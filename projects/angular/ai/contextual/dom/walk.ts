/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaState, CLR_CONTEXT_REDACT_ATTRIBUTE, isRedacted } from './aria-state';
import { mergeElementContext } from './element-context';
import { isLeafRole, isNameFromContents, isPresentationalRole, mayContainControls, resolveRole } from './roles';
import { summarizeRole } from './summarizers';
import { accessibleText, isVisuallyHidden, truncate } from './text';

/**
 * Elements carrying this attribute — and everything inside them — are invisible to the
 * engine: the collector never describes them and the context tracker ignores their
 * mutations. Put it on UI that consumes context (an AI chat panel, a debug view) so it
 * neither describes itself into the page context nor triggers tracking feedback loops.
 */
export const CLR_CONTEXT_IGNORE_ATTRIBUTE = 'data-clr-context-ignore';

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

/** Elements that never carry meaning for an agent. */
const SKIPPED_TAGS = new Set(['script', 'style', 'template', 'link', 'meta', 'noscript', 'head']);

const IGNORE_SELECTOR = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

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
].join(', ');

/**
 * Elements whose text is a name for something else, never content of its own: a
 * control's label, a fieldset's legend, a table's caption. Reported through what they
 * name, so never as text.
 */
const NAMING_TAGS = new Set(['label', 'legend', 'caption', 'figcaption', 'option', 'optgroup', 'datalist', 'title']);

/** A modal dialog, explicit or implicit — what has the user's attention while it is open. */
const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"], dialog[open]';

interface Walk {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly extractors: ClrContextDomExtractor[];
  /** Roles whose subtrees are left out. */
  readonly excludeRoles: ReadonlySet<string>;
  /** Selector for elements left out with their subtrees, or `''` for none. */
  readonly excludeSelector: string;
  /** Ids of elements that exist only to describe another element. */
  readonly describedByIds: Set<string>;
  /** Ids of elements that name another element, and so are not free-standing text. */
  readonly labelIds: Set<string>;
  /** Components still within budget. Shared across the whole walk. */
  remaining: number;
  /** Greater than zero while inside an element marked `data-clr-context-redact`. */
  redactedDepth: number;
  /** Greater than zero while inside a list whose items were summarised. */
  summarizedListDepth: number;
  /** Greater than zero while inside a node whose label already carries the text below it. */
  textDepth: number;
  /** How many described nodes are above the current one. */
  depth: number;
}

/**
 * Describes everything currently on the page as a tree, by reading the accessibility
 * tree rather than any library's selectors.
 *
 * One depth-first pass. Each element is either skipped with its subtree, skipped but
 * descended into, described and descended into, or described as a leaf. Because
 * ancestry is known from the walk itself, nothing has to be cross-checked against the
 * elements already described — which is what makes this linear in the size of the DOM.
 *
 * The result is a pure function of the DOM at the moment of the call: only attached,
 * visible elements are described, so it can never report UI that has been closed,
 * destroyed or navigated away from.
 */
export function collectContextTree(
  root: ParentNode,
  options: Required<ClrContextSnapshotOptions>,
  extractors: ClrContextDomExtractor[] = []
): ClrComponentContext[] {
  return collectContextTreeWithin(root, options, extractors).components;
}

/** The result of a walk, and whether it ran out of budget before it ran out of page. */
export interface ClrContextTreeResult {
  components: ClrComponentContext[];
  truncated: boolean;
  /** Present when the walk was narrowed to the open modal dialog. */
  focus?: 'modal';
}

/** {@link collectContextTree}, also reporting whether the component budget ran out. */
export function collectContextTreeWithin(
  root: ParentNode,
  options: Required<ClrContextSnapshotOptions>,
  extractors: ClrContextDomExtractor[] = []
): ClrContextTreeResult {
  const walk: Walk = {
    options,
    extractors,
    excludeRoles: new Set(options.excludeRoles),
    excludeSelector: usableSelector(root, options.excludeSelectors.join(', ')),
    describedByIds: new Set(),
    labelIds: new Set(),
    remaining: options.maxComponents,
    redactedDepth: 0,
    summarizedListDepth: 0,
    textDepth: 0,
    depth: 0,
  };
  collectReferencedIds(root, walk);
  const scope = scopeOf(root, walk);
  const components = describeScope(scope.roots, walk);
  // The budget ran out if the walk had to stop while there was still something to see.
  const result: ClrContextTreeResult = {
    components,
    truncated: walk.remaining <= 0 && hasUndescribedContent(scope.roots, walk),
  };
  if (scope.focus) {
    result.focus = scope.focus;
  }
  return result;
}

