import * as i0 from '@angular/core';
import { isDevMode, InjectionToken, makeEnvironmentProviders, Injectable, inject, DOCUMENT, getDebugNode, ChangeDetectorRef, ApplicationRef, PLATFORM_ID, NgZone, ErrorHandler, ElementRef, Input, Directive, NgModule } from '@angular/core';
import { CLR_CONTEXT_DEFAULT_MAX_ITEMS, CLR_CONTEXT_IGNORE_SELECTOR, CLR_CONTEXT_REDACT_SELECTOR, CLR_CONTEXT_EDITING_HOST_SELECTOR, CLR_CONTEXT_HIDDEN_SELECTOR, CLR_ELEMENT_CONTEXT_PROPERTY, CLR_ELEMENT_MUTATOR_PROPERTY, usableSelectors, CLR_CONTEXT_REDACT_ATTRIBUTE, normalizeContextText, CLR_CONTEXT_WITHHELD_SELECTOR, CLR_CONTEXT_IGNORE_ATTRIBUTE } from '@clr/angular/utils';
export { CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_REDACT_ATTRIBUTE, CLR_ELEMENT_CONTEXT_PROPERTY, CLR_ELEMENT_MUTATOR_PROPERTY, publishElementContext, publishElementMutator } from '@clr/angular/utils';
import { Subject, ReplaySubject, defer, EMPTY, Observable, filter } from 'rxjs';
import { getAriaReferenceIds } from '@angular/cdk/a11y';
import { LocationStrategy, isPlatformBrowser, HashLocationStrategy } from '@angular/common';
import { Router, NavigationEnd, UrlSegmentGroup, UrlSegment, UrlTree, NavigationStart, NavigationSkipped, NavigationCancel, NavigationCancellationCode, NavigationSkippedCode, NavigationError } from '@angular/router';
import { NgControl } from '@angular/forms';

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
/** The concrete roles of WAI-ARIA 1.2 and 1.3; `doc-` and `graphics-` roles are recognised by prefix. */
const ARIA_ROLES = new Set([
    'alert',
    'alertdialog',
    'application',
    'article',
    'banner',
    'blockquote',
    'button',
    'caption',
    'cell',
    'checkbox',
    'code',
    'columnheader',
    'combobox',
    'comment',
    'complementary',
    'contentinfo',
    'definition',
    'deletion',
    'dialog',
    'directory',
    'document',
    'emphasis',
    'feed',
    'figure',
    'form',
    'generic',
    'grid',
    'gridcell',
    'group',
    'heading',
    'image',
    'img',
    'insertion',
    'link',
    'list',
    'listbox',
    'listitem',
    'log',
    'main',
    'mark',
    'marquee',
    'math',
    'menu',
    'menubar',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'meter',
    'navigation',
    'none',
    'note',
    'option',
    'paragraph',
    'presentation',
    'progressbar',
    'radio',
    'radiogroup',
    'region',
    'row',
    'rowgroup',
    'rowheader',
    'scrollbar',
    'search',
    'searchbox',
    'sectionfooter',
    'sectionheader',
    'separator',
    'slider',
    'spinbutton',
    'status',
    'strong',
    'subscript',
    'suggestion',
    'superscript',
    'switch',
    'tab',
    'table',
    'tablist',
    'tabpanel',
    'term',
    'textbox',
    'time',
    'timer',
    'toolbar',
    'tooltip',
    'tree',
    'treegrid',
    'treeitem',
]);
/** Implicit ARIA role per HTML element, per HTML-AAM. Attribute-dependent ones are in `resolveRole`. */
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
 * Roles an `<input>` carries by `type`. Password and file get one beyond HTML-AAM so they don't
 * vanish from a snapshot; their values are still withheld (see `isRedacted`).
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
const SUGGESTING_INPUT_TYPES = new Set(['text', 'search', 'url', 'tel', 'email']);
const ROLELESS_INPUT_TYPES = new Set(['hidden', 'color']);
/** `<th scope>` values that make it a row header rather than a column header. */
const ROW_HEADER_SCOPES = ['row', 'rowgroup'];
/** Roles named from their own text (ARIA "name from contents"); a superset of {@link LEAF_ROLES}. */
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
/** Roles of a single control or message, where descending would only repeat the label. */
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
/** Leaf roles that may still nest a separate control, such as a heading with a button. */
const CONTENT_LEAF_ROLES = new Set([
    'heading',
    'status',
    'alert',
    'term',
    'caption',
    'definition',
    'tooltip',
    'treeitem',
]);
/** An editing host with any other role would have what the user typed read as prose. */
const TEXT_ENTRY_ROLES = new Set(['textbox', 'searchbox', 'combobox']);
const PRESENTATIONAL_ROLES = new Set(['presentation', 'none']);
/** Roles holding a value the user sets; also the `forms` category, with `form`. */
const WRITABLE_ROLES = new Set([
    'textbox',
    'searchbox',
    'combobox',
    'listbox',
    'checkbox',
    'radio',
    'radiogroup',
    'switch',
    'slider',
    'spinbutton',
]);
/** Named by their message, not their actions: "Saved", not "Saved Undo". */
const MESSAGE_ROLES = new Set(['alert', 'status']);
/** Roles whose label is their content; in a redacted region it is withheld, unlike a control's label. */
const CONTENT_ROLES = new Set([
    'text',
    'heading',
    'cell',
    'gridcell',
    'row',
    'rowheader',
    'columnheader',
    'listitem',
    'caption',
    'note',
    'tooltip',
    'term',
    'definition',
    'paragraph',
    'blockquote',
    'status',
    'alert',
    'log',
    'marquee',
    'option',
]);

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Own entry only: `role="constructor"` must not find a function on `Object.prototype`. */
function ownEntry(table, key) {
    return Object.hasOwn(table, key) ? table[key] : undefined;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Default snapshot budgets, sized for an AI agent's context window. */
const CLR_CONTEXT_DEFAULT_OPTIONS = deepFreeze({
    maxTextLength: 100,
    maxItemsPerCollection: CLR_CONTEXT_DEFAULT_MAX_ITEMS,
    maxComponents: 300,
    maxDepth: 0,
    includeDomComponents: true,
    includeText: true,
    includeFrames: true,
    excludeCategories: [],
    excludeRoles: [],
    excludeSelectors: [],
    rootSelector: '',
    focus: 'page',
    collectionItems: 'all',
    includeRoutes: false,
});
/** The roles each category stands for. `text` and `frames` map to the `includeText` and `includeFrames` switches. */
const CLR_CONTEXT_CATEGORIES = deepFreeze({
    layout: ['navigation', 'banner', 'contentinfo', 'complementary'],
    actions: ['button', 'link', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 'menuitemradio'],
    forms: ['form', ...WRITABLE_ROLES],
    headings: ['heading'],
    collections: ['grid', 'treegrid', 'table', 'list', 'tablist', 'tree'],
    dialogs: ['dialog', 'alertdialog'],
    status: ['alert', 'status', 'progressbar', 'meter'],
    images: ['img', 'figure'],
    text: [],
    frames: [],
});
const CATEGORY_NAMES = Object.keys(CLR_CONTEXT_CATEGORIES);
/** A non-finite budget would never run out and the whole document would be walked. */
const BUDGET_RANGES = {
    maxTextLength: { min: 1, max: 10_000 },
    maxItemsPerCollection: { min: 1, max: 1_000 },
    maxComponents: { min: 0, max: 10_000 },
    maxDepth: { min: 0, max: 100 },
};
const BUDGET_KEYS = Object.keys(BUDGET_RANGES);
const SWITCH_KEYS = ['includeDomComponents', 'includeText', 'includeFrames', 'includeRoutes'];
const LIST_KEYS = ['excludeRoles', 'excludeSelectors'];
const EXCLUSION_KEYS = ['excludeCategories', ...LIST_KEYS];
function isExclusionKey(key) {
    return EXCLUSION_KEYS.includes(key);
}
function listOrNothing(value) {
    return Array.isArray(value) ? value : [];
}
function union(first, second) {
    return [...new Set([...first, ...second])];
}
/** In development, warns that a non-list exclusion (`excludeSelectors: '.secret'`) was ignored. */
function warnIfNotAList(key, value) {
    if (value !== undefined && !Array.isArray(value) && isDevMode()) {
        console.warn(`Clarity context options: ${key} must be a list, so ${describeValue(value)} was ignored.`);
    }
}
function warnIfExclusionsAreNotLists(options) {
    for (const key of EXCLUSION_KEYS) {
        warnIfNotAList(key, options?.[key]);
    }
}
/** A warning must not throw on a circular object or a BigInt. */
function describeValue(value) {
    if (typeof value === 'string') {
        return JSON.stringify(value);
    }
    if (value === null) {
        return 'null';
    }
    return typeof value === 'object' ? 'an object' : `a ${typeof value}`;
}
/** The roles a set of categories leaves out, for the categories that are roles. */
function clrContextCategoryRoles(categories) {
    return [...new Set(categories.flatMap(category => ownEntry(CLR_CONTEXT_CATEGORIES, category) ?? []))];
}
/** Presets from most to least verbose: `full`, `interactive` (no prose or layout) and `minimal`. */
const CLR_CONTEXT_PRESETS = deepFreeze({
    full: {},
    interactive: {
        excludeCategories: ['layout', 'text'],
    },
    minimal: {
        excludeCategories: ['layout', 'text'],
        collectionItems: 'summary',
        maxItemsPerCollection: 10,
        maxTextLength: 60,
        maxComponents: 150,
        focus: 'modal',
    },
});
/** A copy of a preset's options with overrides; exclusion lists add up. Throws for an unknown name. */
function clrContextPreset(preset, overrides = {}) {
    const options = ownEntry(CLR_CONTEXT_PRESETS, preset);
    if (!options) {
        throw new Error(`Clarity context options: "${String(preset)}" is not a preset; use one of ${Object.keys(CLR_CONTEXT_PRESETS).join(', ')}.`);
    }
    const base = { ...options };
    for (const key of EXCLUSION_KEYS) {
        if (Array.isArray(base[key])) {
            base[key] = [...base[key]];
        }
    }
    return withCallOptions(base, overrides);
}
/** One call's options over the application's; exclusion lists add up, so a call can only leave out more. */
function withCallOptions(application, call) {
    const effective = { ...application };
    for (const [key, value] of Object.entries(call ?? {})) {
        if (isExclusionKey(key)) {
            warnIfNotAList(key, value);
        }
        if (value !== undefined && (!isExclusionKey(key) || Array.isArray(value))) {
            effective[key] = value;
        }
    }
    for (const key of EXCLUSION_KEYS) {
        const added = call?.[key];
        if (Array.isArray(added)) {
            effective[key] = union(listOrNothing(application?.[key]), added);
        }
    }
    return effective;
}
/** Most entries in an untrusted caller's role list; the application's own lists are never cut. */
const MAX_LIST_ENTRIES = 50;
/** The caller's options over the defaults, each held to its type and range or else defaulted. */
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
    for (const key of LIST_KEYS) {
        const value = options[key];
        if (Array.isArray(value)) {
            resolved[key] = stringList(value);
        }
    }
    if (Array.isArray(options.excludeCategories)) {
        // Validated before bounding, so junk entries cannot push real categories out.
        resolved.excludeCategories = stringList(options.excludeCategories.filter(name => CATEGORY_NAMES.includes(name)));
    }
    resolved.excludeRoles = union(resolved.excludeRoles, clrContextCategoryRoles(resolved.excludeCategories));
    if (resolved.excludeCategories.includes('text')) {
        resolved.includeText = false;
    }
    if (resolved.excludeCategories.includes('frames')) {
        resolved.includeFrames = false;
    }
    if (typeof options.rootSelector === 'string') {
        resolved.rootSelector = options.rootSelector.trim();
    }
    if (options.focus === 'page' || options.focus === 'modal') {
        resolved.focus = options.focus;
    }
    if (options.collectionItems === 'all' || options.collectionItems === 'summary') {
        resolved.collectionItems = options.collectionItems;
    }
    return resolved;
}
/** Options asked by one party capped by another's ceiling: the smaller budget wins and exclusions add up. */
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
        if (key === 'maxDepth') {
            // Zero is "unlimited", so it is the largest value.
            capped[key] = limit === 0 ? asked : typeof asked === 'number' && asked > 0 ? Math.min(asked, limit) : limit;
            continue;
        }
        capped[key] = typeof asked === 'number' && Number.isFinite(asked) ? Math.min(asked, limit) : limit;
    }
    for (const key of SWITCH_KEYS) {
        if (ceiling[key] === false) {
            capped[key] = false;
        }
    }
    for (const key of LIST_KEYS) {
        const limit = ceiling[key];
        if (Array.isArray(limit) && limit.length) {
            capped[key] = union(stringList(limit), stringList(listOrNothing(capped[key])));
        }
    }
    if (Array.isArray(ceiling.excludeCategories) && ceiling.excludeCategories.length) {
        capped.excludeCategories = union(ceiling.excludeCategories, listOrNothing(capped.excludeCategories));
    }
    if (ceiling.rootSelector) {
        capped.rootSelector = ceiling.rootSelector;
    }
    if (ceiling.focus === 'modal') {
        capped.focus = 'modal';
    }
    if (ceiling.collectionItems === 'summary') {
        capped.collectionItems = 'summary';
    }
    return capped;
}
function stringList(value) {
    return value
        .filter((entry) => typeof entry === 'string')
        .map(entry => entry.trim())
        .filter(entry => entry.length > 0);
}
function clamp(value, range) {
    return Math.min(range.max, Math.max(range.min, value));
}
/** The exported option constants feed the untrusted allow-list, so they must not be mutable. */
function deepFreeze(value) {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (const entry of Object.values(value)) {
            deepFreeze(entry);
        }
    }
    return value;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Application-wide snapshot options that every snapshot starts from. */
const CLR_CONTEXT_OPTIONS = new InjectionToken('CLR_CONTEXT_OPTIONS');
/**
 * Configures snapshot options for the whole application, from a preset, options or both:
 * ```ts
 * provideClrContextOptions('interactive', { excludeSelectors: ['clr-header'] });
 * ```
 * Provide it at application level: the engine is root-provided and reads only the root injector.
 */
function provideClrContextOptions(options, overrides = {}) {
    if (typeof options !== 'string') {
        warnIfExclusionsAreNotLists(options);
    }
    const resolved = typeof options === 'string' ? clrContextPreset(options, overrides) : withCallOptions(options, overrides);
    return makeEnvironmentProviders([{ provide: CLR_CONTEXT_OPTIONS, useValue: resolved }]);
}
/** The application every snapshot describes. */
const CLR_CONTEXT_APPLICATION = new InjectionToken('CLR_CONTEXT_APPLICATION');
/**
 * Identifies the application in every snapshot:
 * ```ts
 * provideClrContextApplication({ id: 'inventory', version: '2.4.0', viewId: () => currentView() });
 * ```
 */
function provideClrContextApplication(application) {
    if (application.views !== undefined &&
        application.views !== 'all' &&
        application.views !== 'enabled' &&
        isDevMode()) {
        console.warn(`provideClrContextApplication: views "${application.views}" is neither 'all' nor 'enabled'; only enabled views are read.`);
    }
    return makeEnvironmentProviders([{ provide: CLR_CONTEXT_APPLICATION, useValue: application }]);
}
/** The views configuration, or the URL of its JSON. */
const CLR_CONTEXT_CONFIG = new InjectionToken('CLR_CONTEXT_CONFIG');
/**
 * Describes views by route or selector, as an object or the URL of an `ai-config.json`:
 * ```ts
 * provideClrContextConfig('/assets/ai-config.json');
 * provideClrContextConfig({ views: [{ route: 'hosts/:id', viewId: 'host-detail', metadata: { purpose: '…' } }] });
 * ```
 */
