"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSS_ATTRIBUTE_REPLACEMENTS = exports.CSS_SELECTOR_REPLACEMENTS = exports.CSS_PROPERTY_REPLACEMENTS = void 0;
exports.CSS_PROPERTY_REPLACEMENTS = [
    // #2229 - Wizard stepnav CSS custom properties
    {
        old: '--clr-wizard-stepnav-text--active',
        new: '--clr-wizard-stepnav-text-selected',
    },
    {
        old: '--clr-wizard-stepnav-item-border-color--active',
        new: '--clr-wizard-stepnav-item-complete-border-color',
    },
    {
        old: '--clr-wizard-stepnav-active-bgcolor',
        new: '--clr-wizard-stepnav-selected-bgcolor',
    },
    {
        old: '--clr-wizard-stepnav-link-hover-bg-color',
        new: '--clr-wizard-stepnav-hover-bgcolor',
    },
    {
        old: '--clr-wizard-stepnav-link-active-bg-color',
        new: '--clr-wizard-stepnav-active-bgcolor',
    },
    // #2230 - Accordion/Collapsible panel deprecated properties
    {
        old: '--clr-accordion-active-background-color',
        new: '--clr-accordion-header-open-background-color',
    },
    {
        old: '--clr-collapsible-panel-active-background-color',
        new: '--clr-collapsible-panel-header-open-background-color',
    },
    // #2229 - Wizard additional rename from beta.1 release
    {
        old: '--clr-wizard-step-title-min-width',
        new: '',
    },
    // #2207 - Accordion step title min width removed
    {
        old: '--clr-accordion-step-title-min-width',
        new: '',
    },
];
exports.CSS_SELECTOR_REPLACEMENTS = [
    // #2180 - Header variant classes removed
    { old: 'header-4', new: 'header-3' },
    { old: 'header-5', new: 'header-3' },
    { old: 'header-6', new: 'header-1' },
    { old: 'header-7', new: 'header-2' },
];
exports.CSS_ATTRIBUTE_REPLACEMENTS = [
    // #2240 - cds-text heading → headline
    { old: "cds-text*='heading'", new: "cds-text*='headline'" },
    { old: 'cds-text*="heading"', new: 'cds-text*="headline"' },
    { old: "[cds-text*='heading']", new: "[cds-text*='headline']" },
    { old: '[cds-text*="heading"]', new: '[cds-text*="headline"]' },
];
//# sourceMappingURL=css-replacements.js.map