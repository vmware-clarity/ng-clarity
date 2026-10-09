/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_IGNORE_ATTRIBUTE,
  CLR_CONTEXT_IGNORE_SELECTOR,
  CLR_CONTEXT_REDACT_ATTRIBUTE,
  CLR_CONTEXT_REDACT_SELECTOR,
  CLR_ELEMENT_CONTEXT_PROPERTY,
  CLR_ELEMENT_MUTATOR_PROPERTY,
  ClrComponentContext,
  ClrContextSnapshotOptions,
  clrUsableSelectors,
} from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaEnumValue, ariaState, isContentEditable, isRedacted, redactNode } from './aria-state';
import { mergeElementContext, publishedNode, readClrElementContext } from './element-context';
import { readElementMutator } from './element-mutator';
import { withinReadScope } from './read-scope';
import {
  isLeafRole,
  isNameFromContents,
  isPresentationalRole,
  mayContainControls,
  resolveRole,
  roleCandidateSelector,
} from './roles';
import { summarizeRole } from './summarizers';
import { accessibleText, isVisuallyHidden, MAX_NESTING_DEPTH, truncate } from './text';
import { isVisible } from './visibility';
import { stripQueryAndFragment } from '../url';

/**
 * Teaches the collector how to describe markup that carries neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 *
 * Report what the user entered or chose under the state keys listed on
 * `ClrElementContextCallback`, which are withheld from a consumer the application does
 * not control; under any other key it is shared with everyone.
 */
export interface ClrContextDomExtractor {
  /** CSS selector matching the elements this extractor understands. */
  selector: string;
  /** Describes the element's current state, or returns `null` when there is nothing to report. */
  extract(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrComponentContext | null;
}

/**
 * Receives, for every described node, the element it was produced from — so that a
 * later operation can find the element again from the node's `ref`. The walk calls it
 * innermost element first: a node folded into the custom element that renders it is
 * noted once for the role-bearing element and once for the host, which is how the host
 * that carries the form binding is reachable from a node the DOM attributed to an
 * element inside it.
 */
export interface ClrContextRefSink {
  note(node: ClrComponentContext, element: Element): void;
}

/**
 * Roles an agent can propose a value for. A node with one of these roles is offered to
 * the ref sink, which keeps a ref only where a write could get somewhere; whether one
 * succeeds is decided when it is attempted, with the reason when it is not.
 */
const WRITABLE_ROLES: ReadonlySet<string> = new Set([
  'textbox',
  'searchbox',
  'combobox',
  'listbox',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'spinbutton',
  'radiogroup',
]);

/**
 * How many elements one walk looks at. The component budget bounds what a snapshot says,
 * not how much of the page is read to say it: a page of wrappers around nothing would be
 * read end to end for an empty snapshot. What lies beyond is left out, and the snapshot
 * says it was cut off.
 */
const MAX_ELEMENTS_VISITED = 25_000;

/** Elements that never carry meaning for an agent. */
const SKIPPED_TAGS = new Set(['script', 'style', 'template', 'link', 'meta', 'noscript', 'head']);

/**
 * Anything a user could act on. A described-by target containing one of these is real
 * content — a dialog body described by its `aria-describedby`, say — and is walked like
 * anything else rather than folded into another element's description.
 */
const CONTROL_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[tabindex]',
  '[contenteditable]',
  '[role="button"]',
  '[role="link"]',
  '[role="checkbox"]',
  '[role="radio"]',
  '[role="switch"]',
  '[role="textbox"]',
  '[role="searchbox"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="menu"]',
  '[role="menuitem"]',
  '[role="tab"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="option"]',
  '[role="treeitem"]',
  '[role="grid"]',
  '[role="table"]',
  '[role="dialog"]',
  '[role="alertdialog"]',
].join(', ');

/**
 * Elements whose text is a name for something else, never content of its own: a
 * control's label, a fieldset's legend, a table's caption. Reported through what they
 * name, so never as text.
 */
const NAMING_TAGS = new Set(['label', 'legend', 'caption', 'figcaption', 'option', 'optgroup', 'datalist', 'title']);

/**
 * A modal dialog — what has the user's attention while it is open. Only a dialog that
 * says it is modal counts: a `<dialog>` opened with `showModal()` (`:modal`), or an ARIA
 * dialog or alert dialog with `aria-modal="true"`. A dialog beside a page that stays in
 * use — a `<dialog>` opened with `show()`, a pinned side panel, an inline wizard — does
 * not take the page away from the user, and so neither from an agent.
 */
const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog:modal';

/** {@link MODAL_SELECTOR} for a browser that does not know `:modal`, where any open `<dialog>` is taken as modal. */
const LEGACY_MODAL_SELECTOR =
  '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog[open]';

interface Walk {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly extractors: ClrContextDomExtractor[];
  /** Roles whose subtrees are left out. */
  readonly excludeRoles: ReadonlySet<string>;
  /** Selector for the elements that could carry one of `excludeRoles`, or `''` for none. */
  readonly excludeRoleCandidates: string;
  /** Selector for elements left out with their subtrees, or `''` for none. */
  readonly excludeSelector: string;
  /** Ids of elements that exist only to describe another element, in the current document. */
  describedByIds: Set<string>;
  /** Ids of elements that name another element, and so are not free-standing text, in the current document. */
  labelIds: Set<string>;
  /** Components still within budget. A probe has a budget of its own. */
  remaining: number;
  /** Whether the budget ran out while there was still something to describe. */
  truncated: boolean;
  /**
   * Whether this walk only asks "is there anything left?": a probe describes at most
   * one node and never starts a probe of its own.
   */
  readonly probing: boolean;
  /** Greater than zero while inside an element marked `data-clr-context-redact`. */
  redactedDepth: number;
  /** Greater than zero while inside a list whose items were summarised. */
  summarizedListDepth: number;
  /** Greater than zero while inside a node whose label already carries the text below it. */
  textDepth: number;
  /** How many described nodes are above the current one. */
  depth: number;
  /** How many elements are above the current one, described or not. */
  elementDepth: number;
  /** How many elements the walk has looked at. Shared across the whole walk, probes included. */
  visited: { count: number };
  /** Greater than zero while inside an embedded frame's document. */
  frameDepth: number;
  /**
   * Greater than zero while inside a custom element that published how it is written
   * to: the component owns writing, so the controls it renders get no refs of their own.
   */
  mutatorDepth: number;
  /** Where refs go, when the snapshot is to carry them. */
  readonly refs: ClrContextRefSink | null;
}

/** The result of a walk, and whether it ran out of budget before it ran out of page. */
export interface ClrContextTreeResult {
  /** What was described, as a tree. */
  components: ClrComponentContext[];
  /** Whether a budget ran out before the page did. */
  truncated: boolean;
  /** Present when the walk was narrowed to the open modal dialog. */
  focus?: 'modal';
}

