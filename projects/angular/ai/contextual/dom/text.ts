/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_CONTEXT_EDITING_HOST_SELECTOR,
  CLR_CONTEXT_HIDDEN_SELECTOR,
  CLR_CONTEXT_IGNORE_SELECTOR,
  CLR_CONTEXT_REDACT_SELECTOR,
} from '@clr/angular/utils';

import { readScope } from './read-scope';
import { isVisible } from './visibility';

/**
 * Normalizes whitespace and enforces a text budget, marking anything shortened with an
 * ellipsis so a reader can tell truncated text from a genuinely short value. The result
 * never exceeds `maxLength`, which is what keeps a snapshot's size predictable.
 */
export function truncate(text: string, maxLength: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  // A cut between the two halves of a surrogate pair would leave half a character, which
  // does not survive encoding: the whole character goes.
  return `${normalized.slice(0, maxLength - 1).replace(/[\ud800-\udbff]$/, '')}…`;
}

/**
 * Whether an element is hidden from sight while staying available to a screen reader.
 *
 * Detected from computed style rather than any library's class name, because the
 * technique is universal: Clarity's `.clr-sr-only`, Bootstrap's `.visually-hidden`,
 * Tailwind's `.sr-only` and the CDK's `.cdk-visually-hidden` all clip an absolutely
 * positioned one-pixel box.
 *
 * Such text is deliberate guidance for a screen reader — "Use left or right key to
 * resize the column" — and belongs in the accessibility tree, but it is not what a
 * component is called, so it is left out of names.
 */
export function isVisuallyHidden(element: Element): boolean {
  const style = computedStyle(element);
  return !!style && isClipped(element, style);
}

/**
 * An element's computed style, asked for once per walk (see {@link withinReadScope}),
 * which spares the walk one lookup per element for every name, description and text
 * block that reads it.
 */
function computedStyle(element: Element): CSSStyleDeclaration | null {
  const styles = readScope()?.styles;
  const cached = styles?.get(element);
  if (cached) {
    return cached;
  }
  const style = element.ownerDocument.defaultView?.getComputedStyle(element);
  if (!style) {
    return null;
  }
  styles?.set(element, style);
  return style;
}

/**
 * Whether an element contributes nothing to a name: hidden from assistive technology or
 * not rendered at all, and — unless `includeClipped` — hidden from sight too. A control
 * that keeps both variants of its label in the DOM and shows one at a time hides the
 * other with `display: none`, and is named by the visible one.
 */
function isExcludedFromName(element: Element, style: CSSStyleDeclaration | null, includeClipped: boolean): boolean {
  if (
    element.getAttribute('aria-hidden') === 'true' ||
    element.hasAttribute('hidden') ||
    element.hasAttribute('inert')
  ) {
    return true;
  }
  if (!style) {
    return false;
  }
  // The walk skips what is invisible, so no name borrows it either.
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
    return true;
  }
  return !includeClipped && isClipped(element, style);
}

function isClipped(element: Element, style: CSSStyleDeclaration): boolean {
  // The visually-hidden idiom clips to nothing with `inset(...)`; a shape — a circle
  // masking an avatar, a polygon — still shows what it clips.
  if (style.clipPath?.startsWith('inset(')) {
    return true;
  }
  if (style.clip && style.clip !== 'auto') {
    return true;
  }
  if (style.overflow !== 'hidden') {
    return false;
  }
  const rect = element.getBoundingClientRect();
  return rect.width <= 1 && rect.height <= 1;
}

/**
 * An element's text as it should be read for a name: content hidden from the
 * accessibility tree is left out, and so is content hidden only from sight — the
 * `clr-sr-only` guidance a column header carries ("use left or right key to resize") is
 * an instruction, not part of what the column is called. Where hidden-from-sight text is
 * all an element has, though, it is the name: an icon button labelled by a `clr-sr-only`
 * span is called what that span says, as assistive technology calls it.
 *
 * `exclude` leaves one descendant out — the control a wrapping `<label>` names, whose
 * own options or content are not part of its name. `withheld` is a selector for further
 * descendants whose text is never read — the elements a snapshot's `excludeSelectors`
 * leave out, which must not come back as part of another element's name.
 */
export function accessibleText(element: Element, exclude?: Element, withheld = ''): string {
  const visible = textFor(element, exclude, false, withheld);
  return visible.trim() ? visible : textFor(element, exclude, true, withheld);
}

/**
 * What a user can act on, which the walk describes as a node of its own: a message is
 * named without it, and nothing inside it lends its own name to another element's.
 */
export const ACTION_SELECTOR = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  '[contenteditable]',
  ...[
    'button',
    'link',
    'checkbox',
    'radio',
    'switch',
    'textbox',
    'searchbox',
    'combobox',
    'listbox',
    'menu',
    'menuitem',
    'tab',
    'slider',
    'spinbutton',
  ].map(role => `[role="${role}"]`),
].join(', ');

/**
 * How deeply nested an element the engine still reads, in a walk or a name. The HTML
 * parser nests no deeper than 512, but script can, and reading recurses once per level:
 * what lies deeper is left out rather than the stack running out.
 */
export const MAX_NESTING_DEPTH = 512;

