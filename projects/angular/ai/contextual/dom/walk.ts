/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_IGNORE_ATTRIBUTE,
  CLR_CONTEXT_REDACT_ATTRIBUTE,
  CLR_CONTEXT_REDACT_SELECTOR,
  CLR_ELEMENT_CONTEXT_PROPERTY,
  CLR_ELEMENT_MUTATOR_PROPERTY,
  ClrComponentContext,
  ClrContextSnapshotOptions,
  clrUsableSelectors,
} from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaState, isContentEditable, isRedacted, redactNode } from './aria-state';
import { mergeElementContext, publishedNode, readClrElementContext } from './element-context';
import { readElementMutator } from './element-mutator';
import {
  isLeafRole,
  isNameFromContents,
  isPresentationalRole,
  mayContainControls,
  resolveRole,
  roleCandidateSelector,
} from './roles';
import { summarizeRole } from './summarizers';
import { accessibleText, isVisuallyHidden, truncate } from './text';
import { isVisible } from './visibility';
import { stripQueryAndFragment } from '../url';

/**
 * Teaches the collector how to describe one kind of element it would otherwise skip.
 *
 * The collector needs no extractors to describe well-formed markup — it reads the
 * accessibility tree, which Clarity components, `@clr/ui` CSS-only markup and plain HTML
 * all expose. Extractors exist for the remainder: markup that carries neither a role nor
 * an accessible name, such as a bare `<div class="card">`.
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
 * Roles an agent can propose a value for. A node with one of these roles is given a ref
 * whether or not it turns out to be writable — the engine decides that when asked, and
 * says why when it is not.
 */
