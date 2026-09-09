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
import { isLeafRole, isPresentationalRole, mayContainControls, resolveRole } from './roles';
import { summarizeRole } from './summarizers';
import { accessibleText, truncate } from './text';

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

interface Walk {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly extractors: ClrContextDomExtractor[];
  /** Ids of elements that exist only to describe another element. */
  readonly describedByIds: ReadonlySet<string>;
  /** Components still within budget. Shared across the whole walk. */
  remaining: number;
  /** Greater than zero while inside an element marked `data-clr-context-redact`. */
  redactedDepth: number;
  /** Greater than zero while inside a list whose items were summarised. */
  summarizedListDepth: number;
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
  return describeChildren(
    root,
    {
      options,
      extractors,
      describedByIds: describedByTargets(root),
      remaining: options.maxComponents,
      redactedDepth: 0,
      summarizedListDepth: 0,
    },
    null
  );
}

/**
 * Ids referenced by an `aria-describedby` anywhere under `root`, outside ignored regions.
 *
 * Elements referenced this way — helper text, a validation message — are supplementary
 * text belonging to the control they describe, and that control reports them as its
 * `description`. Describing them again on their own would repeat the text and leave an
 * agent to work out which field it belonged to.
 *
 * An ignored region is inert to the engine, so what it says about the rest of the page
 * does not count: a panel marked ignore that describes itself against the page heading
 * must not make that heading disappear.
 *
 * `aria-labelledby` targets are deliberately not collected: those are usually real
 * content, such as a heading that also names a dialog.
 */
function describedByTargets(root: ParentNode): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const element of Array.from(root.querySelectorAll('[aria-describedby]'))) {
    if (element.closest(IGNORE_SELECTOR)) {
      continue;
    }
    for (const id of (element.getAttribute('aria-describedby') ?? '').trim().split(/\s+/)) {
      if (id) {
        ids.add(id);
      }
    }
  }
  return ids;
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
  if (!redacts) {
    return describeVisible(element, walk, owner);
  }
  walk.redactedDepth++;
  try {
    return describeVisible(element, walk, owner);
  } finally {
    walk.redactedDepth--;
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

  const role = resolveRole(element);
  if (role && isPresentationalRole(role)) {
    return describeChildren(element, walk, owner);
  }

  const tagName = element.tagName.toLowerCase();
  const isCustomElement = tagName.includes('-');
  const label = accessibleName(element, role, walk.options.maxTextLength);

  if (!role && !label) {
    if (!isCustomElement) {
      return describeChildren(element, walk, owner);
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
      return [finish(rendered[0], element, walk)];
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
    if (summarisedList) {
      walk.summarizedListDepth++;
    }
    const children = describeChildren(element, walk, null);
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