function provideClrContextConfig(config) {
    return makeEnvironmentProviders([{ provide: CLR_CONTEXT_CONFIG, useValue: config }]);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** `fn()`, or `fallback` when it throws: page content and application callbacks must not break a snapshot. */
function attempt(fn, fallback) {
    try {
        return fn();
    }
    catch {
        return fallback;
    }
}
const TIMED_OUT = Symbol('timed out');
/** `promise`, or {@link TIMED_OUT} when it has not settled after `timeoutMs`. */
function withTimeout(promise, timeoutMs) {
    let timer;
    const timeout = new Promise(resolve => (timer = setTimeout(() => resolve(TIMED_OUT), timeoutMs)));
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}
/** The longest delay `setTimeout` honours; longer ones, `Infinity` included, fire at once. */
const MAX_TIMEOUT_MS = 2 ** 31 - 1;
/** `timeoutMs` as a delay `setTimeout` honours: `fallback` when it is not a number, capped otherwise. */
function usableTimeout(timeoutMs, fallback) {
    if (typeof timeoutMs !== 'number' || Number.isNaN(timeoutMs)) {
        return fallback;
    }
    return Math.min(Math.max(timeoutMs, 0), MAX_TIMEOUT_MS);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let current = null;
function withinReadScope(read) {
    if (current) {
        return read();
    }
    current = { styles: new WeakMap(), labels: new WeakMap(), shadowRoots: new WeakMap() };
    try {
        return read();
    }
    finally {
        current = null;
    }
}
function readScope() {
    return current;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Hosts described by their own role and name, whose shadow roots are neither walked nor watched. */
const LEAF_HOST_SELECTOR = 'clr-icon, cds-icon';
/**
 * The nodes that render inside `parent`: an open shadow root's content instead of the light DOM, and for
 * a slot in a shadow root, what is assigned to it or else its fallback. Slots stay in the result, so a
 * marker on a slot applies to what it shows.
 */
function renderedChildNodes(parent) {
    if (isShadowSlot(parent)) {
        const assigned = parent.assignedNodes();
        return assigned.length ? assigned : Array.from(parent.childNodes);
    }
    const source = parent.nodeType === Node.ELEMENT_NODE ? walkedShadowRoot(parent) : null;
    return Array.from((source ?? parent).childNodes);
}
/** The parent in the rendered tree: the slot the element is assigned to, its parent, or its shadow root's host. */
function parentAcrossShadow(element) {
    return element.assignedSlot ?? element.parentElement ?? shadowRootOf(element)?.host ?? null;
}
/** `element.closest(selector)` along the rendered tree, through slots and shadow root hosts. */
function closestAcrossShadow(element, selector) {
    for (let current = element; current; current = parentAcrossShadow(current)) {
        if (current.matches(selector)) {
            return current;
        }
    }
    return null;
}
/** `ancestor.contains(node)` along the rendered tree, through slots and shadow root hosts. */
function containsAcrossShadow(ancestor, node) {
    for (let current = node; current; current = parentAcrossShadow(current)) {
        if (current === ancestor) {
            return true;
        }
    }
    return false;
}
/** Whether `root.querySelector(selector)` would find something, looking inside open shadow roots and slots too. */
function hasRendered(root, selector) {
    return !!root.querySelector(selector) || (!rendersLightDomOnly(root) && queryRendered(root, selector).length > 0);
}
/** No open shadow root below `root` and no slot in it that projects, so plain queries see all it renders. */
function rendersLightDomOnly(root) {
    const inShadowTree = root.nodeType === Node.ELEMENT_NODE ? !!shadowRootOf(root) : 'host' in root;
    return !inShadowTree && !openShadowRoots(root).length;
}
/**
 * `root.querySelectorAll(selector)`, also inside the open shadow roots under `root` and what their slots show,
 * in the order they render.
 */
function queryRendered(root, selector) {
    if (rendersLightDomOnly(root)) {
        return Array.from(root.querySelectorAll(selector));
    }
    const found = new Set();
    for (const scope of [root, ...openShadowRoots(root)]) {
        scope.querySelectorAll(selector).forEach(element => {
            if (!isReplacedFallback(element)) {
                found.add(element);
            }
        });
        for (const slot of Array.from(scope.querySelectorAll('slot')).filter(isShadowSlot)) {
            for (const slotted of slot.assignedElements()) {
                if (slotted.matches(selector)) {
                    found.add(slotted);
                }
                queryRendered(slotted, selector).forEach(element => found.add(element));
            }
        }
    }
    return inRenderedOrder(Array.from(found));
}
/** Sorts elements as they render: a shadow root's content where its host is, slotted elements where their slot is. */
function inRenderedOrder(elements) {
    const paths = new Map(elements.map(element => [element, renderedPath(element)]));
    return elements.sort((a, b) => compareRendered(paths.get(a) ?? [], paths.get(b) ?? []));
}
function renderedPath(element) {
    const path = [];
    for (let current = element; current; current = parentAcrossShadow(current)) {
        path.unshift(current);
    }
    return path;
}
function compareRendered(a, b) {
    let shared = 0;
    while (shared < a.length && shared < b.length && a[shared] === b[shared]) {
        shared++;
    }
    // An ancestor renders before what it holds.
    if (shared === a.length || shared === b.length) {
        return a.length - b.length;
    }
    const [first, second] = [a[shared], b[shared]];
    // Only a host's shadow root content and its unassigned light DOM have the host as their shared parent.
    if (first.getRootNode() !== second.getRootNode()) {
        return first.getRootNode() === a[shared - 1]?.shadowRoot ? -1 : 1;
    }
    return first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
}
function idScope(element) {
    return shadowRootOf(element) ?? element.ownerDocument;
}
/** Every open shadow root under `root` (its own included) that the walk reads, nested ones too; cached for the walk. */
function openShadowRoots(root) {
    const cache = readScope()?.shadowRoots;
    const cached = cache?.get(root);
    if (cached) {
        return cached;
    }
    // The nearest scanned ancestor tells when there is nothing below it, which spares a scan per level.
    for (let ancestor = root.parentNode; cache && ancestor; ancestor = ancestor.parentNode) {
        const scanned = cache.get(ancestor);
        if (scanned?.length === 0) {
            cache.set(root, scanned);
            return scanned;
        }
        if (scanned) {
            break;
        }
    }
    const own = root.nodeType === Node.ELEMENT_NODE ? walkedShadowRoot(root) : null;
    const roots = own ? [own, ...openShadowRoots(own)] : [];
    for (const element of Array.from(root.querySelectorAll('*'))) {
        const shadowRoot = walkedShadowRoot(element);
        if (shadowRoot) {
            roots.push(shadowRoot, ...openShadowRoots(shadowRoot));
        }
    }
    cache?.set(root, roots);
    return roots;
}
/** The element's open shadow root, unless the element is described as a leaf. */
function walkedShadowRoot(element) {
    return element.shadowRoot && !element.matches(LEAF_HOST_SELECTOR) ? element.shadowRoot : null;
}
function shadowRootOf(element) {
    const root = element.getRootNode();
    return root.nodeType === Node.DOCUMENT_FRAGMENT_NODE && 'host' in root ? root : null;
}
/** Whether the element is a slot's fallback content, which what is assigned to the slot replaces. */
function isReplacedFallback(element) {
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
        if (isShadowSlot(parent) && parent.assignedNodes().length) {
            return true;
        }
    }
    return false;
}
/** A slot that projects light DOM; a `<slot>` outside a shadow root is an ordinary element. */
function isShadowSlot(node) {
    return node.nodeType === Node.ELEMENT_NODE && node.tagName === 'SLOT' && !!shadowRootOf(node);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function withRole(...roles) {
    return roles.map(role => `[role="${role}"]`);
}
/** Elements with any of `roles`: explicit, or native ones with that implicit role and no `role` attribute. */
function roleSelector(...roles) {
    const natives = [
        ...Object.keys(IMPLICIT_ROLES_BY_TAG).filter(tag => roles.includes(IMPLICIT_ROLES_BY_TAG[tag])),
        ...Object.keys(INPUT_ROLES_BY_TYPE)
            .filter(type => roles.includes(INPUT_ROLES_BY_TYPE[type]))
            .map(type => `input[type="${type}"]`),
    ];
    return [...withRole(...roles), ...natives.map(native => `${native}:not([role])`)].join(', ');
}
/** What a user acts on; its text is not part of the surrounding name. */
const ACTION_SELECTOR = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[contenteditable]',
    ...withRole('button', 'link', 'checkbox', 'radio', 'switch', 'textbox', 'searchbox', 'combobox', 'listbox', 'menu', 'menuitem', 'tab', 'slider', 'spinbutton'),
].join(', ');
/** An action, or anything else focusable or interactive; a described-by target holding one is real content. */
const CONTROL_SELECTOR = [
    ACTION_SELECTOR,
    '[tabindex]',
    ...withRole('option', 'treeitem', 'grid', 'table', 'dialog', 'alertdialog'),
].join(', ');
/** A control holding a value the user sets. */
const VALUE_CONTROL_SELECTOR = [
    'input',
    'select',
    'textarea',
    '[contenteditable]',
    ...withRole(...WRITABLE_ROLES),
].join(', ');
/** Anything the walk would describe as a node of its own. */
const DESCRIBABLE_SELECTOR = `[role], ${CONTROL_SELECTOR}, img, svg, iframe, frame, [aria-label], [aria-labelledby]`;
const CELL_SELECTOR = 'td, [role="cell"], [role="gridcell"]';
/** Only a dialog that says it is modal; a non-modal dialog or side panel leaves the page in use. */
const MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog:modal';
/** Fallback for browsers without `:modal`: any open `<dialog>` counts as modal. */
const LEGACY_MODAL_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"][aria-modal="true"], dialog[open]';
/** Only a page-level `<header>`/`<footer>` is a landmark, per HTML-AAM. */
const SECTIONING_SELECTOR = 'article, aside, main, nav, section';
/** Never read into names: regions kept from agents, and editing hosts, whose text is a value. */
const UNREADABLE_SELECTOR = `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}, ${CLR_CONTEXT_EDITING_HOST_SELECTOR}`;
const COLUMN_HEADER_CELL = `th:not([role])${ROW_HEADER_SCOPES.map(scope => `:not([scope="${scope}"])`).join('')}`;
/** The items a collection summary counts, per item role. */
const ITEM_SELECTORS = {
    columnheader: `${roleSelector('columnheader')}, ${COLUMN_HEADER_CELL}`,
    row: roleSelector('row'),
    tab: roleSelector('tab'),
    listitem: roleSelector('listitem'),
    option: roleSelector('option'),
    menuitem: roleSelector('menuitem', 'menuitemcheckbox', 'menuitemradio'),
    radio: roleSelector('radio'),
};
const TABLE_CONTAINER = 'table, [role="table"], [role="grid"], [role="treegrid"]';
/** The collection an item belongs to, per item role, so a nested collection's items are left to it. */
const ITEM_CONTAINER_SELECTORS = {
    columnheader: TABLE_CONTAINER,
    row: TABLE_CONTAINER,
    tab: '[role="tablist"]',
    listitem: 'ul, ol, menu, [role="list"]',
    option: 'select, datalist, [role="listbox"], [role="combobox"]',
    menuitem: '[role="menu"], [role="menubar"]',
    radio: '[role="radiogroup"]',
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const SKIPPED_TAGS = new Set([
    'script',
    'style',
    'template',
    'link',
    'meta',
    'noscript',
    'head',
]);
/** Elements whose text names something else and is never reported as text. */
const NAMING_TAGS = new Set([
    'label',
    'legend',
    'caption',
    'figcaption',
    'option',
    'optgroup',
    'datalist',
    'title',
]);
/** Inline elements whose text runs on with the text around them. */
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
/** Elements a `<label>` can name. */
const LABELABLE_TAGS = new Set([
    'button',
    'input',
    'meter',
    'output',
    'progress',
    'select',
    'textarea',
]);

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Whether the element is in hidden, inert or ignored markup, or in a region `withheld` selects. */
function isHiddenFromContext(element, withheld = '') {
    return (!!closestAcrossShadow(element, CLR_CONTEXT_HIDDEN_SELECTOR) ||
        (!!withheld && !!closestAcrossShadow(element, withheld)));
}
/** {@link isHiddenFromContext} judged on the element alone, for a walk that has already judged its ancestors. */
function hidesFromContext(element, withheld = '') {
    return element.matches(CLR_CONTEXT_HIDDEN_SELECTOR) || (!!withheld && element.matches(withheld));
}
/** Whether a redacted region holds `item` but not `container`, so the item's text is withheld from it. */
function isRedactedWithin(item, container) {
    const redacting = closestAcrossShadow(item, CLR_CONTEXT_REDACT_SELECTOR);
    return !!redacting && !containsAcrossShadow(redacting, container);
}
/**
 * Whether the element can be seen, as assistive technology judges it. Geometry is not judged:
 * custom checkboxes draw over a visually hidden native input that is still in the accessibility tree.
 * Transparency hides prose and tooltips, but not controls: the native inputs of a button group and the
 * row actions a hover reveals are `opacity: 0` and still reachable. `judgeOpacity: false` ignores it.
 */
function isVisible(element, judgeOpacity = true) {
    if (!judgeOpacity) {
        return isShown(element, false);
    }
    return isShown(element, true) || (isShown(element, false) && reachesControl(element));
}
function isShown(element, judgeOpacity) {
    // `display: contents` has no box but hides nothing; it shows exactly when its parent does.
    for (let current = element; current; current = current.parentElement) {
        // Not `contentVisibilityAuto`: what `content-visibility: auto` skips is off screen, not absent.
        if (checkVisibility(current, true, judgeOpacity)) {
            return true;
        }
        if (current.ownerDocument.defaultView?.getComputedStyle(current).display !== 'contents') {
            return false;
        }
    }
    return true;
}
function reachesControl(element) {
    return element.matches(CONTROL_SELECTOR) || hasRendered(element, CONTROL_SELECTOR);
}
/** `Element.checkVisibility`, falling back to computed style where it is missing (jsdom, older browsers). */
function checkVisibility(element, judgeVisibility, judgeOpacity = judgeVisibility) {
    const native = element.checkVisibility;
    if (typeof native === 'function') {
        return judgeVisibility
            ? native.call(element, { visibilityProperty: true, opacityProperty: judgeOpacity })
            : native.call(element);
    }
    const view = element.ownerDocument.defaultView;
    if (!element.isConnected || !view) {
        return false;
    }
    const own = view.getComputedStyle(element);
    if (own.display === 'contents' || (judgeVisibility && own.visibility === 'hidden')) {
        return false;
    }
    for (let current = element; current; current = current.parentElement) {
        const style = current === element ? own : view.getComputedStyle(current);
        if (style.display === 'none' || (judgeOpacity && style.opacity === '0')) {
            return false;
        }
    }
    return true;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Normalizes whitespace and truncates to `maxLength`, ending shortened text with an ellipsis. */
function truncate(text, maxLength) {
    const normalized = text.replace(/\s+/g, ' ').trim();
    if (normalized.length <= maxLength) {
        return normalized;
    }
    // Don't cut a surrogate pair in half.
    return `${normalized.slice(0, maxLength - 1).replace(/[\ud800-\udbff]$/, '')}…`;
}
/** Whether an element is visually hidden but available to a screen reader (any library's sr-only idiom). */
function isVisuallyHidden(element) {
    const style = computedStyle(element);
    return !!style && isClipped(element, style);
}
function computedStyle(element) {
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
function isExcludedFromName(element, style, includeClipped) {
    if (element.matches(CLR_CONTEXT_HIDDEN_SELECTOR)) {
        return true;
    }
    if (!style) {
        return false;
    }
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
        return true;
    }
    return !includeClipped && isClipped(element, style);
}
function isClipped(element, style) {
    // The sr-only idiom clips with `inset(...)`; other shapes still show what they clip.
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
 * An element's text as read for a name, without hidden content; sr-only text counts only when it is all there is.
 * `withheld` selects descendants whose text is never read, and `withholds` picks more of them.
 */
function accessibleText(element, exclude, withheld = '', withholds) {
    const visible = textFor(element, exclude, false, withheld, withholds);
    return visible.trim() ? visible : textFor(element, exclude, true, withheld, withholds);
}
/** Embedded choice lists name by their chosen value, which is user input, so they add nothing to a name. */
const CHOICE_LIST_SELECTOR = 'select, [role="listbox" i]';
/** Script can nest deeper than the parser's 512; deeper content is dropped rather than overflow the stack. */
const MAX_NESTING_DEPTH = 512;
function textFor(element, exclude, includeClipped, withheld, withholds, depth = 0, embedding = true) {
    if (depth >= MAX_NESTING_DEPTH) {
        return '';
    }
    let text = '';
    for (const node of renderedChildNodes(element)) {
        if (node.nodeType === Node.TEXT_NODE) {
            text += node.textContent ?? '';
            continue;
        }
        // A node in a frame is an instance of that window's Element, so `instanceof` would fail.
        if (node.nodeType !== Node.ELEMENT_NODE || node === exclude) {
            continue;
        }
        const child = node;
        // A shadow root's `<style>` is text in the DOM, never on screen.
        if (SKIPPED_TAGS.has(child.tagName.toLowerCase()) ||
            child.matches(UNREADABLE_SELECTOR) ||
            child.matches(CHOICE_LIST_SELECTOR) ||
            (withheld && child.matches(withheld)) ||
            withholds?.(child)) {
            continue;
        }
        // Judged before reading, so a hidden subtree is never walked.
        const style = computedStyle(child);
        if (isExcludedFromName(child, style, includeClipped)) {
            continue;
        }
        const embeds = embedding && !child.matches(ACTION_SELECTOR);
        const inner = (embeds ? embeddedName(child, withheld) : null) ??
            textFor(child, exclude, includeClipped, withheld, withholds, depth + 1, embeds);
        if (!inner.trim()) {
            continue;
        }
        // Block-level content reads as separate words.
        text += style && !style.display.startsWith('inline') && style.display !== 'contents' ? ` ${inner} ` : inner;
    }
    return text;
}
/**
 * The name a descendant gives itself (`aria-label`, an image's `alt`), or `null` to read its content.
 * `aria-labelledby` is not followed recursively, as in the ARIA name computation.
 */
function embeddedName(element, withheld) {
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
let followingReference = false;
function referencedText(element, attribute, withheld = '', skip = []) {
    const ids = getAriaReferenceIds(element, attribute);
    if (!ids.length) {
        return '';
    }
    const following = followingReference;
    followingReference = true;
    try {
        return textOfReferences(idScope(element), ids, withheld, skip);
    }
    finally {
        followingReference = following;
    }
}
function textOfReferences(scope, ids, withheld, skip) {
    return (ids
        .filter(id => !skip.includes(id))
        .map(id => scope.getElementById(id))
        // Page content can point `aria-describedby` at anything, so hidden or unreadable targets are
        // skipped (ARIA would include them, which would smuggle in text nobody sees).
        .filter((referenced) => !!referenced &&
        !closestAcrossShadow(referenced, UNREADABLE_SELECTOR) &&
        !isHiddenFromContext(referenced, withheld) &&
        !isUnrendered(referenced))
        .map(referenced => accessibleText(referenced, undefined, withheld).trim())
        .filter(text => text)
        .join(' '));
}
function isUnrendered(element, judgeOpacity = true) {
    return !!closestAcrossShadow(element, '[hidden]') || !isVisible(element, judgeOpacity);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const STATE_DEPTH = 3;
const ROUTE_DATA_DEPTH = 2;
const REGION_DEPTH = 10;
/**
 * Reduces a value to its JSON-serializable subset, at most `depth` levels deep, with strings and arrays
 * cut to `limits` when given. Empty arrays and objects are dropped unless `keepEmpty` is set, and so is
 * a reference back to a value being reduced, so a `parent` pointer cannot copy the tree it points into.
 */
function jsonSafe(value, depth, keepEmpty = false, limits) {
    return reduced(value, depth, keepEmpty, limits, new Set());
}
function reduced(value, depth, keepEmpty, limits, ancestors) {
    if (typeof value === 'string') {
        return limits ? truncate(value, limits.maxTextLength) : value;
    }
    if (value === null || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }
    if (depth <= 0 || typeof value !== 'object' || ancestors.has(value)) {
        return undefined;
    }
    ancestors.add(value);
    try {
        if (Array.isArray(value)) {
            const items = value
                .slice(0, limits?.maxItemsPerCollection)
                .map(item => reduced(item, depth - 1, keepEmpty, limits, ancestors))
                .filter(item => item !== undefined);
            return items.length || keepEmpty ? items : undefined;
        }
        if (!isPlainObject(value)) {
            return undefined;
        }
        const result = {};
        for (const key of Object.keys(value)) {
            // A throwing getter costs its own key, not the whole value.
            const entry = attempt(() => value[key], undefined);
            const serializable = reduced(entry, depth - 1, keepEmpty, limits, ancestors);
            if (serializable !== undefined) {
                defineOwn(result, key, serializable);
            }
        }
        return Object.keys(result).length || keepEmpty ? result : undefined;
    }
    finally {
        ancestors.delete(value);
    }
}
/** An object literal, `Object.create(null)` or one from another window (a frame); not a class instance. */
function isPlainObject(value) {
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || Object.getPrototypeOf(prototype) === null;
}
/** `JSON.stringify(value)` for comparing snapshots, or `null` when the value cannot be serialised. */
function serialize(value) {
    return attempt(() => JSON.stringify(value ?? null), null);
}
/** Defined rather than assigned: an own `__proto__` key from `JSON.parse` would otherwise set the prototype. */
function defineOwn(target, key, value) {
    Object.defineProperty(target, key, { value, enumerable: true, writable: true, configurable: true });
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Reported only when on: `aria-disabled="false"` says nothing. */
const FLAG_ATTRIBUTES = {
    'aria-disabled': 'disabled',
    'aria-readonly': 'readOnly',
    'aria-required': 'required',
    'aria-modal': 'modal',
    'aria-multiselectable': 'multiSelectable',
    'aria-busy': 'busy',
};
/** `false` is as meaningful as `true` here: a collapsed panel is real information. */
const TRISTATE_ATTRIBUTES = {
    'aria-expanded': 'expanded',
    'aria-selected': 'selected',
    'aria-checked': 'checked',
    'aria-pressed': 'pressed',
};
/** Only values ARIA defines are reported, so page markup cannot grow the snapshot. */
const ENUM_ATTRIBUTES = [
    { attribute: 'aria-sort', key: 'sort', empty: 'none', values: ['ascending', 'descending', 'other'], other: null },
    {
        attribute: 'aria-current',
        key: 'current',
        empty: 'false',
        values: ['page', 'step', 'location', 'date', 'time', 'true'],
        other: 'true',
    },
    { attribute: 'aria-live', key: 'live', empty: 'off', values: ['polite', 'assertive'], other: null },
    {
        attribute: 'aria-haspopup',
        key: 'hasPopup',
        empty: 'false',
        values: ['true', 'menu', 'listbox', 'tree', 'grid', 'dialog'],
        other: 'true',
    },
    { attribute: 'aria-invalid', key: 'invalid', empty: 'false', values: [], other: 'true' },
];
const REDACTED_INPUT_TYPES = new Set(['password', 'file']);
/** `autocomplete` tokens for credentials and payment details, which are never reported. */
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
    'cc-given-name',
    'cc-additional-name',
    'cc-family-name',
    'cc-type',
]);
const VALUELESS_INPUT_TYPES = new Set([
    'button',
    'submit',
    'reset',
    'image',
    'checkbox',
    'radio',
    'hidden',
]);
/** State keys holding what the user entered or chose; withheld together. */
const VALUE_STATE_KEYS = [
    'value',
    'selected',
    'checked',
    'pressed',
    'selection',
    'selectedRows',
];
/**
 * State keys listing what a collection shows; inside a redacted region they go with the values.
 * Addresses count too: a path can carry the account number or token the region withholds.
 */
const CONTENT_STATE_KEYS = [
    'items',
    'options',
    'rows',
    'tabs',
    'activeTab',
    'disabledOptions',
    'href',
    'url',
];
/**
 * State keys the engine derives that are withheld from untrusted consumers because they reveal what the user
 * chose; published state is withheld unless marked public, so it needs no entry here.
 */
const UNTRUSTED_WITHHELD_STATE_KEYS = Object.freeze([
    'rows',
    'filteredColumns',
    'hiddenColumns',
    'fileCount',
    'matchingOptions',
    'redactedMatchingOptions',
    'matchingOptionsPending',
    'matchingOptionCount',
]);

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function ariaEnumValue(element, attribute) {
    const definition = ENUM_ATTRIBUTES.find(candidate => candidate.attribute === attribute);
    const raw = element.getAttribute(attribute)?.trim().toLowerCase();
    if (!definition || !raw || raw === definition.empty) {
        return null;
    }
    return definition.values.includes(raw) ? raw : definition.other;
}
/** The element's ARIA and native state as a flat, JSON-safe object. */
function ariaState(element, options, insideRedactedRegion, withheld = '') {
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
    for (const { attribute, key } of ENUM_ATTRIBUTES) {
        const value = ariaEnumValue(element, attribute);
        if (value !== null) {
            state[key] = key === 'invalid' ? true : value;
        }
    }
    const level = numberAttribute(element, 'aria-level');
    if (level !== undefined) {
        state.level = level;
    }
    const roleDescription = element.getAttribute('aria-roledescription')?.trim();
    if (roleDescription) {
        state.roleDescription = truncate(roleDescription, options.maxTextLength);
    }
    // Messages wired by `aria-describedby` are read there, so they do not show up as stray nodes;
    // `aria-errormessage` becomes `error` and only while the field is invalid.
    const errorIds = state.invalid === true ? getAriaReferenceIds(element, 'aria-errormessage') : [];
    const description = truncate(referencedText(element, 'aria-describedby', withheld, errorIds), options.maxTextLength);
    if (description) {
        state.description = description;
    }
    const error = errorIds.length
        ? truncate(referencedText(element, 'aria-errormessage', withheld), options.maxTextLength)
        : '';
    if (error) {
        state.error = error;
    }
    assignNativeState(element, state, options);
    assignValueState(element, state, options, insideRedactedRegion, withheld);
    return state;
}
function assignNativeState(element, state, options) {
    const tagName = element.tagName.toLowerCase();
    if ((tagName === 'details' || tagName === 'dialog') && element.hasAttribute('open')) {
        state.open = true;
    }
    if (isNativelyDisabled(element)) {
        state.disabled = true;
    }
    if ('required' in element && element.required) {
        state.required = true;
    }
    // A custom slider or spinbutton states its bounds through ARIA.
    for (const attribute of ['min', 'max', 'step']) {
        const value = numberAttribute(element, attribute) ??
            (attribute === 'step' ? undefined : numberAttribute(element, `aria-value${attribute}`));
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
    const href = element.getAttribute('href');
    if (href) {
        state.href = truncate(href, options.maxTextLength);
    }
}
/** Native checked state uses `checked`, like `aria-checked`, and is withheld with the other values. */
function assignValueState(element, state, options, insideRedactedRegion, withheld = '') {
    // Reported as withheld so an agent can tell a hidden field from an empty one.
    if (isRedacted(element, insideRedactedRegion)) {
        state.redacted = true;
        return;
    }
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
    if (tagName === 'progress' || tagName === 'meter') {
        if (tagName === 'meter' || element.hasAttribute('value')) {
            state.value = element.value;
        }
        return;
    }
    if (tagName === 'input') {
        const input = element;
        const type = (input.getAttribute('type') || 'text').toLowerCase();
        if (type === 'checkbox' || type === 'radio') {
            state.checked = type === 'checkbox' && input.indeterminate ? 'mixed' : input.checked;
            return;
        }
        if (type === 'number' || type === 'range') {
            state.value = input.value === '' || Number.isNaN(input.valueAsNumber) ? null : input.valueAsNumber;
        }
        else if (!VALUELESS_INPUT_TYPES.has(type)) {
            state.value = truncate(input.value, options.maxTextLength);
        }
        return;
    }
    if (tagName === 'textarea') {
        state.value = truncate(element.value, options.maxTextLength);
        return;
    }
    if (isContentEditable(element)) {
        state.value = truncate(accessibleText(element, undefined, withheld), options.maxTextLength);
        return;
    }
    if (tagName === 'select') {
        // An option's `value` may be an internal key (`[ngValue]` renders "3: Object"), so its text is used.
        const chosen = Array.from(element.selectedOptions)
            .filter(option => !isHiddenFromContext(option, withheld) && !isRedactedWithin(option, element))
            .map(option => truncate(option.label || option.text, options.maxTextLength));
        if (element.multiple) {
            state.value = chosen.slice(0, options.maxItemsPerCollection);
        }
        else if (chosen.length) {
            state.value = chosen[0];
        }
    }
}
/** `:disabled` also covers a control inside a disabled fieldset, which the property does not. */
function isNativelyDisabled(element) {
    return 'disabled' in element && (element.disabled || element.matches(':disabled'));
}
/** Whether this control's value must be withheld, whatever the caller asked for. */
function isRedacted(element, insideRedactedRegion) {
    if (insideRedactedRegion ?? !!closestAcrossShadow(element, CLR_CONTEXT_REDACT_SELECTOR)) {
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
const OUTPUT_VALUE_ROLES = new Set(['progressbar', 'meter']);
function isContentEditable(element) {
    const editable = element.getAttribute('contenteditable');
    return editable !== null && editable.trim().toLowerCase() !== 'false';
}
const OUTPUT_WITHHELD_KEYS = VALUE_STATE_KEYS.filter(key => key !== 'value');
/** Removes every value key from the node and its descendants; see {@link withoutStateKeys}. */
function withoutValues(node, markWithheld = false) {
    return withoutStateKeys(node, ({ type }) => (OUTPUT_VALUE_ROLES.has(type) ? OUTPUT_WITHHELD_KEYS : VALUE_STATE_KEYS), markWithheld);
}
/**
 * Removes the keys `keysFor` names, recursively. With `markWithheld`, a node that lost a
 * non-empty value gets `withheld: true`; an empty value leaves no marker.
 */
function withoutStateKeys(node, keysFor, markWithheld = false) {
    let result = node;
    const state = node.state;
    const keys = keysFor(node);
    if (state && keys.some(key => key in state)) {
        const kept = { ...state };
        for (const key of keys) {
            delete kept[key];
        }
        if (markWithheld && keys.some(key => key in state && !isEmptyValue(state[key]))) {
            kept['withheld'] = true;
        }
        result = { ...result };
        if (Object.keys(kept).length) {
            result.state = kept;
        }
        else {
            delete result.state;
        }
    }
    const children = node.children;
    if (children?.length) {
        const reduced = children.map(child => withoutStateKeys(child, keysFor, markWithheld));
        if (reduced.some((child, index) => child !== children[index])) {
            result = { ...result, children: reduced };
        }
    }
    return result;
}
/** Whether a value says nothing: missing, empty text or an empty list. */
function isEmptyValue(value) {
    return value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length);
}
/** Strips values, collection contents and content labels, and marks the node `redacted: true`. */
function redactNode(node) {
    const reduced = withoutContentLabels(withoutStateKeys(withoutValues(node), () => CONTENT_STATE_KEYS));
    return { ...reduced, state: { ...reduced.state, redacted: true } };
}
function withoutContentLabels(node) {
    const result = { ...node };
    if (CONTENT_ROLES.has(node.type)) {
        delete result.label;
    }
    if (node.children?.length) {
        result.children = node.children.map(withoutContentLabels);
    }
    return result;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Most state keys one publisher can mark public. */
const MAX_PUBLIC_KEYS = 64;
/**
 * Picks the state an untrusted caller may see from what application code published: only the keys its
 * `publicKeys` lists, so a key nobody marked stays private. A non-empty value left out marks the state `withheld`;
 * an empty one leaves no marker, as for form values.
 */
function publicState(published, state) {
    const listed = published['publicKeys'];
    // `redacted` only ever hides more, so it is honoured whether or not it is listed.
    const keys = new Set(['redacted', ...(Array.isArray(listed) ? listed.slice(0, MAX_PUBLIC_KEYS) : [])]);
    const shared = {};
    for (const [key, value] of Object.entries(state)) {
        if (keys.has(key)) {
            defineOwn(shared, key, value);
        }
        else if (!isEmptyValue(value)) {
            shared['withheld'] = true;
        }
    }
    return shared;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Registry of live context providers; they are polled at snapshot time, so nothing goes stale. */
class ClrContextRegistryService {
    constructor() {
        this.providers = [];
        this.elements = new WeakMap();
        this.changesSubject = new Subject();
        /** Answers still pending, shared by every snapshot taken until they settle. */
        this.pending = new Map();
        this.changes$ = this.changesSubject.asObservable();
    }
    /** Registers a provider and returns its teardown; with `element`, it follows that element's visibility. */
    register(provider, element) {
        if (element) {
            this.elements.set(provider, element);
        }
        if (!this.providers.includes(provider)) {
            this.providers.push(provider);
            this.changesSubject.next();
        }
        return () => this.unregister(provider);
    }
    /** Removes a provider, typically from `ngOnDestroy`. */
    unregister(provider) {
        const index = this.providers.indexOf(provider);
        if (index > -1) {
            this.providers.splice(index, 1);
            this.pending.delete(provider);
            this.changesSubject.next();
        }
    }
    /** Tells whoever is keeping a snapshot current that a provider's contribution changed. */
    notifyChanged() {
        this.changesSubject.next();
    }
    /** Polls live providers, skipping ones that return `null` or throw; a pending one is reported as loading. */
    collect(options = {}) {
        return this.poll(options.filter).flatMap(({ result, verdict }) => isPromise(result) ? [{ type: CLR_CONTEXT_LOADING_TYPE }] : listOf$2(reported(result, verdict, options)));
    }
    /**
     * Like {@link collect}, awaiting each pending provider for up to `timeoutMs` (2 seconds by default).
     * One that fails or takes longer is reported as unavailable. The filter is applied again once every
     * provider has answered, as an element may have moved or been redacted meanwhile.
     */
    async collectAsync(options = {}) {
        const { filter } = options;
        const timeoutMs = usableTimeout(options.timeoutMs, DEFAULT_TIMEOUT_MS);
        const polled = this.poll(filter);
        const answers = await Promise.all(polled.map(({ provider, result }) => (isPromise(result) ? this.settle(provider, result, timeoutMs) : result)));
        return polled.flatMap(({ provider }, index) => {
            const verdict = !this.providers.includes(provider)
                ? 'drop'
                : filter
                    ? attempt(() => filter(this.elements.get(provider) ?? null), 'drop')
                    : 'keep';
            const answer = answers[index];
            if (verdict === 'drop') {
                return [];
            }
            return answer === TIMED_OUT
                ? [{ type: CLR_CONTEXT_UNAVAILABLE_TYPE }]
                : listOf$2(reported(answer, verdict, options));
        });
    }
    async settle(provider, result, timeoutMs) {
        const answer = await withTimeout(result, timeoutMs).catch(() => TIMED_OUT);
        // Asked again next time: an answer that never settles must not stand for every later one.
        if (answer === TIMED_OUT && this.pending.get(provider) === result) {
            this.pending.delete(provider);
        }
        return answer;
    }
    poll(filter) {
        const polled = [];
        for (const provider of this.providers) {
            try {
                const verdict = filter ? filter(this.elements.get(provider) ?? null) : 'keep';
                if (verdict !== 'drop') {
                    polled.push({ provider, result: this.ask(provider), verdict });
                }
            }
            catch {
                // A faulty provider must not break the whole snapshot.
            }
        }
        return polled;
    }
    /** The provider's answer; while an earlier answer is pending, that one, so a slow provider is not asked again. */
    ask(provider) {
        const waiting = this.pending.get(provider);
        if (waiting) {
            return waiting;
        }
        const result = provider.getClrContext();
        if (!isPromise(result)) {
            return result;
        }
        // `Promise.resolve` adopts any thenable, including one without `catch` or with a throwing `then`.
        // Only its own entry: once it timed out, a newer answer may be pending in its place.
        const answer = Promise.resolve(result).finally(() => {
            if (this.pending.get(provider) === answer) {
                this.pending.delete(provider);
            }
        });
        answer.catch(() => undefined);
        this.pending.set(provider, answer);
        return answer;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextRegistryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
/** Type of the placeholder region reported for a provider whose answer is pending. */
const CLR_CONTEXT_LOADING_TYPE = 'clr-loading';
/** Type of the placeholder region reported for a provider that failed or did not answer in time. */
const CLR_CONTEXT_UNAVAILABLE_TYPE = 'clr-unavailable';
const DEFAULT_TIMEOUT_MS = 2000;
function isPromise(value) {
    return typeof value?.then === 'function';
}
function reported(context, verdict, options) {
    const copy = attempt(() => copied(context, options), null);
    return copy && verdict === 'redact' ? withheldState(copy) : copy;
}
function listOf$2(context) {
    return context ? [context] : [];
}
function copied(context, options) {
    return componentNode(jsonSafe(context, REGION_DEPTH, true, options.limits), !!options.untrusted);
}
/** The fields a component context has, recursively; anything else would fall outside the published schema. */
function componentNode(value, untrusted) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return null;
    }
    const source = value;
    if (typeof source['type'] !== 'string') {
        return null;
    }
    const node = { type: source['type'] };
    if (typeof source['element'] === 'string') {
        node.element = source['element'];
    }
    if (typeof source['label'] === 'string') {
        node.label = source['label'];
    }
    const published = source['state'];
    if (published && typeof published === 'object' && !Array.isArray(published)) {
        const state = untrusted ? publicState(source, published) : published;
        if (Object.keys(state).length) {
            node.state = state;
        }
    }
    if (Array.isArray(source['children'])) {
        node.children = source['children']
            .map(child => componentNode(child, untrusted))
            .filter((child) => !!child);
    }
    return node;
}
function withheldState(context) {
    const reported = { type: context.type, state: { redacted: true } };
    if (context.label) {
        reported.label = context.label;
    }
    return reported;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * A JSON object about the view when it sits on the view's root or an ancestor of it, or about the
 * piece of UI it sits on anywhere else, where it is reported as the node's `state.metadata`.
 */
const CLR_AI_METADATA_ATTRIBUTE = 'data-ai-metadata';
/** The URL of a JSON object about the view; read on the view's root and its ancestors. */
const CLR_AI_METADATA_URL_ATTRIBUTE = 'data-ai-metadata-url';
/** What a piece of UI is about, as `[clrContext]` sets it, for pages without Angular. */
const CLR_CONTEXT_LABEL_ATTRIBUTE = 'data-clr-context';
/** The kind of UI annotated, as `[clrContextType]` sets it. */
const CLR_CONTEXT_TYPE_ATTRIBUTE = 'data-clr-context-type';
/** The annotated UI's state as a JSON object, as `[clrContextState]` sets it. */
const CLR_CONTEXT_STATE_ATTRIBUTE = 'data-clr-context-state';
const ANNOTATION_ATTRIBUTES = [
    CLR_CONTEXT_LABEL_ATTRIBUTE,
    CLR_CONTEXT_TYPE_ATTRIBUTE,
    CLR_CONTEXT_STATE_ATTRIBUTE,
    CLR_AI_METADATA_ATTRIBUTE,
];
/** Metadata in an attribute is meant to be small. */
const MAX_ATTRIBUTE_LENGTH = 8 * 1024;
/** The JSON object in `text`; `null`, with a dev-mode warning, when it is too long, invalid or not an object. */
function parseJsonObject(text, source, maxLength = MAX_ATTRIBUTE_LENGTH) {
    if (text === null) {
        return null;
    }
    if (text.length > maxLength) {
        warnLeftOut$1(`${source} is longer than ${maxLength} characters`);
        return null;
    }
    const parsed = attempt(() => JSON.parse(text), undefined);
    if (!isRecord(parsed)) {
        warnLeftOut$1(`${source} is not a JSON object`);
        return null;
    }
    const safe = jsonSafe(parsed, REGION_DEPTH);
    return isRecord(safe) ? safe : null;
}
/** Elements carrying view metadata: each root and its ancestors, outermost first. */
function viewMetadataHosts(roots) {
    const hosts = [];
    for (const root of roots) {
        const chain = [];
        for (let element = root; element; element = parentAcrossShadow(element)) {
            const annotated = element.hasAttribute(CLR_AI_METADATA_ATTRIBUTE) || element.hasAttribute(CLR_AI_METADATA_URL_ATTRIBUTE);
            if (annotated && !hosts.includes(element)) {
                chain.unshift(element);
            }
        }
        hosts.push(...chain);
    }
    return hosts;
}
function hasAnnotation(element) {
    return ANNOTATION_ATTRIBUTES.some(attribute => element.hasAttribute(attribute));
}
/** The context the annotation attributes give the element; `data-ai-metadata` only when `withMetadata`. */
function annotationContext(element, withMetadata) {
    const label = element.getAttribute(CLR_CONTEXT_LABEL_ATTRIBUTE);
    const type = element.getAttribute(CLR_CONTEXT_TYPE_ATTRIBUTE);
    const state = parseJsonObject(element.getAttribute(CLR_CONTEXT_STATE_ATTRIBUTE), CLR_CONTEXT_STATE_ATTRIBUTE);
    const metadata = withMetadata
        ? parseJsonObject(element.getAttribute(CLR_AI_METADATA_ATTRIBUTE), CLR_AI_METADATA_ATTRIBUTE)
        : null;
    if (!label && !type && !state && !metadata) {
        return null;
    }
    const context = {};
    if (type) {
        context.type = type;
    }
    if (label) {
        context.label = label;
    }
    if (state || metadata) {
        context.state = metadata ? { ...state, metadata } : { ...state };
    }
    return context;
}
function isRecord(value) {
    return !!value && typeof value === 'object' && !Array.isArray(value);
}
function warnLeftOut$1(message) {
    if (isDevMode()) {
        console.warn(`${message} and was left out of the snapshot.`);
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** A metadata file is meant to be small. */
const MAX_FILE_LENGTH = 64 * 1024;
/** Loads the JSON objects behind metadata and configuration URLs, once per URL for the session. */
class ClrContextMetadataLoader {
    constructor() {
        this.document = inject(DOCUMENT);
        this.application = inject(CLR_CONTEXT_APPLICATION, { optional: true });
        this.loaded = new Map();
    }
    /** The JSON object at `url`: `undefined` while it loads, `null` when it could not be loaded. */
    read(url) {
        return this.load(url).value;
    }
    /** Waits for `urls` to load, for at most `timeoutMs`. */
    async settle(urls, timeoutMs) {
        await withTimeout(Promise.all(urls.map(url => this.load(url).done)), timeoutMs);
    }
    load(url) {
        const resolved = attempt(() => new URL(url, this.document.baseURI), null);
        const key = resolved?.href ?? url;
        let entry = this.loaded.get(key);
        if (!entry) {
            const loading = { value: undefined, done: Promise.resolve() };
            loading.done = this.fetch(resolved).then(value => {
                loading.value = value;
            });
            this.loaded.set(key, loading);
            entry = loading;
        }
        return entry;
    }
    async fetch(url) {
        const fetch = this.document.defaultView?.fetch;
        if (!url || !fetch || !this.isAllowed(url)) {
            return null;
        }
        try {
            const response = await fetch.call(this.document.defaultView, url.href, { credentials: 'same-origin' });
            return response.ok ? parseJsonObject(await response.text(), url.href, MAX_FILE_LENGTH) : null;
        }
        catch {
            return null;
        }
    }
    isAllowed(url) {
        const own = this.document.location?.origin;
        return url.origin === own || !!this.application?.metadataOrigins?.includes(url.origin);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextMetadataLoader, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextMetadataLoader, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextMetadataLoader, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * `nodes` and their children, depth first, each charged to `budget` while it lasts; nodes of an
 * `excluded` type are dropped with their children, as are nodes more than `levels` deep. For trees that
 * are not walked: published children and provider regions.
 */
function charged(nodes, budget, excluded = new Set(), levels = Infinity) {
    if (levels <= 0) {
        if (nodes.length) {
            budget.truncated = true;
        }
        return [];
    }
    const kept = [];
    for (const node of nodes) {
        if (excluded.has(node.type)) {
            continue;
        }
        if (budget.remaining <= 0) {
            budget.truncated = true;
            break;
        }
        budget.remaining--;
        kept.push(node.children ? { ...node, children: charged(node.children, budget, excluded, levels - 1) } : node);
    }
    return kept;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * The element's explicit or implicit ARIA role, or `null`. As for AT, the first recognised token of `role` counts,
 * in any case; markup with none falls back to the implicit role, so it cannot invent types.
 */
function resolveRole(element) {
    const explicit = element.getAttribute('role')?.toLowerCase().split(/\s+/).find(isAriaRole);
    if (explicit && (TEXT_ENTRY_ROLES.has(explicit) || !isContentEditable(element))) {
        return explicit;
    }
    return implicitRole(element);
}
function isAriaRole(token) {
    return ARIA_ROLES.has(token) || /^(doc|graphics)-[a-z]{1,24}$/.test(token);
}
function isLeafRole(role) {
    return LEAF_ROLES.has(role);
}
function isNameFromContents(role) {
    return NAME_FROM_CONTENTS.has(role);
}
function mayContainControls(role) {
    return CONTENT_LEAF_ROLES.has(role);
}
function isPresentationalRole(role) {
    return PRESENTATIONAL_ROLES.has(role);
}
/** Selector for every element that may resolve to one of `roles`, or `''` for none. */
function roleCandidateSelector(roles) {
    if (!roles.size) {
        return '';
    }
    const selectors = new Set(['[role]']);
    for (const [tagName, role] of Object.entries(IMPLICIT_ROLES_BY_TAG)) {
        if (roles.has(role)) {
            selectors.add(tagName);
        }
    }
    const anyOf = (...candidates) => candidates.some(role => roles.has(role));
    if (anyOf('textbox')) {
        selectors.add('[contenteditable]');
    }
    if (anyOf(...Object.values(INPUT_ROLES_BY_TYPE))) {
        selectors.add('input');
    }
    if (anyOf('combobox', 'listbox')) {
        selectors.add('select');
    }
    if (anyOf('combobox')) {
        selectors.add('input[list]');
    }
    if (anyOf('link')) {
        selectors.add('a[href]').add('area[href]');
    }
    if (anyOf('img', 'presentation')) {
        selectors.add('img');
    }
    if (anyOf('columnheader', 'rowheader')) {
        selectors.add('th');
    }
    if (anyOf('banner')) {
        selectors.add('header');
    }
    if (anyOf('contentinfo')) {
        selectors.add('footer');
    }
    return Array.from(selectors).join(', ');
}
function implicitRole(element) {
    const tagName = element.tagName.toLowerCase();
    // An editing host holds user input, so it is a text field whatever element it is drawn on.
    if (isContentEditable(element)) {
        return 'textbox';
    }
    switch (tagName) {
        case 'input':
            return inputRole(element);
        case 'select':
            return element.multiple || element.size > 1
                ? 'listbox'
                : 'combobox';
        case 'a':
        case 'area':
            return element.hasAttribute('href') ? 'link' : null;
        case 'img':
            // `alt=""` marks the image decorative.
            return element.getAttribute('alt') === '' ? 'presentation' : 'img';
        case 'section':
        case 'aside':
            // An unnamed section is not a region, or every wrapper would surface as one.
            return tagName === 'aside' || hasNameAttribute(element)
                ? (ownEntry(IMPLICIT_ROLES_BY_TAG, tagName) ?? null)
                : null;
        case 'th': {
            const scope = element.getAttribute('scope')?.toLowerCase() ?? '';
            return ROW_HEADER_SCOPES.includes(scope) ? 'rowheader' : 'columnheader';
        }
        case 'header':
            return closestAncestor(element, SECTIONING_SELECTOR) ? null : 'banner';
        case 'footer':
            return closestAncestor(element, SECTIONING_SELECTOR) ? null : 'contentinfo';
        default:
            return ownEntry(IMPLICIT_ROLES_BY_TAG, tagName) ?? null;
    }
}
function inputRole(input) {
    const type = (input.getAttribute('type') || 'text').toLowerCase();
    if (ROLELESS_INPUT_TYPES.has(type)) {
        return null;
    }
    if (input.hasAttribute('list') && SUGGESTING_INPUT_TYPES.has(type)) {
        return 'combobox';
    }
    // Date and time inputs have no agreed ARIA role; they behave as a textbox.
    return ownEntry(INPUT_ROLES_BY_TYPE, type) ?? 'textbox';
}
/** Narrower than the full name computation, which depends on the role and would be circular. */
function hasNameAttribute(element) {
    return (!!element.getAttribute('aria-label')?.trim() ||
        !!element.getAttribute('aria-labelledby')?.trim() ||
        !!element.getAttribute('title')?.trim());
}
/** The nearest ancestor in the rendered tree matching `selector`, so a component's own markup sits in its page. */
function closestAncestor(element, selector) {
    const parent = parentAcrossShadow(element);
    return parent ? closestAcrossShadow(parent, selector) : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * The element's accessible name, budgeted: a pragmatic subset of the ARIA name computation.
 * Only roles named from contents use their own text, so a region does not take the page's prose.
 */
function accessibleName(element, role, maxTextLength, withheld = '') {
    const referenced = referencedText(element, 'aria-labelledby', withheld);
    if (referenced) {
        return truncate(referenced, maxTextLength);
    }
    const label = element.getAttribute('aria-label');
    if (label?.trim()) {
        return truncate(label, maxTextLength);
    }
    const native = nativeName(element, withheld);
    if (native?.trim()) {
        return truncate(native, maxTextLength);
    }
    // Content names before `title`, as in HTML-AAM; the walk then reports a differing title as a description.
    if (role && isNameFromContents(role)) {
        const unread = MESSAGE_ROLES.has(role)
            ? withheld
                ? `${withheld}, ${ACTION_SELECTOR}`
                : ACTION_SELECTOR
            : withheld;
        const text = truncate(accessibleText(element, undefined, unread), maxTextLength);
        if (text) {
            return text;
        }
    }
    const title = element.getAttribute('title');
    if (title?.trim()) {
        return truncate(title, maxTextLength);
    }
    if (inputType(element) === 'image') {
        return 'Submit';
    }
    const placeholder = element.getAttribute('aria-placeholder') || element.getAttribute('placeholder');
    if (placeholder?.trim()) {
        return truncate(placeholder, maxTextLength);
    }
    return '';
}
function nativeName(element, withheld) {
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'img' || tagName === 'area') {
        return element.getAttribute('alt');
    }
    if (tagName === 'fieldset') {
        return scopedText(element, 'legend', withheld);
    }
    if (tagName === 'table') {
        return scopedText(element, 'caption', withheld);
    }
    if (tagName === 'figure') {
        return scopedText(element, 'figcaption', withheld);
    }
    if (LABELABLE_TAGS.has(tagName)) {
        return labelText(element, withheld) || inputCaption(element);
    }
    return null;
}
function inputType(element) {
    return element.tagName.toLowerCase() === 'input' ? element.type : null;
}
/** The caption an input button shows; any other input's value is user input, never its name. */
function inputCaption(element) {
    const type = inputType(element);
    const value = element.getAttribute('value');
    switch (type) {
        case 'submit':
            return value ?? 'Submit';
        case 'reset':
            return value ?? 'Reset';
        case 'button':
            return value;
        case 'image':
            return element.getAttribute('alt')?.trim() ? element.getAttribute('alt') : value;
        default:
            return null;
    }
}
function scopedText(element, selector, withheld) {
    const child = element.querySelector(`:scope > ${selector}`);
    return child && readableNameSource(child, element, withheld) ? accessibleText(child, undefined, withheld) : null;
}
/** Whether a label, legend or caption may name `named`: not when hidden, unreadable, or itself redacted. */
function readableNameSource(source, named, withheld) {
    return (!isHiddenFromContext(source, withheld) &&
        !source.closest(CLR_CONTEXT_EDITING_HOST_SELECTOR) &&
        // Like the control it names, a transparent label is still read by assistive technology.
        !isUnrendered(source, false) &&
        !source.matches(CLR_CONTEXT_REDACT_SELECTOR) &&
        !isRedactedWithin(source, named));
}
function labelText(control, withheld) {
    const label = labelOf$1(control);
    if (!label || !readableNameSource(label, control, withheld)) {
        return null;
    }
    return accessibleText(label, control, withheld);
}
/** `labels` searches the document on every read, which makes a walk quadratic; the walk maps labels once. */
function labelOf$1(control) {
    if (!('labels' in control) || !control.labels) {
        return control.closest('label');
    }
    const scope = readScope();
    if (!scope) {
        return control.labels?.[0] ?? null;
    }
    const root = idScope(control);
    let labels = scope.labels.get(root);
    if (!labels) {
        labels = new Map();
        for (const label of Array.from(root.querySelectorAll('label'))) {
            const labelled = label.control;
            if (labelled && !labels.has(labelled)) {
                labels.set(labelled, label);
            }
        }
        scope.labels.set(root, labels);
    }
    return labels.get(control) ?? null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Reads an element's published context. A callback that throws counts as nothing, with a dev-mode warning. */
function readClrElementContext(element, options) {
    const callback = element[CLR_ELEMENT_CONTEXT_PROPERTY];
    if (typeof callback !== 'function') {
        return null;
    }
    try {
        const published = callback(options);
        return published && typeof published === 'object' ? published : null;
    }
    catch (error) {
        warnLeftOut(element, error);
        return null;
    }
}
function warnLeftOut(element, error) {
    if (isDevMode()) {
        console.warn(`The context <${element.tagName.toLowerCase()}> published could not be read and was left out of the snapshot.`, error);
    }
}
/**
 * Merges the context from an element's annotation attributes, then its published context, over the
 * DOM-extracted one; published values win. For an `untrusted` caller, only the state keys the published
 * context marks public are merged.
 */
function mergeElementContext(base, element, options, annotation = null, untrusted = false) {
    const published = readClrElementContext(element, options);
    const source = annotation && published
        ? { ...annotation, ...published, state: { ...annotation.state, ...published.state } }
        : (published ?? annotation);
    if (!source) {
        return base;
    }
    let own;
    try {
        own = publishedParts(source, options, untrusted, PUBLISHED_DEPTH);
    }
    catch (error) {
        warnLeftOut(element, error);
        return base;
    }
    const merged = { ...base, state: { ...base.state, ...own.state } };
    if (own.type) {
        merged.type = own.type;
    }
    if (own.element) {
        merged.element = own.element;
    }
    if (own.label !== undefined) {
        merged.label = own.label;
    }
    if (own.children) {
        merged.children = own.children;
    }
    return merged;
}
const PUBLISHED_DEPTH = 4;
/**
 * A node as application code published it, reduced to plain, budgeted, serialisable data.
 * Anything else is dropped, including a `ref`, which only the walk hands out.
 */
function publishedNode(value, options, untrusted = false, depth = PUBLISHED_DEPTH) {
    let parts;
    try {
        parts = publishedParts(value, options, untrusted, depth);
    }
    catch {
        return null;
    }
    if (!parts.type) {
        return null;
    }
    const node = { type: parts.type };
    if (parts.element) {
        node.element = parts.element;
    }
    if (parts.label !== undefined) {
        node.label = parts.label;
    }
    if (parts.state && Object.keys(parts.state).length) {
        node.state = parts.state;
    }
    if (parts.children) {
        node.children = parts.children;
    }
    return node;
}
function publishedParts(value, options, untrusted, depth) {
    if (!value || typeof value !== 'object') {
        return {};
    }
    const source = value;
    const ownState = {};
    const parts = { state: ownState };
    if (typeof source['type'] === 'string' && source['type']) {
        parts.type = truncate(source['type'], MAX_TYPE_LENGTH);
    }
    if (typeof source['element'] === 'string' && source['element']) {
        parts.element = truncate(source['element'], MAX_TYPE_LENGTH);
    }
    if (typeof source['label'] === 'string') {
        parts.label = truncate(source['label'], options.maxTextLength);
    }
    const state = source['state'];
    if (state && typeof state === 'object' && !Array.isArray(state)) {
        const shared = untrusted ? publicState(source, state) : state;
        for (const [key, entry] of Object.entries(shared)) {
            const safe = jsonSafe(entry, STATE_DEPTH, true, options);
            if (safe !== undefined) {
                defineOwn(ownState, key, safe);
            }
        }
    }
    if (depth > 0 && Array.isArray(source['children'])) {
        // Published children are not walked, so the collection budget bounds them instead.
        parts.children = source['children']
            .slice(0, options.maxItemsPerCollection)
            .map(child => publishedNode(child, options, untrusted, depth - 1))
            .filter((child) => child !== null);
    }
    return parts;
}
const MAX_TYPE_LENGTH = 64;

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function readElementMutator(element) {
    const mutator = element[CLR_ELEMENT_MUTATOR_PROPERTY];
    return mutator && typeof mutator === 'object' ? mutator : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
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
/** The summary for this element's role, or `null` when there is none and the element should be walked. */
function summarizeRole(element, role, options, withheld = '') {
    const summarizer = role ? ownEntry(ROLE_SUMMARIZERS, role) : undefined;
    if (!summarizer) {
        return null;
    }
    const state = summarizer(element, { options, withheld });
    return Object.keys(state).length ? state : null;
}
function summarizeGrid(element, scope) {
    const state = {};
    // A header cell in a row that also holds data names that row, not a column.
    const headers = queryRole(element, 'columnheader', scope).filter(header => !header.closest('tr, [role="row"]')?.querySelector(CELL_SELECTOR));
    const columns = namesOf(headers, element, scope);
    if (columns.length) {
        state.columns = columns;
    }
    // A paginated grid holds one page, so its declared count is the honest total;
    // `aria-rowcount="-1"` or no attribute falls back to counting rendered rows.
    const rows = queryRole(element, 'row', scope);
    const declared = element.getAttribute('aria-rowcount');
    const total = declared === null ? Number.NaN : Number(declared);
    state.rowCount = Number.isFinite(total) && total >= 0 ? total : dataRows(rows).length;
    const selected = rows.filter(row => row.getAttribute('aria-selected') === 'true').length;
    if (selected) {
        state.selectedRows = selected;
    }
    const sorted = headers.find(header => ariaEnumValue(header, 'aria-sort') !== null);
    const sortedBy = sorted ? nameOf(sorted, element, scope) : null;
    if (sorted && sortedBy !== null) {
        state.sort = { column: sortedBy, direction: ariaEnumValue(sorted, 'aria-sort') };
    }
    return state;
}
function listsItems(options) {
    return options.collectionItems !== 'summary';
}
function counted(entries, countKey, listKey, collection, scope) {
    const state = { [countKey]: entries.length };
    if (listsItems(scope.options)) {
        state[listKey] = namesOf(entries, collection, scope);
    }
    return state;
}
function summarizeTablist(element, scope) {
    const tabs = queryRole(element, 'tab', scope);
    if (!tabs.length) {
        return {};
    }
    const state = counted(tabs, 'tabCount', 'tabs', element, scope);
    // The active tab may be past the budget, so it is looked for among all tabs.
    const active = tabs.find(tab => tab.getAttribute('aria-selected') === 'true');
    const activeName = active ? nameOf(active, element, scope) : null;
    if (activeName !== null) {
        state.activeTab = activeName;
    }
    return state;
}
/** A list is still walked after its summary: its links are the point of it. */
function summarizeList(element, scope) {
    const items = queryRole(element, 'listitem', scope);
    if (!items.length) {
        return {};
    }
    return counted(items, 'itemCount', 'items', element, scope);
}
/** `combobox` is a leaf role, so its choices are only reachable here; they are authored markup, not user input. */
function summarizeCombobox(element, scope) {
    const choices = comboboxChoices(element, scope);
    if (!choices.length) {
        return {};
    }
    if (!listsItems(scope.options)) {
        return { optionCount: choices.length };
    }
    return { options: namesOf(choices, element, scope) };
}
function comboboxChoices(element, scope) {
    const own = queryRole(element, 'option', scope);
    if (own.length) {
        return own;
    }
    const root = idScope(element);
    const listId = element.getAttribute('list');
    if (listId) {
        const datalist = root.getElementById(listId);
        if (datalist) {
            return Array.from(datalist.querySelectorAll('option')).filter(option => !isHiddenFromContext(option, scope.withheld));
        }
    }
    const ownedIds = [...getAriaReferenceIds(element, 'aria-owns'), ...getAriaReferenceIds(element, 'aria-controls')];
    for (const id of ownedIds) {
        const owned = root.getElementById(id);
        const listed = owned ? queryRole(owned, 'option', scope) : [];
        if (listed.length) {
            return listed;
        }
    }
    return [];
}
function summarizeOptions(element, scope) {
    return summarizeChoices(element, queryRole(element, 'option', scope), isSelectedOption, scope);
}
/** Menu items are not options, so a menu needs its own summarizer. */
function summarizeMenu(element, scope) {
    return summarizeChoices(element, queryRole(element, 'menuitem', scope), item => item.getAttribute('aria-checked') === 'true', scope);
}
function summarizeChoices(collection, entries, isSelected, scope) {
    if (!entries.length) {
        return {};
    }
    const state = counted(entries, 'optionCount', 'options', collection, scope);
    const selected = namesOf(entries.filter(isSelected), collection, scope);
    if (selected.length) {
        state.selected = selected;
    }
    const disabled = namesOf(entries.filter(entry => entry.getAttribute('aria-disabled') === 'true' || entry.disabled), collection, scope);
    if (disabled.length && listsItems(scope.options)) {
        state.disabledOptions = disabled;
    }
    return state;
}
/** The browser never sets `aria-selected` on a native `<option>`. */
function isSelectedOption(entry) {
    if (entry.tagName.toLowerCase() === 'option') {
        return entry.selected;
    }
    return entry.getAttribute('aria-selected') === 'true';
}
function summarizeRadiogroup(element, scope) {
    const radios = queryRole(element, 'radio', scope);
    if (!radios.length) {
        return {};
    }
    const state = counted(radios, 'optionCount', 'options', element, scope);
    const chosen = radios.find(radio => radio.checked || radio.getAttribute('aria-checked') === 'true');
    const value = chosen ? nameOf(chosen, element, scope) : null;
    if (value !== null) {
        state.value = value;
    }
    return state;
}
/** Rows carrying data; a column-header row is not a record. */
function dataRows(rows) {
    return rows.filter(row => !row.querySelector(ITEM_SELECTORS.columnheader) || row.querySelector(CELL_SELECTOR));
}
function queryRole(element, role, scope) {
    // Items of an excluded role are left out of the summary as the walk leaves them out.
    if (scope.options.excludeRoles.includes(role)) {
        return [];
    }
    const container = ITEM_CONTAINER_SELECTORS[role];
    const judgesStyle = STYLE_JUDGED_ROLES.has(role);
    return queryRendered(element, ITEM_SELECTORS[role]).filter(item => !isHiddenFromContext(item, scope.withheld) &&
        (!container || closestContainer(item, container) === element) &&
        (!judgesStyle || isVisible(item)));
}
/** Roles hidden by a style are left out too; rows are not checked, to avoid a layout read per record. */
const STYLE_JUDGED_ROLES = new Set(['columnheader', 'tab', 'listitem', 'menuitem']);
/** `null` for an item in a redacted region inside the collection: it still counts, but its name is withheld. */
function nameOf(item, collection, scope) {
    if (isRedactedWithin(item, collection)) {
        return null;
    }
    return accessibleName(item, resolveRole(item), scope.options.maxTextLength, scope.withheld);
}
function namesOf(items, collection, scope) {
    return items
        .slice(0, scope.options.maxItemsPerCollection)
        .map(item => nameOf(item, collection, scope))
        .filter((name) => name !== null);
}
function closestContainer(item, container) {
    const parent = parentAcrossShadow(item);
    return parent ? closestAcrossShadow(parent, container) : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
function stripQueryAndFragment(url) {
    return url.split(/[?#]/)[0];
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Caps the elements one walk reads, so a page of empty wrappers is not read end to end. */
const MAX_ELEMENTS_VISITED = 25_000;
function collectContextTreeWithin(root, options, extractors = [], refs = null, untrusted = false) {
    const excludeRoles = new Set(options.excludeRoles);
    const walk = {
        options,
        untrusted,
        extractors: extractors.filter(extractor => usableSelectors(root, [extractor.selector])),
        excludeRoles,
        excludeRoleCandidates: roleCandidateSelector(excludeRoles),
        excludeSelector: usableSelectors(root, options.excludeSelectors),
        referencedIds: new Map(),
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
        viewRoots: [],
    };
    return withinReadScope(() => {
        const rootScope = root.nodeType === Node.ELEMENT_NODE ? idScope(root) : root;
        walk.referencedIds.set(rootScope, collectReferencedIds(root, walk));
        const scope = engineScope(root, walk.options);
        walk.viewRoots = scope.roots ?? topOf(root);
        const components = describeScope(root, scope.roots, walk);
        const result = { components, truncated: walk.truncated };
        if (scope.focus) {
            result.focus = scope.focus;
        }
        return result;
    });
}
/** Whether the walk would leave this element out, judged from the element and its ancestry. */
function isHiddenFromEngine(element, excludeSelector = '') {
    return !element.isConnected || isHiddenFromContext(element, excludeSelector) || !isVisible(element);
}
/**
 * Whether a snapshot with these options leaves the element out on purpose (excluded selector or role,
 * or outside the roots), so the mutation engine never writes what such a snapshot would not show.
 */
function isOutsideSnapshot(element, options) {
    const excludeSelector = usableSelectors(element.ownerDocument, options.excludeSelectors);
    // Along the rendered tree, so an excluded shadow host keeps what it renders out of reach too.
    if (excludeSelector && closestAcrossShadow(element, excludeSelector)) {
        return true;
    }
    if (options.excludeRoles.length) {
        const excludeRoles = new Set(options.excludeRoles);
        const excluding = { excludeRoles, excludeRoleCandidates: roleCandidateSelector(excludeRoles), excludeSelector };
        if (hasExcludedRole(element, excludeRoles) || holdsExcludedRole(element, excluding, true)) {
            return true;
        }
    }
    if (options.rootSelector) {
        const { roots } = engineScope(element.ownerDocument, { ...options, focus: 'page' });
        if (roots && !roots.some(root => containsAcrossShadow(root, element))) {
            return true;
        }
    }
    return false;
}
/** The whole page, the `rootSelector` roots, or with modal focus the topmost open dialog inside them. */
function engineScope(root, options) {
    const excludeSelector = usableSelectors(root, options.excludeSelectors);
    const excludedRoles = new Set(options.excludeRoles);
    const roots = options.rootSelector ? selectedRoots(root, options.rootSelector, excludeSelector, excludedRoles) : null;
    if (options.focus === 'modal') {
        const dialogs = openModalDialogs(root, excludeSelector).filter(dialog => !hasExcludedRole(dialog, excludedRoles) && (!roots || roots.some(scope => containsAcrossShadow(scope, dialog))));
        if (dialogs.length) {
            return { roots: [modalRoot(dialogs[dialogs.length - 1], roots, excludeSelector)], focus: 'modal' };
        }
    }
    return { roots };
}
/** A selector the document rejects matches nothing; it must not widen the snapshot to the whole page. */
function selectedRoots(root, rootSelector, excludeSelector, excludedRoles) {
    const selector = usableSelectors(root, [rootSelector]);
    const roots = selector ? queryRendered(root, selector) : [];
    // What keeps a region from the engine holds however the walk is pointed at it.
    return roots.filter(element => !isHiddenFromEngine(element, excludeSelector) &&
        !hasExcludedRole(element, excludedRoles) &&
        !roots.some(other => other !== element && containsAcrossShadow(other, element)));
}
function hasExcludedRole(element, excludedRoles) {
    if (!excludedRoles.size) {
        return false;
    }
    for (let current = element; current; current = parentAcrossShadow(current)) {
        const role = resolveRole(current);
        if (role && excludedRoles.has(role)) {
            return true;
        }
    }
    return false;
}
/** The dialog, or the anonymous custom element (e.g. a wizard) that renders nothing but it. */
function modalRoot(dialog, roots, excludeSelector) {
    let root = dialog;
    const body = dialog.ownerDocument.body;
    for (let part = dialog, parent = parentAcrossShadow(dialog); parent && parent !== body; parent = parentAcrossShadow(parent)) {
        if (roots && !roots.some(scope => containsAcrossShadow(scope, parent))) {
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
function rendersOnly(parent, part, excludeSelector) {
    return renderedChildNodes(parent).every(node => {
        if (node === part) {
            return true;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return !MEANINGFUL_TEXT.test(node.textContent ?? '');
        }
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return true;
        }
        const element = node;
        if (SKIPPED_TAGS.has(element.tagName.toLowerCase()) || isHiddenFromEngine(element, excludeSelector)) {
            return true;
        }
        if (CLR_ELEMENT_CONTEXT_PROPERTY in element ||
            hasAnnotation(element) ||
            element.matches(DESCRIBABLE_SELECTOR) ||
            hasRendered(element, DESCRIBABLE_SELECTOR)) {
            return false;
        }
        // A screen reader's "end of dialog" marker is not content.
        return !MEANINGFUL_TEXT.test(element.textContent ?? '') || isVisuallyHidden(element);
    });
}
function openModalDialogs(root, excludeSelector = '') {
    return Array.from(modalDialogs(root)).filter(dialog => !isHiddenFromEngine(dialog, excludeSelector));
}
function modalDialogs(root) {
    try {
        return queryRendered(root, MODAL_SELECTOR);
    }
    catch {
        return queryRendered(root, LEGACY_MODAL_SELECTOR);
    }
}
/** Checks each root's ancestry for redaction, which a walk starting at the root cannot see. */
function describeScope(root, roots, walk) {
    if (!roots) {
        return withinRedactedAncestry(root, walk, () => describeChildren(root, walk, null));
    }
    const nodes = [];
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
function noteUndescribed(element, walk, owner, pastDepth = false) {
    if (walk.probing || walk.truncated) {
        return;
    }
    const options = pastDepth ? { ...walk.options, maxDepth: 0 } : walk.options;
    const probe = { ...walk, options, remaining: 1, truncated: false, probing: true };
    if (describeElement(element, probe, owner).length) {
        walk.truncated = true;
    }
}
function withinRedactedAncestry(node, walk, describe) {
    // A walk started at a shadow root continues past it to its host's ancestry.
    const ancestor = node.nodeType === Node.ELEMENT_NODE ? parentAcrossShadow(node) : (node.host ?? null);
    const redacted = !!ancestor && !!closestAcrossShadow(ancestor, CLR_CONTEXT_REDACT_SELECTOR);
    return within(walk, redacted ? ['redactedDepth'] : [], describe);
}
function within(walk, counters, describe) {
    for (const counter of counters) {
        walk[counter]++;
    }
    try {
        return describe();
    }
    finally {
        for (const counter of counters) {
            walk[counter]--;
        }
    }
}
/** Notes a component that owns what it renders, so nothing inside is offered for writing on its own. */
function withinComponent(element, walk, describe) {
    return within(walk, ownsContents(element) ? ['mutatorDepth'] : [], describe);
}
/**
 * `aria-describedby` targets are reported as their control's description, not again on their own;
 * `aria-labelledby` targets are still described, but not as free-standing text.
 */
function collectReferencedIds(root, walk) {
    const ids = { describedBy: new Set(), labels: new Set() };
    const collect = (attribute, into, reports) => {
        for (const element of Array.from(root.querySelectorAll(`[${attribute}]`))) {
            if (isHiddenFromEngine(element, walk.excludeSelector) || !reports(element)) {
                continue;
            }
            for (const id of getAriaReferenceIds(element, attribute)) {
                into.add(id);
            }
        }
    };
    const describes = (element) => !!resolveRole(element) || isCustomElementTag(element);
    collect('aria-describedby', ids.describedBy, describes);
    collect('aria-errormessage', ids.describedBy, element => describes(element) && ariaEnumValue(element, 'aria-invalid') !== null);
    collect('aria-labelledby', ids.labels, () => true);
    return ids;
}
/** Ids are scoped to a document or shadow root, so each gets its own sets, collected when first reached. */
function referencedIds(element, walk) {
    const scope = idScope(element);
    let ids = walk.referencedIds.get(scope);
    if (!ids) {
        ids = collectReferencedIds(scope, walk);
        walk.referencedIds.set(scope, ids);
    }
    return ids;
}
function isDescription(element, walk) {
    return !!element.id && referencedIds(element, walk).describedBy.has(element.id);
}
function isLabel(element, walk) {
    return !!element.id && referencedIds(element, walk).labels.has(element.id);
}
function isCustomElementTag(element) {
    return element.tagName.includes('-');
}
/**
 * `owner` is the nearest role-less custom element above; it becomes the `element` of the
 * next role-bearing node, so `<div role="grid">` reports itself as rendered by `clr-datagrid`.
 */
function describeElement(element, walk, owner) {
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
    const counters = ['elementDepth'];
    if (element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE)) {
        counters.push('redactedDepth');
    }
    if (isDescription(element, walk)) {
        counters.push('textDepth');
    }
    return within(walk, counters, () => describeVisible(element, walk, owner));
}
function describeVisible(element, walk, owner) {
    // An excluded role is left out before an extractor could describe the element as something else.
    const role = resolveRole(element);
    if (role && walk.excludeRoles.has(role)) {
        return [];
    }
    // Like published context, an extractor's state is not read inside a redacted region.
    const extractor = walk.redactedDepth > 0 ? undefined : walk.extractors.find(candidate => element.matches(candidate.selector));
    if (extractor) {
        const extracted = attempt(() => extractor.extract(element, walk.options), null);
        // Only the walk hands out refs: an extractor's node cannot claim another node's.
        const described = extracted ? publishedNode(extracted, walk.options, walk.untrusted) : null;
        if (!described) {
            return describeChildren(element, walk, owner);
        }
        if (walk.remaining <= 0) {
            return [];
        }
        walk.remaining--;
        return listOf$1(finish(described, element, walk, { foreign: true }));
    }
    const tagName = element.tagName.toLowerCase();
    if (tagName === 'iframe' || tagName === 'frame') {
        return describeFrame(element, walk);
    }
    if (role && isPresentationalRole(role)) {
        return describeChildren(element, walk, owner);
    }
    // A summarised list's item with nothing to act on adds no node, so a huge list costs only its controls.
    if (role === 'listitem' &&
        walk.summarizedListDepth > 0 &&
        !(CLR_ELEMENT_CONTEXT_PROPERTY in element) &&
        !hasAnnotation(element) &&
        !Array.from(element.attributes).some(attribute => attribute.name.startsWith('aria-')) &&
        !hasRendered(element, CONTROL_SELECTOR)) {
        return [];
    }
    const isCustomElement = isCustomElementTag(element);
    // In a redacted region only an author-given name is used: a name from content is that content.
    const redacted = walk.redactedDepth > 0;
    const label = nameSafely(element, redacted ? null : role, walk);
    if (!role && !label && !annotationOf(element, walk)) {
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
    const fallbackLabel = !role && !label && isCustomElement && !redacted
        ? truncate(accessibleText(element, undefined, walk.excludeSelector, child => isExcludedRole(child, walk)), walk.options.maxTextLength)
        : label;
    const node = { type: role ?? 'group' };
    const attribution = isCustomElement ? tagName : owner?.tagName.toLowerCase();
    if (attribution) {
        node.element = attribution;
    }
    if (fallbackLabel) {
        node.label = fallbackLabel;
    }
    // Summarising collections keeps a ten-thousand-row grid from producing ten thousand nodes.
    const summary = attempt(() => summarizeRole(element, role, walk.options, walk.excludeSelector), null);
    const state = { ...ariaState(element, walk.options, redacted, walk.excludeSelector), ...summary };
    const title = element.getAttribute('title')?.trim();
    if (title && !redacted && !state['description'] && title !== label) {
        state['description'] = truncate(title, walk.options.maxTextLength);
    }
    if (Object.keys(state).length) {
        node.state = state;
    }
    // Leaf widgets and summarised collections are not descended into; a summarised list still is, for its links.
    const summarised = summary !== null;
    const summarisedList = summarised && role === 'list';
    const terminal = !!role && ((isLeafRole(role) && !mayContainControls(role)) || (summarised && !summarisedList));
    if (!terminal) {
        const counters = [];
        if (summarisedList) {
            counters.push('summarizedListDepth');
        }
        if (role && isNameFromContents(role)) {
            counters.push('textDepth');
        }
        const looseText = (role && WRITABLE_ROLES.has(role)) || (!role && !label) ? undefined : { label };
        const children = within(walk, counters, () => withinComponent(element, walk, () => describeNested(element, walk, null, looseText)));
        if (children.length) {
            node.children = children;
        }
    }
    else if (summarised) {
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
function describeAnonymousCustomElement(element, tagName, walk) {
    const rendered = withinComponent(element, walk, () => describeChildren(element, walk, element));
    const published = !rendered.length || !holdsExcludedRole(element, walk, true);
    if (rendered.length === 1) {
        const only = rendered[0];
        if (only.type === 'text' && !only.children && !only.state) {
            return listOf$1(finish({ type: 'group', element: tagName, label: only.label }, element, walk, { published }));
        }
        return listOf$1(finish(only, element, walk, { published }));
    }
    if (rendered.length > 1) {
        // A wrapper adds a level, so the parts are returned as they are when that level would pass `maxDepth`.
        const { maxDepth } = walk.options;
        if (walk.remaining <= 0 || (maxDepth > 0 && walk.depth + 1 + treeDepth(rendered) > maxDepth)) {
            return rendered;
        }
        walk.remaining--;
        const wrapper = { type: 'group', element: tagName, children: rendered };
        // A component written to as one thing is named by the control it renders, as an agent would refer to it.
        if (ownsContents(element)) {
            const named = rendered.find(part => part.label && WRITABLE_ROLES.has(part.type));
            if (named) {
                wrapper.label = named.label;
            }
            const finished = finish(wrapper, element, walk, { published });
            return listOf$1(finished && foldRenderedControl(finished, walk));
        }
        return listOf$1(finish(wrapper, element, walk, { published }));
    }
    if (holdsExcludedRole(element, walk)) {
        return [];
    }
    if (!readClrElementContext(element, walk.options) &&
        !annotationOf(element, walk) &&
        !accessibleText(element, undefined, walk.excludeSelector).trim()) {
        return [];
    }
    return null;
}
function treeDepth(nodes) {
    return nodes.reduce((deepest, node) => Math.max(deepest, 1 + treeDepth(node.children ?? [])), 0);
}
/** Application controls in a summarised collection's cells, which the summary does not cover. */
function describeCellControls(collection, walk) {
    if (walk.options.collectionItems === 'summary') {
        return [];
    }
    // Hidden, inert, ignored or excluded cells are skipped, as the walk would skip them.
    const cells = new Map();
    for (const control of queryRendered(collection, VALUE_CONTROL_SELECTOR)) {
        const role = resolveRole(control);
        const cell = role && WRITABLE_ROLES.has(role) ? closestAcrossShadow(control, CELL_SELECTOR) : null;
        if (!cell || cells.has(cell) || !containsAcrossShadow(collection, cell)) {
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
        cells.set(cell, path.some(element => element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE)));
    }
    const nodes = [];
    for (const [cell, redacted] of cells) {
        const counters = redacted ? ['textDepth', 'redactedDepth'] : ['textDepth'];
        nodes.push(...within(walk, counters, () => describeNested(cell, walk, null)));
    }
    return nodes;
}
function ancestryUntil(element, boundary) {
    const path = [];
    for (let current = element; current && current !== boundary; current = parentAcrossShadow(current)) {
        path.push(current);
    }
    return path;
}
function isTextBlock(element, walk) {
    if (!walk.options.includeText || walk.textDepth > 0 || walk.redactedDepth > 0) {
        return false;
    }
    if (NAMING_TAGS.has(element.tagName.toLowerCase()) || isLabel(element, walk)) {
        return false;
    }
    const hasOwnText = renderedChildNodes(element).some(node => node.nodeType === Node.TEXT_NODE && !!node.textContent?.trim());
    return hasOwnText && !isVisuallyHidden(element);
}
function describeTextBlock(element, walk, owner) {
    if (walk.remaining <= 0) {
        return [];
    }
    walk.remaining--;
    const node = { type: 'text' };
    if (owner) {
        node.element = owner.tagName.toLowerCase();
    }
    const label = truncate(accessibleText(element, undefined, walk.excludeSelector, child => isExcludedRole(child, walk)), walk.options.maxTextLength);
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
    return listOf$1(finish(node, element, walk));
}
function liveSetting(element) {
    const region = closestAcrossShadow(element, '[aria-live]');
    return region && (region === element || !resolveRole(region)) ? ariaEnumValue(region, 'aria-live') : null;
}
/**
 * A same-origin frame is walked in place against the same budget; a cross-origin one is reported
 * as an empty frame so an agent knows there is UI it cannot see.
 */
function describeFrame(frame, walk) {
    if (!walk.options.includeFrames || walk.remaining <= 0) {
        return [];
    }
    walk.remaining--;
    const node = { type: 'frame', element: frame.tagName.toLowerCase() };
    const state = {};
    const contents = attempt(() => frame.contentDocument, null);
    const roots = contents ? [contents.documentElement, contents.body].filter(root => !!root) : [];
    const ignored = roots.some(root => hidesFromContext(root, walk.excludeSelector));
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
    }
    else if (!contents.body) {
        state.loading = true;
    }
    else if (isStillNavigating(frame, contents)) {
        state.loading = true;
    }
    else if (ignored) {
    }
    else if (contents.designMode === 'on' || contents.body.isContentEditable || isContentEditable(contents.body)) {
        // A rich-text editor document is one text field, and its content is a value.
        node.type = 'textbox';
        if (redacted) {
            state.redacted = true;
        }
        else {
            state.value = truncate(accessibleText(contents.body, undefined, walk.excludeSelector), walk.options.maxTextLength);
        }
    }
    else {
        const redactedRoot = redacted && walk.redactedDepth === 0;
        const children = within(walk, redactedRoot ? ['frameDepth', 'redactedDepth'] : ['frameDepth'], () => describeNested(contents.body, walk, null));
        if (children.length) {
            node.children = children;
        }
    }
    if (Object.keys(state).length) {
        node.state = state;
    }
    return listOf$1(finish(node, frame, walk));
}
/** The initial blank document has a body too, so the body alone does not tell. */
function isStillNavigating(frame, contents) {
    const src = frame.getAttribute('src');
    return (contents.location.href === 'about:blank' && !!src && !src.startsWith('about:') && !frame.hasAttribute('srcdoc'));
}
/** A name that cannot be computed truncates the snapshot rather than break it. */
function nameSafely(element, role, walk) {
    const name = attempt(() => accessibleName(element, role, walk.options.maxTextLength, walk.excludeSelector), null);
    if (name === null) {
        walk.truncated = true;
    }
    return name ?? '';
}
function describeNested(parent, walk, owner, looseText) {
    const { maxDepth } = walk.options;
    if (maxDepth > 0 && walk.depth + 1 >= maxDepth) {
        for (const child of renderedChildNodes(parent)) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                noteUndescribed(child, walk, owner, true);
            }
        }
        return [];
    }
    return within(walk, ['depth'], () => describeChildren(parent, walk, owner, looseText));
}
function describeChildren(parent, walk, owner, looseText) {
    const nodes = [];
    const withText = !!looseText && walk.options.includeText && walk.textDepth === 0 && walk.redactedDepth === 0;
    // An open shadow root renders in place of the light DOM, which shows only through its slots.
    const children = renderedChildNodes(parent).filter(node => withText || node.nodeType === Node.ELEMENT_NODE);
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
        if (withText && isPhrasing(child, walk)) {
            text += phrasingText(child, walk);
            continue;
        }
        nodes.push(...describeLooseText(text, looseText, walk));
        text = '';
        if (walk.remaining <= 0) {
            for (const leftover of children.slice(index)) {
                if (leftover.nodeType === Node.ELEMENT_NODE) {
                    noteUndescribed(leftover, walk, owner);
                }
                else if (leftover.nodeType === Node.TEXT_NODE) {
                    describeLooseText(leftover.textContent ?? '', looseText, walk);
                }
            }
            return nodes;
        }
        nodes.push(...describeElement(child, walk, owner));
    }
    nodes.push(...describeLooseText(text, looseText, walk));
    return nodes;
}
function isPhrasing(element, walk) {
    return (PHRASING_TAGS.has(element.tagName.toLowerCase()) &&
        !resolveRole(element) &&
        !element.hasAttribute('title') &&
        !element.hasAttribute('aria-live') &&
        !element.hasAttribute(CLR_CONTEXT_REDACT_ATTRIBUTE) &&
        !(CLR_ELEMENT_CONTEXT_PROPERTY in element) &&
        !hasAnnotation(element) &&
        !isLabel(element, walk) &&
        !element.matches(DESCRIBABLE_SELECTOR) &&
        !hasRendered(element, DESCRIBABLE_SELECTOR) &&
        !walk.extractors.some(extractor => element.matches(extractor.selector)));
}
function phrasingText(element, walk) {
    if (shouldSkipSubtree(element, walk) || isVisuallyHidden(element)) {
        return '';
    }
    return accessibleText(element, undefined, walk.excludeSelector, child => isExcludedRole(child, walk));
}
const MEANINGFUL_TEXT = /[\p{L}\p{N}]/u;
function describeLooseText(text, looseText, walk) {
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
/** Redaction is re-applied after merging published context, so a component cannot reinstate a withheld value. */
function finish(node, element, walk, { foreign = false, published = true } = {}) {
    const redacted = isRedacted(element, walk.redactedDepth > 0);
    // Published context is not merged inside a redacted region: it would carry the component's state straight out.
    let described = node;
    if (published) {
        described = redacted
            ? withoutOverriddenLabel(node, element, walk)
            : mergeElementContext(node, element, walk.options, annotationOf(element, walk), walk.untrusted);
    }
    if (walk.excludeRoles.has(described.type)) {
        walk.remaining++;
        return null;
    }
    // Published children are not walked, so they are charged to the budget here.
    if (described.children && (foreign || described.children !== node.children)) {
        const { maxDepth } = walk.options;
        const levels = maxDepth > 0 ? maxDepth - walk.depth - 1 : Infinity;
        described = { ...described, children: charged(described.children, walk, walk.excludeRoles, levels) };
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
function withoutOverriddenLabel(node, element, walk) {
    // Reading the published label runs the whole callback, so only when there is a label to lose.
    if (node.label === undefined || typeof readClrElementContext(element, walk.options)?.label !== 'string') {
        return node;
    }
    const unnamed = { ...node };
    delete unnamed.label;
    return unnamed;
}
/** The context annotation attributes give the element; view metadata is not the element's own. */
function annotationOf(element, walk) {
    if (!hasAnnotation(element)) {
        return null;
    }
    const isViewLevel = walk.viewRoots.some(root => containsAcrossShadow(element, root));
    return annotationContext(element, !isViewLevel);
}
/** The element a snapshot of the whole of `root` starts from. */
function topOf(root) {
    const top = root.nodeType === Node.DOCUMENT_NODE
        ? (root.body ?? root.documentElement)
        : root;
    return top ? [top] : [];
}
/** Whether a label read from content leaves the element out: only its resolved role counts, not any `role`. */
function isExcludedRole(element, walk) {
    const role = walk.excludeRoles.size ? resolveRole(element) : null;
    return !!role && walk.excludeRoles.has(role);
}
function listOf$1(node) {
    return node ? [node] : [];
}
/**
 * Whether the element holds an excluded role the walk would otherwise show; with `renderedOnly`,
 * only one its own template renders (the grid in `clr-datagrid`).
 */
function holdsExcludedRole(element, walk, renderedOnly = false) {
    if (!walk.excludeRoleCandidates) {
        return false;
    }
    return queryRendered(element, walk.excludeRoleCandidates).some(descendant => {
        const role = resolveRole(descendant);
        return (!!role &&
            walk.excludeRoles.has(role) &&
            !isLeftOutAnyway(descendant, walk.excludeSelector) &&
            (!renderedOnly || isRenderedBy(descendant, element)));
    });
}
/** No custom element between them: a datagrid renders its grid, not the input in one of its cells. */
function isRenderedBy(descendant, element) {
    let owner = parentAcrossShadow(descendant);
    while (owner && owner !== element && !isCustomElementTag(owner)) {
        owner = parentAcrossShadow(owner);
    }
    return owner === element;
}
function isLeftOutAnyway(element, excludeSelector) {
    return (!!closestAcrossShadow(element, CLR_CONTEXT_IGNORE_SELECTOR) ||
        (!!excludeSelector && !!closestAcrossShadow(element, excludeSelector)));
}
function shouldSkipSubtree(element, walk) {
    if (SKIPPED_TAGS.has(element.tagName.toLowerCase())) {
        return true;
    }
    if (hidesFromContext(element, walk.excludeSelector)) {
        return true;
    }
    // Only role-less text without controls folds into a description; page content can point
    // `aria-describedby` at any id.
    if (isDescription(element, walk) && !hasRendered(element, CONTROL_SELECTOR) && !resolveRole(element)) {
        return true;
    }
    return !isVisible(element);
}
function pruneEmpty(context, { foreign = false } = {}) {
    const pruned = { type: context.type };
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
function noteRef(node, element, walk) {
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
function foldRenderedControl(node, walk) {
    const children = node.children ?? [];
    const index = children.findIndex(child => child.type === node.type && child.label === node.label && WRITABLE_ROLES.has(child.type));
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
function ownsContents(element) {
    return CLR_ELEMENT_MUTATOR_PROPERTY in element && readElementMutator(element)?.ownsContents === true;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const UNTRUSTED_LIST_KEYS = ['excludeCategories', 'excludeRoles'];
const ENUM_KEYS = ['focus', 'collectionItems'];
/** Snapshot budgets a caller the application does not control may set; content rules are not negotiable. */
const CLR_CONTEXT_UNTRUSTED_OPTION_KEYS = Object.freeze([
    ...BUDGET_KEYS,
    ...SWITCH_KEYS,
    ...UNTRUSTED_LIST_KEYS,
    ...ENUM_KEYS,
]);
const MAX_ENUM_LENGTH = 32;
/** Reduces an untrusted caller's options to typed budgets, so no getter, object, `NaN` or selector gets through. */
function sanitizeUntrustedSnapshotOptions(options) {
    if (!options || typeof options !== 'object') {
        return undefined;
    }
    const candidate = options;
    const sanitized = {};
    for (const key of CLR_CONTEXT_UNTRUSTED_OPTION_KEYS) {
        const value = acceptedValue(key, candidate[key]);
        if (value !== undefined) {
            sanitized[key] = value;
        }
    }
    return sanitized;
}
function acceptedValue(key, value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) && BUDGET_KEYS.includes(key) ? value : undefined;
    }
    if (typeof value === 'boolean') {
        return SWITCH_KEYS.includes(key) ? value : undefined;
    }
    if (typeof value === 'string') {
        return value.length <= MAX_ENUM_LENGTH && ENUM_KEYS.includes(key) ? value : undefined;
    }
    if (Array.isArray(value) && UNTRUSTED_LIST_KEYS.includes(key)) {
        return value
            .filter(entry => typeof entry === 'string' && entry.length <= MAX_ENUM_LENGTH)
            .slice(0, MAX_LIST_ENTRIES);
    }
    return undefined;
}
/**
 * The context without what the user entered, for a consumer the application does not control.
 * Fields keep their shape and are marked `withheld: true`. Published state is cut while the snapshot is
 * taken, to the keys its publisher marks public.
 */
function withoutFormValues(context) {
    const withheld = (node) => withoutStateKeys(withoutValues(node, true), () => UNTRUSTED_WITHHELD_STATE_KEYS, true);
    return { ...context, components: context.components.map(withheld), regions: context.regions.map(withheld) };
}
/**
 * The context with only the route pattern of its address, origins for links and frames, and no title,
 * for an untrusted consumer: paths and queries carry ids, tokens and signed links.
 */
function withoutUrlDetails(context, routePattern, baseUrl = context.url) {
    const shared = { ...context, title: '' };
    const pattern = context.route?.path;
    if (typeof shared.url === 'string') {
        shared.url = withPath(shared.url, pattern ?? '');
    }
    if (pattern !== undefined) {
        shared.route = { url: `/${pattern}`, path: pattern };
    }
    else {
        delete shared.route;
    }
    const origin = originOf$1(context.url);
    // A base on another origin is not this page's: relative links resolve against the page.
    const resolveAgainst = baseUrl && originOf$1(baseUrl) === origin ? baseUrl : (context.url ?? null);
    const scope = { origin, resolveAgainst, routePattern };
    shared.components = context.components.map(node => withoutAddressDetails(node, scope));
    shared.regions = context.regions.map(node => withoutAddressDetails(node, scope));
    return shared;
}
/** The context as an untrusted consumer may see it, unless the host shares more. */
function contextForUntrustedCaller(context, share, routePattern, baseUrl) {
    const shared = share.shareFormValues ? context : withoutFormValues(context);
    return share.shareFullUrl ? shared : withoutUrlDetails(shared, routePattern, baseUrl);
}
function withPath(url, path) {
    return attempt(() => `${new URL(url).origin}/${path}`, `/${path}`);
}
function originOf$1(url) {
    return attempt(() => (url ? new URL(url).origin : null), null);
}
function withoutAddressDetails(node, scope) {
    let result = node;
    const state = node.state;
    // A frame whose document is an editing host reads as a textbox, so match on the element too.
    const frame = node.type === 'frame' || node.element === 'iframe' || node.element === 'frame';
    if (state && (typeof state['href'] === 'string' || typeof state['url'] === 'string' || (frame && 'title' in state))) {
        const reduced = { ...state };
        if (frame) {
            delete reduced['title'];
        }
        for (const key of ['href', 'url']) {
            if (typeof reduced[key] === 'string') {
                const address = reducedAddress(reduced[key], key === 'href', scope);
                if (address === null) {
                    delete reduced[key];
                }
                else {
                    reduced[key] = address;
                }
            }
        }
        result = { ...result, state: reduced };
        if (!Object.keys(reduced).length) {
            delete result.state;
        }
    }
    if (node.children?.length) {
        result = { ...result, children: node.children.map(child => withoutAddressDetails(child, scope)) };
    }
    return result;
}
function reducedAddress(address, isLink, scope) {
    const url = attempt(() => new URL(address, scope.resolveAgainst ?? undefined), null);
    if (!url) {
        return null;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return url.protocol;
    }
    if (!isLink || url.origin !== scope.origin) {
        return `${url.origin}/`;
    }
    const pattern = scope.routePattern?.(url) ?? null;
    return pattern === null ? null : `/${pattern}`;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
let warned = false;
/** Warns once in development: without `hostOrigin`, any site embedding the frame can answer with its own context. */
function warnNoHostOrigin() {
    if (!warned && isDevMode()) {
        warned = true;
        console.warn('clrRequestHostContext: no hostOrigin was given, so the context is accepted from whichever page embeds this ' +
            'frame. Pass the origin of the application expected to host it.');
    }
}
/** For specs only; not exported from the package. */
function resetNoHostOriginWarning() {
    warned = false;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Identifier of the framework-agnostic `postMessage` context protocol. A discriminator, never a secret. */
const CLR_CONTEXT_PROTOCOL = 'ui-context/v1';
const MAX_REQUEST_ID_LENGTH = 128;
const DEFAULT_MIN_REQUEST_INTERVAL_MS = 200;
/** Most snapshots served to all frames together per interval, so nesting frames cannot multiply the limit. */
const MAX_REQUESTS_PER_INTERVAL = 5;
const DEFAULT_REQUEST_TIMEOUT_MS = 2000;
/** A longer browser timer delay overflows and fires at once. */
const MAX_TIMER_DELAY_MS = 2 ** 31 - 1;
/**
 * Serves page context to embedded frames, which get no form values, no full URL and no more than the host allows.
 * Not exported: only the engine constructs one, so the application-wide options apply.
 */
class ClrContextFrameHost {
    constructor(getSnapshot, hostWindow, options = {}, routePattern) {
        this.getSnapshot = getSnapshot;
        this.hostWindow = hostWindow;
        this.routePattern = routePattern;
        this.lastServedAt = new WeakMap();
        this.messageListener = this.onMessage.bind(this);
        this.intervalStartedAt = Number.NEGATIVE_INFINITY;
        this.serving = false;
        this.servedInInterval = 0;
        this.allowAnyOrigin = options.allowAnyOrigin === true;
        this.allowedOrigins = allowedOriginsFrom(options, hostWindow.location.origin, this.allowAnyOrigin);
        this.shareFullUrl = options.shareFullUrl === true;
        this.shareFormValues = options.shareFormValues === true;
        // Resolved, so an unset budget is the default rather than whatever a frame asks for.
        this.snapshotCeiling = resolveSnapshotOptions(options.snapshot);
        const interval = options.minRequestIntervalMs;
        this.minRequestIntervalMs =
            typeof interval === 'number' && Number.isFinite(interval) && interval >= 0
                ? interval
                : DEFAULT_MIN_REQUEST_INTERVAL_MS;
    }
    start() {
        this.serving = true;
        this.hostWindow.addEventListener('message', this.messageListener);
    }
    /** Stops serving, including answers to requests still waiting for a snapshot. */
    stop() {
        this.serving = false;
        this.hostWindow.removeEventListener('message', this.messageListener);
    }
    onMessage(event) {
        if (!isContextRequest(event.data) || !this.isServableOrigin(event.origin)) {
            return;
        }
        const source = event.source;
        const frame = source ? this.embeddedFrameOf(source) : null;
        if (!source || !frame || !this.admit(frame)) {
            return;
        }
        // A failing snapshot or uncloneable response is that request's problem; the host keeps serving.
        const answer = (snapshot) => {
            if (!this.serving) {
                return;
            }
            const response = {
                protocol: CLR_CONTEXT_PROTOCOL,
                kind: 'context-response',
                requestId: event.data.requestId,
                context: this.contextForFrame(snapshot),
            };
            // Never '*': the frame can navigate between request and answer.
            source.postMessage(response, { targetOrigin: event.origin });
        };
        try {
            const requested = capSnapshotOptions(sanitizeUntrustedSnapshotOptions(event.data.options), this.snapshotCeiling);
            const snapshot = this.getSnapshot(requested);
            if (snapshot instanceof Promise) {
                snapshot.then(answer).catch(() => undefined);
            }
            else {
                answer(snapshot);
            }
        }
        catch {
            // Deliberately swallowed: see above.
        }
    }
    isServableOrigin(origin) {
        // An opaque origin reports "null", which cannot be a postMessage target; answering would need '*'.
        if (!origin || origin === 'null') {
            return false;
        }
        return this.allowAnyOrigin || this.allowedOrigins.includes(origin);
    }
    /** The child frame `source` sits in, or `null`: a popup or tab sharing an allowed origin is not served. */
    embeddedFrameOf(source) {
        // A top-level window is its own parent.
        if (source === this.hostWindow) {
            return null;
        }
        let frame = source;
        try {
            while (frame.parent !== this.hostWindow) {
                if (!frame.parent || frame.parent === frame) {
                    return null;
                }
                frame = frame.parent;
            }
        }
        catch {
            return null;
        }
        return frame;
    }
    admit(frame) {
        if (this.minRequestIntervalMs <= 0) {
            return true;
        }
        // A monotonic clock: a wall clock set back would throttle every frame until it caught up.
        const now = performance.now();
        // Nested frames share their top-level frame's allowance.
        const previous = this.lastServedAt.get(frame);
        if (previous !== undefined && now - previous < this.minRequestIntervalMs) {
            return false;
        }
        if (now - this.intervalStartedAt >= this.minRequestIntervalMs) {
            this.intervalStartedAt = now;
            this.servedInInterval = 0;
        }
        if (this.servedInInterval >= MAX_REQUESTS_PER_INTERVAL) {
            return false;
        }
        this.servedInInterval++;
        this.lastServedAt.set(frame, now);
        return true;
    }
    contextForFrame(snapshot) {
        const share = { shareFormValues: this.shareFormValues, shareFullUrl: this.shareFullUrl };
        return contextForUntrustedCaller(snapshot, share, this.routePattern, this.hostWindow.document.baseURI);
    }
}
/**
 * Requests the host page's context from inside a frame. Resolves `null` when the host does not answer;
 * rejects when the request cannot be made. Answers are accepted only from the asked window and origin.
 */
async function clrRequestHostContext(options = {}) {
    const targetWindow = options.targetWindow || window.parent;
    if (!targetWindow || targetWindow === window) {
        return null;
    }
    const targetOrigin = targetOriginFor(options, targetWindow);
    const expectedOrigin = targetOrigin !== '*' ? targetOrigin : undefined;
    const requestId = newRequestId();
    const request = {
        protocol: CLR_CONTEXT_PROTOCOL,
        kind: 'context-request',
        requestId,
        options: options.options,
    };
    return new Promise((resolve, reject) => {
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
        }, requestTimeout(options.timeoutMs));
        window.addEventListener('message', responseListener);
        // An uncloneable request is never answered, so don't wait for the timeout.
        try {
            targetWindow.postMessage(request, { targetOrigin });
        }
        catch (error) {
            cleanup();
            reject(error);
        }
    });
}
/** Where the request is addressed, and the only origin an answer is accepted from. */
function targetOriginFor(options, targetWindow) {
    if (options.hostOrigin) {
        // Normalised like the host's allow-list, or a trailing `/` would make every request time out.
        const hostOrigin = originOf(options.hostOrigin);
        if (!hostOrigin) {
            throw new Error(`clrRequestHostContext: "${options.hostOrigin}" is not an origin, such as https://app.example.`);
        }
        return hostOrigin;
    }
    if (targetWindow !== window.parent) {
        // The embedder's origin says nothing about another window.
        const origin = readableOrigin(targetWindow);
        if (!origin) {
            throw new Error('clrRequestHostContext: a targetWindow other than the parent needs a hostOrigin to be asked.');
        }
        return origin;
    }
    warnNoHostOrigin();
    return embedderOrigin() ?? ownOrigin();
}
/** A non-positive, non-finite or too-long delay fires at once, so fall back to the default or the maximum. */
function requestTimeout(timeoutMs) {
    if (typeof timeoutMs !== 'number' || !Number.isFinite(timeoutMs) || timeoutMs <= 0) {
        return DEFAULT_REQUEST_TIMEOUT_MS;
    }
    return Math.min(timeoutMs, MAX_TIMER_DELAY_MS);
}
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
/** Unguessable, so a sibling frame cannot answer a request it cannot see. `randomUUID` needs a secure context. */
function newRequestId() {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return Array.from(crypto.getRandomValues(new Uint8Array(16)), byte => byte.toString(16).padStart(2, '0')).join('');
}
/** The embedder's origin from `ancestorOrigins` or the referrer, or `null`. */
function embedderOrigin() {
    return originOf(window.location.ancestorOrigins?.[0] ?? '') ?? originOf(document.referrer);
}
/** A same-origin window's origin, or `null`; an `about:blank` or `srcdoc` frame shares this document's. */
function readableOrigin(target) {
    try {
        const origin = target.location.origin;
        if (origin && origin !== 'null') {
            return origin;
        }
        return target.location.protocol === 'about:' ? ownOrigin() : null;
    }
    catch {
        return null;
    }
}
/** A sandboxed or `data:` document has no origin; the request carries only budgets, so `'*'` is fine there. */
function ownOrigin() {
    const origin = window.location.origin;
    return origin && origin !== 'null' ? origin : '*';
}
/** Wildcards are dropped so a copied permissive config cannot open the page; an empty result is refused. */
function allowedOriginsFrom(options, ownOrigin, allowAnyOrigin) {
    const allowed = (options.allowedOrigins || (ownOrigin === 'null' ? [] : [ownOrigin]))
        .filter(origin => origin !== '*')
        .map(normalizedOrigin);
    if (!allowAnyOrigin && !allowed.length) {
        throw new Error(options.allowedOrigins
            ? 'enableFrameBridge: allowedOrigins names no origin to serve. List the embedding origins, or set allowAnyOrigin to serve every origin deliberately.'
            : 'enableFrameBridge: this page has no origin of its own (a file:// or sandboxed page) to serve frames from. List the origins to serve in allowedOrigins.');
    }
    return allowed;
}
/** Normalised so `https://Chat.Example/` matches the origin a message carries; a non-origin is refused. */
function normalizedOrigin(entry) {
    const origin = originOf(entry);
    if (!origin) {
        throw new Error(`enableFrameBridge: "${entry}" in allowedOrigins is not an origin, such as https://chat.example.`);
    }
    return origin;
}
function originOf(entry) {
    const origin = attempt(() => new URL(entry).origin, null);
    return origin === 'null' ? null : origin;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Why the engine must not write to this element, or `null`: what a snapshot would not show, behind a modal,
 * or disabled. `knownModals` excludes the dialog the application used to ask for confirmation.
 */
function writeObstacle(element, knownModals) {
    if (isHiddenFromEngine(element)) {
        return 'hidden';
    }
    const modal = topmostModal(element.ownerDocument, knownModals);
    if (modal && !modal.contains(element)) {
        return 'hidden';
    }
    if (isRedacted(element)) {
        return 'redacted';
    }
    if (element.getAttribute('aria-disabled') === 'true' || isNativelyDisabled(element)) {
        return 'disabled';
    }
    if (element.getAttribute('aria-readonly') === 'true' ||
        ('readOnly' in element && element.readOnly)) {
        return 'readOnly';
    }
    return null;
}
function topmostModal(document, knownModals) {
    const modals = openModalDialogs(document).filter(dialog => !knownModals || knownModals.has(dialog));
    return modals[modals.length - 1] ?? null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Input types the browser only accepts in one format, with that format. */
const TYPED_INPUTS = {
    date: 'YYYY-MM-DD',
    time: 'HH:MM',
    month: 'YYYY-MM',
    week: 'YYYY-W##',
    'datetime-local': 'YYYY-MM-DDTHH:MM',
    color: '#rrggbb',
};
/** Controls whose tag says what they hold; a custom one is judged by its role. */
const NATIVE_CONTROLS = new Set(['input', 'select', 'textarea']);
/** Words a description may add without naming anything else: "the email field" names "Email". */
const FILLER_WORDS = new Set([
    'the',
    'a',
    'an',
    'field',
    'input',
    'box',
    'control',
    'value',
    'option',
    'dropdown',
    'select',
    'textbox',
    'checkbox',
    'toggle',
    'of',
    'for',
    'in',
    'on',
    'my',
    'this',
    'that',
]);
/** Words that tell a field from its pair, such as "Email" and "Confirm email"; a description must repeat them. */
const DISTINGUISHING_WORDS = new Set([
    'confirm',
    'confirmation',
    'repeat',
    'retype',
    'new',
    'old',
    'current',
    'previous',
    'first',
    'middle',
    'last',
    'billing',
    'shipping',
    'primary',
    'secondary',
    'home',
    'work',
    'mobile',
    'start',
    'end',
    'from',
    'to',
    'min',
    'max',
    'minimum',
    'maximum',
]);
/** A description using one the label lacks is about something else. */
const NEGATING_WORDS = new Set([
    'not',
    'no',
    'wrong',
    'other',
    'except',
    'instead',
    'never',
]);

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const MAX_LABEL_LENGTH = CLR_CONTEXT_DEFAULT_OPTIONS.maxTextLength;
const UNSUPPORTED_SELECT_DETAIL = 'The select is bound through an accessor the engine cannot hand a choice to. Publish a mutator for it.';
const UNBOUND_DETAIL = 'The control has no Angular form binding (formControlName, formControl or ngModel), which is required.';
const KEPT_CHOICE_DETAIL = 'The current choice is kept from agents, and cannot be changed by one.';
const STRUCTURED_VALUE_DETAIL = 'The control holds an object or a list, which the value its role suggests would replace. It can publish a mutator (publishElementMutator from @clr/angular/utils).';
const CHOICE_VALUE_DETAIL = 'The group holds something other than one of its radios’ labels, so choosing one by its label would store the wrong thing. It can publish a mutator (publishElementMutator from @clr/angular/utils).';
const OBSTACLE_DETAILS = {
    hidden: 'The control is not currently shown to the user, or sits behind an open modal dialog.',
    redacted: 'The control is in a region the application keeps from agents.',
    disabled: 'The control is disabled.',
    readOnly: 'The control is read-only.',
};
/**
 * The outermost bound element is written to; the innermost is what the user sees. A control
 * owned by another Angular application on the page is that application's to fill.
 */
function resolveWriteTarget(ref, application, options, knownModals) {
    const { elements, type } = ref;
    const control = elements[elements.length - 1];
    const obstacle = writeObstacle(control, knownModals);
    if (obstacle) {
        return { refused: obstacle, detail: OBSTACLE_DETAILS[obstacle] };
    }
    const shownLabel = labelOf(elements, withheldBy(control, options));
    const label = ref.label ?? shownLabel;
    const targetOf = (element, kind, ngControl, mutator) => ({
        target: { element, control, label, shownLabel, type, kind, ngControl, mutator, options, knownModals },
    });
    const element = boundElementOf(elements);
    if (element) {
        const mutator = readElementMutator(element);
        const ngControl = formControlOn(element);
        const bound = ngControl?.control;
        const refusal = bindingRefusal(element, mutator?.write ? null : bound, application);
        if (refusal) {
            return refusal;
        }
        if (mutator?.write) {
            return targetOf(element, 'custom', ngControl, mutator);
        }
        const kind = kindFor(element, control, type) ?? (mutator?.coerce ? 'text' : null);
        if (!kind) {
            return {
                refused: 'unsupported',
                detail: 'This custom control does not say how it is written to. It can publish a mutator (publishElementMutator from @clr/angular/utils).',
            };
        }
        if (kind === 'select' && bound?.updateOn === 'submit') {
            return {
                refused: 'unsupported',
                detail: 'This select applies its value only when its form is submitted, which the engine never does.',
            };
        }
        // A custom control judged by its role holds text; one whose model holds an object would get a string.
        if (!NATIVE_CONTROLS.has(element.tagName.toLowerCase()) && !mutator?.coerce && isStructured(bound?.value)) {
            return { refused: 'unsupported', detail: STRUCTURED_VALUE_DETAIL };
        }
        if (kind === 'choice' && !holdsChoiceLabel(control, bound?.value)) {
            return { refused: 'unsupported', detail: CHOICE_VALUE_DETAIL };
        }
        return targetOf(element, kind, ngControl, mutator);
    }
    const radio = boundRadioOf(control);
    if (radio) {
        const ngControl = formControlOn(radio);
        return bindingRefusal(radio, ngControl?.control, application) ?? targetOf(control, 'radiogroup', ngControl, null);
    }
    return { refused: 'unbound', detail: UNBOUND_DETAIL };
}
/** Whether a node could be written to at all; disabled and similar states are judged at write time. */
function offersWrite(ref) {
    return !!boundElementOf(ref.elements) || !!boundRadioOf(ref.elements[ref.elements.length - 1]);
}
function boundElementOf(elements) {
    return elements.find(element => readElementMutator(element)?.write || formControlOn(element)?.control);
}
/** A radio group is summarised, so its ref is the group's while the binding is on the radios. */
function boundRadioOf(control) {
    return resolveRole(control) === 'radiogroup'
        ? radiosOf(control).find(each => formControlOn(each)?.control)
        : undefined;
}
function bindingRefusal(element, bound, application) {
    if (!sameApplication(element, application)) {
        return { refused: 'unbound', detail: 'The control belongs to another Angular application on this page.' };
    }
    return bound?.disabled ? { refused: 'disabled', detail: OBSTACLE_DETAILS.disabled } : null;
}
/**
 * Whether the description names the node: every word of the label, plus only filler. Requiring every word
 * tells "Email" from "Confirm email" in any language; a label cut with "…" is matched on the words kept.
 */
function descriptionMatches(description, label, type = '') {
    if (typeof description !== 'string') {
        return false;
    }
    const typeWords = words(type);
    const given = words(description);
    if (!label) {
        return !given.length || given.every(word => typeWords.includes(word));
    }
    const labelWords = words(label);
    if (!given.length || given.some(word => NEGATING_WORDS.has(word) && !labelWords.includes(word))) {
        return false;
    }
    const cut = label.trimEnd().endsWith('…');
    // The last word of a cut label may itself be cut.
    const actual = cut ? labelWords.slice(0, -1) : labelWords;
    // A distinguishing word must be said even when the type contains it ("start" in `date-range-start`).
    if (actual.some(word => (DISTINGUISHING_WORDS.has(word) || NEGATING_WORDS.has(word)) && !given.includes(word))) {
        return false;
    }
    const said = actual.every(word => given.includes(word) || FILLER_WORDS.has(word) || typeWords.includes(word));
    if (cut) {
        return said;
    }
    const extra = given.some(word => !actual.includes(word) && !FILLER_WORDS.has(word) && !typeWords.includes(word));
    return said && given.some(word => actual.includes(word)) && !extra;
}
/**
 * What the form control will receive, where known before writing. A component that translates
 * the value itself is not asked: its model may hold what it keeps from agents.
 */
function modelValueOf(target, value) {
    if (target.kind === 'radiogroup') {
        return value === null ? null : radioValue(value);
    }
    return target.kind === 'select' || target.mutator?.coerce ? undefined : value;
}
/** What the control would be given for a proposal, and what a person would call it; `null` clears. */
function coerceValue(target, proposed) {
    const mutator = target.mutator;
    if (mutator?.coerce) {
        const coerced = safely(() => mutator.coerce?.(proposed, target.options));
        if (coerced.refused !== undefined) {
            return { refused: coerced.refused };
        }
        // The policy is shown the component's display value, never the model, which may hold an unseen selection.
        if (coerced.display !== undefined) {
            return { value: coerced.value, display: plain(coerced.display) };
        }
        return {
            value: coerced.value,
            display: target.kind === 'custom' || proposed === null ? plain(coerced.value) : proposed,
        };
    }
    switch (target.kind) {
        case 'custom':
            return { value: proposed, display: proposed };
        case 'checkbox':
        case 'boolean':
            if (proposed === null) {
                return { value: false, display: false };
            }
            if (typeof proposed === 'boolean') {
                return { value: proposed, display: proposed };
            }
            if (proposed === 'true' || proposed === 'false') {
                return { value: proposed === 'true', display: proposed === 'true' };
            }
            return { refused: 'A checkbox takes true or false.' };
        case 'radio':
            if (proposed === false || proposed === 'false' || proposed === null) {
                return { refused: 'A radio cannot be unchecked on its own; set another radio in the group instead.' };
            }
            return { value: radioValue(target.element), display: true };
        case 'radiogroup':
            return coerceRadio(target, proposed);
        case 'choice':
            return coerceChoice(target, proposed);
        case 'number':
            return coerceNumber(target, proposed);
        case 'typed':
            return coerceTyped(target, proposed);
        case 'select':
            return coerceSelect(target, proposed);
        default:
            if (proposed === null) {
                return { value: '', display: '' };
            }
            if (typeof proposed === 'string' || typeof proposed === 'number' || typeof proposed === 'boolean') {
                const text = String(proposed);
                // The model must not hold more than the field's `maxlength` would let a person type.
                const limit = maxLengthOf(target.element);
                if (limit !== null && text.length > limit) {
                    return { refused: `The text must be at most ${limit} characters.` };
                }
                return { value: text, display: text };
            }
            return { refused: 'Text is expected.' };
    }
}
function maxLengthOf(element) {
    const tagName = element.tagName.toLowerCase();
    if (tagName !== 'input' && tagName !== 'textarea') {
        return null;
    }
    const limit = element.maxLength;
    return limit >= 0 ? limit : null;
}
/**
 * Writes the value as user input would arrive. Marked dirty and touched first, so the change is validated,
 * shown and emitted once.
 */
function writeValue(target, coerced) {
    const previous = readValue(target);
    const mutator = target.mutator;
    if (target.kind === 'custom') {
        const written = safely(() => mutator?.write?.(coerced.value, target.options));
        if (written.refused !== undefined) {
            return { applied: false, refused: 'invalid', detail: written.refused };
        }
        return { applied: true, previous, value: mutator?.read ? readValue(target) : plain(written.value) };
    }
    let control = target.ngControl?.control ?? null;
    if (target.kind === 'radiogroup' && coerced.value !== null) {
        control = formControlOn(coerced.value)?.control ?? null;
    }
    if (!control) {
        return { applied: false, refused: 'unbound', detail: UNBOUND_DETAIL };
    }
    const accessor = selectAccessorOf(target);
    if (target.kind === 'select' && !accessor) {
        return { applied: false, refused: 'unsupported', detail: UNSUPPORTED_SELECT_DETAIL, previous };
    }
    const valueBefore = control.value;
    const modelBefore = serialized(valueBefore);
    // A refused or throwing write leaves the control as the user left it.
    const wasDirty = control.dirty;
    const wasTouched = control.touched;
    const rollback = (bound) => {
        if (!wasDirty) {
            bound.markAsPristine();
        }
        if (!wasTouched) {
            bound.markAsUntouched();
        }
    };
    control.markAsDirty();
    control.markAsTouched();
    try {
        if (target.kind === 'radiogroup') {
            control.setValue(coerced.value === null ? null : radioValue(coerced.value));
        }
        else if (target.kind === 'select' &&
            !target.element.multiple &&
            coerced.display === null) {
            // A one-line select re-chooses its first option, so a cleared one is told through its control.
            control.setValue(null);
        }
        else if (target.kind === 'select' && accessor) {
            const taken = writeSelect(target.element, control, accessor, coerced, previous, modelBefore);
            if (!taken) {
                rollback(control);
                return { applied: false, refused: 'invalid', detail: 'The form control did not take the value.', previous };
            }
        }
        else {
            control.setValue(coerced.value);
        }
    }
    catch (error) {
        // `setValue` updates the view before validating, so a throw is undone quietly.
        try {
            control.setValue(valueBefore, { emitEvent: false });
        }
        catch {
            control.setValue(valueBefore, { emitModelToViewChange: false, emitEvent: false });
        }
        rollback(control);
        throw error;
    }
    const outcome = { applied: true, value: readValue(target), previous, status: control.status };
    const errors = jsonSafe(control.errors, STATE_DEPTH);
    if (errors && typeof errors === 'object') {
        outcome.errors = errors;
    }
    return outcome;
}
function selectAccessorOf(target) {
    const accessor = target.ngControl?.valueAccessor;
    return typeof accessor?.onChange === 'function' ? accessor : null;
}
/**
 * Hands the chosen options to the accessor as its `change` listener would, without dispatching DOM events
 * that would run the application's own handlers.
 */
function writeSelect(select, control, accessor, coerced, previous, modelBefore) {
    const options = Array.from(select.options);
    const shown = options.map(option => option.selected);
    const restore = () => options.forEach((option, index) => (option.selected = shown[index]));
    const chosen = Array.isArray(coerced.value) ? coerced.value : [];
    options.forEach(option => (option.selected = chosen.includes(option)));
    try {
        accessor.onChange(select.multiple ? select : select.value);
        if (control.updateOn === 'blur') {
            accessor.onTouched?.();
        }
    }
    catch (error) {
        restore();
        throw error;
    }
    const moved = JSON.stringify(plain(previous)) !== JSON.stringify(plain(coerced.display));
    if (moved && serialized(control.value) === modelBefore) {
        restore();
        return false;
    }
    return true;
}
function readValue(target) {
    const mutator = target.mutator;
    if (mutator?.read) {
        return attempt(() => plain(mutator.read?.(target.options)), null);
    }
    switch (target.kind) {
        case 'select': {
            const select = target.element;
            const labels = Array.from(select.selectedOptions)
                .filter(option => choiceShown(option, target))
                .map(option => optionLabel(option));
            return select.multiple ? labels : (labels[0] ?? null);
        }
        case 'checkbox':
        case 'radio':
            return target.element.checked;
        case 'radiogroup': {
            const chosen = radiosOf(target.element).find(radio => radio.checked && choiceShown(radio, target));
            return chosen ? radioLabelWithin(chosen, withheldBy(target.element, target.options)) : null;
        }
        default:
            return plain(target.ngControl?.control?.value);
    }
}
/** Marks the view for check, which an `OnPush` parent would otherwise skip. */
function markViewForCheck(element) {
    // An element Angular does not render has no view to check.
    attempt(() => getDebugNode(element)?.injector.get(ChangeDetectorRef, null)?.markForCheck(), undefined);
}
function formControlOn(element) {
    return attempt(() => getDebugNode(element)?.injector.get(NgControl, null, { self: true }) ?? null, null);
}
function sameApplication(element, application) {
    if (!application) {
        return true;
    }
    return attempt(() => getDebugNode(element)?.injector.get(ApplicationRef, null) === application, false);
}
/** A custom element is judged by the role of what it renders; a role that says nothing is not guessed at. */
function kindFor(bound, rendered, type) {
    const tag = bound.tagName.toLowerCase();
    if (tag === 'select') {
        return 'select';
    }
    if (tag === 'textarea') {
        return 'text';
    }
    if (tag === 'input') {
        const inputType = (bound.getAttribute('type') ?? 'text').toLowerCase();
        if (inputType === 'checkbox') {
            return 'checkbox';
        }
        if (inputType === 'radio') {
            return 'radio';
        }
        if (inputType === 'number' || inputType === 'range') {
            return 'number';
        }
        return ownEntry(TYPED_INPUTS, inputType) ? 'typed' : 'text';
    }
    switch (resolveRole(rendered) ?? type) {
        case 'checkbox':
        case 'switch':
            return 'boolean';
        case 'spinbutton':
        case 'slider':
            return 'number';
        case 'textbox':
        case 'searchbox':
            return 'text';
        case 'radiogroup':
            return 'choice';
        default:
            return null;
    }
}
function coerceNumber(target, proposed) {
    if (proposed === null) {
        return { value: null, display: null };
    }
    const blank = typeof proposed === 'string' && !proposed.trim();
    const number = blank ? NaN : typeof proposed === 'string' ? Number(proposed) : proposed;
    if (typeof number !== 'number' || !Number.isFinite(number)) {
        return { refused: 'A number is expected.' };
    }
    // A range input clamps silently and Angular's min/max validators skip it, so bounds are checked here.
    const input = target.element.tagName.toLowerCase() === 'input' ? target.element : null;
    const [min, max] = input
        ? nativeBounds(input)
        : [ariaBound(target.control, 'aria-valuemin'), ariaBound(target.control, 'aria-valuemax')];
    if ((Number.isFinite(min) && number < min) || (Number.isFinite(max) && number > max)) {
        const bounds = [Number.isFinite(min) ? `at least ${min}` : '', Number.isFinite(max) ? `at most ${max}` : '']
            .filter(Boolean)
            .join(' and ');
        return { refused: `The number must be ${bounds}.` };
    }
    if (input) {
        const step = input.step && input.step !== 'any' ? Number(input.step) : NaN;
        if (Number.isFinite(step) && step > 0) {
            const offset = (number - (Number.isFinite(min) ? min : 0)) / step;
            if (Math.abs(offset - Math.round(offset)) > 1e-9) {
                return { refused: `The number must be a multiple of ${step}${Number.isFinite(min) ? ` from ${min}` : ''}.` };
            }
        }
    }
    return { value: number, display: number };
}
function nativeBounds(input) {
    const [min, max] = input.type === 'range' ? [0, 100] : [NaN, NaN];
    return [input.min !== '' ? Number(input.min) : min, input.max !== '' ? Number(input.max) : max];
}
function ariaBound(element, attribute) {
    const raw = element.getAttribute(attribute);
    return raw?.trim() ? Number(raw) : NaN;
}
function coerceTyped(target, proposed) {
    if (proposed === null) {
        return { value: '', display: '' };
    }
    const input = target.element;
    const format = ownEntry(TYPED_INPUTS, input.type) ?? '';
    if (typeof proposed !== 'string') {
        return { refused: `A value in the form ${format} is expected.` };
    }
    // The browser's sanitisation decides: the model must not hold what the field cannot show.
    const probe = input.ownerDocument.createElement('input');
    probe.type = input.type;
    probe.value = proposed;
    // A colour input lowercases, so compare in lowercase.
    const sameValue = input.type === 'color' ? probe.value === proposed.toLowerCase() : probe.value === proposed;
    if (!sameValue) {
        return { refused: `A value in the form ${format} is expected.` };
    }
    return { value: probe.value, display: probe.value };
}
function coerceSelect(target, proposed) {
    const select = target.element;
    // An option the snapshot left out that is selected stays selected.
    const kept = select.multiple ? Array.from(select.selectedOptions).filter(option => !choiceShown(option, target)) : [];
    // Replacing a choice the agent was never shown would change what it cannot see or undo.
    if (!select.multiple && Array.from(select.selectedOptions).some(option => choiceKept(option, target))) {
        return { refused: KEPT_CHOICE_DETAIL };
    }
    if (proposed === null) {
        return { value: kept, display: select.multiple ? [] : null };
    }
    if (!select.multiple && Array.isArray(proposed)) {
        return { refused: 'The select takes one option.' };
    }
    const wanted = Array.isArray(proposed) ? proposed : [proposed];
    const all = Array.from(select.options).filter(option => choiceShown(option, target));
    const usable = all.filter(option => optionUsable(option));
    const options = [];
    for (const entry of wanted) {
        const matches = all.filter(candidate => optionMatches(candidate, entry));
        // Two options can read the same: only a value naming exactly one tells which.
        const byValue = matches.filter(candidate => typeof entry === 'string' && normalizeContextText(candidate.value) === normalizeContextText(entry));
        const option = matches.length > 1 ? (byValue.length === 1 ? byValue[0] : undefined) : matches[0];
        if (matches.length > 1 && !option) {
            return {
                refused: `Several options read "${String(entry)}", and nothing tells which one is meant. Leave this choice to the user.`,
            };
        }
        if (!option) {
            return { refused: `No such option. The options are: ${listLabels(usable.map(optionLabel))}.` };
        }
        if (!optionUsable(option)) {
            return { refused: `The option "${optionLabel(option)}" cannot be chosen right now.` };
        }
        options.push(option);
    }
    const labels = options.map(optionLabel);
    const bound = options.map(option => boundValueOf(target, option));
    return { value: [...kept, ...options], display: select.multiple ? labels : labels[0], bound };
}
/**
 * The value the select's accessor binds the option to: `ngValue` can change while the option element stays.
 * Angular's select accessors look it up by the option's value with `_getOptionValue`; without one, the value is the text.
 */
function boundValueOf(target, option) {
    const accessor = target.ngControl?.valueAccessor;
    return attempt(() => accessor?._getOptionValue?.(option.value), undefined) ?? option.value;
}
function coerceRadio(target, proposed) {
    if (radiosOf(target.element).some(radio => radio.checked && choiceKept(radio, target))) {
        return { refused: KEPT_CHOICE_DETAIL };
    }
    if (proposed === null) {
        return { value: null, display: null };
    }
    const radios = radiosOf(target.element).filter(radio => choiceShown(radio, target));
    const withheld = withheldBy(target.element, target.options);
    const radioLabel = (radio) => radioLabelWithin(radio, withheld);
    const usable = radios.filter(radio => !writeObstacle(radio, target.knownModals));
    const chosen = radios.find(radio => typeof proposed === 'string' && normalizeContextText(radioLabel(radio)) === normalizeContextText(proposed));
    if (!chosen) {
        return { refused: `No such option. The options are: ${listLabels(usable.map(radioLabel))}.` };
    }
    if (!usable.includes(chosen)) {
        return { refused: `The option "${radioLabel(chosen)}" cannot be chosen right now.` };
    }
    return { value: chosen, display: radioLabel(chosen) };
}
function coerceChoice(target, proposed) {
    const radios = customRadiosOf(target.control);
    if (radios.some(radio => radio.getAttribute('aria-checked') === 'true' && choiceKept(radio, target))) {
        return { refused: KEPT_CHOICE_DETAIL };
    }
    if (proposed === null) {
        return { value: null, display: null };
    }
    const withheld = withheldBy(target.control, target.options);
    const shown = radios.filter(radio => choiceShown(radio, target));
    const usable = shown.filter(radio => !writeObstacle(radio, target.knownModals));
    const labelOfRadio = (radio) => accessibleName(radio, 'radio', MAX_LABEL_LENGTH, withheld);
    const chosen = shown.find(radio => typeof proposed === 'string' && normalizeContextText(labelOfRadio(radio)) === normalizeContextText(proposed));
    if (!chosen) {
        return { refused: `No such option. The options are: ${listLabels(usable.map(labelOfRadio))}.` };
    }
    const label = labelOfRadio(chosen);
    if (!usable.includes(chosen)) {
        return { refused: `The option "${label}" cannot be chosen right now.` };
    }
    return { value: label, display: label };
}
function holdsChoiceLabel(group, value) {
    if (value === null || value === undefined || value === '') {
        return true;
    }
    const labels = customRadiosOf(group).map(radio => normalizeContextText(accessibleName(radio, 'radio', MAX_LABEL_LENGTH)));
    return typeof value === 'string' && labels.includes(normalizeContextText(value));
}
function customRadiosOf(group) {
    return Array.from(group.querySelectorAll('[role="radio"]'));
}
function isStructured(value) {
    return value !== null && typeof value === 'object';
}
/** Excluded or redacted, as opposed to merely hidden: a hidden "Choose…" placeholder may be replaced. */
function choiceKept(choice, target) {
    const excluded = withheldBy(choice, target.options);
    if (excluded && choice.closest(excluded)) {
        return true;
    }
    return isRedactedWithin(choice, target.control);
}
function choiceShown(choice, target) {
    return !choiceKept(choice, target) && !choice.matches(CLR_CONTEXT_WITHHELD_SELECTOR);
}
function optionUsable(option) {
    return !option.disabled && !option.hidden && !option.closest('optgroup[disabled], [hidden]');
}
function radioValue(radio) {
    const accessor = formControlOn(radio)?.valueAccessor;
    return accessor && 'value' in accessor && accessor.value !== undefined ? accessor.value : radio.value;
}
function radiosOf(group) {
    return Array.from(group.querySelectorAll('input[type="radio"]'));
}
function radioLabelWithin(radio, withheld = '') {
    return accessibleName(radio, 'radio', MAX_LABEL_LENGTH, withheld) || radio.value;
}
function withheldBy(element, options) {
    return options ? usableSelectors(element.ownerDocument, options.excludeSelectors) : '';
}
function labelOf(elements, withheld) {
    for (let index = elements.length - 1; index >= 0; index--) {
        const element = elements[index];
        const name = accessibleName(element, resolveRole(element), MAX_LABEL_LENGTH, withheld);
        if (name) {
            return name;
        }
    }
    return '';
}
function optionMatches(option, proposed) {
    if (typeof proposed !== 'string') {
        return false;
    }
    const wanted = normalizeContextText(proposed);
    return normalizeContextText(optionLabel(option)) === wanted || normalizeContextText(option.value) === wanted;
}
function optionLabel(option) {
    return (option.label || option.text).trim();
}
function listLabels(labels) {
    const named = labels.filter(Boolean);
    const listed = named.slice(0, CLR_CONTEXT_DEFAULT_MAX_ITEMS).map(label => `"${label}"`);
    return named.length > CLR_CONTEXT_DEFAULT_MAX_ITEMS
        ? `${listed.join(', ')} and ${named.length - CLR_CONTEXT_DEFAULT_MAX_ITEMS} more`
        : listed.join(', ');
}
function words(text) {
    return text
        .toLowerCase()
        .split(/[^\p{L}\p{N}]+/u)
        .filter(Boolean);
}
function plain(value) {
    if (value === undefined || value === null) {
        return null;
    }
    const safe = jsonSafe(value, STATE_DEPTH, true);
    return safe === undefined ? String(value) : safe;
}
function serialized(value) {
    try {
        return JSON.stringify(value) ?? '';
    }
    catch {
        return String(value);
    }
}
function safely(operation) {
    try {
        const outcome = operation();
        if (outcome && typeof outcome === 'object' && ('value' in outcome || 'refused' in outcome)) {
            return outcome;
        }
        return { refused: 'The component did not say what it would take.' };
    }
    catch (error) {
        return { refused: error instanceof Error ? error.message : 'The component refused the value.' };
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Long enough not to be guessed, short enough to read. */
const REF_RANDOM_LENGTH = 8;
/**
 * Hands out refs and resolves them back to elements. A ref is stable per element, random so it can
 * only be recalled from a snapshot, and held weakly.
 */
class ContextRefRegistryService {
    constructor() {
        this.refsByElement = new WeakMap();
        this.targets = new Map();
    }
    /** A sink for one walk, recorded only once the walk commits, so a failed snapshot records nothing. */
    begin(offered = offersWrite) {
        const collected = new Map();
        return {
            note: (node, element) => {
                if (!node.ref) {
                    node.ref = this.refFor(element);
                    collected.set(node.ref, { elements: [element], type: node.type, label: node.label });
                    return;
                }
                // Finished innermost first; the outer finish is the node as the snapshot shows it.
                const target = collected.get(node.ref);
                if (target) {
                    if (!target.elements.includes(element)) {
                        target.elements.unshift(element);
                    }
                    target.type = node.type;
                    target.label = node.label;
                }
            },
            commit: (components = []) => {
                const withheld = new Set();
                let modal;
                for (const [ref, target] of collected) {
                    const control = target.elements[target.elements.length - 1];
                    modal = modal === undefined ? topmostModal(control.ownerDocument) : modal;
                    if ((modal && !modal.contains(control)) || !offered(target)) {
                        withheld.add(ref);
                        continue;
                    }
                    this.targets.set(ref, {
                        elements: target.elements.map(element => new WeakRef(element)),
                        type: target.type,
                        label: target.label,
                    });
                }
                if (withheld.size) {
                    withoutRefs(components, withheld);
                }
                this.prune();
            },
        };
    }
    resolve(ref) {
        const stored = this.targets.get(ref);
        if (!stored) {
            return null;
        }
        const elements = stored.elements.map(element => element.deref());
        if (elements.some(element => !element || !element.isConnected)) {
            return null;
        }
        return { elements: elements, type: stored.type, label: stored.label };
    }
    prune() {
        for (const [ref, stored] of this.targets) {
            if (stored.elements.some(element => !element.deref()?.isConnected)) {
                this.targets.delete(ref);
            }
        }
    }
    refFor(element) {
        let ref = this.refsByElement.get(element);
        if (!ref) {
            do {
                ref = `e${randomSuffix()}`;
            } while (this.targets.has(ref));
            this.refsByElement.set(element, ref);
        }
        return ref;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ContextRefRegistryService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ContextRefRegistryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ContextRefRegistryService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
function withoutRefs(nodes, refs) {
    for (const node of nodes) {
        if (node.ref && refs.has(node.ref)) {
            delete node.ref;
        }
        withoutRefs(node.children ?? [], refs);
    }
}
function randomSuffix() {
    const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
    const bytes = crypto.getRandomValues(new Uint8Array(REF_RANDOM_LENGTH));
    return Array.from(bytes, byte => alphabet[byte % alphabet.length]).join('');
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** The application's {@link ClrMutationPolicy}; provide it at application level with `provideClrMutationPolicy`. */
const CLR_MUTATION_POLICY = new InjectionToken('CLR_MUTATION_POLICY');
/**
 * Enables the mutation engine with the application's policy. Provide it at application level, not in a lazy route.
 * ```ts
 * provideClrMutationPolicy({ classify: t => (t.operation === 'navigate' ? 'consequential' : 'reversible') });
 * ```
 */
function provideClrMutationPolicy(policy) {
    return makeEnvironmentProviders([{ provide: CLR_MUTATION_POLICY, useValue: policy }]);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * The router configuration flattened to navigable path patterns, without wildcards, redirects or custom matchers.
 * An unloaded lazy route is reported as `lazy`.
 */
function availableRoutes(config, limit) {
    const routes = [];
    const listed = new Set();
    const add = (route) => {
        if (!listed.has(route.path)) {
            listed.add(route.path);
            routes.push(route);
        }
    };
    const visit = (entries, prefix) => {
        for (const entry of entries) {
            if (routes.length >= limit) {
                return;
            }
            const segment = entry.path ?? '';
            if (segment === '**' || entry.redirectTo !== undefined || (entry.matcher && entry.path === undefined)) {
                continue;
            }
            const path = [prefix, segment].filter(Boolean).join('/');
            const loaded = loadedChildren(entry);
            const lazy = !!entry.loadChildren && !loaded;
            if (entry.component || entry.loadComponent || (!entry.children && !entry.loadChildren)) {
                const route = { path: path || '/' };
                const title = entry.title ?? entry.data?.['title'];
                if (typeof title === 'string' && title) {
                    route.title = title;
                }
                if (lazy) {
                    route.lazy = true;
                }
                add(route);
            }
            else if (lazy) {
                add({ path: path || '/', lazy: true });
            }
            if (entry.children) {
                visit(entry.children, path);
            }
            if (loaded) {
                visit(loaded, path);
            }
        }
    };
    visit(config, '');
    return routes;
}
/**
 * The configured pattern a path matches (`clusters/:id` for `/clusters/42`), or `null`.
 * Unknown segments below a lazy route or custom matcher are `*`.
 */
function routePatternFor(config, path) {
    const match = (entries, rest, prefix) => {
        for (const entry of entries) {
            if (entry.redirectTo !== undefined) {
                continue;
            }
            if (entry.path === '**') {
                return [...prefix, '**'];
            }
            if (entry.matcher && entry.path === undefined) {
                if (rest.length) {
                    return [...prefix, ...rest.map(() => '*')];
                }
                continue;
            }
            const own = (entry.path ?? '').split('/').filter(Boolean);
            if (own.length > rest.length || !own.every((part, index) => part.startsWith(':') || part === rest[index])) {
                continue;
            }
            const remaining = rest.slice(own.length);
            const pattern = [...prefix, ...own];
            const children = entry.children ?? loadedChildren(entry);
            const inner = children ? match(children, remaining, pattern) : null;
            if (inner) {
                return inner;
            }
            if (entry.loadChildren && !children && remaining.length) {
                return [...pattern, ...remaining.map(() => '*')];
            }
            if (!remaining.length && (entry.component || entry.loadComponent || entry.loadChildren)) {
                return pattern;
            }
        }
        return null;
    };
    const segments = stripQueryAndFragment(path).split('/').filter(Boolean).map(decodeSegment);
    const pattern = match(config, segments, []);
    return pattern ? pattern.join('/') : null;
}
function decodeSegment(segment) {
    return attempt(() => decodeURIComponent(segment), segment);
}
function loadedChildren(entry) {
    if (!entry.loadChildren) {
        return null;
    }
    // TODO: use a public accessor once the router offers one; `_loadedRoutes` is private API.
    const loaded = entry._loadedRoutes;
    return Array.isArray(loaded) ? loaded : null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Version of the {@link ClrPageContext} format; it changes only when a field changes meaning or is removed.
 * New top-level fields are added without changing it.
 */
const CLR_PAGE_CONTEXT_SCHEMA_VERSION = '1';
/**
 * JSON Schema (draft-07) of {@link ClrPageContext} at `schemaVersion` `'1'`, for consumers that validate
 * snapshots outside TypeScript. The top level accepts fields a later release adds, so ignore the ones you do
 * not know; everything below it is strict. Component `state` and the view's `metadata` are
 * application-specific and left open.
 */
const CLR_PAGE_CONTEXT_SCHEMA = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'https://clarity.design/schemas/page-context/1.json',
    title: 'ClrPageContext',
    type: 'object',
    required: ['schemaVersion', 'application', 'enabled', 'title', 'regions', 'components', 'collectedAt'],
    properties: {
        schemaVersion: { const: CLR_PAGE_CONTEXT_SCHEMA_VERSION },
        application: {
            type: 'object',
            required: ['id'],
            additionalProperties: false,
            properties: { id: { type: 'string' }, version: { type: 'string' } },
        },
        viewId: { type: 'string' },
        metadata: { type: 'object' },
        metadataState: { enum: ['loading', 'unavailable'] },
        enabled: { type: 'boolean' },
        title: { type: 'string' },
        url: { type: 'string' },
        route: {
            type: 'object',
            required: ['url'],
            additionalProperties: false,
            properties: {
                url: { type: 'string' },
                path: { type: 'string' },
                params: { $ref: '#/definitions/strings' },
                queryParams: { $ref: '#/definitions/queryParams' },
                data: { type: 'object' },
            },
        },
        availableRoutes: {
            type: 'array',
            items: {
                type: 'object',
                required: ['path'],
                additionalProperties: false,
                properties: { path: { type: 'string' }, title: { type: 'string' }, lazy: { type: 'boolean' } },
            },
        },
        regions: { type: 'array', items: { $ref: '#/definitions/component' } },
        components: { type: 'array', items: { $ref: '#/definitions/component' } },
        truncated: { type: 'boolean' },
        focus: { const: 'modal' },
        collectedAt: { type: 'string' },
    },
    definitions: {
        strings: { type: 'object', additionalProperties: { type: 'string' } },
        // A repeated query key is reported as a list.
        queryParams: {
            type: 'object',
            additionalProperties: { anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
        },
        component: {
            type: 'object',
            required: ['type'],
            additionalProperties: false,
            properties: {
                type: { type: 'string' },
                ref: { type: 'string' },
                element: { type: 'string' },
                label: { type: 'string' },
                state: { type: 'object' },
                children: { type: 'array', items: { $ref: '#/definitions/component' } },
            },
        },
    },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_GLOBAL_PROPERTY = 'clrContext';
/** How long `getSnapshotAsync` waits for each asynchronous provider by default. */
const DEFAULT_SOURCE_TIMEOUT_MS = 2000;
/** Shorter than a frame waits for its answer, so a slow provider is reported rather than the request lost. */
const FRAME_SOURCE_TIMEOUT_MS = 1000;
/** A route map cut to a handful of entries would misdescribe where the app can go. */
const MIN_ROUTE_LIMIT = 50;
/** A plain identifier, so it is reachable as `window.<name>()`. */
const GLOBAL_PROPERTY_PATTERN = /^[A-Za-z_$][\w$]*$/;
/** Builds on-demand, read-only snapshots of the current page: route, rendered components and registered context. */
class ClrContextEngineService {
    constructor() {
        this.customExtractors = [];
        this.applicationOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
        this.application = inject(CLR_CONTEXT_APPLICATION, { optional: true });
        // Refs are handed out only under a policy, so readers who never write pay nothing.
        this.mutationPolicy = inject(CLR_MUTATION_POLICY, { optional: true });
        this.refs = inject(ContextRefRegistryService);
        this.config = inject(CLR_CONTEXT_CONFIG, { optional: true });
        this.metadataLoader = inject(ClrContextMetadataLoader);
        this.locationStrategy = inject(LocationStrategy, { optional: true });
        this.platformId = inject(PLATFORM_ID);
        this.document = inject(DOCUMENT);
        this.contextRegistry = inject(ClrContextRegistryService);
        this.router = inject(Router, { optional: true });
        this.zone = inject(NgZone);
        this.frameHost = null;
        this.globalProperty = null;
    }
    ngOnDestroy() {
        this.disableFrameBridge();
        this.disableGlobalAccess();
    }
    /**
     * Takes a fresh snapshot, applying `options` over the application-wide ones; pending sources are reported as loading.
     * With a mutation policy, writable nodes carry a stable `ref`.
     */
    getSnapshot(options) {
        return this.snapshot(options, false);
    }
    /**
     * Like {@link getSnapshot}, awaiting asynchronous providers and metadata URLs for up to `timeoutMs` each
     * (2 seconds by default). When the view changes while they answer, the new view is snapshotted instead.
     */
    getSnapshotAsync(asyncOptions) {
        return this.snapshotAsync(asyncOptions, false);
    }
    /** Registers a DOM extractor for other libraries' components. Returns a function that removes it. */
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
     * Exposes the engine on `window` (`window.clrContext()` by default) for agents driving the browser.
     * Any script on the page can call it, so form values and the full URL are withheld unless allowed.
     */
    enableGlobalAccess(propertyName = DEFAULT_GLOBAL_PROPERTY, hostOptions = {}) {
        if (!GLOBAL_PROPERTY_PATTERN.test(propertyName)) {
            throw new Error(`ClrContextEngineService: "${propertyName}" is not a valid name for a global accessor.`);
        }
        const window = this.browserWindow();
        if (!window) {
            return;
        }
        const { shareFormValues, shareFullUrl, ...budgets } = hostOptions;
        const host = window;
        // A refused name leaves the existing accessor in place.
        if (propertyName in host && propertyName !== this.globalProperty) {
            throw new Error(`ClrContextEngineService: window.${propertyName} already exists and will not be replaced.`);
        }
        this.disableGlobalAccess();
        this.globalProperty = propertyName;
        const ceiling = this.untrustedCeiling(budgets);
        const accessor = (options) => {
            // The caller may ask for less than the application allows, never for more.
            const snapshot = this.snapshot(capSnapshotOptions(sanitizeUntrustedSnapshotOptions(options), ceiling), true);
            return contextForUntrustedCaller(snapshot, { shareFormValues, shareFullUrl }, url => this.routePattern(url), this.document.baseURI);
        };
        // Read-only so assignment cannot replace it; configurable so `disableGlobalAccess` can delete it.
        Object.defineProperty(host, propertyName, {
            value: accessor,
            writable: false,
            enumerable: true,
            configurable: true,
        });
    }
    /** Removes the accessor added by `enableGlobalAccess`. */
    disableGlobalAccess() {
        const window = this.browserWindow();
        if (window && this.globalProperty) {
            delete window[this.globalProperty];
        }
        this.globalProperty = null;
    }
    /** Answers context requests from embedded frames over `postMessage`; by default only same-origin frames. */
    enableFrameBridge(options) {
        const window = this.browserWindow();
        if (!window) {
            return;
        }
        // The application's options cap what the host allows, so a frame cannot undo them either.
        const ceiling = this.untrustedCeiling(options?.snapshot);
        // Built before the running bridge stops, so a refused configuration leaves current frames served.
        const frameHost = new ClrContextFrameHost(snapshotOptions => this.snapshotAsync({ ...capSnapshotOptions(snapshotOptions, ceiling), timeoutMs: FRAME_SOURCE_TIMEOUT_MS }, true), window, options, url => this.routePattern(url));
        this.disableFrameBridge();
        this.frameHost = frameHost;
        // Every `message` on the page reaches the listener, and answering renders nothing.
        this.zone.runOutsideAngular(() => frameHost.start());
    }
    /** Stops answering embedded frames. */
    disableFrameBridge() {
        this.frameHost?.stop();
        this.frameHost = null;
    }
    /** Requests the hosting page's context from inside an iframe; `null` when there is none or it does not answer. */
    requestHostContext(options) {
        if (!this.browserWindow()) {
            return Promise.resolve(null);
        }
        return clrRequestHostContext(options);
    }
    /**
     * The application and view, with nothing about the page yet. A view is not read when its
     * configuration disables it, while a configuration URL has not loaded, or, with `views: 'enabled'`,
     * when nothing gives it metadata. Once `settled`, a metadata URL that has not loaded is reported as unavailable.
     */
    viewSnapshot(options, settled) {
        const route = this.routeContext();
        const snapshot = {
            schemaVersion: CLR_PAGE_CONTEXT_SCHEMA_VERSION,
            application: this.applicationContext(),
            enabled: true,
            title: '',
            regions: [],
            components: [],
            collectedAt: new Date().toISOString(),
        };
        const loads = this.metadataUrls(options).map(url => this.metadataLoader.read(url));
        if (loads.includes(undefined) || loads.includes(null)) {
            snapshot.metadataState = settled || loads.includes(null) ? 'unavailable' : 'loading';
        }
        // A configuration that has not loaded may disable this view, so the view is not read until it has.
        if (typeof this.config === 'string' && !this.metadataLoader.read(this.config)) {
            snapshot.enabled = false;
            return snapshot;
        }
        const config = this.viewConfig(route);
        const provided = attempt(() => this.application?.metadata?.(), undefined);
        const fromPage = this.pageMetadata(options);
        // A copy, so a consumer cannot change the configuration or the loaded metadata, and a cycle cannot break it.
        const metadata = recordOrEmpty(jsonSafe({ ...recordOrEmpty(config?.metadata), ...recordOrEmpty(provided), ...fromPage }, REGION_DEPTH, true));
        const enabled = typeof config?.enabled === 'boolean'
            ? config.enabled
            : // An empty object from the application still enables the view.
                !readsEnabledViewsOnly(this.application?.views) || Object.keys(metadata).length > 0 || isRecord(provided);
        const viewId = [fromPage['viewId'], this.providedViewId(), this.routedViewId(), config?.viewId].find(id => typeof id === 'string' && id);
        if (viewId) {
            snapshot.viewId = viewId;
        }
        // A disabled view says which view it is, and nothing more.
        if (!enabled) {
            snapshot.enabled = false;
            return snapshot;
        }
        if (Object.keys(metadata).length || isRecord(provided)) {
            snapshot.metadata = metadata;
        }
        if (route) {
            snapshot.route = route;
        }
        return snapshot;
    }
    /** Metadata from `data-ai-metadata` and `data-ai-metadata-url` on the view's roots and their ancestors, inner winning. */
    pageMetadata(options) {
        const metadata = {};
        for (const host of this.metadataHosts(options)) {
            const url = host.getAttribute(CLR_AI_METADATA_URL_ATTRIBUTE);
            const inline = parseJsonObject(host.getAttribute(CLR_AI_METADATA_ATTRIBUTE), CLR_AI_METADATA_ATTRIBUTE);
            Object.assign(metadata, url ? this.metadataLoader.read(url) : null, inline);
        }
        return metadata;
    }
    metadataHosts(options) {
        if (!isPlatformBrowser(this.platformId)) {
            return [];
        }
        const roots = engineScope(this.document, options).roots ?? [this.document.body ?? this.document.documentElement];
        const excludeSelector = usableSelectors(this.document, options.excludeSelectors);
        // Metadata in a region kept from agents is kept with it.
        return viewMetadataHosts(roots.filter(Boolean)).filter(host => !closestAcrossShadow(host, `${CLR_CONTEXT_IGNORE_SELECTOR}, ${CLR_CONTEXT_REDACT_SELECTOR}`) &&
            !(excludeSelector && closestAcrossShadow(host, excludeSelector)));
    }
    /** The configuration and metadata URLs the view's description depends on. */
    metadataUrls(options) {
        const urls = this.metadataHosts(options)
            .map(host => host.getAttribute(CLR_AI_METADATA_URL_ATTRIBUTE))
            .filter((url) => !!url);
        return typeof this.config === 'string' ? [this.config, ...urls] : urls;
    }
    /** The first configured view matching the route and the page. */
    viewConfig(route) {
        const config = typeof this.config === 'string' ? this.metadataLoader.read(this.config) : this.config;
        const views = Array.isArray(config?.['views']) ? config['views'] : [];
        return views.find((view) => {
            if (!isRecord(view)) {
                return false;
            }
            const { route: pattern, selector } = view;
            return ((typeof pattern === 'string' || typeof selector === 'string') &&
                (typeof pattern !== 'string' || pattern.replace(/^\//, '') === route?.path) &&
                (typeof selector !== 'string' || attempt(() => !!this.document.querySelector(selector), false)));
        });
    }
    /** With `untrusted`, what application code published is cut to the state keys it marks public. */
    snapshot(options, untrusted) {
        const resolved = resolveSnapshotOptions(withCallOptions(this.applicationOptions, options));
        const snapshot = this.viewSnapshot(resolved, false);
        if (!snapshot.enabled) {
            return snapshot;
        }
        const regions = this.contextRegistry.collect({ filter: this.regionFilter(resolved), limits: resolved, untrusted });
        return this.describePage(snapshot, resolved, regions, untrusted);
    }
    /** After a navigation, the new view's providers are awaited once more; then it settles for a synchronous snapshot. */
    async snapshotAsync(asyncOptions, untrusted, retries = 1) {
        const { timeoutMs, ...options } = asyncOptions ?? {};
        const resolved = resolveSnapshotOptions(withCallOptions(this.applicationOptions, options));
        const urls = this.metadataUrls(resolved);
        const waitMs = usableTimeout(timeoutMs, DEFAULT_SOURCE_TIMEOUT_MS);
        if (urls.length) {
            await this.metadataLoader.settle(urls, waitMs);
        }
        const view = this.viewSnapshot(resolved, true);
        if (!view.enabled) {
            return view;
        }
        const address = this.address();
        const regions = await this.contextRegistry.collectAsync({
            filter: this.regionFilter(resolved),
            timeoutMs: waitMs,
            limits: resolved,
            untrusted,
        });
        const snapshot = this.viewSnapshot(resolved, true);
        // The answers are the old view's: a view id is optional, so the address is compared too.
        if (snapshot.viewId !== view.viewId || snapshot.enabled !== view.enabled || this.address() !== address) {
            return retries > 0 ? this.snapshotAsync(asyncOptions, untrusted, retries - 1) : this.snapshot(options, untrusted);
        }
        // The page is read once providers have answered, so a region redacted meanwhile is read as it is now.
        return this.describePage(snapshot, resolved, regions, untrusted);
    }
    describePage(snapshot, resolved, regions, untrusted) {
        snapshot.title = this.document.title;
        snapshot.url = this.currentUrl();
        setRegions(snapshot, regions, resolved);
        if (resolved.includeRoutes && this.router?.config.length) {
            const limit = Math.max(resolved.maxItemsPerCollection, MIN_ROUTE_LIMIT);
            snapshot.availableRoutes = availableRoutes(this.router.config, limit);
        }
        if (isPlatformBrowser(this.platformId) && resolved.includeDomComponents) {
            // Untrusted callers never get refs: they cannot write.
            const refs = !untrusted && this.mutationPolicy ? this.refs.begin() : null;
            const tree = collectContextTreeWithin(this.document, resolved, this.customExtractors, refs, untrusted);
            refs?.commit(tree.components);
            snapshot.components = tree.components;
            if (tree.truncated) {
                snapshot.truncated = true;
            }
            if (tree.focus) {
                snapshot.focus = tree.focus;
            }
        }
        return snapshot;
    }
    applicationContext() {
        if (!this.application) {
            return { id: this.document.location?.hostname ?? '' };
        }
        const { id, version } = this.application;
        return version ? { id, version } : { id };
    }
    providedViewId() {
        return attempt(() => this.application?.viewId?.(), undefined);
    }
    /** The deepest route's own `data.viewId`: a child route does not inherit its parent's view. */
    routedViewId() {
        let route = this.router?.config.length ? this.router.routerState.snapshot.root : null;
        while (route?.firstChild) {
            route = route.firstChild;
        }
        return route?.routeConfig?.data?.['viewId'];
    }
    /** Annotations follow their element: left out where it would be, stateless inside a redacted region. */
    regionFilter(options) {
        if (!isPlatformBrowser(this.platformId)) {
            return () => 'keep';
        }
        const scope = engineScope(this.document, options);
        const excludeSelector = usableSelectors(this.document, options.excludeSelectors);
        return element => {
            if (!element) {
                return 'keep';
            }
            if (isHiddenFromEngine(element, excludeSelector)) {
                return 'drop';
            }
            if (scope.roots &&
                !scope.roots.some(root => containsAcrossShadow(root, element) || containsAcrossShadow(element, root))) {
                return 'drop';
            }
            return closestAcrossShadow(element, CLR_CONTEXT_REDACT_SELECTOR) ? 'redact' : 'keep';
        };
    }
    /** The most an untrusted caller may get: the host can narrow the application's options, never widen them. */
    untrustedCeiling(hostCeiling) {
        const application = this.applicationOptions ?? undefined;
        return resolveSnapshotOptions(capSnapshotOptions(withCallOptions(application, hostCeiling), application));
    }
    browserWindow() {
        return isPlatformBrowser(this.platformId) ? this.document.defaultView : null;
    }
    /** Where the application is, as its router sees it. */
    address() {
        return this.router?.url ?? this.currentUrl();
    }
    currentUrl() {
        if (isPlatformBrowser(this.platformId) && this.document.location) {
            return this.document.location.href;
        }
        return this.router?.url;
    }
    routePattern(url) {
        if (!this.router || !this.router.config.length) {
            return null;
        }
        if (this.locationStrategy instanceof HashLocationStrategy) {
            const page = this.document.location?.pathname;
            return page !== undefined && url.pathname === page && url.hash.startsWith('#/')
                ? routePatternFor(this.router.config, url.hash.slice(1))
                : null;
        }
        const base = this.basePath();
        return url.pathname.startsWith(base)
            ? routePatternFor(this.router.config, url.pathname.slice(base.length - 1))
            : null;
    }
    basePath() {
        try {
            const href = this.locationStrategy?.getBaseHref() || new URL('.', this.document.baseURI).href;
            const path = new URL(href, this.document.baseURI).pathname;
            return path.endsWith('/') ? path : `${path}/`;
        }
        catch {
            return '/';
        }
    }
    routeContext() {
        // The router is root-provided even without routing; an empty config would only add a misleading `/`.
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
            else if (route.routeConfig?.matcher) {
                // A custom matcher has no pattern; report its segments as `*`, never their values.
                pathSegments.push(...route.url.map(() => '*'));
            }
            Object.assign(params, route.params);
            // `route.data` on the snapshot also carries resolver results, which are application data.
            for (const [key, value] of Object.entries(route.routeConfig?.data ?? {})) {
                const serializable = jsonSafe(value, ROUTE_DATA_DEPTH);
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextEngineService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextEngineService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextEngineService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
function recordOrEmpty(value) {
    return isRecord(value) ? value : {};
}
/** Whether only enabled views are read; an unrecognised `views` value reads only those, failing closed. */
function readsEnabledViewsOnly(views) {
    return views !== undefined && views !== 'all';
}
/** Regions are not walked, so they get a component budget of their own. */
function setRegions(snapshot, regions, options) {
    const budget = { remaining: options.maxComponents, truncated: false };
    snapshot.regions = charged(regions, budget);
    if (budget.truncated) {
        snapshot.truncated = true;
    }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** Compares two snapshots, matching nodes level by level by role, element and label, since nodes have no ids. */
function clrDiffContext(previous, current) {
    const change = {
        previous,
        current,
        added: [],
        removed: [],
        changed: [],
        routeChanged: !previous || serialize(previous.route) !== serialize(current.route) || previous.url !== current.url,
        viewChanged: !previous ||
            serialize(previous.application) !== serialize(current.application) ||
            previous.viewId !== current.viewId ||
            previous.enabled !== current.enabled ||
            serialize(previous.metadata) !== serialize(current.metadata),
        regionsChanged: !previous || serialize(previous.regions) !== serialize(current.regions),
        titleChanged: !previous || previous.title !== current.title,
    };
    diffLevel(previous?.components ?? [], current.components, change);
    return change;
}
/** Whether a change carries anything at all. */
function clrIsEmptyContextChange(change) {
    return (!change.added.length &&
        !change.removed.length &&
        !change.changed.length &&
        !change.routeChanged &&
        !change.viewChanged &&
        !change.regionsChanged &&
        !change.titleChanged);
}
function diffLevel(before, after, change) {
    const previousByKey = keyed(before);
    const currentByKey = keyed(after);
    for (const [key, node] of currentByKey) {
        const counterpart = previousByKey.get(key);
        if (!counterpart) {
            change.added.push(node);
            continue;
        }
        if (serialize(counterpart.state) !== serialize(node.state)) {
            change.changed.push({ before: withoutChildren(counterpart), after: withoutChildren(node) });
        }
        diffLevel(counterpart.children ?? [], node.children ?? [], change);
    }
    for (const [key, node] of previousByKey) {
        if (!currentByKey.has(key)) {
            change.removed.push(withoutChildren(node));
        }
    }
}
function keyed(nodes) {
    const seen = new Map();
    const result = new Map();
    for (const node of nodes) {
        const identity = `${node.type}|${node.element ?? ''}|${node.label ?? ''}`;
        const occurrence = seen.get(identity) ?? 0;
        seen.set(identity, occurrence + 1);
        result.set(`${identity}#${occurrence}`, node);
    }
    return result;
}
function withoutChildren(node) {
    const shallow = { ...node };
    delete shallow.children;
    return shallow;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const DEFAULT_DEBOUNCE_MS = 300;
const DEFAULT_MAX_WAIT_MS = 2000;
/** A shorter quiet period, `0` or `NaN` included, would scrape on every mutation. */
const MIN_DEBOUNCE_MS = 10;
/**
 * Streams the page context, re-scraping after DOM, value and annotation changes. Each scrape waits for
 * asynchronous providers, as `getSnapshotAsync` does; one runs at a time, and changes made meanwhile
 * lead to one more. A provider whose answer changes the page, such as a loading bar, is asked again
 * after the next quiet period, so it is never asked more often than `debounceMs` allows.
 */
class ClrContextTrackerService {
    constructor() {
        this.errorHandler = inject(ErrorHandler);
        this.contextSubject = new ReplaySubject(1);
        this.changesSubject = new Subject();
        this.trackingOptions = {};
        this.tracking = false;
        this.observer = null;
        this.quietTimer = null;
        this.maxWaitTimer = null;
        this.stopListeningForValues = null;
        this.frames = new Map();
        /** Observers do not cross shadow boundaries, so each open shadow root gets its own. */
        this.shadowObservers = new Map();
        this.subscriptions = null;
        this.latest = null;
        this.latestSerialized = null;
        /** Bumped by each scrape, `refresh` and `stop`, so a slower earlier scrape never overwrites a newer snapshot. */
        this.scrapeRun = 0;
        /** One scrape at a time: a change during one marks the page dirty, and one more scrape follows. */
        this.scrapeInFlight = false;
        this.scrapeDirty = false;
        this.destroyed = false;
        this.sharedUsers = 0;
        this.sharedStarted = false;
        this.platformId = inject(PLATFORM_ID);
        this.document = inject(DOCUMENT);
        this.contextEngine = inject(ClrContextEngineService);
        this.contextRegistry = inject(ClrContextRegistryService);
        this.zone = inject(NgZone);
        this.router = inject(Router, { optional: true });
        // A completed ReplaySubject still replays: once destroyed, a new subscriber gets nothing.
        this.context$ = defer(() => (this.destroyed ? EMPTY : this.contextSubject.asObservable()));
        this.changes$ = this.changesSubject.asObservable();
    }
    /** The latest snapshot, or `null` before tracking starts. */
    get currentContext() {
        return this.latest;
    }
    /** Whether the tracker is watching the page. */
    get isTracking() {
        return this.tracking;
    }
    ngOnDestroy() {
        this.destroyed = true;
        this.stop();
        // The last snapshot describes the whole page and should not outlive the injector.
        this.latest = null;
        this.latestSerialized = null;
        this.contextSubject.complete();
        this.changesSubject.complete();
    }
    /**
     * Starts tracking with an immediate snapshot. Calling it again restarts with the new options. Tracking
     * started here runs until `stop`, even after the last `track()` subscriber leaves. An open shadow root
     * attached to an element already on the page is watched from the next snapshot; `refresh` takes one.
     */
    start(options = {}) {
        this.sharedStarted = false;
        this.begin(options);
    }
    /**
     * The page context, tracked while anyone subscribes; the last subscriber to leave stops tracking.
     * Options apply to every consumer, since there is one tracker.
     */
    track(options) {
        return new Observable(subscriber => {
            if (this.sharedUsers++ === 0) {
                this.sharedStarted = !this.tracking;
            }
            if (options || !this.tracking) {
                try {
                    this.begin(options);
                }
                catch (error) {
                    this.errorHandler.handleError(error);
                }
            }
            const subscription = this.context$.subscribe(subscriber);
            return () => {
                subscription.unsubscribe();
                if (--this.sharedUsers === 0 && this.sharedStarted) {
                    this.sharedStarted = false;
                    this.stop();
                }
            };
        });
    }
    /** Stops tracking and disconnects the observers. */
    stop() {
        this.tracking = false;
        this.scrapeRun++;
        this.scrapeDirty = false;
        this.observer?.disconnect();
        this.observer = null;
        this.stopListeningForValues?.();
        this.stopListeningForValues = null;
        for (const [frame, tracked] of this.frames) {
            this.detachFrame(frame, tracked);
        }
        this.frames.clear();
        for (const observer of this.shadowObservers.values()) {
            observer.disconnect();
        }
        this.shadowObservers.clear();
        this.subscriptions?.unsubscribe();
        this.subscriptions = null;
        this.clearTimers();
    }
    /**
     * Takes a new snapshot now instead of waiting for a change; asynchronous providers follow when they
     * answer, even when the tracker is not started.
     */
    refresh() {
        // A scrape already under way describes the page as it was; its result is dropped.
        this.scrapeRun++;
        const snapshot = this.contextEngine.getSnapshot(this.trackingOptions.snapshot);
        this.emit(snapshot);
        this.zone.runOutsideAngular(() => this.observeShadowRootsIn(this.document));
        const loading = snapshot.metadataState === 'loading' || snapshot.regions.some(region => region.type === CLR_CONTEXT_LOADING_TYPE);
        if (!loading) {
            return;
        }
        if (this.scrapeInFlight) {
            this.scrapeDirty = true;
        }
        else {
            this.zone.runOutsideAngular(() => this.scrape(true));
        }
    }
    begin(options = {}) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.stop();
        this.tracking = true;
        this.trackingOptions = options;
        this.latest = null;
        this.latestSerialized = null;
        // Outside the zone: zone.js patches MutationObserver and would run change detection on every batch.
        this.zone.runOutsideAngular(() => {
            this.observer = this.observeDocument(this.document);
            this.observeShadowRootsIn(this.document);
            this.observeFrames();
            this.stopListeningForValues = listenForValues(this.document.body, event => this.onValueChange(event));
            this.subscriptions = this.contextRegistry.changes$.subscribe(() => this.scheduleScrape());
            // A navigation that reuses the component may change nothing in the DOM, only the route.
            this.subscriptions.add(this.router?.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.scheduleScrape()));
        });
        this.refresh();
    }
    emit(snapshot, serialized = serializeSnapshot(snapshot)) {
        const previous = this.latest;
        this.latest = snapshot;
        this.latestSerialized = serialized;
        this.contextSubject.next(snapshot);
        if (this.changesSubject.observed) {
            this.changesSubject.next(clrDiffContext(previous, snapshot));
        }
    }
    onMutations(records) {
        // Shadow roots arrive with their hosts; observers do not cross into them.
        for (const record of records) {
            for (const node of Array.from(record.addedNodes)) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    this.observeShadowRootsIn(node);
                }
            }
        }
        // Ignoring a region changes what the snapshot holds, though the element is then inside it.
        const unchanged = (record) => (record.attributeName !== CLR_CONTEXT_IGNORE_ATTRIBUTE && isInsideIgnoredRegion(record.target)) ||
            isPlacementOnly(record);
        if (records.every(unchanged)) {
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
    scheduleScrape() {
        if (!this.tracking) {
            return;
        }
        if (this.quietTimer !== null) {
            clearTimeout(this.quietTimer);
        }
        // An annotation change arrives inside the zone; scraping there would rerun change detection app-wide.
        const debounceMs = Math.max(usableTimeout(this.trackingOptions.debounceMs, DEFAULT_DEBOUNCE_MS), MIN_DEBOUNCE_MS);
        const maxWaitMs = Math.max(usableTimeout(this.trackingOptions.maxWaitMs, DEFAULT_MAX_WAIT_MS), debounceMs);
        this.zone.runOutsideAngular(() => {
            this.quietTimer = setTimeout(() => this.scrape(), debounceMs);
            if (this.maxWaitTimer === null) {
                this.maxWaitTimer = setTimeout(() => this.scrape(), maxWaitMs);
            }
        });
    }
    /** Scrapes once at a time; `pending` also runs it untracked, to settle a `refresh`. */
    async scrape(pending = false) {
        this.clearTimers();
        if (!this.tracking && !pending) {
            return;
        }
        if (this.scrapeInFlight) {
            this.scrapeDirty = true;
            return;
        }
        this.scrapeInFlight = true;
        const run = ++this.scrapeRun;
        try {
            const snapshot = await this.contextEngine.getSnapshotAsync(this.trackingOptions.snapshot);
            if (run !== this.scrapeRun) {
                return;
            }
            const serialized = serializeSnapshot(snapshot);
            if (serialized === null || serialized !== this.latestSerialized) {
                this.zone.run(() => this.emit(snapshot, serialized));
            }
        }
        catch (error) {
            this.errorHandler.handleError(error);
        }
        finally {
            this.scrapeInFlight = false;
            this.zone.runOutsideAngular(() => {
                this.observeFrames();
                this.forgetDetachedShadowRoots();
                // Attaching a shadow root is no DOM mutation, so roots attached to hosts already on the page are found here.
                this.observeShadowRootsIn(this.document);
                if (this.scrapeDirty) {
                    this.scrapeDirty = false;
                    // Untracked, only a `refresh` marks the page dirty, and it is still owed its answer.
                    if (this.tracking) {
                        this.scheduleScrape();
                    }
                    else {
                        this.scrape(true);
                    }
                }
            });
        }
    }
    observeDocument(target) {
        // The title lives in the head, so the whole document is observed.
        return this.observeTree(target.documentElement);
    }
    observeTree(target) {
        const observer = new MutationObserver(records => this.onMutations(records));
        observer.observe(target, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true,
            characterData: true,
        });
        return observer;
    }
    /** Watches same-origin frames, nested ones too; an unreadable frame is watched for `load` instead. */
    observeFrames() {
        if (!this.tracking) {
            return;
        }
        const present = new Set();
        for (const frame of allFrames([this.document, ...this.shadowObservers.keys()])) {
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
                this.frames.set(frame, { document: null, observer: null, stopListeningForValues: null, loadListener: onLoad });
                continue;
            }
            this.observeShadowRootsIn(contents);
            this.frames.set(frame, {
                document: contents,
                observer: this.observeDocument(contents),
                stopListeningForValues: listenForValues(contents.body, event => this.onValueChange(event)),
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
    /** Observes the open shadow roots in `root`, its own included, that are not observed yet. */
    observeShadowRootsIn(root) {
        if (!this.tracking) {
            return;
        }
        for (const shadowRoot of openShadowRoots(root)) {
            if (!this.shadowObservers.has(shadowRoot)) {
                this.shadowObservers.set(shadowRoot, this.observeTree(shadowRoot));
            }
        }
    }
    forgetDetachedShadowRoots() {
        // A removed frame's document lives on with its hosts connected to it, so only tracked documents count.
        const documents = new Set([this.document]);
        for (const tracked of this.frames.values()) {
            if (tracked.document) {
                documents.add(tracked.document);
            }
        }
        for (const [shadowRoot, observer] of this.shadowObservers) {
            if (!shadowRoot.host.isConnected || !documents.has(shadowRoot.host.ownerDocument)) {
                observer.disconnect();
                this.shadowObservers.delete(shadowRoot);
            }
        }
    }
    detachFrame(frame, tracked) {
        frame.removeEventListener('load', tracked.loadListener);
        tracked.observer?.disconnect();
        tracked.stopListeningForValues?.();
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextTrackerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextTrackerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextTrackerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });
/** Typing changes the `value` property, not the attribute, so a MutationObserver never sees it. */
function listenForValues(body, listener) {
    body.addEventListener('input', listener, true);
    body.addEventListener('change', listener, true);
    return () => {
        body.removeEventListener('input', listener, true);
        body.removeEventListener('change', listener, true);
    };
}
/** The frames in `roots`, which include the observed shadow roots, and in their readable documents. */
function allFrames(roots) {
    const frames = new Set();
    for (const root of roots) {
        for (const frame of Array.from(root.querySelectorAll('iframe'))) {
            if (frames.has(frame) || closestAcrossShadow(frame, CLR_CONTEXT_IGNORE_SELECTOR)) {
                continue;
            }
            frames.add(frame);
            const contents = readableDocument(frame);
            if (contents) {
                allFrames([contents]).forEach(nested => frames.add(nested));
            }
        }
    }
    return frames;
}
function readableDocument(frame) {
    const contents = attempt(() => frame.contentDocument, null);
    return contents?.body ? contents : null;
}
function isInsideIgnoredRegion(node) {
    // A node in a frame is an instance of that window's Element, so `instanceof` would fail.
    const element = node.nodeType === Node.ELEMENT_NODE
        ? node
        : (node.parentElement ?? node.getRootNode().host ?? null);
    return !!element && !!closestAcrossShadow(element, CLR_CONTEXT_IGNORE_SELECTOR);
}
// A custom property can feed any of these, so a change to one counts too.
const VISIBILITY_DECLARATIONS = /(?:^|;)\s*(?:display|visibility|opacity|content-visibility|--[\w-]+)\s*:[^;]*/gi;
/** Whether a mutation only moved or resized something, e.g. a popover repositioning on scroll. */
function isPlacementOnly(record) {
    if (record.type !== 'attributes' || record.attributeName !== 'style') {
        return false;
    }
    const visibility = (style) => (style?.match(VISIBILITY_DECLARATIONS) ?? [])
        .join(';')
        .replace(/[\s;]+/g, ' ')
        .trim();
    return visibility(record.oldValue) === visibility(record.target.getAttribute('style'));
}
/** The snapshot as text without its timestamp, or `null` when it cannot be serialised. */
function serializeSnapshot(snapshot) {
    return serialize({ ...snapshot, collectedAt: undefined });
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Describes everything rendered under `root` as a tree, and whether the budget ran out. Internal: it skips the
 * application's options, the enabled-views gate and registered extractors, so apps go through the engine.
 * `customExtractors` describe markup with neither a role nor an accessible name.
 */
function clrCollectDomContextTree(root, options, customExtractors = []) {
    return collectContextTreeWithin(root, resolveSnapshotOptions(options), customExtractors);
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Annotates a piece of UI with context for AI agents, such as what a section is for:
 * ```html
 * <section clrContext="Firewall rules for the selected cluster" [clrContextState]="{ cluster: clusterName }">
 * ```
 */
class ClrContext {
    constructor() {
        /** Human-readable description of what this piece of UI is about. */
        this.label = '';
        /** Kind of UI this annotation describes. Defaults to `'region'`. */
        this.type = 'region';
        /** Current application state an agent should know about, as a small serializable object. */
        this.state = null;
        /** State keys untrusted callers (`window.clrContext()`, frames) may see; every other key is withheld. */
        this.publicKeys = null;
        this.lastReported = '';
        this.host = inject(ElementRef, { optional: true });
        this.contextRegistry = inject(ClrContextRegistryService);
    }
    ngOnInit() {
        this.lastReported = this.serialized();
        this.contextRegistry.register(this, this.anchor() ?? undefined);
    }
    ngDoCheck() {
        // An annotation inside an ignored region never reaches a snapshot, so its changes don't count.
        const anchor = this.anchor();
        if (anchor && closestAcrossShadow(anchor, CLR_CONTEXT_IGNORE_SELECTOR)) {
            return;
        }
        // Serialised on every check to catch a state object edited in place; keep the state small.
        const current = this.serialized();
        if (current !== this.lastReported) {
            this.lastReported = current;
            this.contextRegistry.notifyChanged();
        }
    }
    ngOnDestroy() {
        this.contextRegistry.unregister(this);
    }
    /** The context this element publishes, or `null` when it is ignored. */
    getClrContext() {
        const serialized = this.serialized();
        return serialized ? JSON.parse(serialized) : null;
    }
    annotation() {
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
        if (this.publicKeys?.length) {
            context.publicKeys = this.publicKeys;
        }
        return context;
    }
    serialized() {
        try {
            const annotation = this.annotation();
            return annotation ? JSON.stringify(annotation) : '';
        }
        catch {
            return '';
        }
    }
    /** On an `<ng-container>`, the element it sits in, or the host of the shadow root it sits at the top of. */
    anchor() {
        const node = this.host?.nativeElement;
        if (node?.nodeType === Node.ELEMENT_NODE) {
            return node;
        }
        return node?.parentElement ?? node?.parentNode?.host ?? null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContext, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "22.1.2", type: ClrContext, isStandalone: true, selector: "[clrContext]", inputs: { label: ["clrContext", "label"], type: ["clrContextType", "type"], state: ["clrContextState", "state"], publicKeys: ["clrContextPublicKeys", "publicKeys"] }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContext, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrContext]',
                }]
        }], propDecorators: { label: [{
                type: Input,
                args: ['clrContext']
            }], type: [{
                type: Input,
                args: ['clrContextType']
            }], state: [{
                type: Input,
                args: ['clrContextState']
            }], publicKeys: [{
                type: Input,
                args: ['clrContextPublicKeys']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/** The standalone directives {@link ClrContextModule} imports and exports. */
const CLR_CONTEXT_DIRECTIVES = [ClrContext];
/** Makes the standalone `clrContext` directive available to NgModule applications. */
class ClrContextModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "22.1.2", ngImport: i0, type: ClrContextModule, imports: [ClrContext], exports: [ClrContext] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextModule }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrContextModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CLR_CONTEXT_DIRECTIVES],
                    exports: [CLR_CONTEXT_DIRECTIVES],
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Fills `:param` segments, one literal segment per value. `.` and `..` are refused: the router would
 * step up the path to a route nobody classified.
 */
function fillRoutePath(pattern, params = {}) {
    const segments = [];
    for (const segment of pattern.split('/').filter(Boolean)) {
        if (!segment.startsWith(':')) {
            segments.push(segment);
            continue;
        }
        const name = segment.slice(1);
        const value = params[name];
        if (typeof value !== 'string' || !value) {
            return { missing: name };
        }
        if (value === '.' || value === '..') {
            return { invalid: name };
        }
        segments.push(value);
    }
    return { segments };
}
/** Built directly: `createUrlTree` would split at slashes and read `..` as a step up. */
function urlTreeFor(segments, queryParams = {}) {
    const children = segments.length
        ? {
            primary: new UrlSegmentGroup(segments.map(path => new UrlSegment(path, {})), {}),
        }
        : {};
    return new UrlTree(new UrlSegmentGroup([], children), queryParams);
}
const NAVIGATION_TIMEOUT_MS = 60_000;
/**
 * Navigates and reports the outcome from the router's events: its promise is `true` after a redirect
 * and `false` for a skipped no-op.
 */
function navigateAndReport(router, target, zone) {
    const requested = router.serializeUrl(target);
    return new Promise(resolve => {
        let id = null;
        let redirected = false;
        let followedRedirect = false;
        let timer = null;
        const settle = (report) => {
            subscription.unsubscribe();
            if (timer !== null) {
                clearTimeout(timer);
            }
            resolve(report);
        };
        const subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                // This navigation, by destination, and after a guard redirect, the redirect's own navigation.
                if ((id === null && event.url === requested) || redirected) {
                    id = event.id;
                    redirected = false;
                }
                return;
            }
            // A skipped navigation never starts, so it is the first thing heard of it.
            if (event instanceof NavigationSkipped && id === null && event.url === requested) {
                id = event.id;
            }
            if (!('id' in event) || event.id !== id) {
                return;
            }
            if (event instanceof NavigationEnd) {
                settle({
                    outcome: followedRedirect || event.urlAfterRedirects !== requested ? 'redirected' : 'navigated',
                    url: router.url,
                });
            }
            else if (event instanceof NavigationCancel) {
                if (event.code === NavigationCancellationCode.Redirect) {
                    redirected = true;
                    followedRedirect = true;
                    return;
                }
                settle({ ...cancellation(event.code), url: router.url });
            }
            else if (event instanceof NavigationSkipped) {
                settle(event.code === NavigationSkippedCode.IgnoredSameUrlNavigation
                    ? { outcome: 'unchanged', url: router.url }
                    : { outcome: 'failed', url: router.url, detail: 'The application does not let the router handle this URL.' });
            }
            else if (event instanceof NavigationError) {
                settle({ outcome: 'failed', url: router.url, detail: errorMessage(event.error) });
            }
        });
        // A guard waiting on the user can hold a navigation indefinitely. Timed outside the zone to keep the app stable.
        timer = zone.runOutsideAngular(() => setTimeout(() => settle({
            outcome: 'failed',
            url: router.url,
            detail: 'The navigation had not settled after a minute; it may still complete.',
        }), NAVIGATION_TIMEOUT_MS));
        router.navigateByUrl(target).then(() => {
            zone.runOutsideAngular(() => setTimeout(() => {
                if (!subscription.closed) {
                    const url = router.url;
                    settle(url === requested ? { outcome: 'navigated', url } : { outcome: 'failed', url });
                }
            }));
        }, error => settle({ outcome: 'failed', url: router.url, detail: errorMessage(error) }));
    });
}
function cancellation(code) {
    switch (code) {
        case NavigationCancellationCode.GuardRejected:
            return { outcome: 'rejected', detail: 'A route guard refused the navigation.' };
        case NavigationCancellationCode.SupersededByNewNavigation:
            return { outcome: 'superseded', detail: 'Another navigation started before this one finished.' };
        case NavigationCancellationCode.NoDataFromResolver:
            return { outcome: 'failed', detail: 'A route resolver completed without data.' };
        default:
            return { outcome: 'failed', detail: 'The navigation was cancelled.' };
    }
}
function errorMessage(error) {
    return error instanceof Error ? error.message : String(error ?? 'The navigation failed.');
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CONFIRM_TIMEOUT_MS = 120_000;
/**
 * Fills form controls and navigates for an AI agent, from the refs and routes in snapshots; never submits or clicks.
 * For application code only: results carry unwithheld page values, so no untrusted surface exposes it.
 */
class ClrMutationEngineService {
    constructor() {
        this.contextEngine = inject(ClrContextEngineService);
        this.refs = inject(ContextRefRegistryService);
        this.policy = inject(CLR_MUTATION_POLICY, { optional: true });
        this.router = inject(Router, { optional: true });
        this.zone = inject(NgZone);
        this.application = inject(ApplicationRef);
        this.contextOptions = inject(CLR_CONTEXT_OPTIONS, { optional: true });
        // Batches run one at a time so agent turns do not interleave.
        this.queue = Promise.resolve();
    }
    /** What applying the operations would do, without doing it. Pass the same `snapshotOptions` as `apply()`. */
    plan(operations, snapshotOptions) {
        const options = this.scopeOptions(snapshotOptions);
        return listOf(operations).map(operation => {
            const prepared = this.prepareSafely(operation, options);
            if ('refused' in prepared) {
                return { operation, refused: prepared.refused, detail: prepared.detail };
            }
            const entry = { operation, target: prepared.target, consequence: prepared.consequence };
            const blocked = this.verdict(prepared.consequence);
            if (blocked) {
                entry.refused = blocked.refused;
                entry.detail = blocked.detail;
            }
            return entry;
        });
    }
    /** Applies the operations in order and reports each result, a fresh snapshot and the changes. */
    apply(operations, snapshotOptions) {
        const run = this.queue.then(() => this.run(operations, snapshotOptions));
        this.queue = run.catch(() => undefined);
        return run;
    }
    async run(operations, snapshotOptions) {
        const before = this.contextEngine.getSnapshot(snapshotOptions);
        const options = this.scopeOptions(snapshotOptions);
        const results = [];
        for (const operation of listOf(operations)) {
            try {
                results.push(await this.applyOne(operation, options));
            }
            catch (error) {
                results.push(refusal(operation, 'unsupported', unforeseen(error)));
            }
        }
        await this.catchUp();
        const snapshot = this.contextEngine.getSnapshot(snapshotOptions);
        const report = {
            results,
            snapshot,
            changes: withoutSnapshots(clrDiffContext(before, snapshot)),
        };
        // The application's announcement failing must not lose the report.
        attempt(() => this.policy?.announce?.(report), undefined);
        return report;
    }
    /** Asks `confirm` for at most `confirmTimeoutMs`; the timer runs outside the zone so the app can stabilise. */
    async confirm(target) {
        const limit = this.policy?.confirmTimeoutMs;
        const timeoutMs = typeof limit === 'number' && Number.isFinite(limit) && limit >= 0 ? limit : CONFIRM_TIMEOUT_MS;
        let timer;
        const answer = Promise.resolve()
            .then(() => this.policy?.confirm?.(target))
            .then(confirmed => confirmed === true, () => false);
        const expiry = timeoutMs > 0
            ? new Promise(resolve => {
                this.zone.runOutsideAngular(() => (timer = setTimeout(() => resolve('timeout'), timeoutMs)));
            })
            : null;
        try {
            return await (expiry ? Promise.race([answer, expiry]) : answer);
        }
        finally {
            clearTimeout(timer);
        }
    }
    async applyOne(operation, options) {
        let prepared = this.prepare(operation, options);
        if ('refused' in prepared) {
            return refusal(operation, prepared.refused, prepared.detail);
        }
        const blocked = this.verdict(prepared.consequence);
        if (blocked) {
            return refusal(operation, blocked.refused, blocked.detail);
        }
        if (prepared.consequence === 'consequential') {
            prepared = await this.confirmAndRecheck(operation, prepared, options);
            if ('refused' in prepared) {
                return refusal(operation, prepared.refused, prepared.detail);
            }
        }
        if (prepared.kind === 'navigate') {
            return this.navigate(prepared);
        }
        const { write, coerced } = prepared;
        let outcome;
        try {
            outcome = this.zone.run(() => writeValue(write, coerced));
        }
        catch (error) {
            outcome = {
                applied: false,
                refused: 'invalid',
                detail: error instanceof Error ? error.message : 'The control failed to take the value.',
            };
        }
        markViewForCheck(write.element);
        return { operation: prepared.operation.operation, ref: prepared.operation.ref, ...outcome };
    }
    /** Re-prepares after confirmation: the operation is written only if it is still exactly what was agreed to. */
    async confirmAndRecheck(operation, prepared, options) {
        // Modals open now are obstacles; one the application opens to ask the person is not.
        const knownModals = new Set(prepared.kind === 'write' ? openModalDialogs(prepared.write.control.ownerDocument) : []);
        const confirmed = await this.confirm(prepared.target);
        if (confirmed !== true) {
            return {
                refused: 'declined',
                detail: confirmed === 'timeout'
                    ? 'The confirmation was not answered in time.'
                    : 'The application declined the operation.',
            };
        }
        await this.catchUp();
        const again = this.prepare(operation, options, knownModals);
        if ('refused' in again || sameOperation(prepared, again)) {
            return again;
        }
        return {
            refused: 'stale',
            detail: 'The page changed while the operation waited for confirmation. Take a new snapshot and ask again.',
        };
    }
    /** Checks every view (zoneless apps, writes outside the zone) and lets scheduled work run. */
    async catchUp() {
        this.zone.run(() => this.application.tick());
        await settle(this.zone);
    }
    prepareSafely(operation, options) {
        try {
            return this.prepare(operation, options);
        }
        catch (error) {
            return { refused: 'unsupported', detail: unforeseen(error) };
        }
    }
    scopeOptions(snapshotOptions) {
        return resolveSnapshotOptions(withCallOptions(this.contextOptions, snapshotOptions));
    }
    prepare(operation, options, knownModals) {
        if (!this.policy) {
            return { refused: 'unclassified', detail: 'The application has not provided a mutation policy.' };
        }
        if (!operation || typeof operation !== 'object') {
            return { refused: 'unsupported', detail: 'An operation is expected.' };
        }
        if (operation.operation === 'navigate') {
            return this.prepareNavigation(operation);
        }
        if (operation.operation !== 'setValue' && operation.operation !== 'clear') {
            return { refused: 'unsupported', detail: 'Supported operations are setValue, clear and navigate.' };
        }
        // A missing value is malformed, not a request to clear: `clear` says that.
        if (operation.operation === 'setValue' && operation.value === undefined) {
            return { refused: 'unsupported', detail: 'setValue needs a value; use clear to empty the control.' };
        }
        if (typeof operation.ref !== 'string' || !operation.ref) {
            return {
                refused: 'unsupported',
                detail: 'The operation names no ref; only a node with a ref can be written to.',
            };
        }
        const ref = this.refs.resolve(operation.ref);
        if (!ref) {
            return {
                refused: 'stale',
                detail: 'The ref does not name anything on the page. Take a new snapshot and use its refs.',
            };
        }
        const resolution = resolveWriteTarget(ref, this.application, options, knownModals);
        if ('refused' in resolution) {
            return resolution;
        }
        const write = resolution.target;
        // A ref outlives its snapshot, which may have used wider options; what these options leave out is not written.
        if (isOutsideSnapshot(write.element, options) ||
            (write.control !== write.element && isOutsideSnapshot(write.control, options)) ||
            options.excludeRoles.includes(write.type)) {
            return { refused: 'hidden', detail: 'The control is outside what snapshots with these options describe.' };
        }
        if (!descriptionMatches(operation.description, write.label, write.type)) {
            return {
                refused: 'mismatch',
                detail: write.label
                    ? `The node is "${write.label}", not "${String(operation.description)}". Take a new snapshot and use its refs.`
                    : 'The node has no name; describe it by what it is, or give an empty string as the description.',
            };
        }
        const coerced = coerceValue(write, operation.operation === 'clear' ? null : operation.value);
        if (coerced.refused !== undefined) {
            return { refused: 'invalid', detail: coerced.refused };
        }
        const target = {
            operation: operation.operation,
            ref: operation.ref,
            label: write.label,
            type: write.type,
            element: write.element,
            value: coerced.display,
        };
        const modelValue = modelValueOf(write, coerced.value);
        if (modelValue !== undefined) {
            target.modelValue = modelValue;
        }
        return {
            kind: 'write',
            operation,
            target,
            consequence: this.classify(target),
            write,
            coerced: { value: coerced.value, display: coerced.display, bound: coerced.bound },
        };
    }
    prepareNavigation(operation) {
        if (!this.router?.config.length) {
            return { refused: 'noRoute', detail: 'The application has no routes.' };
        }
        const routes = availableRoutes(this.router.config, Number.MAX_SAFE_INTEGER);
        if (typeof operation.path !== 'string' || !routes.some(route => route.path === operation.path)) {
            return {
                refused: 'noRoute',
                detail: 'The path is not a route of this application. Use a path as availableRoutes lists it.',
            };
        }
        const filled = fillRoutePath(operation.path, plainStrings(operation.params));
        if (filled.missing !== undefined) {
            return { refused: 'invalid', detail: `The route needs a value for its "${filled.missing}" parameter.` };
        }
        if (filled.invalid !== undefined) {
            return { refused: 'invalid', detail: `The "${filled.invalid}" parameter cannot be "." or "..".` };
        }
        const queryParams = plainStrings(operation.queryParams);
        const url = this.router.serializeUrl(urlTreeFor(filled.segments, queryParams));
        const target = { operation: 'navigate', path: operation.path, url, queryParams };
        return {
            kind: 'navigate',
            operation,
            target,
            consequence: this.classify(target),
            router: this.router,
            segments: filled.segments,
        };
    }
    async navigate(prepared) {
        const { operation, router, segments, target } = prepared;
        const report = await this.zone.run(() => navigateAndReport(router, urlTreeFor(segments, target.queryParams), this.zone));
        const result = {
            operation: 'navigate',
            path: operation.path,
            applied: report.outcome === 'navigated' || report.outcome === 'redirected' || report.outcome === 'unchanged',
            outcome: report.outcome,
            url: report.url,
        };
        if (report.detail) {
            result.detail = report.detail;
        }
        return result;
    }
    classify(target) {
        const verdict = attempt(() => this.policy?.classify(target), 'forbidden');
        return verdict === 'reversible' || verdict === 'consequential' ? verdict : 'forbidden';
    }
    verdict(consequence) {
        if (consequence === 'forbidden') {
            return { refused: 'forbidden', detail: 'The application forbids this operation.' };
        }
        if (consequence === 'consequential' && !this.policy?.confirm) {
            return {
                refused: 'unconfirmed',
                detail: 'The application calls this consequential and has no way to confirm it.',
            };
        }
        return null;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrMutationEngineService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrMutationEngineService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "22.1.2", ngImport: i0, type: ClrMutationEngineService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
function unforeseen(error) {
    return `The operation could not be carried out: ${error instanceof Error ? error.message : 'an unexpected error'}.`;
}
function withoutSnapshots(change) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { previous, current, ...changes } = change;
    return changes;
}
/** Same element, label and value: a field relabelled in place is not what the person agreed to fill. */
function sameOperation(confirmed, now) {
    return (confirmed.consequence === now.consequence &&
        confirmed.target.element === now.target.element &&
        confirmed.target.label === now.target.label &&
        (confirmed.kind !== 'write' || now.kind !== 'write' || confirmed.write.shownLabel === now.write.shownLabel) &&
        confirmed.target.type === now.target.type &&
        confirmed.target.url === now.target.url &&
        JSON.stringify(confirmed.target.value ?? null) === JSON.stringify(now.target.value ?? null) &&
        sameValue(coercedValue(confirmed), coercedValue(now)) &&
        sameBindings(confirmed, now));
}
/** The same option elements can be bound to other values by the time the user confirms. */
function sameBindings(confirmed, now) {
    const before = confirmed.kind === 'write' ? (confirmed.coerced.bound ?? []) : [];
    const after = now.kind === 'write' ? (now.coerced.bound ?? []) : [];
    return before.length === after.length && before.every((value, index) => Object.is(value, after[index]));
}
function coercedValue(prepared) {
    return prepared.kind === 'write' ? prepared.coerced.value : undefined;
}
/** Two options with the same label are different choices. */
function sameValue(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        return a.length === b.length && a.every((entry, index) => sameValue(entry, b[index]));
    }
    if (Object.is(a, b)) {
        return true;
    }
    const plainData = (value) => value === null || typeof value !== 'object' || Object.getPrototypeOf(value) === Object.prototype;
    return plainData(a) && plainData(b) && JSON.stringify(a) === JSON.stringify(b);
}
function refusal(operation, refused, detail) {
    if (operation?.operation === 'navigate') {
        return { operation: 'navigate', path: String(operation.path ?? ''), applied: false, refused, detail };
    }
    const result = {
        operation: operation?.operation === 'clear' ? 'clear' : 'setValue',
        ref: typeof operation?.ref === 'string' ? operation.ref : '',
        applied: false,
        refused,
        detail,
    };
    return result;
}
function listOf(operations) {
    return Array.isArray(operations) ? operations : [];
}
function plainStrings(value) {
    const result = {};
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const [key, entry] of Object.entries(value)) {
            if (typeof entry === 'string' || typeof entry === 'number' || typeof entry === 'boolean') {
                result[key] = String(entry);
            }
        }
    }
    return result;
}
/** The `ngModel` in a component template writes its view in a resolved promise, so wait two turns. */
function settle(zone) {
    return new Promise(resolve => zone.runOutsideAngular(() => setTimeout(() => setTimeout(resolve))));
}

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

export { CLR_AI_METADATA_ATTRIBUTE, CLR_AI_METADATA_URL_ATTRIBUTE, CLR_CONTEXT_APPLICATION, CLR_CONTEXT_CATEGORIES, CLR_CONTEXT_CONFIG, CLR_CONTEXT_DEFAULT_OPTIONS, CLR_CONTEXT_DIRECTIVES, CLR_CONTEXT_LABEL_ATTRIBUTE, CLR_CONTEXT_LOADING_TYPE, CLR_CONTEXT_OPTIONS, CLR_CONTEXT_PRESETS, CLR_CONTEXT_PROTOCOL, CLR_CONTEXT_STATE_ATTRIBUTE, CLR_CONTEXT_TYPE_ATTRIBUTE, CLR_CONTEXT_UNAVAILABLE_TYPE, CLR_CONTEXT_UNTRUSTED_OPTION_KEYS, CLR_MUTATION_POLICY, CLR_PAGE_CONTEXT_SCHEMA, CLR_PAGE_CONTEXT_SCHEMA_VERSION, ClrContext, ClrContextEngineService, ClrContextModule, ClrContextRegistryService, ClrContextTrackerService, ClrMutationEngineService, clrContextCategoryRoles, clrContextPreset, clrDiffContext, clrIsEmptyContextChange, clrRequestHostContext, provideClrContextApplication, provideClrContextConfig, provideClrContextOptions, provideClrMutationPolicy };
//# sourceMappingURL=clr-angular-ai.mjs.map