export const WRITABLE_ROLES: ReadonlySet<string> = new Set([
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
 * How deeply nested an element the walk still looks at. The HTML parser nests no deeper
 * than 512, but script can, and the walk recurses once per level: what lies deeper is
 * left out, and the snapshot says it was cut off, rather than the stack running out.
 */
const MAX_ELEMENT_DEPTH = 512;

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
  /** Components still within budget. Shared across the whole walk. */
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
  /** How many elements the walk has looked at. Shared across the whole walk. */
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

/** {@link collectContextTree}, also reporting whether the component budget ran out. */
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
  collectReferencedIds(root, walk);
  const scope = scopeOf(root, walk);
  const components = describeScope(scope.roots, walk);
  const result: ClrContextTreeResult = { components, truncated: walk.truncated };
  if (scope.focus) {
    result.focus = scope.focus;
  }
  return result;
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
 * set of roles), holds one — a datagrid host renders the grid it is written through —
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
    for (let current: Element | null = element; current; current = current.parentElement) {
      const role = resolveRole(current);
      if (role && excluded.has(role)) {
        return true;
      }
    }
    const candidates = roleCandidateSelector(excluded);
    if (
      candidates &&
      Array.from(element.querySelectorAll(candidates)).some(inner => excluded.has(resolveRole(inner) ?? ''))
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
 */
export function engineScope(root: ParentNode, options: Required<ClrContextSnapshotOptions>): ClrContextScope {
  const excludeSelector = clrUsableSelectors(root, options.excludeSelectors);
  if (options.focus === 'modal') {
    const dialog = topmostModal(root, excludeSelector);
    if (dialog) {
      return { roots: [dialog], focus: 'modal' };
    }
  }
  if (options.rootSelector) {
    // A selector the document rejects matches nothing, the same as one that matches no
    // element: it must not silently widen the snapshot to the whole page.
    const selector = clrUsableSelectors(root, [options.rootSelector]);
    const roots = selector ? Array.from(root.querySelectorAll(selector)) : [];
    // A root inside a hidden, inert, ignored or excluded region is still left out: what
    // keeps a region from the engine holds however the walk is pointed at it. A root
    // inside another is already described with it.
    return {
      roots: roots.filter(
        element =>
          !isHiddenFromEngine(element, excludeSelector) &&
          !roots.some(other => other !== element && other.contains(element))
      ),
    };
  }
  return { roots: null };
}

/** The open modal dialog the user is looking at, if any: the last one the engine would describe. */
export function topmostModal(root: ParentNode, excludeSelector = ''): Element | null {
  const dialogs = openModalDialogs(root, excludeSelector);
  return dialogs.length ? dialogs[dialogs.length - 1] : null;
}

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

function scopeOf(root: ParentNode, walk: Walk): { roots: ParentNode | Element[]; focus?: 'modal' } {
  const scope = engineScope(root, walk.options);
  return scope.roots ? { roots: scope.roots, focus: scope.focus } : { roots: root };
}

/**
 * Describes the chosen roots. A root chosen by a selector or by modal focus may sit
 * inside a redacted region, which a walk starting from it cannot see; the region's
 * ancestry is checked once per root so that what it withholds stays withheld however
 * the walk is pointed at it.
 */
function describeScope(roots: ParentNode | Element[], walk: Walk): ClrComponentContext[] {
  if (Array.isArray(roots)) {
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
  return withinRedactedAncestry(roots, walk, () => describeChildren(roots, walk, null));
}

/**
 * Called when the budget is spent and `element` (with whatever follows it) is left
 * undescribed. Whether the snapshot is actually cut off depends on whether anything
 * there would have produced a node — an invisible or empty leftover is not a loss — so a
 * probe with a budget of one is walked from it, stopping at the first node it would
 * produce. The probe shares this walk's context but not its counters, and is itself
 * never probed, so it costs at most one node's worth of work. Once the walk is known to
 * be cut off, nothing further is probed.
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

/**
 * Describes what a custom element renders, noting when the element is a component that
 * is written to as one thing and owns what it renders (see `ClrElementMutator.ownsContents`),
 * so that nothing it renders is offered for writing on its own.
 */
function withinComponent<T>(element: Element, walk: Walk, describe: () => T): T {
  if (!ownsContents(element)) {
    return describe();
  }
  walk.mutatorDepth++;
  try {
    return describe();
  } finally {
    walk.mutatorDepth--;
  }
}

function withinRedactedAncestry<T>(node: ParentNode, walk: Walk, describe: () => T): T {
  const ancestor = node.nodeType === Node.ELEMENT_NODE ? (node as Element).parentElement : null;
  if (!ancestor?.closest(CLR_CONTEXT_REDACT_SELECTOR)) {
    return describe();
  }
  walk.redactedDepth++;
  try {
    return describe();
  } finally {
    walk.redactedDepth--;
  }
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
  collect('aria-describedby', walk.describedByIds, element => !!resolveRole(element) || isCustomElementTag(element));
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
  if (shouldSkipSubtree(element, walk)) {
    return [];
  }
  if (walk.elementDepth >= MAX_ELEMENT_DEPTH || walk.visited.count >= MAX_ELEMENTS_VISITED) {
    if (!walk.probing) {
      walk.truncated = true;
    }
    return [];
  }
  walk.visited.count++;
  walk.elementDepth++;
  try {
    return describeAtDepth(element, walk, owner);
  } finally {
    walk.elementDepth--;
  }
}

function describeAtDepth(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  const redacts = element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE);
  // A described-by target that is walked for the controls it holds still had its text
  // reported as the description of whatever it describes.
  const describes = !!element.id && walk.describedByIds.has(element.id);
  if (!redacts && !describes) {
    return describeVisible(element, walk, owner);
  }
  if (redacts) {
    walk.redactedDepth++;
  }
  if (describes) {
    walk.textDepth++;
  }
  try {
    return describeVisible(element, walk, owner);
  } finally {
    if (redacts) {
      walk.redactedDepth--;
    }
    if (describes) {
      walk.textDepth--;
    }
  }
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
    return listOf(finish(described, element, walk, true));
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

  const isCustomElement = tagName.includes('-');
  // Inside a region the application keeps from agents, a name is only what an author
  // gave the element — a label, `aria-label`, a title. A name taken from the content is
  // that content: a link that reads as the account number it opens, a button that
  // repeats the record it deletes.
  const redacted = walk.redactedDepth > 0;
  const label = accessibleName(element, redacted ? null : role, walk.options.maxTextLength, walk.excludeSelector);

  if (!role && !label) {
    if (!isCustomElement) {
      return isTextBlock(element, walk)
        ? describeTextBlock(element, walk, owner)
        : describeChildren(element, walk, owner);
    }
    // An anonymous custom element is a wrapper around whatever it renders.
    const rendered = withinComponent(element, walk, () => describeChildren(element, walk, element));

    // A single reportable descendant effectively IS this element, so it is returned
    // directly, attributed back to here (see the owner mechanism above) — how
    // <div role="grid"> inside <clr-datagrid> reports itself as a grid rendered by a
    // datagrid. What this element publishes belongs to that descendant too, and wins
    // over what the DOM said about it. More than one independently reportable
    // descendant means this component genuinely has several parts — clr-datagrid's grid
    // and its clr-dg-footer, clr-tabs's tablist and each active tabpanel — siblings in
    // the DOM but one component. Flattening them apart would scatter one thing into
    // unrelated-looking siblings, so they are wrapped instead: nesting survives exactly
    // as it is in the DOM, the wrapper counts against the budget like any other node,
    // and it is the wrapper that carries what this element publishes.
    // A component whose own content was excluded — a datagrid when grids are — says
    // nothing about itself through what is left of it, a footer, and is not written to
    // through it either.
    const published = !rendered.length || !rendersExcludedRole(element, walk);
    if (rendered.length === 1) {
      const only = rendered[0];
      // Text is all this element renders: it is the element's own label, the same way a
      // `clr-dg-footer` with bare text is labelled by it, rather than a text node inside.
      if (only.type === 'text' && !only.children && !only.state) {
        return listOf(finish({ type: tagName, element: tagName, label: only.label }, element, walk, false, published));
      }
      return listOf(finish(only, element, walk, false, published));
    }
    if (rendered.length > 1) {
      if (walk.remaining <= 0) {
        // The parts were counted; a wrapper for them is not affordable, so they stand alone.
        return rendered;
      }
      walk.remaining--;
      const wrapper: ClrComponentContext = { type: tagName, element: tagName, children: rendered };
      // A component that is written to as one thing is named by the control it renders
      // — a combobox by the input the user types into — so the node carrying its ref
      // carries the name an agent would refer to it by.
      if (ownsContents(element)) {
        const named = rendered.find(part => part.label && WRITABLE_ROLES.has(part.type));
        if (named) {
          wrapper.label = named.label;
        }
      }
      return listOf(finish(wrapper, element, walk, false, published));
    }
    // Nothing rendered, nothing said, nothing published: a closed modal, an icon, a
    // spacer, a dismissed alert. Such an element is not on the page as far as an agent is
    // concerned: a publisher that has nothing to say right now counts as none. Nor is
    // one whose content was left out on purpose — a datagrid when grids are excluded —
    // which must not come back labelled with all the text it holds.
    // The role check first: it looks only at the elements that could carry an excluded
    // role, while the text check reads the style of everything with text.
    if (holdsExcludedRole(element, walk)) {
      return [];
    }
    if (
      !readClrElementContext(element, walk.options) &&
      !accessibleText(element, undefined, walk.excludeSelector).trim()
    ) {
      return [];
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

  const node: ClrComponentContext = { type: role ?? (isCustomElement ? tagName : 'group') };
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
    const carriesText = !!role && isNameFromContents(role);
    if (summarisedList) {
      walk.summarizedListDepth++;
    }
    if (carriesText) {
      walk.textDepth++;
    }
    const children = withinComponent(element, walk, () => describeNested(element, walk, null));
    if (carriesText) {
      walk.textDepth--;
    }
    if (summarisedList) {
      walk.summarizedListDepth--;
    }
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
      if (!walk.probing) {
        walk.truncated = true;
      }
      break;
    }
    cells.set(
      cell,
      path.some(element => element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE))
    );
  }
  const nodes: ClrComponentContext[] = [];
  walk.textDepth++;
  try {
    for (const [cell, redacted] of cells) {
      if (redacted) {
        walk.redactedDepth++;
      }
      try {
        nodes.push(...describeNested(cell, walk, null));
      } finally {
        if (redacted) {
          walk.redactedDepth--;
        }
      }
    }
  } finally {
    walk.textDepth--;
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
  walk.textDepth++;
  const children = describeNested(element, walk, owner);
  walk.textDepth--;
  if (children.length) {
    node.children = children;
  }
  return listOf(finish(node, element, walk));
}

/**
 * An embedded frame. A page assembled from plugins in same-origin frames — a tab that is
 * an iframe, a widget that is another — is one page to the user and is described as one:
 * the frame's document is walked in place, against the same budget. A cross-origin frame
 * cannot be read from here and is reported as a frame with no children, so an agent at
 * least knows there is UI it does not see; the frame bridge is the way to reach it.
 */
function describeFrame(frame: HTMLIFrameElement, walk: Walk): ClrComponentContext[] {
  if (!walk.options.includeFrames || walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;

  const node: ClrComponentContext = { type: 'frame', element: frame.tagName.toLowerCase() };
  const state: Record<string, unknown> = {};
  const contents = frameDocument(frame);
  // A frame is named by what its author gave the frame element. Its document's title is
  // what that document shows — a record's name as often as a page's — so it is kept
  // apart, as the frame's `title`, where a caller given less than the full address does
  // not get it; and a frame in a redacted region reports none.
  const label = accessibleName(frame, null, walk.options.maxTextLength, walk.excludeSelector);
  if (label) {
    node.label = truncate(label, walk.options.maxTextLength);
  }
  const title = walk.redactedDepth > 0 ? '' : (contents?.title ?? '');
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
  } else if (contents.designMode === 'on' || contents.body.isContentEditable || isContentEditable(contents.body)) {
    // A document the user types into — how classic rich-text editors are built — is one
    // text field, and what it holds is a value, never prose.
    node.type = 'textbox';
    state.value = truncate(accessibleText(contents.body, undefined, walk.excludeSelector), walk.options.maxTextLength);
  } else {
    // Ids are scoped to a document: the frame's references must not skip or fold the
    // host's elements that happen to share an id, nor the other way round.
    const hostDescribedByIds = walk.describedByIds;
    const hostLabelIds = walk.labelIds;
    walk.describedByIds = new Set();
    walk.labelIds = new Set();
    walk.frameDepth++;
    try {
      collectReferencedIds(contents, walk);
      const children = describeNested(contents.body, walk, null);
      if (children.length) {
        node.children = children;
      }
    } finally {
      walk.frameDepth--;
      walk.describedByIds = hostDescribedByIds;
      walk.labelIds = hostLabelIds;
    }
  }

  if (Object.keys(state).length) {
    node.state = state;
  }
  return listOf(finish(node, frame, walk));
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
function describeNested(parent: ParentNode, walk: Walk, owner: Element | null): ClrComponentContext[] {
  const { maxDepth } = walk.options;
  if (maxDepth > 0 && walk.depth + 1 >= maxDepth) {
    return [];
  }
  walk.depth++;
  try {
    return describeChildren(parent, walk, owner);
  } finally {
    walk.depth--;
  }
}

function describeChildren(parent: ParentNode, walk: Walk, owner: Element | null): ClrComponentContext[] {
  const nodes: ClrComponentContext[] = [];
  const children = Array.from(parent.children);
  for (let index = 0; index < children.length; index++) {
    if (walk.remaining <= 0) {
      // Whatever follows would be described from here on; check that it would have been.
      for (const leftover of children.slice(index)) {
        if (walk.truncated || walk.probing) {
          break;
        }
        noteUndescribed(leftover, walk, owner);
      }
      break;
    }
    nodes.push(...describeElement(children[index], walk, owner));
  }
  return nodes;
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
  deep = false,
  published = true
): ClrComponentContext | null {
  const redacted = isRedacted(element, walk.redactedDepth > 0);
  // Inside a region the application keeps from agents, what a component publishes about
  // itself is not merged at all: a publisher reports its own state — a grid's rows and
  // selection, a combobox's value — and would otherwise carry it straight out. Nor is it
  // when the caller excluded what the component renders (see `rendersExcludedRole`).
  let described = redacted || !published ? node : mergeElementContext(node, element, walk.options);
  // A component that says it is something the caller excluded is left out like any
  // element with that role, whatever the DOM said about it. The node was counted against
  // the budget, which it no longer uses.
  if (walk.excludeRoles.has(described.type)) {
    walk.remaining++;
    return null;
  }
  // Anything published or extracted arrives unpruned and may carry children of its own.
  const foreign = deep || described !== node;

  if (redacted || described.state?.['redacted'] === true) {
    // What the user entered goes, along with the content the region shows: neither this
    // node nor anything under it keeps it.
    described = redactNode(described);
  }

  const pruned = pruneEmpty(described, foreign);
  if (published) {
    noteRef(pruned, element, walk);
  }
  return pruned;
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
    if (!role || !walk.excludeRoles.has(role)) {
      continue;
    }
    let owner: Element | null = descendant.parentElement;
    while (owner && owner !== element && !isCustomElementTag(owner)) {
      owner = owner.parentElement;
    }
    if (owner === element) {
      return true;
    }
  }
  return false;
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
    if (role && walk.excludeRoles.has(role)) {
      return true;
    }
  }
  return false;
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
function pruneEmpty(context: ClrComponentContext, deep = false): ClrComponentContext {
  const pruned: ClrComponentContext = { type: context.type };
  if (context.element) {
    pruned.element = context.element;
  }
  if (context.ref) {
    pruned.ref = context.ref;
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
    pruned.children = deep ? context.children.map(child => pruneEmpty(child, true)) : context.children;
  }
  return pruned;
}

/** Whether an element is a component written to as one thing, whose rendered controls are its own internals. */
function ownsContents(element: Element): boolean {
  return CLR_ELEMENT_MUTATOR_PROPERTY in element && readElementMutator(element)?.ownsContents === true;
}