/** Describes what is under `root` as a tree, and whether the component budget ran out. */
export function collectContextTreeWithin(
  root: ParentNode,
  options: Required<ClrContextSnapshotOptions>,
  extractors: ClrContextDomExtractor[] = [],
  refs: ClrContextRefSink | null = null
): ClrContextTreeResult {
  const excludeRoles = new Set(options.excludeRoles);
  const walk: Walk = {
    options,
    // An extractor whose selector the document rejects would throw on every element.
    extractors: extractors.filter(extractor => clrUsableSelectors(root, [extractor.selector])),
    excludeRoles,
    excludeRoleCandidates: roleCandidateSelector(excludeRoles),
    // Validated one by one, so a single bad entry does not silently drop every exclusion.
    excludeSelector: clrUsableSelectors(root, options.excludeSelectors),
    describedByIds: new Set(),
    labelIds: new Set(),
    remaining: options.maxComponents,
    truncated: false,
    probing: false,
    redactedDepth: 0,
    summarizedListDepth: 0,
    textDepth: 0,
    depth: 0,
    elementDepth: 0,
    visited: { count: 0 },
    frameDepth: 0,
    mutatorDepth: 0,
    refs,
  };
  return withinReadScope(() => {
    collectReferencedIds(root, walk);
    const scope = engineScope(root, walk.options);
    const components = describeScope(root, scope.roots, walk);
    const result: ClrContextTreeResult = { components, truncated: walk.truncated };
    if (scope.focus) {
      result.focus = scope.focus;
    }
    return result;
  });
}

/**
 * Whether the engine would leave this element out of a snapshot, judged from the element
 * and its ancestry: not in the document, inside something hidden, inert, ignored or
 * excluded, or not rendered visibly. Used wherever something must follow the walk's
 * rules without walking — the mutation engine before it writes, and annotations that
 * sit on an element.
 */
export function isHiddenFromEngine(element: Element, excludeSelector = ''): boolean {
  if (!element.isConnected || element.closest(CLR_CONTEXT_HIDDEN_SELECTOR)) {
    return true;
  }
  if (excludeSelector && element.closest(excludeSelector)) {
    return true;
  }
  return !isVisible(element);
}

/**
 * Whether a snapshot with these options leaves the element out on purpose: it matches or
 * sits in one of the `excludeSelectors`, in or under an excluded role (a category is a
 * set of roles), renders one itself — a datagrid host renders the grid it is written
 * through, while an input in one of its cells is the application's content —
 * or lies outside every `rootSelector` root. What is hidden, inert, ignored or
 * behind a modal is judged separately, by {@link isHiddenFromEngine} and the modal check.
 * The mutation engine uses this so that it never writes what such a snapshot would not
 * show, whatever snapshot the ref came from.
 */
export function isOutsideSnapshot(element: Element, options: Required<ClrContextSnapshotOptions>): boolean {
  const excludeSelector = clrUsableSelectors(element.ownerDocument, options.excludeSelectors);
  if (excludeSelector && element.closest(excludeSelector)) {
    return true;
  }
  if (options.excludeRoles.length) {
    const excluded = new Set(options.excludeRoles);
    if (hasExcludedRole(element, excluded)) {
      return true;
    }
    const candidates = roleCandidateSelector(excluded);
    if (
      candidates &&
      Array.from(element.querySelectorAll(candidates)).some(
        inner =>
          excluded.has(resolveRole(inner) ?? '') &&
          !isLeftOutAnyway(inner, excludeSelector) &&
          isRenderedBy(inner, element)
      )
    ) {
      return true;
    }
  }
  if (options.rootSelector) {
    const { roots } = engineScope(element.ownerDocument, { ...options, focus: 'page' });
    if (roots && !roots.some(root => root.contains(element))) {
      return true;
    }
  }
  return false;
}

/** The part of the page a snapshot describes, when that is not the whole page. */
export interface ClrContextScope {
  /** The elements the snapshot is limited to, or `null` for the whole page. */
  roots: Element[] | null;
  /** Present when the scope is the open modal dialog. */
  focus?: 'modal';
}

/**
 * What a snapshot with these options starts from: the whole page, the elements a
 * `rootSelector` picks out, or — with modal focus, while a modal dialog is open — the
 * topmost open dialog alone. The dialog is what the user can act on; the page behind it
 * is what an agent no longer needs, so it is left out entirely rather than budgeted down.
 *
 * Modal focus narrows a `rootSelector`, never steps outside it: only a dialog inside one
 * of the roots is taken, and while none is open the roots are described. A root or a
 * dialog in or under an excluded role is left out, as the walk would leave it out had it
 * reached it from the page.
 */
export function engineScope(root: ParentNode, options: Required<ClrContextSnapshotOptions>): ClrContextScope {
  const excludeSelector = clrUsableSelectors(root, options.excludeSelectors);
  const excludedRoles = new Set(options.excludeRoles);
  const roots = options.rootSelector ? selectedRoots(root, options.rootSelector, excludeSelector, excludedRoles) : null;
  if (options.focus === 'modal') {
    const dialogs = openModalDialogs(root, excludeSelector).filter(
      dialog => !hasExcludedRole(dialog, excludedRoles) && (!roots || roots.some(scope => scope.contains(dialog)))
    );
    if (dialogs.length) {
      return { roots: [modalRoot(dialogs[dialogs.length - 1], roots, excludeSelector)], focus: 'modal' };
    }
  }
  return { roots };
}

/**
 * The elements a `rootSelector` picks out that a snapshot may start from. A selector the
 * document rejects matches nothing, the same as one that matches no element: it must not
 * silently widen the snapshot to the whole page.
 */
function selectedRoots(
  root: ParentNode,
  rootSelector: string,
  excludeSelector: string,
  excludedRoles: ReadonlySet<string>
): Element[] {
  const selector = clrUsableSelectors(root, [rootSelector]);
  const roots = selector ? Array.from(root.querySelectorAll(selector)) : [];
  // A root inside a hidden, inert, ignored or excluded region is still left out: what
  // keeps a region from the engine holds however the walk is pointed at it. A root
  // inside another is already described with it.
  return roots.filter(
    element =>
      !isHiddenFromEngine(element, excludeSelector) &&
      !hasExcludedRole(element, excludedRoles) &&
      !roots.some(other => other !== element && other.contains(element))
  );
}

/** Whether the element, or anything it sits in, has one of the excluded roles. */
function hasExcludedRole(element: Element, excludedRoles: ReadonlySet<string>): boolean {
  if (!excludedRoles.size) {
    return false;
  }
  for (let current: Element | null = element; current; current = current.parentElement) {
    const role = resolveRole(current);
    if (role && excludedRoles.has(role)) {
      return true;
    }
  }
  return false;
}

