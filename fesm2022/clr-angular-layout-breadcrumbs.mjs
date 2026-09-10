import * as i0 from '@angular/core';
import { Component, EventEmitter, Output, Input, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/utils';
import { ClrHostWrappingModule } from '@clr/angular/utils';
import * as i2 from '@clr/angular/icon';
import { ClrIcon } from '@clr/angular/icon';
import * as i3 from '@angular/router';
import { RouterModule } from '@angular/router';
import * as i5 from '@angular/common';
import { CommonModule } from '@angular/common';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const MAX_DISPLAY_ITEMS = 3;

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbItem {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbItem, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.1.3", type: ClrBreadcrumbItem, isStandalone: false, selector: "clr-breadcrumb-item", host: { properties: { "attr.role": "\"list-item\"" }, classAttribute: "clr-breadcrumb-item" }, ngImport: i0, template: '<ng-content />', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbItem, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-breadcrumb-item',
                    template: '<ng-content />',
                    host: {
                        class: 'clr-breadcrumb-item',
                        '[attr.role]': '"list-item"',
                    },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbs {
    constructor(commonStrings) {
        this.commonStrings = commonStrings;
        this.isExpanded = false;
        this.items = [];
        this.clrBreadcrumbItemClick = new EventEmitter();
        this.limit = MAX_DISPLAY_ITEMS;
        this.max = MAX_DISPLAY_ITEMS;
    }
    expand() {
        this.isExpanded = true;
        this.limit = this.items?.length;
    }
    handleItemClick(breadcrumb) {
        this.clrBreadcrumbItemClick.emit(breadcrumb);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbs, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.1.3", type: ClrBreadcrumbs, isStandalone: false, selector: "clr-breadcrumbs", inputs: { items: "items" }, outputs: { clrBreadcrumbItemClick: "clrBreadcrumbItemClick" }, host: { properties: { "attr.aria-label": "commonStrings.keys.breadcrumbsLabel", "attr.role": "\"navigation\"" }, classAttribute: "clr-breadcrumb" }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (items?.length) {\n<div role=\"list\" class=\"clr-breadcrumb-menu\">\n  @if (items.length > max && !isExpanded) {\n  <clr-breadcrumb-item>\n    <button\n      [attr.aria-label]=\"commonStrings.keys.expandBreadcrumbsLabel\"\n      class=\"btn btn-link btn-sm clr-breadcrumb-expand\"\n      (click)=\"expand()\"\n      (keydown)=\"expand()\"\n    >\n      <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n    </button>\n  </clr-breadcrumb-item>\n  } @for (breadcrumb of items | slice: -limit : items.length; track breadcrumb; let isLastItem = $last) {\n  <clr-breadcrumb-item>\n    @if (isLastItem) {\n    <span aria-current=\"page\">{{ breadcrumb.label }}</span>\n    } @else { @if (breadcrumb.routerLink) {\n    <a\n      [routerLink]=\"breadcrumb.routerLink\"\n      [queryParams]=\"breadcrumb.queryParams\"\n      [target]=\"breadcrumb.target || '_self'\"\n      (click)=\"handleItemClick(breadcrumb)\"\n    >\n      {{ breadcrumb.label }}\n    </a>\n    } @if (breadcrumb.href) {\n    <a [href]=\"breadcrumb.href\" [target]=\"breadcrumb.target || '_self'\" (click)=\"handleItemClick(breadcrumb)\">\n      {{ breadcrumb.label }}\n    </a>\n    } }\n  </clr-breadcrumb-item>\n  }\n</div>\n}\n", styles: [":where(:root,:host),:where(:root,:host) [clr-density]{--clr-breadcrumb-item-space: var(--clr-base-gap-s)}.clr-breadcrumb-menu{display:flex;flex-wrap:wrap;align-items:center}.clr-breadcrumb-menu .clr-breadcrumb-item{display:flex;align-items:center;height:var(--clr-base-row-height-s);color:var(--cds-alias-typography-color-400);font-size:var(--clr-base-typography-font-size-inline);font-weight:var(--cds-alias-typography-secondary-font-weight);line-height:var(--clr-base-typography-line-height-16);letter-spacing:calc(-.1 * 1rem / var(--cds-global-base))}.clr-breadcrumb-menu .clr-breadcrumb-item a{text-decoration:none;text-align:center}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited{color:var(--clr-link-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:hover{color:var(--clr-link-hover-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:active{color:var(--clr-link-active-color)}.clr-breadcrumb-menu .clr-breadcrumb-item:not(:last-child):after{content:\"/\";margin:0 var(--clr-breadcrumb-item-space)}.clr-breadcrumb-menu .clr-breadcrumb-expand{height:var(--clr-base-icon-size-l);width:var(--clr-base-icon-size-l);min-height:var(--clr-base-icon-size-l);min-width:var(--clr-base-icon-size-l);margin:0;padding:0;gap:0}\n"], dependencies: [{ kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "directive", type: i3.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: ClrBreadcrumbItem, selector: "clr-breadcrumb-item" }, { kind: "pipe", type: i5.SlicePipe, name: "slice" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbs, decorators: [{
            type: Component,
            args: [{ selector: 'clr-breadcrumbs', host: {
                        class: 'clr-breadcrumb',
                        '[attr.aria-label]': 'commonStrings.keys.breadcrumbsLabel',
                        '[attr.role]': '"navigation"',
                    }, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (items?.length) {\n<div role=\"list\" class=\"clr-breadcrumb-menu\">\n  @if (items.length > max && !isExpanded) {\n  <clr-breadcrumb-item>\n    <button\n      [attr.aria-label]=\"commonStrings.keys.expandBreadcrumbsLabel\"\n      class=\"btn btn-link btn-sm clr-breadcrumb-expand\"\n      (click)=\"expand()\"\n      (keydown)=\"expand()\"\n    >\n      <cds-icon shape=\"ellipsis-horizontal\"></cds-icon>\n    </button>\n  </clr-breadcrumb-item>\n  } @for (breadcrumb of items | slice: -limit : items.length; track breadcrumb; let isLastItem = $last) {\n  <clr-breadcrumb-item>\n    @if (isLastItem) {\n    <span aria-current=\"page\">{{ breadcrumb.label }}</span>\n    } @else { @if (breadcrumb.routerLink) {\n    <a\n      [routerLink]=\"breadcrumb.routerLink\"\n      [queryParams]=\"breadcrumb.queryParams\"\n      [target]=\"breadcrumb.target || '_self'\"\n      (click)=\"handleItemClick(breadcrumb)\"\n    >\n      {{ breadcrumb.label }}\n    </a>\n    } @if (breadcrumb.href) {\n    <a [href]=\"breadcrumb.href\" [target]=\"breadcrumb.target || '_self'\" (click)=\"handleItemClick(breadcrumb)\">\n      {{ breadcrumb.label }}\n    </a>\n    } }\n  </clr-breadcrumb-item>\n  }\n</div>\n}\n", styles: [":where(:root,:host),:where(:root,:host) [clr-density]{--clr-breadcrumb-item-space: var(--clr-base-gap-s)}.clr-breadcrumb-menu{display:flex;flex-wrap:wrap;align-items:center}.clr-breadcrumb-menu .clr-breadcrumb-item{display:flex;align-items:center;height:var(--clr-base-row-height-s);color:var(--cds-alias-typography-color-400);font-size:var(--clr-base-typography-font-size-inline);font-weight:var(--cds-alias-typography-secondary-font-weight);line-height:var(--clr-base-typography-line-height-16);letter-spacing:calc(-.1 * 1rem / var(--cds-global-base))}.clr-breadcrumb-menu .clr-breadcrumb-item a{text-decoration:none;text-align:center}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited{color:var(--clr-link-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:hover{color:var(--clr-link-hover-color)}.clr-breadcrumb-menu .clr-breadcrumb-item a:visited:active{color:var(--clr-link-active-color)}.clr-breadcrumb-menu .clr-breadcrumb-item:not(:last-child):after{content:\"/\";margin:0 var(--clr-breadcrumb-item-space)}.clr-breadcrumb-menu .clr-breadcrumb-expand{height:var(--clr-base-icon-size-l);width:var(--clr-base-icon-size-l);min-height:var(--clr-base-icon-size-l);min-width:var(--clr-base-icon-size-l);margin:0;padding:0;gap:0}\n"] }]
        }], ctorParameters: () => [{ type: i1.ClrCommonStringsService }], propDecorators: { items: [{
                type: Input
            }], clrBreadcrumbItemClick: [{
                type: Output
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrBreadcrumbsModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbsModule, declarations: [ClrBreadcrumbs, ClrBreadcrumbItem], imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule], exports: [ClrBreadcrumbs, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbsModule, imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: ClrBreadcrumbsModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [ClrBreadcrumbs, ClrBreadcrumbItem],
                    exports: [ClrBreadcrumbs, ClrIcon],
                    imports: [CommonModule, ClrIcon, ClrHostWrappingModule, RouterModule],
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

export { ClrBreadcrumbItem, ClrBreadcrumbs, ClrBreadcrumbsModule };
//# sourceMappingURL=clr-angular-layout-breadcrumbs.mjs.map
