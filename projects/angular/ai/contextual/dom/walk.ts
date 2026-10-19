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
 * Describes markup that has neither a role nor an accessible name, such as a bare `<div class="card">`.
 * State under the keys listed on `ClrElementContextCallback` is withheld from untrusted consumers.
 */
export interface ClrContextDomExtractor {
  /** CSS selector matching the elements this extractor understands. */
  selector: string;
  /** Describes the element's current state, or returns `null` when there is nothing to report. */
  extract(element: HTMLElement, options: Required<ClrContextSnapshotOptions>): ClrComponentContext | null;
}

/**
 * Receives each described node with its element, innermost first, so a host carrying the
 * form binding is reachable from a node attributed to an element inside it.
 */
export interface ClrContextRefSink {
  note(node: ClrComponentContext, element: Element): void;
}

/** Roles an agent can propose a value for; such nodes are offered to the ref sink. */
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

/** Caps the elements one walk reads, so a page of empty wrappers is not read end to end. */
const MAX_ELEMENTS_VISITED = 25_000;

const SKIPPED_TAGS = new Set(['script', 'style', 'template', 'link', 'meta', 'noscript', 'head']);

/** A described-by target holding a control is real content, walked rather than folded into a description. */
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

/** Elements whose text names something else and is never reported as text. */
const NAMING_TAGS = new Set(['label', 'legend', 'caption', 'figcaption', 'option', 'optgroup', 'datalist', 'title']);

/** Only a dialog that says it is modal; a non-modal dialog or side panel leaves the page in use. */
const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog:modal';

/** Fallback for browsers without `:modal`: any open `<dialog>` counts as modal. */
const LEGACY_MODAL_SELECTOR =
  '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog[open]';