/**
 * Where modal focus starts: the dialog, or — when the dialog is all an anonymous custom
 * element renders, as a wizard renders the modal it lives in — the outermost such
 * component. What it publishes about itself (a wizard's steps) and its tag describe the
 * dialog, and the walk from the dialog alone would never reach them. The climb stops at a
 * component with a role or a name of its own, at one that renders anything beside the
 * dialog, and at the edge of the roots a `rootSelector` picked.
 */
function modalRoot(dialog: Element, roots: Element[] | null, excludeSelector: string): Element {
  let root = dialog;
  const body = dialog.ownerDocument.body;
  for (let part = dialog, parent = dialog.parentElement; parent && parent !== body; parent = parent.parentElement) {
    if (roots && !roots.some(scope => scope.contains(parent))) {
      break;
    }
    if (resolveRole(parent) || accessibleName(parent, null, 1) || !rendersOnly(parent, part, excludeSelector)) {
      break;
    }
    if (isCustomElementTag(parent)) {
      root = parent;
    }
    part = parent;
  }
  return root;
}

/** Whether `part` is all of `parent` the walk would describe: anything beside it adds nothing. */
function rendersOnly(parent: Element, part: Element, excludeSelector: string): boolean {
  return Array.from(parent.childNodes).every(node => {
    if (node === part) {
      return true;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      return !MEANINGFUL_TEXT.test(node.textContent ?? '');
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    const element = node as Element;
    if (SKIPPED_TAGS.has(element.tagName.toLowerCase()) || isHiddenFromEngine(element, excludeSelector)) {
      return true;
    }
    if (CLR_ELEMENT_CONTEXT_PROPERTY in element || element.matches(DESCRIBABLE) || element.querySelector(DESCRIBABLE)) {
      return false;
    }
    // A screen reader's "end of dialog" marker is not content.
    return !MEANINGFUL_TEXT.test(element.textContent ?? '') || isVisuallyHidden(element);
  });
}

/** The elements that are described in their own right, beyond text: roles, controls, names, media. */
const DESCRIBABLE = `[role], ${CONTROL_SELECTOR}, img, svg, iframe, frame, [aria-label], [aria-labelledby]`;

/** The open modal dialogs the engine would describe, in document order. */
export function openModalDialogs(root: ParentNode, excludeSelector = ''): Element[] {
  return Array.from(modalDialogs(root)).filter(dialog => !isHiddenFromEngine(dialog, excludeSelector));
}

function modalDialogs(root: ParentNode): NodeListOf<Element> {
  try {
    return root.querySelectorAll(MODAL_SELECTOR);
  } catch {
    return root.querySelectorAll(LEGACY_MODAL_SELECTOR);
  }
}

/**
 * Describes the chosen roots. A root chosen by a selector or by modal focus may sit
 * inside a redacted region, which a walk starting from it cannot see; the region's
 * ancestry is checked once per root so that what it withholds stays withheld however
 * the walk is pointed at it.
 */
function describeScope(root: ParentNode, roots: Element[] | null, walk: Walk): ClrComponentContext[] {
  if (!roots) {
    return withinRedactedAncestry(root, walk, () => describeChildren(root, walk, null));
  }
  const nodes: ClrComponentContext[] = [];
  for (const element of roots) {
    if (walk.remaining <= 0) {
      noteUndescribed(element, walk, null);
      break;
    }
    nodes.push(...withinRedactedAncestry(element, walk, () => describeElement(element, walk, null)));
  }
  return nodes;
}

/**
 * Called when the budget is spent and `element` (with whatever follows it) is left
 * undescribed. Whether the snapshot is actually cut off depends on whether anything
 * there would have produced a node — an invisible or empty leftover is not a loss — so a
 * probe with a budget of one is walked from it, stopping at the first node it would
 * produce. The probe has a budget of its own but counts towards the elements visited,
 * and is itself never probed, so it costs at most one node's worth of work. Once the
 * walk is known to be cut off, nothing further is probed.
 */
function noteUndescribed(element: Element, walk: Walk, owner: Element | null): void {
  if (walk.probing || walk.truncated) {
    return;
  }
  const probe: Walk = { ...walk, remaining: 1, truncated: false, probing: true };
  if (describeElement(element, probe, owner).length) {
    walk.truncated = true;
  }
}

function withinRedactedAncestry<T>(node: ParentNode, walk: Walk, describe: () => T): T {
  const ancestor = node.nodeType === Node.ELEMENT_NODE ? (node as Element).parentElement : null;
  return within(walk, ancestor?.closest(CLR_CONTEXT_REDACT_SELECTOR) ? ['redactedDepth'] : [], describe);
}

/** The walk's depth counters: how deep the current element is, and inside what. */
type DepthCounter =
  'depth' | 'elementDepth' | 'frameDepth' | 'mutatorDepth' | 'redactedDepth' | 'summarizedListDepth' | 'textDepth';

/** Runs `describe` one level deeper in each of `counters`, restoring them however it ends. */
function within<T>(walk: Walk, counters: readonly DepthCounter[], describe: () => T): T {
  for (const counter of counters) {
    walk[counter]++;
  }
  try {
    return describe();
  } finally {
    for (const counter of counters) {
      walk[counter]--;
    }
  }
}

/**
 * Describes what a custom element renders, noting when the element is a component that
 * is written to as one thing and owns what it renders (see `ClrElementMutator.ownsContents`),
 * so that nothing it renders is offered for writing on its own.
 */
function withinComponent<T>(element: Element, walk: Walk, describe: () => T): T {
  return within(walk, ownsContents(element) ? ['mutatorDepth'] : [], describe);
}

/**
 * Records the ids referenced by `aria-describedby` and `aria-labelledby` anywhere under
 * `root`, outside ignored regions.
 *
 * Elements referenced by `aria-describedby` — helper text, a validation message — are
 * supplementary text belonging to the control they describe, and that control reports
 * them as its `description`. Describing them again on their own would repeat the text
 * and leave an agent to work out which field it belonged to.
 *
 * Elements referenced by `aria-labelledby` are usually real content, such as a heading
 * that also names a dialog, so they are still described — but not as free-standing
 * text, which would repeat the name they already supply.
 *
 * Only what the walk reports counts: an element hidden, inert, ignored or excluded says
 * nothing about the rest of the page, and neither does a role-less element pointing
 * `aria-describedby` at text, since no description is reported for it. Otherwise page
 * content — a hidden span a sanitiser let through — could make visible text disappear.
 */
function collectReferencedIds(root: ParentNode, walk: Walk): void {
  const collect = (attribute: string, into: Set<string>, reports: (element: Element) => boolean) => {
    for (const element of Array.from(root.querySelectorAll(`[${attribute}]`))) {
      if (isHiddenFromEngine(element, walk.excludeSelector) || !reports(element)) {
        continue;
      }
      for (const id of (element.getAttribute(attribute) ?? '').trim().split(/\s+/)) {
        if (id) {
          into.add(id);
        }
      }
    }
  };
  const describes = (element: Element) => !!resolveRole(element) || isCustomElementTag(element);
  collect('aria-describedby', walk.describedByIds, describes);
  // An invalid field reports the message `aria-errormessage` names as its `error`.
  collect(
    'aria-errormessage',
    walk.describedByIds,
    element => describes(element) && ariaEnumValue(element, 'aria-invalid') !== null
  );
  collect('aria-labelledby', walk.labelIds, () => true);
}

/** Whether an element is a custom element, which the walk describes as a component. */
function isCustomElementTag(element: Element): boolean {
  return element.tagName.includes('-');
}

/**
 * Describes the element's subtree. Returns the nodes it contributes to its parent —
 * usually one, but none when it is skipped, or several when it is a custom element whose
 * describable content stands in for it.
 *
 * `owner` is the nearest custom element above that carries no role of its own and has not
 * been described in its own right. It becomes the `element` of whatever role-bearing node
 * is found beneath it, which is how `<div role="grid">` inside `<clr-datagrid>` reports
 * itself as a grid rendered by a datagrid.
 */
function describeElement(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  // Past the element cap nothing more is looked at — not even whether it is hidden, which
  // on a long flat list would still cost a style read per element. Too deep a level is
  // left out too (see `MAX_NESTING_DEPTH`), and the snapshot says it was cut off.
  if (walk.visited.count >= MAX_ELEMENTS_VISITED) {
    walk.truncated = true;
    return [];
  }
  if (shouldSkipSubtree(element, walk)) {
    return [];
  }
  if (walk.elementDepth >= MAX_NESTING_DEPTH) {
    walk.truncated = true;
    return [];
  }
  walk.visited.count++;
  const counters: DepthCounter[] = ['elementDepth'];
  if (element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE)) {
    counters.push('redactedDepth');
  }
  // A described-by target that is walked for the controls it holds still had its text
  // reported as the description of whatever it describes.
  if (element.id && walk.describedByIds.has(element.id)) {
    counters.push('textDepth');
  }
  return within(walk, counters, () => describeVisible(element, walk, owner));
}