/**
 * What the walk starts from: the whole root, the elements a `rootSelector` picks out, or
 * — with modal focus, while a modal dialog is open — the topmost open dialog alone. The
 * dialog is what the user can act on; the page behind it is what an agent no longer
 * needs, so it is left out entirely rather than budgeted down.
 */
function scopeOf(root: ParentNode, walk: Walk): { roots: ParentNode | Element[]; focus?: 'modal' } {
  if (walk.options.focus === 'modal') {
    const dialogs = Array.from(root.querySelectorAll(MODAL_SELECTOR)).filter(
      dialog => !dialog.closest(IGNORE_SELECTOR) && !shouldSkipSubtree(dialog, walk)
    );
    if (dialogs.length) {
      return { roots: [dialogs[dialogs.length - 1]], focus: 'modal' };
    }
  }
  const selector = usableSelector(root, walk.options.rootSelector);
  if (selector) {
    return { roots: Array.from(root.querySelectorAll(selector)) };
  }
  return { roots: root };
}

function describeScope(roots: ParentNode | Element[], walk: Walk): ClrComponentContext[] {
  if (Array.isArray(roots)) {
    return roots.flatMap(element => (walk.remaining > 0 ? describeElement(element, walk, null) : []));
  }
  return describeChildren(roots, walk, null);
}

/** A selector the document accepts, or `''` for none or an invalid one. */
function usableSelector(root: ParentNode, selector: string): string {
  if (!selector) {
    return '';
  }
  try {
    root.querySelector(selector);
    return selector;
  } catch {
    return '';
  }
}

/**
 * Whether the walk left anything behind. Only consulted once the budget is spent — a
 * page that fits exactly must not be reported as cut off — and answered by a second
 * pass with a budget one larger: if that pass describes more than the budget allowed,
 * something was left out. The probe is bounded the same way the walk is, so it costs at
 * most one more node's worth of work than the walk itself.
 */
function hasUndescribedContent(roots: ParentNode | Element[], walk: Walk): boolean {
  const probe: Walk = { ...walk, remaining: walk.options.maxComponents + 1, depth: 0 };
  const described = countNodes(describeScope(roots, probe));
  return described > walk.options.maxComponents;
}

