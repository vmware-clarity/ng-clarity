"use strict";
/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMPORT_REPLACEMENTS = void 0;
exports.IMPORT_REPLACEMENTS = [
    // #2107 - Secondary entrypoints: deep /src/ imports → package entrypoints
    {
        oldModule: '@clr/angular/src/accordion',
        newModule: '@clr/angular/accordion',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/accordion/stepper',
        newModule: '@clr/angular/stepper',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/emphasis',
        newModule: '@clr/angular/emphasis',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/forms',
        newModule: '@clr/angular/forms',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/data',
        newModule: '@clr/angular/data',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/layout',
        newModule: '@clr/angular/layout',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/modal',
        newModule: '@clr/angular/modal',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/popover',
        newModule: '@clr/angular/popover',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/utils',
        newModule: '@clr/angular/utils',
        oldSymbol: '*',
        newSymbol: '*',
    },
    {
        oldModule: '@clr/angular/src/wizard',
        newModule: '@clr/angular/wizard',
        oldSymbol: '*',
        newSymbol: '*',
    },
    // #2098 - Smart popovers moved from utils/popover → popover/common
    {
        oldModule: '@clr/angular/utils/popover',
        newModule: '@clr/angular/popover/common',
        oldSymbol: '*',
        newSymbol: '*',
    },
    // #2107 - ClrIfOpen moved from utils → popover/common
    {
        oldModule: '@clr/angular/utils',
        newModule: '@clr/angular/popover/common',
        oldSymbol: 'ClrIfOpen',
        newSymbol: 'ClrIfOpen',
    },
    // #2107 - FocusService renamed to FormsFocusService
    {
        oldModule: '@clr/angular/forms',
        newModule: '@clr/angular/forms/common',
        oldSymbol: 'FocusService',
        newSymbol: 'FormsFocusService',
    },
    // #2101 - cds-icon: @cds/core/icon → @clr/angular or @clr/angular/icon
    {
        oldModule: '@cds/core/icon',
        newModule: '@clr/angular/icon',
        oldSymbol: '*',
        newSymbol: '*',
    },
];
//# sourceMappingURL=import-replacements.js.map