function describeVisible(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  const extractor = walk.extractors.find(candidate => element.matches(candidate.selector));
  if (extractor) {
    const extracted = extractSafely(extractor, element as HTMLElement, walk);
    // Only the walk hands out refs: an extractor's node cannot claim another node's.
    const described = extracted ? publishedNode(extracted, walk.options) : null;
    if (!described) {
      // The extractor owns this element: when it declines to describe it, the element is
      // not described generically either, but its contents may still be interesting.
      return describeChildren(element, walk, owner);
    }
    if (walk.remaining <= 0) {
      return [];
    }
    walk.remaining--;
    return listOf(finish(described, element, walk, { foreign: true }));
  }

  const tagName = element.tagName.toLowerCase();
  if (tagName === 'iframe' || tagName === 'frame') {
    return describeFrame(element as HTMLIFrameElement, walk);
  }

  const role = resolveRole(element);
  if (role && walk.excludeRoles.has(role)) {
    return [];
  }
  if (role && isPresentationalRole(role)) {
    return describeChildren(element, walk, owner);
  }
  // An item of a summarised list is already named in the summary. One with nothing to act
  // on, no state of its own and nothing published adds no node, so it is not read at all:
  // a list of thousands costs what its controls do.
  if (
    role === 'listitem' &&
    walk.summarizedListDepth > 0 &&
    !(CLR_ELEMENT_CONTEXT_PROPERTY in element) &&
    !Array.from(element.attributes).some(attribute => attribute.name.startsWith('aria-')) &&
    !element.querySelector(CONTROL_SELECTOR)
  ) {
    return [];
  }

  const isCustomElement = isCustomElementTag(element);
  // Inside a region the application keeps from agents, a name is only what an author
  // gave the element — a label, `aria-label`, a title. A name taken from the content is
  // that content: a link that reads as the account number it opens, a button that
  // repeats the record it deletes.
  const redacted = walk.redactedDepth > 0;
  const label = nameSafely(element, redacted ? null : role, walk);

  if (!role && !label) {
    if (!isCustomElement) {
      return isTextBlock(element, walk)
        ? describeTextBlock(element, walk, owner)
        : describeChildren(element, walk, owner);
    }
    const parts = describeAnonymousCustomElement(element, tagName, walk);
    if (parts) {
      return parts;
    }
  }

  if (walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;

  // An anonymous custom element has no role to describe it and no name of its own, so
  // what it renders is the only thing it can say — a `clr-dg-footer` reporting "2 items",
  // for instance. That is content, so a redacted region keeps it.
  const fallbackLabel =
    !role && !label && isCustomElement && !redacted
      ? truncate(accessibleText(element, undefined, walk.excludeSelector), walk.options.maxTextLength)
      : label;

  // Without a role, a component is a group of what it renders, and its tag — in
  // `element` — says which component: `type` stays a role, whatever rendered it.
  const node: ClrComponentContext = { type: role ?? 'group' };
  const attribution = isCustomElement ? tagName : owner?.tagName.toLowerCase();
  if (attribution) {
    node.element = attribution;
  }
  if (fallbackLabel) {
    node.label = fallbackLabel;
  }
  // A collection role is described by aggregating its subtree rather than listing it,
  // which is what keeps a ten-thousand-row grid from producing ten thousand nodes.
  const summary = summarizeSafely(element, role, walk);
  const state = { ...ariaState(element, walk.options, redacted, walk.excludeSelector), ...summary };
  if (Object.keys(state).length) {
    node.state = state;
  }

  // Descend unless the role is a single-widget leaf — nothing inside a button or a
  // checkbox has independent semantics — or a collection that has just been summarised.
  // A summary that said nothing does not count: the element is walked like any other,
  // so a list of custom elements or a menu built from unfamiliar markup still reports
  // what it contains. A list is walked even when summarised, because its links are the
  // point of it. A content leaf such as heading/alert/status still terminates for generic
  // wrapper purposes but is not fully opaque: see mayContainControls.
  const summarised = summary !== null;
  const summarisedList = summarised && role === 'list';
  const terminal = !!role && ((isLeafRole(role) && !mayContainControls(role)) || (summarised && !summarisedList));
  if (!terminal) {
    // A node named from its contents — a heading, a cell, a list item — already carries
    // the text below it as its label, so nothing inside it is free-standing text.
    const counters: DepthCounter[] = [];
    if (summarisedList) {
      counters.push('summarizedListDepth');
    }
    if (role && isNameFromContents(role)) {
      counters.push('textDepth');
    }
    // Text written straight into a container — a dialog's message, a region's paragraph
    // that no element wraps — is content as much as wrapped text is. Not in a field,
    // where it is the value, and not where the node is named from it (see `textDepth`).
    const looseText = (role && WRITABLE_ROLES.has(role)) || (!role && !label) ? undefined : { label };
    const children = within(walk, counters, () =>
      withinComponent(element, walk, () => describeNested(element, walk, null, looseText))
    );
    if (children.length) {
      node.children = children;
    }
  } else if (summarised) {
    const controls = describeCellControls(element, walk);
    if (controls.length) {
      node.children = controls;
    }
  }

  const described = finish(node, element, walk);
  if (!described) {
    return [];
  }

  // A list item's text is already in its list's summary, so it earns a node of its own
  // only when it has state to add — what its component published, say. Otherwise the
  // controls inside it stand in for it: a navigation list reports its links directly.
  if (role === 'listitem' && walk.summarizedListDepth > 0 && !described.state) {
    walk.remaining++;
    return described.children ?? [];
  }
  return [described];
}

/**
 * An anonymous custom element — no role, no name — is a wrapper around what it renders:
 *
 * - One reportable part is this element: it is returned attributed to it (how the grid
 *   inside a `clr-datagrid` reports itself as a grid rendered by a datagrid), and what
 *   this element publishes merges into it.
 * - Several parts are one component — a datagrid's grid and footer, a tab set's tab list
 *   and panel — and are wrapped in a node for it, which carries what it publishes, rather
 *   than scattered into unrelated-looking siblings.
 * - Nothing rendered leaves it out, unless it publishes something or shows text.
 *
 * Returns `null` in that last case, when the element is described as a node of its own.
 */
function describeAnonymousCustomElement(element: Element, tagName: string, walk: Walk): ClrComponentContext[] | null {
  const rendered = withinComponent(element, walk, () => describeChildren(element, walk, element));
  // A component whose own content was excluded — a datagrid when grids are — says
  // nothing about itself through what is left of it, a footer, and is not written to
  // through it either.
  const published = !rendered.length || !rendersExcludedRole(element, walk);
  if (rendered.length === 1) {
    const only = rendered[0];
    // Text is all this element renders: it is the element's own label, the same way a
    // `clr-dg-footer` with bare text is labelled by it, rather than a text node inside.
    if (only.type === 'text' && !only.children && !only.state) {
      return listOf(finish({ type: 'group', element: tagName, label: only.label }, element, walk, { published }));
    }
    return listOf(finish(only, element, walk, { published }));
  }
  if (rendered.length > 1) {
    if (walk.remaining <= 0) {
      // The parts were counted; a wrapper for them is not affordable, so they stand alone.
      return rendered;
    }
    walk.remaining--;
    const wrapper: ClrComponentContext = { type: 'group', element: tagName, children: rendered };
    // A component that is written to as one thing is named by the control it renders
    // — a combobox by the input the user types into — so the node carrying its ref
    // carries the name an agent would refer to it by.
    if (ownsContents(element)) {
      const named = rendered.find(part => part.label && WRITABLE_ROLES.has(part.type));
      if (named) {
        wrapper.label = named.label;
      }
      const finished = finish(wrapper, element, walk, { published });
      return listOf(finished && foldRenderedControl(finished, walk));
    }
    return listOf(finish(wrapper, element, walk, { published }));
  }
  // Nothing rendered, nothing said, nothing published: a closed modal, an icon, a
  // spacer, a dismissed alert. Nor is one whose content was left out on purpose — a
  // datagrid when grids are excluded — which must not come back labelled with all the
  // text it holds. The role check goes first: it looks only at the elements that could
  // carry an excluded role, while the text check reads the style of everything with text.
  if (holdsExcludedRole(element, walk)) {
    return [];
  }
  if (
    !readClrElementContext(element, walk.options) &&
    !accessibleText(element, undefined, walk.excludeSelector).trim()
  ) {
    return [];
  }
  return null;
}

const CELL_SELECTOR = '[role="gridcell"], [role="cell"], td';
const VALUE_CONTROL_SELECTOR = [
  'input',
  'select',
  'textarea',
  '[contenteditable]',
  ...Array.from(WRITABLE_ROLES, role => `[role="${role}"]`),
].join(', ');

/**
 * The controls an application put in the cells of a summarised collection — a quantity
 * in each row, a status to pick — described cell by cell. The summary says what the
 * collection holds but nothing about what the user can change in it, and these controls
 * belong to the application, not to the collection. The cells are walked like any other
 * content, so a custom control in a cell is described as a whole; text is left out, the
 * summary already carries it. Controls the collection renders for itself, such as a
 * datagrid's row selection, sit in cells marked `data-clr-context-ignore` and add nothing.
 */
function describeCellControls(collection: Element, walk: Walk): ClrComponentContext[] {
  if (walk.options.collectionItems === 'summary') {
    return [];
  }
  // Each cell with whether something between it and the collection redacts it. A cell
  // that is itself, or sits inside, something hidden, inert, ignored or excluded is not
  // described, exactly as the walk would not reach it: the grid's own selection cells
  // are marked ignored, and a redacted row keeps its values.
  const cells = new Map<Element, boolean>();
  for (const control of Array.from(collection.querySelectorAll(VALUE_CONTROL_SELECTOR))) {
    const role = resolveRole(control);
    const cell = role && WRITABLE_ROLES.has(role) ? control.closest(CELL_SELECTOR) : null;
    if (!cell || cells.has(cell) || !collection.contains(cell)) {
      continue;
    }
    const path = ancestryUntil(cell, collection);
    if (path.some(element => shouldSkipSubtree(element, walk))) {
      continue;
    }
    if (cells.size >= walk.options.maxItemsPerCollection) {
      // One more cell the budget leaves out: the snapshot is cut off, as when the
      // component budget runs out.
      walk.truncated = true;
      break;
    }
    cells.set(
      cell,
      path.some(element => element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE))
    );
  }
  const nodes: ClrComponentContext[] = [];
  for (const [cell, redacted] of cells) {
    const counters: DepthCounter[] = redacted ? ['textDepth', 'redactedDepth'] : ['textDepth'];
    nodes.push(...within(walk, counters, () => describeNested(cell, walk, null)));
  }
  return nodes;
}

