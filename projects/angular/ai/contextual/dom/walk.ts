/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrComponentContext, ClrContextSnapshotOptions } from '@clr/angular/utils';

import { accessibleName } from './accessible-name';
import { ariaState } from './aria-state';
import { mergeElementContext } from './element-context';
import { isLeafRole, isPresentationalRole, resolveRole } from './roles';
import { hasRoleSummarizer, summarizeRole } from './summarizers';
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

interface Walk {
  readonly options: Required<ClrContextSnapshotOptions>;
  readonly extractors: ClrContextDomExtractor[];
  /** Ids of elements that exist only to describe another element. */
  readonly describedByIds: ReadonlySet<string>;
  /** Components still within budget. Shared across the whole walk. */
  remaining: number;
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
    { options, extractors, describedByIds: describedByTargets(root), remaining: options.maxComponents },
    null
  );
}

/**
 * Ids referenced by an `aria-describedby` anywhere under `root`.
 *
 * Elements referenced this way — helper text, a validation message — are supplementary
 * text belonging to the control they describe, and that control reports them as its
 * `description`. Describing them again on their own would repeat the text and leave an
 * agent to work out which field it belonged to.
 *
 * `aria-labelledby` targets are deliberately not collected: those are usually real
 * content, such as a heading that also names a dialog.
 */
function describedByTargets(root: ParentNode): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const element of Array.from(root.querySelectorAll('[aria-describedby]'))) {
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
 * itself as a grid rendered by a datagrid. Its published context is merged too: the
 * component that publishes is the host element, while the node being described is the
 * role-bearing element inside it.
 */
function describeElement(element: Element, walk: Walk, owner: Element | null): ClrComponentContext[] {
  if (shouldSkipSubtree(element, walk)) {
    return [];
  }

  const extractor = walk.extractors.find(candidate => element.matches(candidate.selector));
  if (extractor) {
    const described = extractor.extract(element as HTMLElement, walk.options);
    if (!described) {
      // The extractor owns this element: when it declines to describe it, the element is
      // not described generically either, but its contents may still be interesting.
      return describeChildren(element, walk, owner);
    }
    walk.remaining--;
    return [pruneEmpty(mergeElementContext(described, element, walk.options))];
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
    // An anonymous custom element is a wrapper around whatever it renders. Prefer to
    // describe that, attributing it back to this element, and only describe the wrapper
    // itself when it turns out to render nothing describable.
    const rendered = describeChildren(element, walk, element);
    if (rendered.length) {
      return rendered;
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
  const state = { ...ariaState(element, role, walk.options), ...summarizeRole(element, role, walk.options) };
  if (Object.keys(state).length) {
    node.state = state;
  }

  // Descend unless the role is a single control or message, whose label already says
  // everything, or a collection that has just been summarised.
  const terminal = !!role && (isLeafRole(role) || hasRoleSummarizer(role));
  if (!terminal) {
    const children = describeChildren(element, walk, null);
    if (children.length) {
      node.children = children;
    }
  }

  // A component publishes on its own host element, which for Clarity is the custom
  // element wrapping the role-bearing node being described here. Merge the host's
  // contribution first, so anything the described element publishes itself still wins.
  let described = node;
  if (owner && owner !== element) {
    described = mergeElementContext(described, owner, walk.options);
  }
  return [pruneEmpty(mergeElementContext(described, element, walk.options))];
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

/** Whether an element and everything inside it is invisible to the engine. */
function shouldSkipSubtree(element: Element, walk: Walk): boolean {
  if (SKIPPED_TAGS.has(element.tagName.toLowerCase())) {
    return true;
  }
  if (element.id && walk.describedByIds.has(element.id)) {
    return true;
  }
  if (element.hasAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE)) {
    return true;
  }
  if (element.getAttribute('aria-hidden') === 'true' || element.hasAttribute('hidden')) {
    return true;
  }
  return !isVisible(element as HTMLElement);
}

function isVisible(element: HTMLElement): boolean {
  if (typeof element.checkVisibility === 'function') {
    return element.checkVisibility();
  }
  return element.getClientRects().length > 0;
}

/** Removes empty labels, states, actions and children so snapshots stay minimal. */
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
  if (context.actions?.length) {
    const actions = context.actions.filter(action => action.label || action.href);
    if (actions.length) {
      pruned.actions = actions;
    }
  }
  if (context.children?.length) {
    pruned.children = context.children.map(child => pruneEmpty(child));
  }
  return pruned;
}
