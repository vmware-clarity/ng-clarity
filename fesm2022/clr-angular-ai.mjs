import * as i0 from '@angular/core';
import { Injectable, PLATFORM_ID, DOCUMENT, Inject, Optional, Input, Directive, NgModule } from '@angular/core';
import { Subject, ReplaySubject } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { CLR_ELEMENT_CONTEXT_PROPERTY } from '@clr/angular/utils';
export { CLR_ELEMENT_CONTEXT_PROPERTY, publishElementContext } from '@clr/angular/utils';
import * as i2 from '@angular/router';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Root registry of everything currently able to contribute context to a page snapshot.
 *
 * Providers register when they enter the page and unregister when they are destroyed,
 * so the registry only ever knows about UI that exists right now. Context itself is
 * never stored here — providers are polled at snapshot time — which prevents stale
 * information from accumulating.
 */
class ClrContextRegistryService {
    constructor() {
        this.providers = [];
        this.changesSubject = new Subject();
        this.changes = this.changesSubject.asObservable();
    }
    /**
     * Registers a context provider. Call the returned function (or `unregister`) when the
     * provider leaves the page, typically from `ngOnDestroy`.
     */
    register(provider) {
        if (!this.providers.includes(provider)) {
            this.providers.push(provider);
            this.changesSubject.next();
        }
        return () => this.unregister(provider);
    }
    unregister(provider) {
        const index = this.providers.indexOf(provider);
        if (index > -1) {
            this.providers.splice(index, 1);
            this.changesSubject.next();
        }
    }
    /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
    notifyChanged() {
        this.changesSubject.next();
    }
    /**
     * Polls all live providers for their current context. Providers that return `null`
     * or throw are skipped so a single faulty provider cannot break a snapshot.
     */
    collect() {
        const contexts = [];
        for (const provider of this.providers) {
            try {
                const context = provider.getClrContext();
                if (context) {
                    contexts.push(context);
                }
            }
            catch {
                // A provider that fails to describe itself should not break the whole snapshot.
            }
        }
        return contexts;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextRegistryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Mapping from HTML element to the ARIA role it carries implicitly, following HTML-AAM.
 *
 * This is the collector's one lookup table, and it is defined by the HTML and ARIA
 * specifications rather than by any component library — which is what lets one
 * implementation describe Clarity Angular components, `@clr/ui` CSS-only markup, other
 * component libraries and plain semantic HTML alike.
 *
 * Elements whose role depends on their attributes (`input`, `select`, `section`, `a`,
 * `img`) are resolved in {@link resolveRole} rather than listed here.
 */
const IMPLICIT_ROLES_BY_TAG = {
    article: 'article',
    aside: 'complementary',
    blockquote: 'blockquote',
    button: 'button',
    caption: 'caption',
    dd: 'definition',
    details: 'group',
    dialog: 'dialog',
    dl: 'list',
    dt: 'term',
    fieldset: 'group',
    figure: 'figure',
    form: 'form',
    h1: 'heading',
    h2: 'heading',
    h3: 'heading',
    h4: 'heading',
    h5: 'heading',
    h6: 'heading',
    hr: 'separator',
    li: 'listitem',
    main: 'main',
    menu: 'list',
    meter: 'meter',
    nav: 'navigation',
    ol: 'list',
    optgroup: 'group',
    option: 'option',
    output: 'status',
    progress: 'progressbar',
    search: 'search',
    section: 'region',
    summary: 'button',
    table: 'table',
    tbody: 'rowgroup',
    td: 'cell',
    textarea: 'textbox',
    tfoot: 'rowgroup',
    thead: 'rowgroup',
    tr: 'row',
    ul: 'list',
};
/**
 * Roles an `<input>` carries, by its `type`. Types absent here have no ARIA role.
 *
 * Two entries go beyond HTML-AAM, which gives password and file inputs no role at all. A
 * field with no role and no label would vanish from a snapshot, and an agent asked to
 * fill a login form must at least learn that a password field exists — its value is
 * withheld regardless (see `isRedacted`). A password field behaves as a textbox for the
 * user typing into it; a file input is exposed by browsers as the button that opens the
 * picker.
 */
const INPUT_ROLES_BY_TYPE = {
    button: 'button',
    checkbox: 'checkbox',
    email: 'textbox',
    file: 'button',
    image: 'button',
    number: 'spinbutton',
    password: 'textbox',
    radio: 'radio',
    range: 'slider',
    reset: 'button',
    search: 'searchbox',
    submit: 'button',
    tel: 'textbox',
    text: 'textbox',
    url: 'textbox',
};
/** `<input>` types that deliberately have no role: they expose no useful semantics. */
const ROLELESS_INPUT_TYPES = new Set(['hidden', 'color', 'image-map']);
/**
 * Sectioning ancestors that turn a `<header>` or `<footer>` into a plain container: only
 * a page-level one is the banner or contentinfo landmark, per HTML-AAM.
 */
const SECTIONING_SELECTOR = 'article, aside, main, nav, section';
/**
 * Roles that may take their accessible name from their own text, per ARIA's
 * "name from author and contents".
 *
 * A superset of {@link LEAF_ROLES}: a table cell or a list item names itself from its
 * text without being a single control, and a grid that is not summarised still needs its
 * rows walked. Keeping the two questions apart is what stops a container from absorbing
 * the whole page as its label while still letting a cell report what it says.
 */
const NAME_FROM_CONTENTS = new Set([
    'alert',
    'button',
    'caption',
    'cell',
    'checkbox',
    'columnheader',
    'definition',
    'gridcell',
    'heading',
    'link',
    'listitem',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'option',
    'radio',
    'row',
    'rowheader',
    'status',
    'switch',
    'tab',
    'term',
    'tooltip',
    'treeitem',
]);
/**
 * Roles describing a single control or a self-contained message, where descending would
 * only repeat what the label already says.
 */
const LEAF_ROLES = new Set([
    'alert',
    'button',
    'caption',
    'checkbox',
    'definition',
    'heading',
    'img',
    'link',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'meter',
    'option',
    'progressbar',
    'radio',
    'searchbox',
    'separator',
    'slider',
    'spinbutton',
    'status',
    'switch',
    'tab',
    'term',
    'textbox',
    'tooltip',
    'treeitem',
]);
/**
 * Leaf roles that describe a unit of content rather than a single interactive widget.
 * A heading's, an alert's or a status's accessible name subsumes all descendant text —
 * that is correct, unlike-role computation — but ordinary markup routinely nests a
 * genuinely separate, independently focusable control inside one anyway: a heading with
 * a button, an alert with a dismiss action, a status with an undo action. That control
 * keeps its own role and state regardless of its container's, so the walk must still
 * find it. A widget leaf (`button`, `link`, `checkbox`, ...) has no such exception:
 * nothing inside it has independent semantics, so it stays fully terminal.
 */
const CONTENT_LEAF_ROLES = new Set(['heading', 'status', 'alert', 'term', 'caption', 'definition', 'tooltip']);
/** The two spellings of "this element carries no semantics of its own". */
const PRESENTATIONAL_ROLES = new Set(['presentation', 'none']);
/**
 * The ARIA role an element carries, explicit or implicit, or `null` when it has none.
 *
 * An explicit `role` always wins. Because `role` accepts a fallback list, only the first
 * token is honored — the same way assistive technology resolves it.
 */
function resolveRole(element) {
    const explicit = element.getAttribute('role')?.trim().split(/\s+/)[0];
    if (explicit) {
        return explicit;
    }
    return implicitRole(element);
}
/** Whether a role describes a single control or message the walk should not descend into. */
function isLeafRole(role) {
    return LEAF_ROLES.has(role);
}
/** Whether a role may take its accessible name from its own text content. */
function isNameFromContents(role) {
    return NAME_FROM_CONTENTS.has(role);
}
/** Whether a leaf role may still contain a genuinely separate, independent control. */
function mayContainControls(role) {
    return CONTENT_LEAF_ROLES.has(role);
}
/** Whether a role means "ignore this element but keep looking at its children". */
function isPresentationalRole(role) {
    return PRESENTATIONAL_ROLES.has(role);
}
function implicitRole(element) {
    const tagName = element.tagName.toLowerCase();
    switch (tagName) {
        case 'input':
            return inputRole(element);
        case 'select':
            // A dropdown presents one value at a time; an expanded or multiple select is a list.
            return element.multiple || element.size > 1
                ? 'listbox'
                : 'combobox';
        case 'a':
        case 'area':
            // Only a navigable anchor is a link; without href it is a placeholder.
            return element.hasAttribute('href') ? 'link' : null;
        case 'img':
            // `alt=""` is the author declaring the image decorative.
            return element.getAttribute('alt') === '' ? 'presentation' : 'img';
        case 'section':
        case 'aside':
            // A generic landmark only earns its role once it is named, otherwise every
            // wrapper section would surface as an indistinguishable region.
            return tagName === 'aside' || hasNameAttribute(element) ? IMPLICIT_ROLES_BY_TAG[tagName] : null;
        case 'th': {
            // A header cell at the start of a row names that row, not a column.
            const scope = element.getAttribute('scope')?.toLowerCase();
            return scope === 'row' || scope === 'rowgroup' ? 'rowheader' : 'columnheader';
        }
        case 'header':
            return element.parentElement?.closest(SECTIONING_SELECTOR) ? null : 'banner';
        case 'footer':
            return element.parentElement?.closest(SECTIONING_SELECTOR) ? null : 'contentinfo';
        default:
            return IMPLICIT_ROLES_BY_TAG[tagName] ?? null;
    }
}
function inputRole(input) {
    const type = (input.getAttribute('type') || 'text').toLowerCase();
    if (ROLELESS_INPUT_TYPES.has(type)) {
        return null;
    }
    // Date and time inputs have no agreed ARIA role; treat anything unlisted as a textbox,
    // which is how they behave for a user typing into them.
    return INPUT_ROLES_BY_TYPE[type] ?? 'textbox';
}
/**
 * Whether an element carries a name directly. Deliberately narrower than full accessible
 * name computation, which depends on role resolution and would make this circular.
 */
function hasNameAttribute(element) {
    return (!!element.getAttribute('aria-label')?.trim() ||
        !!element.getAttribute('aria-labelledby')?.trim() ||
        !!element.getAttribute('title')?.trim());
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Normalizes whitespace and enforces a text budget, marking anything shortened with an
 * ellipsis so a reader can tell truncated text from a genuinely short value. The result
 * never exceeds `maxLength`, which is what keeps a snapshot's size predictable.
 */
function truncate(text, maxLength) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}
/** An element's text content, budgeted. */
function textOf(element, maxLength) {
    return truncate(element?.textContent || '', maxLength);
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
function isVisuallyHidden(element) {
    const view = element.ownerDocument.defaultView;
    if (!view) {
        return false;
    }
    return isClipped(element, view.getComputedStyle(element));
}
/**
 * Whether an element contributes nothing to a name: hidden from assistive technology,
 * not rendered at all, or rendered out of sight. The same rule the walk applies when it
 * decides what to describe, so a control that keeps both variants of its label in the
 * DOM and shows one at a time is named by the visible one only.
 */
function isExcludedFromName(element) {
    if (element.getAttribute('aria-hidden') === 'true' || element.hasAttribute('hidden')) {
        return true;
    }
    const view = element.ownerDocument.defaultView;
    if (!view) {
        return false;
    }
    const style = view.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') {
        return true;
    }
    return isClipped(element, style);
}
function isClipped(element, style) {
    if (style.clipPath && style.clipPath !== 'none') {
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
 * accessibility tree, and content hidden from sight, are both left out.
 *
 * `exclude` leaves one descendant out — the control a wrapping `<label>` names, whose
 * own options or content are not part of its name.
 */
function accessibleText(element, exclude) {
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
        const child = node;
        // Nothing to contribute, and checking style for an empty element would be a layout
        // read for no reason.
        if (!child.textContent?.trim()) {
            continue;
        }
        if (isExcludedFromName(child)) {
            continue;
        }
        text += accessibleText(child, exclude);
    }
    return text;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Elements whose name a `<label>` may supply. */
const LABELABLE = new Set(['button', 'input', 'meter', 'output', 'progress', 'select', 'textarea']);
/**
 * The element's accessible name, budgeted — a pragmatic subset of the ARIA accessible
 * name computation covering the sources that actually appear in application markup.
 *
 * Resolution order: `aria-labelledby`, `aria-label`, a native label source (an
 * associated or wrapping `<label>`, a `<legend>`, `<caption>`, `<figcaption>`, or `alt`),
 * `title`, a placeholder, and finally the element's own text — but only for roles that
 * may name themselves from their contents (see `isNameFromContents`).
 *
 * That last restriction is what keeps the result useful: without it a `region` or `form`
 * would take the whole page's prose as its label.
 */
function accessibleName(element, role, maxTextLength) {
    const referenced = labelledByText(element);
    if (referenced) {
        return truncate(referenced, maxTextLength);
    }
    const label = element.getAttribute('aria-label');
    if (label?.trim()) {
        return truncate(label, maxTextLength);
    }
    const native = nativeName(element);
    if (native?.trim()) {
        return truncate(native, maxTextLength);
    }
    const title = element.getAttribute('title');
    if (title?.trim()) {
        return truncate(title, maxTextLength);
    }
    // A placeholder is the last thing HTML-AAM lets a field be named by. Search boxes in
    // particular routinely have nothing else.
    const placeholder = element.getAttribute('aria-placeholder') || element.getAttribute('placeholder');
    if (placeholder?.trim()) {
        return truncate(placeholder, maxTextLength);
    }
    if (role && isNameFromContents(role)) {
        return truncate(accessibleText(element), maxTextLength);
    }
    return '';
}
/** The joined text of every element `aria-labelledby` points at. */
function labelledByText(element) {
    const ids = element.getAttribute('aria-labelledby')?.trim();
    if (!ids) {
        return '';
    }
    const document = element.ownerDocument;
    return ids
        .split(/\s+/)
        .map(id => document.getElementById(id))
        .map(referenced => (referenced ? accessibleText(referenced).trim() : ''))
        .filter(text => text)
        .join(' ');
}
/** The name HTML itself supplies for this element, or `null` when it supplies none. */
function nativeName(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'img' || tagName === 'area') {
        return element.getAttribute('alt');
    }
    if (tagName === 'fieldset') {
        return scopedText(element, 'legend');
    }
    if (tagName === 'table') {
        return scopedText(element, 'caption');
    }
    if (tagName === 'figure') {
        return scopedText(element, 'figcaption');
    }
    if (LABELABLE.has(tagName)) {
        return labelText(element);
    }
    return null;
}
/** Text of a direct child matching `selector`, the only place these names may come from. */
function scopedText(element, selector) {
    const child = element.querySelector(`:scope > ${selector}`);
    return child ? accessibleText(child) : null;
}
/**
 * The text of the `<label>` that names a form control, associated or wrapping.
 *
 * The browser already maintains the association as `labels`, so reading it is a
 * constant-time lookup rather than a document-wide query per field — which on a long
 * form is the difference between a linear and a quadratic scrape. A wrapping label's
 * name leaves the control itself out: a `<select>`'s options are not part of its name.
 */
function labelText(control) {
    const labels = control.labels;
    if (labels !== undefined) {
        const label = labels?.[0];
        return label ? accessibleText(label, control) : null;
    }
    if (control.id) {
        const associated = control.ownerDocument.querySelector(`label[for="${CSS.escape(control.id)}"]`);
        if (associated) {
            return accessibleText(associated, control);
        }
    }
    const wrapping = control.closest('label');
    return wrapping ? accessibleText(wrapping, control) : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * ARIA attributes that are only worth reporting when they are on, reported as a flag.
 * `aria-disabled="false"` says nothing an agent needs, so it is left out entirely.
 */
const FLAG_ATTRIBUTES = {
    'aria-disabled': 'disabled',
    'aria-readonly': 'readOnly',
    'aria-required': 'required',
    'aria-modal': 'modal',
    'aria-multiselectable': 'multiSelectable',
    'aria-busy': 'busy',
};
/**
 * ARIA attributes whose `false` state is as meaningful as their `true` state — a
 * collapsed panel and an unselected tab are both real information.
 */
const TRISTATE_ATTRIBUTES = {
    'aria-expanded': 'expanded',
    'aria-selected': 'selected',
    'aria-checked': 'checked',
    'aria-pressed': 'pressed',
};
/**
 * ARIA attributes carrying an enumerated value, with the value that means "nothing to
 * report" and is therefore omitted.
 */
const ENUM_ATTRIBUTES = [
    { attribute: 'aria-sort', key: 'sort', empty: 'none' },
    { attribute: 'aria-current', key: 'current', empty: 'false' },
    { attribute: 'aria-live', key: 'live', empty: 'off' },
    { attribute: 'aria-haspopup', key: 'hasPopup', empty: 'false' },
    { attribute: 'aria-invalid', key: 'invalid', empty: 'false' },
];
/**
 * Marks a control, or a region containing controls, whose value must never appear in a
 * snapshot. Use it for anything sensitive that the input type alone does not reveal — an
 * account number or an API token in a plain text field.
 *
 * The field itself is still described, so an agent knows it exists and that its value is
 * being withheld rather than being absent.
 */
const CLR_CONTEXT_REDACT_ATTRIBUTE = 'data-clr-context-redact';
/** Input types whose value is never reported, whatever the caller asked for. */
const REDACTED_INPUT_TYPES = new Set(['password', 'file']);
/**
 * `autocomplete` tokens that declare a field holds a credential or a payment
 * instrument. The author has already told the browser what this field is for; that is
 * reason enough not to put it in a snapshot.
 */
const REDACTED_AUTOCOMPLETE_TOKENS = new Set([
    'current-password',
    'new-password',
    'one-time-code',
    'cc-number',
    'cc-exp',
    'cc-exp-month',
    'cc-exp-year',
    'cc-csc',
    'cc-name',
]);
/**
 * Everything the accessibility tree and native HTML say about an element's current state,
 * as a flat, JSON-safe object.
 *
 * One declarative map applied to every element, rather than per-component knowledge:
 * `aria-expanded` means the same thing on a Clarity accordion, a `@clr/ui` CSS-only
 * dropdown and a plain `<details>`.
 *
 * A control's current value is part of what the page is showing, so it is reported like
 * any other state — except where it must never be: see {@link isRedacted}. Which
 * consumers are allowed to see values is decided at the boundary that serves them, not
 * here.
 *
 * `insideRedactedRegion` is what the walk already knows about the element's ancestry;
 * when it is omitted the ancestry is checked here.
 */
function ariaState(element, options, insideRedactedRegion) {
    const state = {};
    for (const [attribute, key] of Object.entries(TRISTATE_ATTRIBUTES)) {
        const raw = element.getAttribute(attribute);
        if (raw === 'true' || raw === 'false') {
            state[key] = raw === 'true';
        }
        else if (raw === 'mixed') {
            state[key] = 'mixed';
        }
    }
    for (const [attribute, key] of Object.entries(FLAG_ATTRIBUTES)) {
        if (element.getAttribute(attribute) === 'true') {
            state[key] = true;
        }
    }
    for (const { attribute, key, empty } of ENUM_ATTRIBUTES) {
        const raw = element.getAttribute(attribute)?.trim();
        if (raw && raw !== empty) {
            state[key] = key === 'invalid' ? true : raw;
        }
    }
    const level = numberAttribute(element, 'aria-level');
    if (level !== undefined) {
        state.level = level;
    }
    // Helper guidance and validation messages are wired to a control with
    // aria-describedby, which is where an agent should read them from too — otherwise they
    // surface as unattached nodes beside the field and it has to guess which one they
    // belong to.
    const description = describedByText(element, options);
    if (description) {
        state.description = description;
    }
    assignNativeState(element, state, options);
    assignValueState(element, state, options, insideRedactedRegion);
    return state;
}
/** State HTML itself expresses, which authors reach for far more often than ARIA. */
function assignNativeState(element, state, options) {
    const tagName = element.tagName.toLowerCase();
    if ((tagName === 'details' || tagName === 'dialog') && element.hasAttribute('open')) {
        state.open = true;
    }
    if ('disabled' in element && element.disabled) {
        state.disabled = true;
    }
    if ('required' in element && element.required) {
        state.required = true;
    }
    // Constraints bound what an agent may legitimately propose, so they are reported
    // whether or not values are.
    for (const attribute of ['min', 'max', 'step']) {
        const value = numberAttribute(element, attribute);
        if (value !== undefined) {
            state[attribute] = value;
        }
    }
    const pattern = element.getAttribute('pattern');
    if (pattern) {
        state.pattern = truncate(pattern, options.maxTextLength);
    }
    const maxLength = numberAttribute(element, 'maxlength');
    if (maxLength !== undefined) {
        state.maxLength = maxLength;
    }
    // Where a link goes is part of what it offers to do.
    const href = element.getAttribute('href');
    if (href) {
        state.href = truncate(href, options.maxTextLength);
    }
}
/** Input types whose `value` is a submission detail or a caption, never something typed. */
const VALUELESS_INPUT_TYPES = new Set(['button', 'submit', 'reset', 'image', 'checkbox', 'radio', 'hidden']);
/**
 * The element's current value, unless it is one that must never be reported.
 *
 * A native checked state is reported as `checked`, the same key `aria-checked` uses, so
 * a native and an ARIA checkbox read alike — and so that a consumer served without form
 * values still sees whether a box is ticked, which is UI state rather than something
 * typed.
 */
function assignValueState(element, state, options, insideRedactedRegion) {
    // Reported as withheld rather than left out, so an agent can tell a field it may not
    // see from one that happens to be empty — and does not go looking for it elsewhere.
    if (isRedacted(element, insideRedactedRegion)) {
        state.redacted = true;
        return;
    }
    // The value as it is shown to the user, when the author spelled it out: a slider
    // displaying "Large" rather than 3.
    const valueText = element.getAttribute('aria-valuetext')?.trim();
    if (valueText) {
        state.value = truncate(valueText, options.maxTextLength);
        return;
    }
    const ariaValue = numberAttribute(element, 'aria-valuenow');
    if (ariaValue !== undefined) {
        state.value = ariaValue;
        return;
    }
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'input') {
        const input = element;
        const type = (input.getAttribute('type') || 'text').toLowerCase();
        if (type === 'checkbox' || type === 'radio') {
            state.checked = type === 'checkbox' && input.indeterminate ? 'mixed' : input.checked;
            return;
        }
        if (!VALUELESS_INPUT_TYPES.has(type)) {
            state.value = truncate(input.value, options.maxTextLength);
        }
        return;
    }
    if (tagName === 'textarea') {
        state.value = truncate(element.value, options.maxTextLength);
        return;
    }
    if (tagName === 'select') {
        // What the user sees is the option's text; its `value` may be an internal key — an
        // Angular `[ngValue]` binding renders as "3: Object" — that means nothing to an agent.
        const chosen = Array.from(element.selectedOptions).map(option => truncate(option.label || option.text, options.maxTextLength));
        if (element.multiple) {
            state.value = chosen.slice(0, options.maxItemsPerCollection);
        }
        else if (chosen.length) {
            state.value = chosen[0];
        }
    }
}
/** The joined text of every element that describes this one. */
function describedByText(element, options) {
    const ids = element.getAttribute('aria-describedby')?.trim();
    if (!ids) {
        return '';
    }
    const document = element.ownerDocument;
    const described = ids
        .split(/\s+/)
        .map(id => document.getElementById(id))
        .map(target => (target ? accessibleText(target).trim() : ''))
        .filter(text => text)
        .join(' ');
    return truncate(described, options.maxTextLength);
}
/**
 * Whether this control's value must be withheld. Independent of what the caller asked
 * for: some values have no business being in a snapshot at all.
 *
 * `insideRedactedRegion` says whether an ancestor carries the redaction attribute, when
 * the caller already knows; the ancestry is only searched when it does not.
 */
function isRedacted(element, insideRedactedRegion) {
    if (insideRedactedRegion ?? !!element.closest(`[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`)) {
        return true;
    }
    const type = element.getAttribute('type')?.toLowerCase();
    if (type && REDACTED_INPUT_TYPES.has(type)) {
        return true;
    }
    const autocomplete = element.getAttribute('autocomplete')?.toLowerCase().trim();
    if (!autocomplete) {
        return false;
    }
    // `autocomplete` may be a space-separated list with section and address hints.
    return autocomplete.split(/\s+/).some(token => REDACTED_AUTOCOMPLETE_TOKENS.has(token));
}
function numberAttribute(element, attribute) {
    const raw = element.getAttribute(attribute);
    if (raw === null || raw.trim() === '') {
        return undefined;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : undefined;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Reads an element's published context, if any. A callback that throws is treated as
 * having nothing to say — one broken publisher must not break the snapshot.
 */
function readClrElementContext(element, options) {
    const callback = element[CLR_ELEMENT_CONTEXT_PROPERTY];
    if (typeof callback !== 'function') {
        return null;
    }
    try {
        const published = callback(options);
        return published && typeof published === 'object' ? published : null;
    }
    catch {
        return null;
    }
}
/**
 * Merges an element's published context over a DOM-extracted one. Published values win
 * — the component knows itself better than the markup does — and states are merged
 * key-wise. Arrays inside the published state are capped to the collection budget.
 */
function mergeElementContext(base, element, options) {
    const published = readClrElementContext(element, options);
    if (!published) {
        return base;
    }
    const merged = { ...base, ...published, state: { ...base.state, ...published.state } };
    for (const [key, value] of Object.entries(merged.state ?? {})) {
        if (Array.isArray(value)) {
            merged.state[key] = value.slice(0, options.maxItemsPerCollection);
        }
    }
    return merged;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Selectors matching a role explicitly or through the element's implicit role. */
const ROLE_SELECTORS = {
    columnheader: '[role="columnheader"], th:not([role]):not([scope="row"]):not([scope="rowgroup"])',
    row: '[role="row"], tr:not([role])',
    tab: '[role="tab"]',
    listitem: '[role="listitem"], li:not([role])',
    option: '[role="option"], option:not([role])',
    menuitem: '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]',
    radio: '[role="radio"], input[type="radio"]:not([role])',
};
const ROLE_SUMMARIZERS = {
    combobox: summarizeCombobox,
    grid: summarizeGrid,
    table: summarizeGrid,
    treegrid: summarizeGrid,
    tablist: summarizeTablist,
    list: summarizeList,
    listbox: summarizeOptions,
    menu: summarizeMenu,
    radiogroup: summarizeRadiogroup,
};
/**
 * The summary for this element's role, or `null` when there is nothing to summarise —
 * either because the role has no summarizer or because the summarizer found none of the
 * items it understands. In both cases the element should be walked instead: a `<div
 * role="list">` whose items are custom elements rather than list items still has
 * content, and a summary that says nothing must not make it disappear.
 */
function summarizeRole(element, role, options) {
    const summarizer = role ? ROLE_SUMMARIZERS[role] : undefined;
    if (!summarizer) {
        return null;
    }
    const state = summarizer(element, options);
    return Object.keys(state).length ? state : null;
}
function summarizeGrid(element, options) {
    const state = {};
    const columns = queryRole(element, 'columnheader')
        .slice(0, options.maxItemsPerCollection)
        .map(header => nameOf(header, options));
    if (columns.length) {
        state.columns = columns;
    }
    // A paginated or virtualised grid holds only the current page, so its own declared
    // count is the only honest total. `aria-rowcount="-1"` means "unknown", and an absent
    // attribute must not be read as zero, so both fall back to counting what is rendered.
    // The declared count is reported as declared: ARIA says it includes header rows, but
    // the producers that actually set it (Clarity's virtual scroll among them) declare the
    // data rows, which is also what the fallback counts.
    const declared = element.getAttribute('aria-rowcount');
    const total = declared === null ? Number.NaN : Number(declared);
    state.rowCount = Number.isFinite(total) && total >= 0 ? total : dataRows(element).length;
    const selected = element.querySelectorAll('[aria-selected="true"]').length;
    if (selected) {
        state.selectedRows = selected;
    }
    const sorted = element.querySelector('[aria-sort]:not([aria-sort="none"])');
    if (sorted) {
        state.sort = { column: nameOf(sorted, options), direction: sorted.getAttribute('aria-sort') };
    }
    return state;
}
function summarizeTablist(element, options) {
    const tabs = queryRole(element, 'tab');
    if (!tabs.length) {
        return {};
    }
    const state = {
        tabs: tabs.slice(0, options.maxItemsPerCollection).map(tab => nameOf(tab, options)),
    };
    // Looked for among all the tabs, not the reported few: the active one being past the
    // budget must not read as "nothing is selected".
    const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    if (active) {
        state.activeTab = nameOf(active, options);
    }
    return state;
}
/**
 * A list is summarised by its items' text but, unlike the other collections, is still
 * walked afterwards (see the walk): a navigation list's links are the point of it, and
 * the summary alone would lose where they go.
 */
function summarizeList(element, options) {
    const items = queryRole(element, 'listitem');
    if (!items.length) {
        return {};
    }
    return {
        itemCount: items.length,
        items: items.slice(0, options.maxItemsPerCollection).map(item => nameOf(item, options)),
    };
}
/**
 * A collapsed dropdown's choices, which are the whole point of it and are not otherwise
 * reachable: `combobox` is a leaf role, so nothing descends into a `<select>`'s options.
 *
 * The choices are authored markup describing what the UI permits, not anything a user
 * typed — the same reasoning that reports `min`, `max` and `pattern`. An agent needs
 * them to propose a legal value at all.
 *
 * Three shapes are covered: a native `<select>`, a combobox that owns a separate listbox
 * through `aria-owns`/`aria-controls`, and an input backed by a `<datalist>`.
 */
function summarizeCombobox(element, options) {
    const choices = comboboxChoices(element);
    if (!choices.length) {
        return {};
    }
    return { options: choices.slice(0, options.maxItemsPerCollection).map(choice => nameOf(choice, options)) };
}
function comboboxChoices(element) {
    const own = queryRole(element, 'option');
    if (own.length) {
        return own;
    }
    const document = element.ownerDocument;
    const listId = element.getAttribute('list');
    if (listId) {
        const datalist = document.getElementById(listId);
        if (datalist) {
            return Array.from(datalist.querySelectorAll('option'));
        }
    }
    const ownedIds = `${element.getAttribute('aria-owns') ?? ''} ${element.getAttribute('aria-controls') ?? ''}`.trim();
    for (const id of ownedIds.split(/\s+/).filter(Boolean)) {
        const owned = document.getElementById(id);
        const listed = owned ? queryRole(owned, 'option') : [];
        if (listed.length) {
            return listed;
        }
    }
    return [];
}
function summarizeOptions(element, options) {
    return summarizeChoices(queryRole(element, 'option'), isSelectedOption, options);
}
/**
 * A menu's commands. Menu items are not options — a different role, deliberately, in
 * ARIA — so they need looking for by name; a menu summarised through the option
 * selector would report nothing and hide every command it offers.
 */
function summarizeMenu(element, options) {
    return summarizeChoices(queryRole(element, 'menuitem'), item => item.getAttribute('aria-checked') === 'true', options);
}
function summarizeChoices(entries, isSelected, options) {
    if (!entries.length) {
        return {};
    }
    const state = {
        options: entries.slice(0, options.maxItemsPerCollection).map(entry => nameOf(entry, options)),
    };
    const selected = entries
        .filter(isSelected)
        .slice(0, options.maxItemsPerCollection)
        .map(entry => nameOf(entry, options));
    if (selected.length) {
        state.selected = selected;
    }
    // A choice that cannot currently be taken is still listed, since it tells an agent
    // what the UI can do, but proposing it would fail.
    const disabled = entries
        .filter(entry => entry.getAttribute('aria-disabled') === 'true' || entry.disabled === true)
        .slice(0, options.maxItemsPerCollection)
        .map(entry => nameOf(entry, options));
    if (disabled.length) {
        state.disabledOptions = disabled;
    }
    return state;
}
/**
 * Whether an option is selected. A native `<option>` carries its selection as a
 * property the browser maintains; the browser never sets `aria-selected` on it.
 */
function isSelectedOption(entry) {
    if (entry.tagName.toLowerCase() === 'option') {
        return entry.selected;
    }
    return entry.getAttribute('aria-selected') === 'true';
}
function summarizeRadiogroup(element, options) {
    const radios = queryRole(element, 'radio');
    if (!radios.length) {
        return {};
    }
    const state = {
        options: radios.slice(0, options.maxItemsPerCollection).map(radio => nameOf(radio, options)),
    };
    const chosen = radios.find(radio => radio.checked || radio.getAttribute('aria-checked') === 'true');
    if (chosen) {
        state.value = nameOf(chosen, options);
    }
    return state;
}
/**
 * The rows carrying data. A row made of column headers names the columns rather than
 * holding a record, and counting it would misreport the size of the data. A row header
 * (`<th scope="row">`) names its own row and does not make it a header row.
 */
function dataRows(element) {
    return queryRole(element, 'row').filter(row => !row.querySelector(ROLE_SELECTORS.columnheader));
}
function queryRole(element, role) {
    return Array.from(element.querySelectorAll(ROLE_SELECTORS[role]));
}
function nameOf(element, options) {
    return accessibleName(element, resolveRole(element), options.maxTextLength);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Elements carrying this attribute — and everything inside them — are invisible to the
 * engine: the collector never describes them and the context tracker ignores their
 * mutations. Put it on UI that consumes context (an AI chat panel, a debug view) so it
 * neither describes itself into the page context nor triggers tracking feedback loops.
 */
const CLR_CONTEXT_IGNORE_ATTRIBUTE = 'data-clr-context-ignore';
/** Elements that never carry meaning for an agent. */
const SKIPPED_TAGS = new Set(['script', 'style', 'template', 'link', 'meta', 'noscript', 'head']);
const IGNORE_SELECTOR$1 = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;
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
function collectContextTree(root, options, extractors = []) {
    return collectContextTreeWithin(root, options, extractors).components;
}
/** {@link collectContextTree}, also reporting whether the component budget ran out. */
function collectContextTreeWithin(root, options, extractors = []) {
    const walk = {
        options,
        extractors,
        describedByIds: new Set(),
        labelIds: new Set(),
        remaining: options.maxComponents,
        redactedDepth: 0,
        summarizedListDepth: 0,
        textDepth: 0,
    };
    collectReferencedIds(root, walk);
    const components = describeChildren(root, walk, null);
    // The budget ran out if the walk had to stop while there was still something to see.
    return { components, truncated: walk.remaining <= 0 && hasUndescribedContent(root, walk) };
}
/**
 * Whether the walk left anything behind. Only consulted once the budget is spent — a
 * page that fits exactly must not be reported as cut off — and answered by a second
 * pass with a budget one larger: if that pass describes more than the budget allowed,
 * something was left out. The probe is bounded the same way the walk is, so it costs at
 * most one more node's worth of work than the walk itself.
 */
function hasUndescribedContent(root, walk) {
    const probe = { ...walk, remaining: walk.options.maxComponents + 1 };
    const described = countNodes(describeChildren(root, probe, null));
    return described > walk.options.maxComponents;
}
function countNodes(nodes) {
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
function collectReferencedIds(root, walk) {
    const collect = (attribute, into) => {
        for (const element of Array.from(root.querySelectorAll(`[${attribute}]`))) {
            if (element.closest(IGNORE_SELECTOR$1)) {
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
function describeElement(element, walk, owner) {
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
    }
    finally {
        if (redacts) {
            walk.redactedDepth--;
        }
        if (describes) {
            walk.textDepth--;
        }
    }
}
function describeVisible(element, walk, owner) {
    const extractor = walk.extractors.find(candidate => element.matches(candidate.selector));
    if (extractor) {
        const described = extractor.extract(element, walk.options);
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
        return describeFrame(element, walk);
    }
    const role = resolveRole(element);
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
    const fallbackLabel = !role && !label && isCustomElement ? truncate(accessibleText(element), walk.options.maxTextLength) : label;
    const node = { type: role ?? (isCustomElement ? tagName : 'group') };
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
        const children = describeChildren(element, walk, null);
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
function isTextBlock(element, walk) {
    if (!walk.options.includeText || walk.textDepth > 0 || walk.redactedDepth > 0) {
        return false;
    }
    if (NAMING_TAGS.has(element.tagName.toLowerCase()) || (element.id && walk.labelIds.has(element.id))) {
        return false;
    }
    const hasOwnText = Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim());
    return hasOwnText && !isVisuallyHidden(element);
}
/**
 * A block of text, with whatever controls sit inside it — a link in a sentence — as its
 * children. Nested text is folded into this node's label rather than repeated.
 */
function describeTextBlock(element, walk, owner) {
    if (walk.remaining <= 0) {
        return [];
    }
    walk.remaining--;
    const node = { type: 'text' };
    if (owner) {
        node.element = owner.tagName.toLowerCase();
    }
    const label = truncate(accessibleText(element), walk.options.maxTextLength);
    if (label) {
        node.label = label;
    }
    walk.textDepth++;
    const children = describeChildren(element, walk, owner);
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
function describeFrame(frame, walk) {
    if (!walk.options.includeFrames || walk.remaining <= 0) {
        return [];
    }
    walk.remaining--;
    const node = { type: 'frame', element: frame.tagName.toLowerCase() };
    const state = {};
    const contents = frameDocument(frame);
    const label = accessibleName(frame, null, walk.options.maxTextLength) || (contents?.title ?? '');
    if (label) {
        node.label = truncate(label, walk.options.maxTextLength);
    }
    const location = contents ? contents.location.href : (frame.getAttribute('src') ?? '');
    if (location && !location.startsWith('about:')) {
        state.url = truncate(stripQueryAndFragment$1(location), walk.options.maxTextLength);
    }
    if (contents === null) {
        state.crossOrigin = true;
    }
    else if (!contents.body) {
        state.loading = true;
    }
    else {
        collectReferencedIds(contents, walk);
        const children = describeChildren(contents.body, walk, null);
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
function frameDocument(frame) {
    try {
        return frame.contentDocument;
    }
    catch {
        return null;
    }
}
/** Everything up to the first `?` or `#`. */
function stripQueryAndFragment$1(url) {
    return url.split(/[?#]/)[0];
}
function describeChildren(parent, walk, owner) {
    const nodes = [];
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
function finish(node, element, walk) {
    let described = mergeElementContext(node, element, walk.options);
    if (described.state?.['redacted'] === true || isRedacted(element, walk.redactedDepth > 0)) {
        const state = { ...described.state, redacted: true };
        delete state['value'];
        described = { ...described, state };
    }
    return pruneEmpty(described);
}
/** Whether an element and everything inside it is invisible to the engine. */
function shouldSkipSubtree(element, walk) {
    if (SKIPPED_TAGS.has(element.tagName.toLowerCase())) {
        return true;
    }
    if (element.hasAttribute(CLR_CONTEXT_IGNORE_ATTRIBUTE)) {
        return true;
    }
    if (element.getAttribute('aria-hidden') === 'true' ||
        element.hasAttribute('hidden') ||
        element.hasAttribute('inert')) {
        return true;
    }
    // Text that only describes another element is reported as that element's description.
    // But a described-by target that holds controls is content in its own right — a dialog
    // described by its own body — and folding it away would lose what a user can do there.
    if (element.id && walk.describedByIds.has(element.id) && !element.querySelector(CONTROL_SELECTOR)) {
        return true;
    }
    return !isVisible(element);
}
/**
 * Whether the element is rendered and can be seen, as assistive technology judges it:
 * `display: none`, `visibility: hidden`, `content-visibility: hidden` and full
 * transparency all hide it. `checkVisibility` without options only covers the first.
 */
function isVisible(element) {
    if (typeof element.checkVisibility === 'function') {
        return element.checkVisibility({ visibilityProperty: true, opacityProperty: true, contentVisibilityAuto: true });
    }
    return element.getClientRects().length > 0;
}
/** Removes empty labels, states and children so snapshots stay minimal. */
function pruneEmpty(context) {
    const pruned = { type: context.type };
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Default budgets applied while building a snapshot, tuned to keep snapshots compact
 * enough for an AI agent's context window.
 */
const CLR_CONTEXT_DEFAULT_OPTIONS = {
    maxTextLength: 100,
    maxItemsPerCollection: 25,
    maxComponents: 300,
    includeDomComponents: true,
    includeText: true,
    includeFrames: true,
};
const SWITCH_KEYS = ['includeDomComponents', 'includeText', 'includeFrames'];
/**
 * The range each budget is held to. The walk stops when a budget is exhausted, so a
 * budget that is not a finite number — `NaN`, `Infinity` — would never be exhausted and
 * the whole document would be walked and serialised; the upper bounds keep even a
 * trusted caller's typo from doing the same.
 */
const BUDGET_RANGES = {
    maxTextLength: { min: 1, max: 10_000 },
    maxItemsPerCollection: { min: 1, max: 1_000 },
    maxComponents: { min: 0, max: 10_000 },
};
const BUDGET_KEYS = Object.keys(BUDGET_RANGES);
/**
 * The budgets a snapshot is actually built with: the caller's options over the defaults,
 * with every budget a finite integer inside its range. Anything that is not a usable
 * number falls back to the default rather than to "unbounded".
 */
function resolveSnapshotOptions(options) {
    const resolved = { ...CLR_CONTEXT_DEFAULT_OPTIONS };
    if (!options) {
        return resolved;
    }
    for (const key of BUDGET_KEYS) {
        const value = options[key];
        if (typeof value === 'number' && Number.isFinite(value)) {
            resolved[key] = clamp(Math.floor(value), BUDGET_RANGES[key]);
        }
    }
    for (const key of SWITCH_KEYS) {
        const value = options[key];
        if (typeof value === 'boolean') {
            resolved[key] = value;
        }
    }
    return resolved;
}
/**
 * Budgets requested by one party, held to the ceiling set by another: whichever asked
 * for less wins. This is how a host caps what an embedded frame may ask for — a frame
 * can request a smaller snapshot than the host allows, never a larger one.
 */
function capSnapshotOptions(requested, ceiling) {
    const capped = { ...requested };
    if (!ceiling) {
        return capped;
    }
    for (const key of BUDGET_KEYS) {
        const limit = ceiling[key];
        if (typeof limit !== 'number' || !Number.isFinite(limit)) {
            continue;
        }
        const asked = capped[key];
        capped[key] = typeof asked === 'number' && Number.isFinite(asked) ? Math.min(asked, limit) : limit;
    }
    // A switch the ceiling turned off stays off: less is always allowed, more never.
    for (const key of SWITCH_KEYS) {
        if (ceiling[key] === false) {
            capped[key] = false;
        }
    }
    return capped;
}
function clamp(value, range) {
    return Math.min(range.max, Math.max(range.min, value));
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Describes everything currently rendered, as a tree, by reading the accessibility tree.
 *
 * Clarity components, `@clr/ui` CSS-only markup, other component libraries and plain
 * semantic HTML are all described by the same code: a role means the same thing wherever
 * it appears. Components contribute only what a role cannot express, by publishing
 * through `publishElementContext`.
 *
 * A button or link is reported wherever it actually is in the tree — inside the dialog,
 * the heading, the alert that owns it — never pulled out into a separate flattened list.
 * Nesting is the only representation of "this belongs to that": an agent looking for
 * what it can invoke inside a specific dialog walks that dialog's own `children`, the
 * same way it would read the rendered page.
 *
 * `customExtractors` cover the remainder — markup carrying neither a role nor an
 * accessible name, such as a bare `<div class="card">`.
 */
function collectClrDomContexts(root, options, customExtractors = []) {
    return collectClrDomContextTree(root, options, customExtractors).components;
}
/**
 * {@link collectClrDomContexts}, also reporting whether the component budget ran out
 * before the whole page was described.
 */
function collectClrDomContextTree(root, options, customExtractors = []) {
    return collectContextTreeWithin(root, resolveSnapshotOptions(options), customExtractors);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Snapshot budgets a caller the application does not control — an embedded frame, a
 * script calling the global accessor — is allowed to set.
 *
 * Budgets are all a caller may influence. What a snapshot is allowed to contain is not
 * negotiable from the outside — see {@link withoutFormValues}.
 */
const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS = [
    'maxTextLength',
    'maxItemsPerCollection',
    'maxComponents',
    'includeDomComponents',
    'includeText',
    'includeFrames',
];
/**
 * Reduces whatever an untrusted caller passed to the budgets it is allowed to set,
 * discarding everything else. Anything that is not a finite number or a boolean is
 * dropped, so a caller cannot smuggle a getter or an object through — nor a `NaN` or an
 * `Infinity`, which a budget check would never see as exhausted. The numbers that
 * survive are still held to their ranges when the snapshot is built.
 */
function sanitizeUntrustedSnapshotOptions(options) {
    if (!options || typeof options !== 'object') {
        return undefined;
    }
    const candidate = options;
    const sanitized = {};
    for (const key of CLR_CONTEXT_UNTRUSTED_OPTION_KEYS) {
        const value = candidate[key];
        if ((typeof value === 'number' && Number.isFinite(value)) || typeof value === 'boolean') {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
/**
 * The same context with everything the user typed taken out, for a consumer the
 * application does not control — an embedded frame, a script calling the global
 * accessor.
 *
 * Fields keep their label, type, constraints and validation state, so such a consumer
 * still learns the shape of a form; it just does not learn its contents.
 *
 * Regions are left as they are: those come from the application's own `clrContext`
 * annotations, so whatever is in them was put there deliberately.
 */
function withoutFormValues(context) {
    return { ...context, components: context.components.map(withoutValue) };
}
function withoutValue(component) {
    const reduced = { ...component };
    if (reduced.state && 'value' in reduced.state) {
        const state = { ...reduced.state };
        delete state.value;
        if (Object.keys(state).length) {
            reduced.state = state;
        }
        else {
            delete reduced.state;
        }
    }
    if (reduced.children?.length) {
        reduced.children = reduced.children.map(withoutValue);
    }
    return reduced;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Identifier of the cross-frame context protocol. The protocol is plain,
 * framework-agnostic JSON over `postMessage`, so UI running inside an iframe — a chat
 * widget, another UI library, anything — can request context from the hosting page
 * without depending on Angular or Clarity. Implementations in other languages or
 * frameworks only need to reproduce the two message shapes below.
 *
 * This is a discriminator, never a secret: it ships in the client bundle, so any script
 * can read it. Nothing here relies on it being unknown.
 */
const CLR_CONTEXT_PROTOCOL = 'ui-context/v1';
/** Longest request id a frame may send. Ids are only correlators, never payloads. */
const MAX_REQUEST_ID_LENGTH = 128;
/** Shortest gap between two snapshots served to the same frame. */
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 200;
/**
 * Most snapshots served to all frames together within one interval. The per-frame
 * throttle bounds each frame; this bounds their sum, so a document nesting many frames
 * cannot multiply its way past the per-frame floor.
 */
const MAX_REQUESTS_PER_INTERVAL = 10;
/**
 * Serves page context to embedded frames. The hosting page creates one of these around
 * its snapshot function; every embedded frame can then pull a fresh snapshot whenever it
 * needs one. Context is computed per request and never cached or broadcast, so an
 * embedded agent always sees the page as it currently is.
 *
 * A frame is trusted less than the application that embeds it: it does not receive what
 * the user has typed, nor the URL's query string, it cannot ask for a larger snapshot
 * than the host allows, and it cannot ask faster than
 * {@link ClrContextFrameHostOptions.minRequestIntervalMs}.
 */
class ClrContextFrameHost {
    constructor(getSnapshot, hostWindow, options = {}) {
        this.getSnapshot = getSnapshot;
        this.hostWindow = hostWindow;
        this.lastServedAt = new WeakMap();
        this.messageListener = this.onMessage.bind(this);
        this.intervalStartedAt = 0;
        this.servedInInterval = 0;
        this.listening = false;
        // A wildcard in the list is dropped rather than honoured, so a configuration copied
        // from somewhere permissive cannot quietly open the page up.
        this.allowedOrigins = (options.allowedOrigins || [hostWindow.location.origin]).filter(origin => origin !== '*');
        this.allowAnyOrigin = options.allowAnyOrigin === true;
        if (!this.allowAnyOrigin && !this.allowedOrigins.length) {
            throw new Error('ClrContextFrameHost: allowedOrigins names no origin to serve. List the embedding origins, or set allowAnyOrigin to serve every origin deliberately.');
        }
        this.shareFullUrl = options.shareFullUrl === true;
        this.shareFormValues = options.shareFormValues === true;
        this.snapshotCeiling = options.snapshot;
        const interval = options.minRequestIntervalMs;
        this.minRequestIntervalMs =
            typeof interval === 'number' && Number.isFinite(interval) && interval >= 0
                ? interval
                : DEFAULT_MIN_REQUEST_INTERVAL_MS;
    }
    start() {
        if (!this.listening) {
            this.hostWindow.addEventListener('message', this.messageListener);
            this.listening = true;
        }
    }
    stop() {
        if (this.listening) {
            this.hostWindow.removeEventListener('message', this.messageListener);
            this.listening = false;
        }
    }
    onMessage(event) {
        if (!isContextRequest(event.data)) {
            return;
        }
        if (!this.isServableOrigin(event.origin)) {
            return;
        }
        const source = event.source;
        if (!source) {
            return;
        }
        if (this.isThrottled(source)) {
            return;
        }
        // Nothing a frame sends may take the host's listener down with it: a snapshot that
        // fails to build, or a response the browser refuses to clone, is that one request's
        // problem. The frame times out; the host keeps serving.
        try {
            const requested = capSnapshotOptions(sanitizeUntrustedSnapshotOptions(event.data.options), this.snapshotCeiling);
            const response = {
                protocol: CLR_CONTEXT_PROTOCOL,
                kind: 'context-response',
                requestId: event.data.requestId,
                context: this.contextForFrame(requested),
            };
            // Addressed to the origin that asked. Never '*': between the request and the answer
            // a frame can navigate, and '*' would deliver the page context wherever it went.
            source.postMessage(response, { targetOrigin: event.origin });
        }
        catch {
            // Deliberately swallowed: see above.
        }
    }
    isServableOrigin(origin) {
        // An opaque origin — a sandboxed frame without `allow-same-origin`, a `data:`
        // document — reports itself as "null", which cannot be named as a postMessage
        // target. Answering one would mean posting to '*', so it is refused instead.
        if (!origin || origin === 'null') {
            return false;
        }
        return this.allowAnyOrigin || this.allowedOrigins.includes(origin);
    }
    isThrottled(source) {
        if (this.minRequestIntervalMs <= 0) {
            return false;
        }
        const now = Date.now();
        const previous = this.lastServedAt.get(source);
        if (previous !== undefined && now - previous < this.minRequestIntervalMs) {
            return true;
        }
        if (now - this.intervalStartedAt >= this.minRequestIntervalMs) {
            this.intervalStartedAt = now;
            this.servedInInterval = 0;
        }
        if (this.servedInInterval >= MAX_REQUESTS_PER_INTERVAL) {
            return true;
        }
        this.servedInInterval++;
        this.lastServedAt.set(source, now);
        return false;
    }
    /** The snapshot as a frame is allowed to see it, leaving the original untouched. */
    contextForFrame(options) {
        const context = this.getSnapshot(options);
        const shared = this.shareFormValues ? { ...context } : withoutFormValues(context);
        if (this.shareFullUrl) {
            return shared;
        }
        if (typeof shared.url === 'string') {
            shared.url = stripQueryAndFragment(shared.url);
        }
        if (shared.route) {
            const route = { ...shared.route };
            delete route.queryParams;
            if (typeof route.url === 'string') {
                route.url = stripQueryAndFragment(route.url);
            }
            shared.route = route;
        }
        return shared;
    }
}
/**
 * Requests the hosting page's context from inside an embedded frame. Resolves with
 * `null` when the host does not answer (e.g. it does not run a {@link ClrContextFrameHost},
 * this frame's origin is not allowed, or it asked again too soon), so embedded UI can
 * degrade gracefully.
 *
 * The answer is only accepted from the window that was asked, and from the origin the
 * request was addressed to. A browser sets `event.source` and a page cannot forge it,
 * which is what stops a sibling frame from answering in the host's place — sibling
 * frames can reach each other through `parent.frames`, so without this a fabricated page
 * context could be fed to whatever consumes it. The origin check covers the other way
 * round: the right window having navigated somewhere else in between.
 */
function requestClrContextFromHost(options = {}) {
    const targetWindow = options.targetWindow || window.parent;
    if (!targetWindow || targetWindow === window) {
        return Promise.resolve(null);
    }
    const targetOrigin = options.targetOrigin || options.hostOrigin || embedderOrigin() || ownOrigin();
    const expectedOrigin = options.hostOrigin || (targetOrigin !== '*' ? targetOrigin : undefined);
    const requestId = newRequestId();
    const request = {
        protocol: CLR_CONTEXT_PROTOCOL,
        kind: 'context-request',
        requestId,
        options: options.options,
    };
    return new Promise(resolve => {
        const cleanup = () => {
            window.removeEventListener('message', responseListener);
            clearTimeout(timeout);
        };
        const responseListener = (event) => {
            if (event.source !== targetWindow) {
                return;
            }
            if (expectedOrigin && event.origin !== expectedOrigin) {
                return;
            }
            if (!isContextResponse(event.data, requestId)) {
                return;
            }
            cleanup();
            resolve(event.data.context);
        };
        const timeout = setTimeout(() => {
            cleanup();
            resolve(null);
        }, options.timeoutMs ?? 2000);
        window.addEventListener('message', responseListener);
        targetWindow.postMessage(request, { targetOrigin });
    });
}
/** Whether an inbound message is a context request this host should answer. */
function isContextRequest(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value;
    return (candidate.protocol === CLR_CONTEXT_PROTOCOL &&
        candidate.kind === 'context-request' &&
        typeof candidate.requestId === 'string' &&
        candidate.requestId.length > 0 &&
        candidate.requestId.length <= MAX_REQUEST_ID_LENGTH);
}
/** Whether an inbound message is the answer to this particular request. */
function isContextResponse(value, requestId) {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const candidate = value;
    return (candidate.protocol === CLR_CONTEXT_PROTOCOL &&
        candidate.kind === 'context-response' &&
        candidate.requestId === requestId &&
        !!candidate.context &&
        typeof candidate.context === 'object');
}
/**
 * An unguessable correlator. The previous scheme — a counter plus a millisecond
 * timestamp — could be guessed in a few thousand attempts, which is all a frame needs to
 * answer a request it cannot see.
 */
function newRequestId() {
    const webCrypto = globalThis.crypto;
    if (webCrypto && typeof webCrypto.randomUUID === 'function') {
        return webCrypto.randomUUID();
    }
    const bytes = new Uint8Array(16);
    if (webCrypto && typeof webCrypto.getRandomValues === 'function') {
        webCrypto.getRandomValues(bytes);
    }
    else {
        for (let index = 0; index < bytes.length; index++) {
            bytes[index] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}
/**
 * The origin of the document that embedded this one, when the browser disclosed it. An
 * embedded document's referrer is its embedder; the default referrer policy discloses at
 * least the origin across sites, which is exactly what addressing the host needs. Empty
 * when the embedder withheld it or the document was not embedded.
 */
function embedderOrigin() {
    const referrer = document.referrer;
    if (!referrer) {
        return '';
    }
    try {
        const origin = new URL(referrer).origin;
        return origin && origin !== 'null' ? origin : '';
    }
    catch {
        return '';
    }
}
/**
 * This document's origin, used to address the request. A sandboxed or `data:` document
 * has no origin to name; the request carries only budgets, so a wildcard is acceptable
 * there and is the only thing a browser will deliver.
 */
function ownOrigin() {
    const origin = window.location.origin;
    return origin && origin !== 'null' ? origin : '*';
}
/** Everything up to the first `?` or `#`, for both absolute and relative URLs. */
function stripQueryAndFragment(url) {
    return url.split(/[?#]/)[0];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_GLOBAL_PROPERTY = 'clrContext';
/**
 * What a global accessor may be called: a plain identifier. Anything else — a name with
 * a dot, an empty string, the name of something `window` already has — would either
 * fail to be reachable as `window.<name>()` or overwrite something the page relies on.
 */
const GLOBAL_PROPERTY_PATTERN = /^[A-Za-z_$][\w$]*$/;
/**
 * Builds on-demand snapshots of everything useful an AI agent can know about the current
 * page: the active route, and the components rendered right now with their state, as a
 * tree in which every control sits where it is on the page — plus whatever semantic
 * context the application registered.
 *
 * Snapshots are always computed at call time from the live application — nothing is
 * cached — so they can never contain obsolete information about UI that no longer exists.
 *
 * The engine only ever reads. It describes the page and never changes it.
 *
 * The engine can also serve snapshots across an iframe boundary (see
 * {@link enableFrameBridge} and {@link requestHostContext}), so embedded UI such as a
 * chat surface built with a different UI library can receive the hosting page's context.
 */
class ClrContextualEngineService {
    constructor(platformId, document, contextRegistry, router) {
        this.platformId = platformId;
        this.document = document;
        this.contextRegistry = contextRegistry;
        this.router = router;
        this.customExtractors = [];
        this.frameHost = null;
        this.globalProperty = null;
    }
    ngOnDestroy() {
        this.disableFrameBridge();
        this.disableGlobalAccess();
    }
    /**
     * Takes a fresh snapshot of the page context.
     */
    getSnapshot(options) {
        const snapshot = {
            title: this.document.title,
            url: this.currentUrl(),
            regions: this.contextRegistry.collect(),
            components: [],
            collectedAt: new Date().toISOString(),
        };
        const route = this.routeContext();
        if (route) {
            snapshot.route = route;
        }
        if (isPlatformBrowser(this.platformId) && options?.includeDomComponents !== false) {
            const tree = collectClrDomContextTree(this.document, options, this.customExtractors);
            snapshot.components = tree.components;
            if (tree.truncated) {
                snapshot.truncated = true;
            }
        }
        return snapshot;
    }
    /**
     * Registers an additional DOM extractor, letting other UI libraries on the page teach
     * the engine about their own components. Returns a function that removes it again.
     */
    registerDomExtractor(extractor) {
        if (!this.customExtractors.includes(extractor)) {
            this.customExtractors.push(extractor);
        }
        return () => {
            const index = this.customExtractors.indexOf(extractor);
            if (index > -1) {
                this.customExtractors.splice(index, 1);
            }
        };
    }
    /**
     * Exposes the engine on `window` (as `window.clrContext()` by default) so AI agents
     * driving the browser can query the page context without an application API.
     *
     * Anything running on the page can call this, including a third-party script, so the
     * caller is treated as untrusted: its options are reduced to budgets, the
     * application's own budgets are applied over the top, and what the user has typed is
     * withheld unless {@link ClrContextGlobalAccessOptions.shareFormValues} says otherwise.
     */
    enableGlobalAccess(propertyName = DEFAULT_GLOBAL_PROPERTY, hostOptions = {}) {
        if (!GLOBAL_PROPERTY_PATTERN.test(propertyName)) {
            throw new Error(`ClrContextualEngineService: "${propertyName}" is not a valid name for a global accessor.`);
        }
        const window = this.browserWindow();
        if (!window) {
            return;
        }
        const { shareFormValues, ...budgets } = hostOptions;
        this.disableGlobalAccess();
        const host = window;
        if (propertyName in host) {
            throw new Error(`ClrContextualEngineService: window.${propertyName} already exists and will not be replaced.`);
        }
        this.globalProperty = propertyName;
        host[propertyName] = (options) => {
            // The caller may ask for less than the application allows, never for more.
            const snapshot = this.getSnapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), budgets));
            return shareFormValues ? snapshot : withoutFormValues(snapshot);
        };
    }
    disableGlobalAccess() {
        const window = this.browserWindow();
        if (window && this.globalProperty) {
            delete window[this.globalProperty];
        }
        this.globalProperty = null;
    }
    /**
     * Starts answering context requests from embedded frames, so UI hosted in an iframe
     * (a chat surface, an embedded tool) can pull this page's context through
     * `postMessage`. Each request is answered with a freshly computed snapshot.
     *
     * By default only frames from the page's own origin are served; pass
     * `allowedOrigins` to serve trusted cross-origin frames.
     */
    enableFrameBridge(options) {
        const window = this.browserWindow();
        if (!window) {
            return;
        }
        this.disableFrameBridge();
        this.frameHost = new ClrContextFrameHost(snapshotOptions => this.getSnapshot(snapshotOptions), window, options);
        this.frameHost.start();
    }
    disableFrameBridge() {
        this.frameHost?.stop();
        this.frameHost = null;
    }
    /**
     * Requests the context of the page hosting this application, for applications that
     * themselves run inside an iframe. Resolves with `null` when there is no hosting
     * page or it does not serve context.
     */
    requestHostContext(options) {
        if (!this.browserWindow()) {
            return Promise.resolve(null);
        }
        return requestClrContextFromHost(options);
    }
    browserWindow() {
        return isPlatformBrowser(this.platformId) ? this.document.defaultView : null;
    }
    currentUrl() {
        if (isPlatformBrowser(this.platformId) && this.document.location) {
            return this.document.location.href;
        }
        return this.router?.url;
    }
    routeContext() {
        // The router is root-provided even in applications that never configure routing;
        // an unconfigured router would only contribute a misleading `/` route.
        if (!this.router || this.router.config.length === 0) {
            return undefined;
        }
        const pathSegments = [];
        const params = {};
        const data = {};
        let route = this.router.routerState.snapshot.root;
        while (route) {
            if (route.routeConfig?.path) {
                pathSegments.push(route.routeConfig.path);
            }
            Object.assign(params, route.params);
            for (const [key, value] of Object.entries(route.data)) {
                const serializable = jsonSafe(value, 2);
                if (serializable !== undefined) {
                    data[key] = serializable;
                }
            }
            route = route.firstChild;
        }
        const context = { url: this.router.url, path: pathSegments.join('/') };
        if (Object.keys(params).length) {
            context.params = params;
        }
        const queryParams = this.router.routerState.snapshot.root.queryParams;
        if (Object.keys(queryParams).length) {
            context.queryParams = { ...queryParams };
        }
        if (Object.keys(data).length) {
            context.data = data;
        }
        return context;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualEngineService, deps: [{ token: PLATFORM_ID }, { token: DOCUMENT }, { token: ClrContextRegistryService }, { token: i2.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualEngineService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualEngineService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: ClrContextRegistryService }, { type: i2.Router, decorators: [{
                    type: Optional
                }] }] });
/**
 * Reduces a route `data` value to its JSON-serializable subset, dropping functions,
 * class instances and anything nested too deeply. Route data commonly mixes plain
 * configuration (useful to an agent) with resolvers and component references (useless
 * and potentially huge), and only the former belongs in a snapshot.
 */
function jsonSafe(value, depth) {
    if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    if (depth <= 0) {
        return undefined;
    }
    if (Array.isArray(value)) {
        const items = value.map(item => jsonSafe(item, depth - 1)).filter(item => item !== undefined);
        return items.length ? items : undefined;
    }
    if (typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
        const result = {};
        for (const [key, entry] of Object.entries(value)) {
            const serializable = jsonSafe(entry, depth - 1);
            if (serializable !== undefined) {
                result[key] = serializable;
            }
        }
        return Object.keys(result).length ? result : undefined;
    }
    return undefined;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WAIT_MS = 2000;
const IGNORE_SELECTOR = `[${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;
/**
 * Maintains the current page context as a stream by watching the DOM itself: a
 * `MutationObserver` sees every change — route navigations, data arriving into a
 * datagrid, a modal opening, rows being selected — and the page is re-scraped after a
 * short quiet window, then emitted only if the context actually changed. Consumers
 * such as an AI chat panel subscribe to {@link context$} and always hold context
 * describing what the user currently sees, without polling and without any coupling to
 * the router or the rendering framework.
 *
 * Mutations inside elements marked with {@link CLR_CONTEXT_IGNORE_ATTRIBUTE} are
 * ignored (and the collector never describes those elements), so UI that renders the
 * context — the chat panel itself — neither triggers feedback loops nor describes
 * itself into the page context.
 *
 * `input` and `change` are watched as well as mutations, because typing changes a
 * property rather than an attribute and is invisible to a `MutationObserver`. So are
 * the application's own `clrContext` annotations, whose state lives outside the DOM.
 *
 * Same-origin frames are watched too — an observer on the page's own document never
 * sees inside them — so a page assembled from embedded plugins is tracked as one page,
 * the same way the engine describes it. Frames are discovered after every scrape, and
 * re-attached when they navigate.
 *
 * Every emission is a freshly computed snapshot of the live DOM at that moment — the
 * tracker stores only the latest emission and never merges or accumulates, so context
 * from a page that was navigated away from can never leak into the current one.
 */
class ClrContextTrackerService {
    constructor(platformId, document, contextEngine, contextRegistry, zone) {
        this.platformId = platformId;
        this.document = document;
        this.contextEngine = contextEngine;
        this.contextRegistry = contextRegistry;
        this.zone = zone;
        this.contextSubject = new ReplaySubject(1);
        this.trackingOptions = {};
        this.tracking = false;
        this.observer = null;
        this.quietTimer = null;
        this.maxWaitTimer = null;
        this.valueListener = null;
        this.frames = new Map();
        this.registrySubscription = null;
        this.latest = null;
        this.context$ = this.contextSubject.asObservable();
    }
    /** The most recent snapshot the tracker has taken, or `null` before tracking starts. */
    get currentContext() {
        return this.latest;
    }
    ngOnDestroy() {
        this.stop();
        // Nothing outlives the injector that owned this service; the snapshot it was
        // holding — a description of the whole page — should not either.
        this.latest = null;
        this.contextSubject.complete();
    }
    /**
     * Starts tracking: takes an initial snapshot immediately, then re-scrapes whenever
     * the DOM changes. Calling it again restarts with the new options.
     */
    start(options = {}) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.stop();
        this.tracking = true;
        this.trackingOptions = options;
        this.refresh();
        // Created outside the Angular zone: zone.js patches MutationObserver, and an
        // in-zone observer would trigger change detection on every mutation batch.
        this.zone.runOutsideAngular(() => {
            this.observer = this.observeDocument(this.document);
            this.observeFrames();
            // Typing changes an input's `value` property, never its attribute, so a
            // MutationObserver never sees it. Without these listeners a subscriber would hold
            // whatever the values were at the last unrelated DOM change.
            this.valueListener = event => this.onValueChange(event);
            this.document.body.addEventListener('input', this.valueListener, true);
            this.document.body.addEventListener('change', this.valueListener, true);
            // An annotation's state is application data, changed without any DOM change.
            this.registrySubscription = this.contextRegistry.changes.subscribe(() => this.scheduleScrape());
        });
    }
    /** Stops tracking. The last emitted context stays available to subscribers. */
    stop() {
        this.tracking = false;
        this.observer?.disconnect();
        this.observer = null;
        if (this.valueListener) {
            this.document.body.removeEventListener('input', this.valueListener, true);
            this.document.body.removeEventListener('change', this.valueListener, true);
            this.valueListener = null;
        }
        for (const [frame, tracked] of this.frames) {
            this.detachFrame(frame, tracked);
        }
        this.frames.clear();
        this.registrySubscription?.unsubscribe();
        this.registrySubscription = null;
        this.clearTimers();
    }
    /** Takes a fresh snapshot immediately and emits it. */
    refresh() {
        this.latest = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
        this.contextSubject.next(this.latest);
    }
    onMutations(records) {
        if (records.every(record => isInsideIgnoredRegion(record.target))) {
            return;
        }
        this.scheduleScrape();
    }
    onValueChange(event) {
        const target = event.target;
        if (target && isInsideIgnoredRegion(target)) {
            return;
        }
        this.scheduleScrape();
    }
    /**
     * Queues a scrape for after the page goes quiet. Mutations and value changes share one
     * window, so a burst of typing still results in a single scrape.
     */
    scheduleScrape() {
        if (!this.tracking) {
            return;
        }
        if (this.quietTimer !== null) {
            clearTimeout(this.quietTimer);
        }
        this.quietTimer = setTimeout(() => this.scrape(), this.trackingOptions.debounceMs ?? DEFAULT_DEBOUNCE_MS);
        if (this.maxWaitTimer === null) {
            this.maxWaitTimer = setTimeout(() => this.scrape(), this.trackingOptions.maxWaitMs ?? DEFAULT_MAX_WAIT_MS);
        }
    }
    /** Scrapes the page and emits only if the context actually changed. */
    scrape() {
        this.clearTimers();
        if (!this.tracking) {
            return;
        }
        // Re-enter the zone for the emission so subscribers' views update normally.
        this.zone.run(() => {
            const snapshot = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
            if (!contextEquals(snapshot, this.latest)) {
                this.latest = snapshot;
                this.contextSubject.next(snapshot);
            }
        });
        // A frame that arrived with this change is watched from now on.
        this.zone.runOutsideAngular(() => this.observeFrames());
    }
    observeDocument(target) {
        const observer = new MutationObserver(records => this.onMutations(records));
        observer.observe(target.body, { childList: true, subtree: true, attributes: true, characterData: true });
        return observer;
    }
    /**
     * Watches every same-origin frame currently on the page, including frames inside
     * frames, and drops the ones that have gone. A frame whose document is not readable
     * yet — still loading, or cross-origin — is watched for its `load` event instead, so
     * it is picked up once it is, and again whenever it navigates.
     */
    observeFrames() {
        if (!this.tracking) {
            return;
        }
        const present = new Set();
        for (const frame of allFrames(this.document)) {
            present.add(frame);
            const contents = readableDocument(frame);
            const tracked = this.frames.get(frame);
            if (tracked && tracked.document === contents) {
                continue;
            }
            if (tracked) {
                this.detachFrame(frame, tracked);
            }
            const onLoad = () => {
                this.observeFrames();
                this.scheduleScrape();
            };
            frame.addEventListener('load', onLoad);
            if (!contents) {
                this.frames.set(frame, { document: null, observer: null, valueListener: null, loadListener: onLoad });
                continue;
            }
            const valueListener = (event) => this.onValueChange(event);
            contents.body.addEventListener('input', valueListener, true);
            contents.body.addEventListener('change', valueListener, true);
            this.frames.set(frame, {
                document: contents,
                observer: this.observeDocument(contents),
                valueListener,
                loadListener: onLoad,
            });
        }
        for (const [frame, tracked] of this.frames) {
            if (!present.has(frame)) {
                this.detachFrame(frame, tracked);
                this.frames.delete(frame);
            }
        }
    }
    detachFrame(frame, tracked) {
        frame.removeEventListener('load', tracked.loadListener);
        tracked.observer?.disconnect();
        if (tracked.document && tracked.valueListener) {
            tracked.document.body?.removeEventListener('input', tracked.valueListener, true);
            tracked.document.body?.removeEventListener('change', tracked.valueListener, true);
        }
    }
    clearTimers() {
        if (this.quietTimer !== null) {
            clearTimeout(this.quietTimer);
            this.quietTimer = null;
        }
        if (this.maxWaitTimer !== null) {
            clearTimeout(this.maxWaitTimer);
            this.maxWaitTimer = null;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextTrackerService, deps: [{ token: PLATFORM_ID }, { token: DOCUMENT }, { token: ClrContextualEngineService }, { token: ClrContextRegistryService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextTrackerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextTrackerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: ClrContextualEngineService }, { type: ClrContextRegistryService }, { type: i0.NgZone }] });
/** Every frame under a document, and under every readable frame inside it. */
function allFrames(root) {
    const frames = [];
    for (const frame of Array.from(root.querySelectorAll('iframe'))) {
        frames.push(frame);
        const contents = readableDocument(frame);
        if (contents) {
            frames.push(...allFrames(contents));
        }
    }
    return frames;
}
/** A frame's document when it is same-origin and has finished parsing, `null` otherwise. */
function readableDocument(frame) {
    try {
        const contents = frame.contentDocument;
        return contents?.body ? contents : null;
    }
    catch {
        return null;
    }
}
/** Whether a mutated node lives inside a region the engine is told not to look at. */
function isInsideIgnoredRegion(node) {
    // By node type rather than `instanceof Element`: a node inside a frame's document is
    // an instance of that window's Element, not this one's.
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    return !!element?.closest(IGNORE_SELECTOR);
}
/**
 * Compares two snapshots for meaningful equality, ignoring the capture timestamp. A
 * snapshot that cannot be serialised — a provider handed over something circular —
 * counts as changed, so it is at least emitted rather than silently dropped.
 */
function contextEquals(a, b) {
    if (!b) {
        return false;
    }
    try {
        return JSON.stringify({ ...a, collectedAt: undefined }) === JSON.stringify({ ...b, collectedAt: undefined });
    }
    catch {
        return false;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Annotates a piece of UI with semantic context for AI agents — the knowledge only the
 * application has, such as what a section is for:
 *
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 *
 * The annotation is part of snapshots only while this element exists: it registers when
 * the directive initializes and unregisters when it is destroyed, and its inputs are
 * read at snapshot time, so snapshots never contain outdated annotations.
 *
 * Changes to the annotation are also announced to whatever keeps a snapshot current —
 * whether the state object was replaced or edited in place — because they alter no DOM
 * and would otherwise go unnoticed until something else on the page changed.
 */
class ClrContext {
    constructor(contextRegistry) {
        this.contextRegistry = contextRegistry;
        /** Human-readable description of what this piece of UI is about. */
        this.label = '';
        /** Kind of UI this annotation describes. Defaults to `'region'`. */
        this.type = 'region';
        /** Current application state an agent should know about, as a small serializable object. */
        this.state = null;
        this.lastReported = '';
    }
    ngOnInit() {
        this.lastReported = this.serialized();
        this.contextRegistry.register(this);
    }
    ngDoCheck() {
        const current = this.serialized();
        if (current !== this.lastReported) {
            this.lastReported = current;
            this.contextRegistry.notifyChanged();
        }
    }
    ngOnDestroy() {
        this.contextRegistry.unregister(this);
    }
    getClrContext() {
        if (!this.label && !this.state) {
            return null;
        }
        const context = { type: this.type };
        if (this.label) {
            context.label = this.label;
        }
        if (this.state && Object.keys(this.state).length) {
            context.state = this.state;
        }
        return context;
    }
    /** The annotation as it would appear in a snapshot; what "changed" is measured against. */
    serialized() {
        try {
            return JSON.stringify(this.getClrContext());
        }
        catch {
            // A state that cannot be serialised cannot appear in a snapshot either.
            return '';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContext, deps: [{ token: ClrContextRegistryService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.1.3", type: ClrContext, isStandalone: false, selector: "[clrContext]", inputs: { label: ["clrContext", "label"], type: ["clrContextType", "type"], state: ["clrContextState", "state"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContext, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrContext]',
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: ClrContextRegistryService }], propDecorators: { label: [{
                type: Input,
                args: ['clrContext']
            }], type: [{
                type: Input,
                args: ['clrContextType']
            }], state: [{
                type: Input,
                args: ['clrContextState']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_CONTEXTUAL_DIRECTIVES = [ClrContext];
class ClrContextualModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualModule, declarations: [ClrContext], imports: [CommonModule], exports: [ClrContext] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrContextualModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [CLR_CONTEXTUAL_DIRECTIVES],
                    exports: [CLR_CONTEXTUAL_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_CONTEXTUAL_DIRECTIVES, CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_PROTOCOL, CLR_CONTEXT_REDACT_ATTRIBUTE, ClrContext, ClrContextFrameHost, ClrContextRegistryService, ClrContextTrackerService, ClrContextualEngineService, ClrContextualModule, collectClrDomContextTree, collectClrDomContexts, mergeElementContext, readClrElementContext, requestClrContextFromHost };
//# sourceMappingURL=clr-angular-ai.mjs.map