/** The element and its ancestors up to, but not including, `boundary`. */
function ancestryUntil(element: Element, boundary: Element): Element[] {
  const path: Element[] = [];
  for (let current: Element | null = element; current && current !== boundary; current = current.parentElement) {
    path.push(current);
  }
  return path;
}

/**
 * Whether a role-less, name-less element is a block of text in its own right: it has
 * text of its own — not merely descendants that do — and that text is not the name of
 * something else. Text is only reported where nothing above already carries it, never
 * inside a sensitive region, and never when it is hidden from sight.
 */
function isTextBlock(element: Element, walk: Walk): boolean {
  if (!walk.options.includeText || walk.textDepth > 0 || walk.redactedDepth > 0) {
    return false;
  }
  if (NAMING_TAGS.has(element.tagName.toLowerCase()) || (element.id && walk.labelIds.has(element.id))) {
    return false;
  }
  const hasOwnText = Array.from(element.childNodes).some(
    node => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim()
  );
  return hasOwnText && !isVisuallyHidden(element);
}

/**
 * A block of text, with whatever controls sit inside it — a link in a sentence — as its
 * children. Nested text is folded into this node's label rather than repeated.
 */
function describeTextBlock(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  if (walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;
  const node: ClrComponentContext = { type: 'text' };
  if (owner) {
    node.element = owner.tagName.toLowerCase();
  }
  const label = truncate(accessibleText(element, undefined, walk.excludeSelector), walk.options.maxTextLength);
  if (label) {
    node.label = label;
  }
  // Text the page announces as it changes — a connection lost, a save confirmed — says
  // so, as a status or an alert would.
  const live = liveSetting(element);
  if (live) {
    node.state = { live };
  }
  const children = within(walk, ['textDepth'], () => describeNested(element, walk, owner));
  if (children.length) {
    node.children = children;
  }
  return listOf(finish(node, element, walk));
}

/**
 * How a text block is announced when it changes: its own `aria-live`, or that of the
 * role-less element it sits in. A live region with a role is described with its own
 * `live` state, which the text inside it does not repeat.
 */
function liveSetting(element: Element): string | null {
  const region = element.closest('[aria-live]');
  return region && (region === element || !resolveRole(region)) ? ariaEnumValue(region, 'aria-live') : null;
}

/**
 * An embedded frame. A page assembled from plugins in same-origin frames — a tab that is
 * an iframe, a widget that is another — is one page to the user and is described as one:
 * the frame's document is walked in place, against the same budget. A cross-origin frame
 * cannot be read from here and is reported as a frame with no children, so an agent at
 * least knows there is UI it does not see.
 */
function describeFrame(frame: HTMLIFrameElement, walk: Walk): ClrComponentContext[] {
  if (!walk.options.includeFrames || walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;

  const node: ClrComponentContext = { type: 'frame', element: frame.tagName.toLowerCase() };
  const state: Record<string, unknown> = {};
  const contents = frameDocument(frame);
  // A frame's page marks itself as a host page marks a region: on its root or its body.
  const roots = contents ? [contents.documentElement, contents.body].filter(root => !!root) : [];
  const ignored = roots.some(root => hidesDocument(root, walk));
  const redacted = walk.redactedDepth > 0 || roots.some(root => root.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE));
  // A frame is named by what its author gave the frame element. Its document's title is
  // what that document shows — a record's name as often as a page's — so it is kept
  // apart, as the frame's `title`, where a caller given less than the full address does
  // not get it; and a frame in a redacted region reports none.
  const label = nameSafely(frame, null, walk);
  if (label) {
    node.label = truncate(label, walk.options.maxTextLength);
  }
  const title = redacted || ignored ? '' : (contents?.title ?? '');
  if (!label && title.trim()) {
    state.title = truncate(title, walk.options.maxTextLength);
  }

  const location = contents ? contents.location.href : (frame.getAttribute('src') ?? '');
  if (location && !location.startsWith('about:')) {
    state.url = truncate(stripQueryAndFragment(location), walk.options.maxTextLength);
  }

  if (contents === null) {
    state.crossOrigin = true;
  } else if (!contents.body) {
    state.loading = true;
  } else if (isStillNavigating(frame, contents)) {
    state.loading = true;
  } else if (ignored) {
    // The page keeps itself from agents: it is there, and that is all that is said.
  } else if (contents.designMode === 'on' || contents.body.isContentEditable || isContentEditable(contents.body)) {
    // A document the user types into — how classic rich-text editors are built — is one
    // text field, and what it holds is a value, never prose.
    node.type = 'textbox';
    if (redacted) {
      state.redacted = true;
    } else {
      state.value = truncate(
        accessibleText(contents.body, undefined, walk.excludeSelector),
        walk.options.maxTextLength
      );
    }
  } else {
    // Ids are scoped to a document: the frame's references must not skip or fold the
    // host's elements that happen to share an id, nor the other way round.
    const hostDescribedByIds = walk.describedByIds;
    const hostLabelIds = walk.labelIds;
    walk.describedByIds = new Set();
    walk.labelIds = new Set();
    const redactedRoot = redacted && walk.redactedDepth === 0;
    try {
      collectReferencedIds(contents, walk);
      const children = within(walk, redactedRoot ? ['frameDepth', 'redactedDepth'] : ['frameDepth'], () =>
        describeNested(contents.body, walk, null)
      );
      if (children.length) {
        node.children = children;
      }
    } finally {
      walk.describedByIds = hostDescribedByIds;
      walk.labelIds = hostLabelIds;
    }
  }

  if (Object.keys(state).length) {
    node.state = state;
  }
  return listOf(finish(node, frame, walk));
}

/** Whether a frame document's root or body keeps the whole page from the engine. */
function hidesDocument(root: Element, walk: Walk): boolean {
  return (
    root.hasAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE) ||
    root.getAttribute('aria-hidden') === 'true' ||
    root.hasAttribute('hidden') ||
    root.hasAttribute('inert') ||
    (!!walk.excludeSelector && root.matches(walk.excludeSelector))
  );
}