function textFor(
  element: Element,
  exclude: Element | undefined,
  includeClipped: boolean,
  withheld: string,
  depth = 0,
  embedding = true
): string {
  if (depth >= MAX_NESTING_DEPTH) {
    return '';
  }
  let text = '';
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent ?? '';
      continue;
    }
    // Checked by node type rather than `instanceof Element`: a node inside a frame's
    // document is an instance of that window's Element, not this one's.
    if (node.nodeType !== Node.ELEMENT_NODE || node === exclude) {
      continue;
    }
    const child = node as Element;
    // Text the application keeps from agents is never borrowed into a name, a label or a
    // description, whatever element above it is being named.
    if (child.matches(UNREADABLE_SELECTOR) || (withheld && child.matches(withheld))) {
      continue;
    }
    // A descendant that names itself — an icon's `aria-label`, an image's `alt` — stands
    // for its content, as it does when a browser names an element from what it holds: a
    // button holding only an image is called what the image's text alternative says. A
    // control inside, such as a column header's filter button, is a node of its own, and
    // neither it nor anything in it lends its name.
    const embeds = embedding && !child.matches(ACTION_SELECTOR);
    const inner =
      (embeds ? embeddedName(child, withheld) : null) ??
      textFor(child, exclude, includeClipped, withheld, depth + 1, embeds);
    // Nothing to contribute, and checking style for an empty element would be a layout
    // read for no reason.
    if (!inner.trim()) {
      continue;
    }
    const style = computedStyle(child);
    if (isExcludedFromName(child, style, includeClipped)) {
      continue;
    }
    // Block-level content reads as separate words, as it does when a browser names an
    // element: two cells or two lines never run together into one word.
    text += style && !style.display.startsWith('inline') && style.display !== 'contents' ? ` ${inner} ` : inner;
  }
  return text;
}

/**
 * The name a descendant gives itself, which stands for its content in a name taken from
 * contents: its `aria-labelledby` or `aria-label`, and for an image (`<img>`, `<area>`,
 * `role="img"`) its `alt` or `title`. An image that gives none contributes nothing, since
 * what it draws is not text. `null` for any other element that gives no name, whose
 * content is read instead.
 *
 * `aria-labelledby` is not followed while already following one, as in the ARIA name
 * computation: two elements that name each other must not recurse.
 */
function embeddedName(element: Element, withheld: string): string | null {
  const referenced = followingReference ? '' : referencedText(element, 'aria-labelledby', withheld);
  if (referenced) {
    return referenced;
  }
  const label = element.getAttribute('aria-label')?.trim();
  if (label) {
    return label;
  }
  const tagName = element.tagName.toLowerCase();
  const nativeImage = tagName === 'img' || tagName === 'area';
  if (!nativeImage && element.getAttribute('role')?.trim().split(/\s+/)[0] !== 'img') {
    return null;
  }
  return (nativeImage && element.getAttribute('alt')?.trim()) || element.getAttribute('title')?.trim() || '';
}

/** Whether an id reference is being followed, during which another is not; see {@link embeddedName}. */
let followingReference = false;

/**
 * The joined text of every element an id-list attribute (`aria-labelledby`,
 * `aria-describedby`, `aria-errormessage`) points at, in the order the ids are given;
 * missing and empty targets are skipped, and so are targets inside anything `withheld`
 * selects and the ids in `skip`.
 */
export function referencedText(
  element: Element,
  attribute: string,
  withheld = '',
  skip: readonly string[] = []
): string {
  const ids = element.getAttribute(attribute)?.trim();
  if (!ids) {
    return '';
  }
  const following = followingReference;
  followingReference = true;
  try {
    return textOfReferences(element.ownerDocument, ids, withheld, skip);
  } finally {
    followingReference = following;
  }
}

/** The ids an id-list attribute names, in order. */
export function referencedIds(element: Element, attribute: string): string[] {
  return (element.getAttribute(attribute) ?? '').split(/\s+/).filter(id => id);
}

function textOfReferences(document: Document, ids: string, withheld: string, skip: readonly string[]): string {
  return (
    ids
      .split(/\s+/)
      .filter(id => !skip.includes(id))
      .map(id => document.getElementById(id))
      // A reference must not reach into a region the engine may not read, nor into an
      // element it would not describe — hidden, `aria-hidden`, inert, or not rendered at
      // all: page content can point an `aria-describedby` at anything with an id. (ARIA
      // would include such a target; for an agent consumer that is a way to smuggle in
      // text nobody sees. Text hidden only visually, clipped for screen readers, is still
      // read, as intended.)
      .filter(
        (referenced): referenced is HTMLElement =>
          !!referenced &&
          !referenced.closest(UNREADABLE_SELECTOR) &&
          !referenced.closest(CLR_CONTEXT_HIDDEN_SELECTOR) &&
          !(withheld && referenced.closest(withheld)) &&
          !isUnrendered(referenced)
      )
      .map(referenced => accessibleText(referenced, undefined, withheld).trim())
      .filter(text => text)
      .join(' ')
  );
}

/**
 * What is never read into a name, a label or a description: regions kept from agents,
 * and editing hosts, whose text is what the user typed — a value, withheld wherever
 * values are.
 */
const UNREADABLE_SELECTOR = `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}, ${CLR_CONTEXT_EDITING_HOST_SELECTOR}`;

/**
 * Whether an element cannot be seen: `hidden`, or `display: none`, `visibility: hidden`
 * or full transparency on it or an ancestor — the same judgement the walk makes of what
 * it describes. Text clipped for screen readers is visible in this sense, and still read.
 */
export function isUnrendered(element: Element): boolean {
  return !!element.closest('[hidden]') || !isVisible(element);
}