interface Walk {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly extractors: ClrContextDomExtractor[];
  readonly excludeRoles: ReadonlySet<string>;
  readonly excludeRoleCandidates: string;
  readonly excludeSelector: string;
  describedByIds: Set<string>;
  labelIds: Set<string>;
  /** Component budget left; a probe has its own. */
  remaining: number;
  truncated: boolean;
  /** A probe only checks whether anything is left to describe. */
  readonly probing: boolean;
  redactedDepth: number;
  summarizedListDepth: number;
  /** Inside a node whose label already carries the text below it. */
  textDepth: number;
  depth: number;
  elementDepth: number;
  /** Shared across the whole walk, probes included. */
  visited: { count: number };
  frameDepth: number;
  /** Inside a component that publishes its own writing, so its rendered controls get no refs. */
  mutatorDepth: number;
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

export function collectContextTreeWithin(
  root: ParentNode,
  options: Required<ClrContextSnapshotOptions>,
  extractors: ClrContextDomExtractor[] = [],
  refs: ClrContextRefSink | null = null
): ClrContextTreeResult {
  const excludeRoles = new Set(options.excludeRoles);
  const walk: Walk = {
    options,
    extractors: extractors.filter(extractor => clrUsableSelectors(root, [extractor.selector])),
    excludeRoles,
    excludeRoleCandidates: roleCandidateSelector(excludeRoles),
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

/** Whether the walk would leave this element out, judged from the element and its ancestry. */
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
 * Whether a snapshot with these options leaves the element out on purpose (excluded selector or role,
 * or outside the roots), so the mutation engine never writes what such a snapshot would not show.
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

export interface ClrContextScope {
  roots: Element[] | null;
  focus?: 'modal';
}

/** The whole page, the `rootSelector` roots, or with modal focus the topmost open dialog inside them. */
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

/** A selector the document rejects matches nothing; it must not widen the snapshot to the whole page. */
function selectedRoots(
  root: ParentNode,
  rootSelector: string,
  excludeSelector: string,
  excludedRoles: ReadonlySet<string>
): Element[] {
  const selector = clrUsableSelectors(root, [rootSelector]);
  const roots = selector ? Array.from(root.querySelectorAll(selector)) : [];
  // What keeps a region from the engine holds however the walk is pointed at it.
  return roots.filter(
    element =>
      !isHiddenFromEngine(element, excludeSelector) &&
      !hasExcludedRole(element, excludedRoles) &&
      !roots.some(other => other !== element && other.contains(element))
  );
}

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

/** The dialog, or the anonymous custom element (e.g. a wizard) that renders nothing but it. */
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

const DESCRIBABLE = `[role], ${CONTROL_SELECTOR}, img, svg, iframe, frame, [aria-label], [aria-labelledby]`;

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

/** Checks each root's ancestry for redaction, which a walk starting at the root cannot see. */
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

/** Probes the leftovers with a budget of one: the snapshot is only truncated if they would produce a node. */
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

type DepthCounter =
  'depth' | 'elementDepth' | 'frameDepth' | 'mutatorDepth' | 'redactedDepth' | 'summarizedListDepth' | 'textDepth';

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

/** Notes a component that owns what it renders, so nothing inside is offered for writing on its own. */
function withinComponent<T>(element: Element, walk: Walk, describe: () => T): T {
  return within(walk, ownsContents(element) ? ['mutatorDepth'] : [], describe);
}

/**
 * `aria-describedby` targets are reported as their control's description, not again on their own;
 * `aria-labelledby` targets are still described, but not as free-standing text.
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
  collect(
    'aria-errormessage',
    walk.describedByIds,
    element => describes(element) && ariaEnumValue(element, 'aria-invalid') !== null
  );
  collect('aria-labelledby', walk.labelIds, () => true);
}

function isCustomElementTag(element: Element): boolean {
  return element.tagName.includes('-');
}

/**
 * `owner` is the nearest role-less custom element above; it becomes the `element` of the
 * next role-bearing node, so `<div role="grid">` reports itself as rendered by `clr-datagrid`.
 */
function describeElement(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  // Past the cap nothing is read, not even visibility, which would cost a style read per element.
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
  // A summarised list's item with nothing to act on adds no node, so a huge list costs only its controls.
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
  // In a redacted region only an author-given name is used: a name from content is that content.
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

  const fallbackLabel =
    !role && !label && isCustomElement && !redacted
      ? truncate(accessibleText(element, undefined, walk.excludeSelector), walk.options.maxTextLength)
      : label;

  const node: ClrComponentContext = { type: role ?? 'group' };
  const attribution = isCustomElement ? tagName : owner?.tagName.toLowerCase();
  if (attribution) {
    node.element = attribution;
  }
  if (fallbackLabel) {
    node.label = fallbackLabel;
  }
  // Summarising collections keeps a ten-thousand-row grid from producing ten thousand nodes.
  const summary = summarizeSafely(element, role, walk);
  const state = { ...ariaState(element, walk.options, redacted, walk.excludeSelector), ...summary };
  if (Object.keys(state).length) {
    node.state = state;
  }

  // Leaf widgets and summarised collections are not descended into; a summarised list still is, for its links.
  const summarised = summary !== null;
  const summarisedList = summarised && role === 'list';
  const terminal = !!role && ((isLeafRole(role) && !mayContainControls(role)) || (summarised && !summarisedList));
  if (!terminal) {
    const counters: DepthCounter[] = [];
    if (summarisedList) {
      counters.push('summarizedListDepth');
    }
    if (role && isNameFromContents(role)) {
      counters.push('textDepth');
    }
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

  if (role === 'listitem' && walk.summarizedListDepth > 0 && !described.state) {
    walk.remaining++;
    return described.children ?? [];
  }
  return [described];
}

/**
 * Returns the single rendered part attributed to this element, a wrapper node for several parts,
 * or `null` when the element is described as a node of its own.
 */
function describeAnonymousCustomElement(element: Element, tagName: string, walk: Walk): ClrComponentContext[] | null {
  const rendered = withinComponent(element, walk, () => describeChildren(element, walk, element));
  const published = !rendered.length || !rendersExcludedRole(element, walk);
  if (rendered.length === 1) {
    const only = rendered[0];
    if (only.type === 'text' && !only.children && !only.state) {
      return listOf(finish({ type: 'group', element: tagName, label: only.label }, element, walk, { published }));
    }
    return listOf(finish(only, element, walk, { published }));
  }
  if (rendered.length > 1) {
    if (walk.remaining <= 0) {
      return rendered;
    }
    walk.remaining--;
    const wrapper: ClrComponentContext = { type: 'group', element: tagName, children: rendered };
    // A component written to as one thing is named by the control it renders, as an agent would refer to it.
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

/** Application controls in a summarised collection's cells, which the summary does not cover. */
function describeCellControls(collection: Element, walk: Walk): ClrComponentContext[] {
  if (walk.options.collectionItems === 'summary') {
    return [];
  }
  // Hidden, inert, ignored or excluded cells are skipped, as the walk would skip them.
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

function ancestryUntil(element: Element, boundary: Element): Element[] {
  const path: Element[] = [];
  for (let current: Element | null = element; current && current !== boundary; current = current.parentElement) {
    path.push(current);
  }
  return path;
}

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

function liveSetting(element: Element): string | null {
  const region = element.closest('[aria-live]');
  return region && (region === element || !resolveRole(region)) ? ariaEnumValue(region, 'aria-live') : null;
}

/**
 * A same-origin frame is walked in place against the same budget; a cross-origin one is reported
 * as an empty frame so an agent knows there is UI it cannot see.
 */
function describeFrame(frame: HTMLIFrameElement, walk: Walk): ClrComponentContext[] {
  if (!walk.options.includeFrames || walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;

  const node: ClrComponentContext = { type: 'frame', element: frame.tagName.toLowerCase() };
  const state: Record<string, unknown> = {};
  const contents = frameDocument(frame);
  const roots = contents ? [contents.documentElement, contents.body].filter(root => !!root) : [];
  const ignored = roots.some(root => hidesDocument(root, walk));
  const redacted = walk.redactedDepth > 0 || roots.some(root => root.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE));
  // The document title may be a record's name, so it is kept apart as `title` and withheld when redacted.
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
  } else if (contents.designMode === 'on' || contents.body.isContentEditable || isContentEditable(contents.body)) {
    // A rich-text editor document is one text field, and its content is a value.
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
    // Ids are scoped to a document, so the frame gets its own id sets.
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

function hidesDocument(root: Element, walk: Walk): boolean {
  return (
    root.hasAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE) ||
    root.getAttribute('aria-hidden') === 'true' ||
    root.hasAttribute('hidden') ||
    root.hasAttribute('inert') ||
    (!!walk.excludeSelector && root.matches(walk.excludeSelector))
  );
}

/** The initial blank document has a body too, so the body alone does not tell. */
function isStillNavigating(frame: HTMLIFrameElement, contents: Document): boolean {
  const src = frame.getAttribute('src');
  return (
    contents.location.href === 'about:blank' && !!src && !src.startsWith('about:') && !frame.hasAttribute('srcdoc')
  );
}

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

function summarizeSafely(element: Element, role: string | null, walk: Walk): Record<string, unknown> | null {
  try {
    return summarizeRole(element, role, walk.options, walk.excludeSelector);
  } catch {
    return null;
  }
}

function nameSafely(element: Element, role: string | null, walk: Walk): string {
  try {
    return accessibleName(element, role, walk.options.maxTextLength, walk.excludeSelector);
  } catch {
    walk.truncated = true;
    return '';
  }
}

function frameDocument(frame: HTMLIFrameElement): Document | null {
  try {
    return frame.contentDocument;
  } catch {
    return null;
  }
}

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
    if (withText && isPhrasing(child as Element, walk)) {
      text += phrasingText(child as Element, walk);
      continue;
    }
    nodes.push(...describeLooseText(text, looseText, walk));
    text = '';
    if (walk.remaining <= 0) {
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

function phrasingText(element: Element, walk: Walk): string {
  if (shouldSkipSubtree(element, walk) || isVisuallyHidden(element)) {
    return '';
  }
  return accessibleText(element, undefined, walk.excludeSelector);
}

const MEANINGFUL_TEXT = /[\p{L}\p{N}]/u;

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

interface FinishOptions {
  foreign?: boolean;
  published?: boolean;
}

/** Redaction is re-applied after merging published context, so a component cannot reinstate a withheld value. */
function finish(
  node: ClrComponentContext,
  element: Element,
  walk: Walk,
  { foreign = false, published = true }: FinishOptions = {}
): ClrComponentContext | null {
  const redacted = isRedacted(element, walk.redactedDepth > 0);
  // Published context is not merged inside a redacted region: it would carry the component's state straight out.
  let described = node;
  if (published) {
    described = redacted
      ? withoutOverriddenLabel(node, element, walk)
      : mergeElementContext(node, element, walk.options);
  }
  if (walk.excludeRoles.has(described.type)) {
    walk.remaining++;
    return null;
  }
  const unpruned = foreign || described !== node;

  if (redacted || described.state?.['redacted'] === true) {
    described = redactNode(described);
  }

  const pruned = pruneEmpty(described, { foreign: unpruned });
  if (published) {
    noteRef(pruned, element, walk);
  }
  return pruned;
}

/** In a redacted region, a markup name the element overrides is dropped; both may be the withheld content. */
function withoutOverriddenLabel(node: ClrComponentContext, element: Element, walk: Walk): ClrComponentContext {
  // Reading the published label runs the whole callback, so only when there is a label to lose.
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

/** Whether the component's own template renders an excluded role (the grid in `clr-datagrid`). */
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

/** No custom element between them: a datagrid renders its grid, not the input in one of its cells. */
function isRenderedBy(descendant: Element, element: Element): boolean {
  let owner: Element | null = descendant.parentElement;
  while (owner && owner !== element && !isCustomElementTag(owner)) {
    owner = owner.parentElement;
  }
  return owner === element;
}

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

function isLeftOutAnyway(element: Element, excludeSelector: string): boolean {
  return !!element.closest(CLR_CONTEXT_IGNORE_SELECTOR) || (!!excludeSelector && !!element.closest(excludeSelector));
}

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
  // Only role-less text without controls folds into a description; page content can point
  // `aria-describedby` at any id.
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
    pruned.children = foreign ? context.children.map(child => pruneEmpty(child, { foreign: true })) : context.children;
  }
  return pruned;
}

/**
 * Gives a writable node a ref and records its element; a node finished again for its host keeps the ref.
 * Nothing in a frame, a redacted region or a component that owns its contents gets one.
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

/** Folds a host's rendered part with the same role and name into the host, so the control is not listed twice. */
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
  walk.remaining++;
  return node;
}

function ownsContents(element: Element): boolean {
  return CLR_ELEMENT_MUTATOR_PROPERTY in element && readElementMutator(element)?.ownsContents === true;
}