/**
 * Whether a frame still shows the initial blank document while its real one loads: the
 * blank document has a body of its own, so the body alone does not tell.
 */
function isStillNavigating(frame: HTMLIFrameElement, contents: Document): boolean {
  const src = frame.getAttribute('src');
  return (
    contents.location.href === 'about:blank' && !!src && !src.startsWith('about:') && !frame.hasAttribute('srcdoc')
  );
}

/**
 * An extractor's description, or `null` when it throws: application code describing
 * one element must not take the whole snapshot down.
 */
function extractSafely(
  extractor: ClrContextDomExtractor,
  element: HTMLElement,
  walk: Walk
): ClrComponentContext | null {
  try {
    return extractor.extract(element, walk.options);
  } catch {
    return null;
  }
}

/**
 * The collection summary for an element, or `null` when summarising it throws: markup
 * the summarizers did not foresee must cost one node its summary, not the whole snapshot.
 */
function summarizeSafely(element: Element, role: string | null, walk: Walk): Record<string, unknown> | null {
  try {
    return summarizeRole(element, role, walk.options, walk.excludeSelector);
  } catch {
    return null;
  }
}

/**
 * An element's name, or none when naming it fails — markup no browser would build, a
 * component that throws — so one element cannot fail the whole snapshot. The snapshot
 * then says something was left out.
 */
function nameSafely(element: Element, role: string | null, walk: Walk): string {
  try {
    return accessibleName(element, role, walk.options.maxTextLength, walk.excludeSelector);
  } catch {
    walk.truncated = true;
    return '';
  }
}

/** A frame's document when it is same-origin and readable, `null` when it is not. */
function frameDocument(frame: HTMLIFrameElement): Document | null {
  try {
    return frame.contentDocument;
  } catch {
    return null;
  }
}