function countNodes(nodes: ClrComponentContext[]): number {
  return nodes.reduce((total, node) => total + 1 + countNodes(node.children ?? []), 0);
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
 * An ignored region is inert to the engine, so what it says about the rest of the page
 * does not count: a panel marked ignore that describes itself against the page heading
 * must not make that heading disappear.
 */
function collectReferencedIds(root: ParentNode, walk: Walk): void {
  const collect = (attribute: string, into: Set<string>) => {
    for (const element of Array.from(root.querySelectorAll(`[${attribute}]`))) {
      if (element.closest(IGNORE_SELECTOR)) {
        continue;
      }
      for (const id of (element.getAttribute(attribute) ?? '').trim().split(/\s+/)) {
        if (id) {
          into.add(id);
        }
      }
    }
  };
  collect('aria-describedby', walk.describedByIds);
  collect('aria-labelledby', walk.labelIds);
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
    const described = extractor.extract(element as HTMLElement, walk.options);
    if (!described) {
      // The extractor owns this element: when it declines to describe it, the element is
      // not described generically either, but its contents may still be interesting.
      return describeChildren(element, walk, owner);
    }
    if (walk.remaining <= 0) {
      return [];
    }
    walk.remaining--;
    return [finish(described, element, walk)];
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

  const isCustomElement = tagName.includes('-');
  const label = accessibleName(element, role, walk.options.maxTextLength);

  if (!role && !label) {
    if (!isCustomElement) {
      return isTextBlock(element, walk)
        ? describeTextBlock(element, walk, owner)
        : describeChildren(element, walk, owner);
    }
    // An anonymous custom element is a wrapper around whatever it renders.
    const rendered = describeChildren(element, walk, element);

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
    if (rendered.length === 1) {
      const only = rendered[0];
      // Text is all this element renders: it is the element's own label, the same way a
      // `clr-dg-footer` with bare text is labelled by it, rather than a text node inside.
      if (only.type === 'text' && !only.children && !only.state) {
        return [finish({ type: tagName, element: tagName, label: only.label }, element, walk)];
      }
      return [finish(only, element, walk)];
    }
    if (rendered.length > 1) {
      walk.remaining--;
      return [finish({ type: tagName, element: tagName, children: rendered }, element, walk)];
    }
  }

  if (walk.remaining <= 0) {
    return [];
  }
  walk.remaining--;

  // An anonymous custom element has no role to describe it and no name of its own, so
  // what it renders is the only thing it can say — a `clr-dg-footer` reporting "2 items",
  // for instance.
  const fallbackLabel =
    !role && !label && isCustomElement ? truncate(accessibleText(element), walk.options.maxTextLength) : label;

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
  const summary = summarizeRole(element, role, walk.options);
  const state = { ...ariaState(element, walk.options, walk.redactedDepth > 0), ...summary };
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
    const children = describeNested(element, walk, null);
    if (carriesText) {
      walk.textDepth--;
    }
    if (summarisedList) {
      walk.summarizedListDepth--;
    }
    if (children.length) {
      node.children = children;
    }
  }

  const described = finish(node, element, walk);

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
  const label = truncate(accessibleText(element), walk.options.maxTextLength);
  if (label) {
    node.label = label;
  }
  walk.textDepth++;
  const children = describeNested(element, walk, owner);
  walk.textDepth--;
  if (children.length) {
    node.children = children;
  }
  return [finish(node, element, walk)];
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
  const label = accessibleName(frame, null, walk.options.maxTextLength) || (contents?.title ?? '');
  if (label) {
    node.label = truncate(label, walk.options.maxTextLength);
  }

  const location = contents ? contents.location.href : (frame.getAttribute('src') ?? '');
  if (location && !location.startsWith('about:')) {
    state.url = truncate(stripQueryAndFragment(location), walk.options.maxTextLength);
  }

  if (contents === null) {
    state.crossOrigin = true;
  } else if (!contents.body) {
    state.loading = true;
  } else {
    collectReferencedIds(contents, walk);
    const children = describeNested(contents.body, walk, null);
    if (children.length) {
      node.children = children;
    }
  }

  if (Object.keys(state).length) {
    node.state = state;
  }
  return [finish(node, frame, walk)];
}

/** A frame's document when it is same-origin and readable, `null` when it is not. */
function frameDocument(frame: HTMLIFrameElement): Document | null {
  try {
    return frame.contentDocument;
  } catch {
    return null;
  }
}

/** Everything up to the first `?` or `#`. */
function stripQueryAndFragment(url: string): string {
  return url.split(/[?#]/)[0];
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
  for (const child of Array.from(parent.children)) {
    if (walk.remaining <= 0) {
      break;
    }
    nodes.push(...describeElement(child, walk, owner));
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
function finish(node: ClrComponentContext, element: Element, walk: Walk): ClrComponentContext {
  let described = mergeElementContext(node, element, walk.options);

  if (described.state?.['redacted'] === true || isRedacted(element, walk.redactedDepth > 0)) {
    const state: Record<string, unknown> = { ...described.state, redacted: true };
    delete state['value'];
    described = { ...described, state };
  }

  return pruneEmpty(described);
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
  if (element.id && walk.describedByIds.has(element.id) && !element.querySelector(CONTROL_SELECTOR)) {
    return true;
  }
  return !isVisible(element as HTMLElement);
}

/**
 * Whether the element is rendered and can be seen, as assistive technology judges it:
 * `display: none`, `visibility: hidden`, `content-visibility: hidden` and full
 * transparency all hide it. `checkVisibility` without options only covers the first.
 */
function isVisible(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility({ visibilityProperty: true, opacityProperty: true, contentVisibilityAuto: true });
  }
  return element.getClientRects().length > 0;
}

/** Removes empty labels, states and children so snapshots stay minimal. */
export function pruneEmpty(context: ClrComponentContext): ClrComponentContext {
  const pruned: ClrComponentContext = { type: context.type };
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
    pruned.children = context.children.map(child => pruneEmpty(child));
  }
  return pruned;
}