/**
 * The children of a described node: one level deeper, and left out altogether once the
 * walk is as deep as `maxDepth` allows. Transparent wrappers do not count as levels —
 * only nodes that appear in the snapshot do.
 */
function describeNested(
  parent: ParentNode,
  walk: Walk,
  owner: Element | null,
  looseText?: LooseText
): ClrComponentContext[] {
  const { maxDepth } = walk.options;
  if (maxDepth > 0 && walk.depth + 1 >= maxDepth) {
    return [];
  }
  return within(walk, ['depth'], () => describeChildren(parent, walk, owner, looseText));
}

/**
 * Text directly inside a described node, between or beside its child elements: reported
 * as `text` nodes, where text is (see {@link isTextBlock}). `label` is the node's own
 * label, which text that merely repeats it does not add to.
 */
interface LooseText {
  label: string;
}

function describeChildren(
  parent: ParentNode,
  walk: Walk,
  owner: Element | null,
  looseText?: LooseText
): ClrComponentContext[] {
  const nodes: ClrComponentContext[] = [];
  const withText = !!looseText && walk.options.includeText && walk.textDepth === 0 && walk.redactedDepth === 0;
  const children: ChildNode[] = withText ? Array.from(parent.childNodes) : Array.from(parent.children);
  let text = '';
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent ?? '';
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      continue;
    }
    // `Delete <b>vm-01</b>?` is one sentence: emphasis inside it does not break it up.
    if (withText && isPhrasing(child as Element, walk)) {
      text += phrasingText(child as Element, walk);
      continue;
    }
    nodes.push(...describeLooseText(text, looseText, walk));
    text = '';
    if (walk.remaining <= 0) {
      // Whatever follows would be described from here on; check that it would have been.
      for (const leftover of children.slice(index)) {
        if (leftover.nodeType === Node.ELEMENT_NODE) {
          noteUndescribed(leftover as Element, walk, owner);
        } else if (leftover.nodeType === Node.TEXT_NODE) {
          describeLooseText(leftover.textContent ?? '', looseText, walk);
        }
      }
      return nodes;
    }
    nodes.push(...describeElement(child as Element, walk, owner));
  }
  nodes.push(...describeLooseText(text, looseText, walk));
  return nodes;
}

/** Inline elements that only style or mark up the prose they sit in. */
const PHRASING_TAGS = new Set([
  'abbr',
  'b',
  'bdi',
  'bdo',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'em',
  'i',
  'ins',
  'kbd',
  'mark',
  'q',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
]);

/**
 * Whether an element inside loose text is part of the prose around it: a phrasing element
 * with no role, no name, nothing it publishes or an extractor describes, and nothing
 * inside that is described in its own right. Anything else — a link, a button, a named
 * or live span, one the application marked — is a node of its own, and ends the text
 * before it.
 */
function isPhrasing(element: Element, walk: Walk): boolean {
  return (
    PHRASING_TAGS.has(element.tagName.toLowerCase()) &&
    !resolveRole(element) &&
    !element.hasAttribute('title') &&
    !element.hasAttribute('aria-live') &&
    !element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE) &&
    !(CLR_ELEMENT_CONTEXT_PROPERTY in element) &&
    !(element.id && walk.labelIds.has(element.id)) &&
    !element.matches(DESCRIBABLE) &&
    !element.querySelector(DESCRIBABLE) &&
    !walk.extractors.some(extractor => element.matches(extractor.selector))
  );
}

/**
 * What a phrasing element adds to the prose it sits in: its text, unless the walk would
 * leave it out or it is hidden from sight (guidance for a screen reader, as in a name).
 */
function phrasingText(element: Element, walk: Walk): string {
  if (shouldSkipSubtree(element, walk) || isVisuallyHidden(element)) {
    return '';
  }
  return accessibleText(element, undefined, walk.excludeSelector);
}

/** Text with a letter or a digit in it; punctuation between links — a separator — says nothing. */
const MEANINGFUL_TEXT = /[\p{L}\p{N}]/u;

/** A run of text directly inside a described node, as a `text` node; see {@link LooseText}. */
function describeLooseText(text: string, looseText: LooseText | undefined, walk: Walk): ClrComponentContext[] {
  if (!looseText || !MEANINGFUL_TEXT.test(text)) {
    return [];
  }
  const label = truncate(text, walk.options.maxTextLength);
  if (label === looseText.label) {
    return [];
  }
  if (walk.remaining <= 0) {
    if (!walk.probing) {
      walk.truncated = true;
    }
    return [];
  }
  walk.remaining--;
  return [{ type: 'text', label }];
}

/** How {@link finish} treats a node. */
interface FinishOptions {
  /** The node came from outside the walk — an extractor — and was never pruned. */
  foreign?: boolean;
  /** Whether what the element publishes is merged in. */
  published?: boolean;
}

/**
 * The last steps every described node goes through, whichever path produced it: the
 * element's published context is merged in, then redaction is re-applied, because
 * published context is merged over what the DOM said and a component publishing its own
 * value must not be able to reinstate one the engine withheld. The same applies to an
 * extractor's result: an extractor is application code, but the element it describes
 * may sit inside a region the application marked as sensitive.
 */
function finish(
  node: ClrComponentContext,
  element: Element,
  walk: Walk,
  { foreign = false, published = true }: FinishOptions = {}
): ClrComponentContext | null {
  const redacted = isRedacted(element, walk.redactedDepth > 0);
  // Inside a region the application keeps from agents, what a component publishes about
  // itself is not merged at all: a publisher reports its own state — a grid's rows and
  // selection, a combobox's value — and would otherwise carry it straight out. Nor is it
  // when the caller excluded what the component renders (see `rendersExcludedRole`).
  let described = node;
  if (published) {
    described = redacted
      ? withoutOverriddenLabel(node, element, walk)
      : mergeElementContext(node, element, walk.options);
  }
  // A component that says it is something the caller excluded is left out like any
  // element with that role, whatever the DOM said about it. The node was counted against
  // the budget, which it no longer uses.
  if (walk.excludeRoles.has(described.type)) {
    walk.remaining++;
    return null;
  }
  // Anything published or extracted arrives unpruned and may carry children of its own.
  const unpruned = foreign || described !== node;

  if (redacted || described.state?.['redacted'] === true) {
    // What the user entered goes, along with the content the region shows: neither this
    // node nor anything under it keeps it.
    described = redactNode(described);
  }

  const pruned = pruneEmpty(described, { foreign: unpruned });
  if (published) {
    noteRef(pruned, element, walk);
  }
  return pruned;
}

/**
 * A redacted node without the name its markup gives it, when its element publishes a name
 * of its own. A component publishes a name because the markup's says more than it should
 * — a datepicker toggle's names the date the user picked — and the published one is not
 * used either, since inside a redacted region it may be the very content withheld.
 */
function withoutOverriddenLabel(node: ClrComponentContext, element: Element, walk: Walk): ClrComponentContext {
  // Reading the published label runs the component's whole callback (a datagrid reads
  // every row), so it is done only for a node that has a label to lose.
  if (node.label === undefined || typeof readClrElementContext(element, walk.options)?.label !== 'string') {
    return node;
  }
  const unnamed = { ...node };
  delete unnamed.label;
  return unnamed;
}

function listOf(node: ClrComponentContext | null): ClrComponentContext[] {
  return node ? [node] : [];
}

/**
 * Whether a component renders, in its own template, an element with an excluded role —
 * the grid inside a `clr-datagrid` — rather than holding one inside another component it
 * contains, such as a datagrid in a tab panel. What the component publishes describes
 * that content, so it is left out with it.
 */
function rendersExcludedRole(element: Element, walk: Walk): boolean {
  if (!walk.excludeRoleCandidates) {
    return false;
  }
  for (const descendant of Array.from(element.querySelectorAll(walk.excludeRoleCandidates))) {
    const role = resolveRole(descendant);
    if (!role || !walk.excludeRoles.has(role) || isLeftOutAnyway(descendant, walk.excludeSelector)) {
      continue;
    }
    if (isRenderedBy(descendant, element)) {
      return true;
    }
  }
  return false;
}

/**
 * Whether the element itself renders the descendant, rather than another component
 * inside it: no custom element stands between them. A datagrid renders its grid; the
 * input in one of its cells belongs to the cell, which holds the application's content.
 */
function isRenderedBy(descendant: Element, element: Element): boolean {
  let owner: Element | null = descendant.parentElement;
  while (owner && owner !== element && !isCustomElementTag(owner)) {
    owner = owner.parentElement;
  }
  return owner === element;
}

/**
 * Whether anything inside the element has a role this walk leaves out. Only the elements
 * that could carry one of those roles are looked at, not every descendant.
 */
function holdsExcludedRole(element: Element, walk: Walk): boolean {
  if (!walk.excludeRoleCandidates) {
    return false;
  }
  for (const descendant of Array.from(element.querySelectorAll(walk.excludeRoleCandidates))) {
    const role = resolveRole(descendant);
    if (role && walk.excludeRoles.has(role) && !isLeftOutAnyway(descendant, walk.excludeSelector)) {
      return true;
    }
  }
  return false;
}

/**
 * Whether an element is in a region the engine is told not to look at — ignored, or
 * matched by the snapshot's `excludeSelectors` — so its role decides nothing about the
 * component around it: the select-all checkbox in a datagrid's ignored header does not
 * make the grid a form when forms are excluded.
 */
function isLeftOutAnyway(element: Element, excludeSelector: string): boolean {
  return !!element.closest(CLR_CONTEXT_IGNORE_SELECTOR) || (!!excludeSelector && !!element.closest(excludeSelector));
}

/** Whether an element and everything inside it is invisible to the engine. */
function shouldSkipSubtree(element: Element, walk: Walk): boolean {
  if (SKIPPED_TAGS.has(element.tagName.toLowerCase())) {
    return true;
  }
  if (element.hasAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE)) {
    return true;
  }
  if (walk.excludeSelector && element.matches(walk.excludeSelector)) {
    return true;
  }
  if (
    element.getAttribute('aria-hidden') === 'true' ||
    element.hasAttribute('hidden') ||
    element.hasAttribute('inert')
  ) {
    return true;
  }
  // Text that only describes another element is reported as that element's description.
  // But a described-by target that holds controls is content in its own right — a dialog
  // described by its own body — and folding it away would lose what a user can do there.
  // Only role-less text folds away: an alert, a region, a heading is content whatever
  // points at it, and page content can point an `aria-describedby` at any id.
  if (
    element.id &&
    walk.describedByIds.has(element.id) &&
    !element.querySelector(CONTROL_SELECTOR) &&
    !resolveRole(element)
  ) {
    return true;
  }
  return !isVisible(element);
}

/** Removes empty labels, states and children so snapshots stay minimal. */
function pruneEmpty(context: ClrComponentContext, { foreign = false } = {}): ClrComponentContext {
  const pruned: ClrComponentContext = { type: context.type };
  if (context.ref) {
    pruned.ref = context.ref;
  }
  if (context.element) {
    pruned.element = context.element;
  }
  if (context.label) {
    pruned.label = context.label;
  }
  if (context.state && Object.keys(context.state).length) {
    pruned.state = context.state;
  }
  if (context.children?.length) {
    // Children the walk produced were each pruned as they were finished; only children
    // that arrived from outside the walk need visiting.
    pruned.children = foreign ? context.children.map(child => pruneEmpty(child, { foreign: true })) : context.children;
  }
  return pruned;
}

/**
 * Gives a node a ref when it is something an agent could propose a value for — a
 * writable role, or an element that published how it is written to — and records the
 * element behind it. A node that already has a ref, because it was finished once for
 * the element inside and is now being finished for the host that renders it, keeps the
 * ref and gains the host as a second way to find its binding. Nothing inside a frame, a
 * redacted region or a component that owns its contents gets a ref: the engine never
 * writes there, so nothing should invite it to.
 */
function noteRef(node: ClrComponentContext, element: Element, walk: Walk): void {
  if (!walk.refs || walk.probing || walk.frameDepth > 0 || walk.redactedDepth > 0 || walk.mutatorDepth > 0) {
    return;
  }
  if (node.ref || WRITABLE_ROLES.has(node.type) || CLR_ELEMENT_MUTATOR_PROPERTY in element) {
    if (node.state?.['redacted'] === true) {
      return;
    }
    walk.refs.note(node, element);
  }
}

/**
 * A component written to as one thing that says it is the control it renders — a
 * combobox host publishing itself as a combobox — would otherwise list that control
 * twice, once as itself and once as its rendered part with the same role and name. The
 * part is folded into the host, which speaks for it: the host's own state is what the
 * component publishes, and the part's — the typed text, whether the popup is open — is
 * the component's internals. Whatever the part contains takes its place.
 */
function foldRenderedControl(node: ClrComponentContext, walk: Walk): ClrComponentContext {
  const children = node.children ?? [];
  const index = children.findIndex(
    child => child.type === node.type && child.label === node.label && WRITABLE_ROLES.has(child.type)
  );
  if (index < 0) {
    return node;
  }
  const part = children[index];
  children.splice(index, 1, ...(part.children ?? []));
  if (!children.length) {
    delete node.children;
  }
  // The part was counted against the budget, which it no longer uses.
  walk.remaining++;
  return node;
}

/** Whether an element is a component written to as one thing, whose rendered controls are its own internals. */
function ownsContents(element: Element): boolean {
  return CLR_ELEMENT_MUTATOR_PROPERTY in element && readElementMutator(element)?.ownsContents === true;
}
