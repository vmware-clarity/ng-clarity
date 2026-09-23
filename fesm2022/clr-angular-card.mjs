import * as i0 from '@angular/core';
import { EventEmitter, signal, booleanAttribute, Input, Output, ChangeDetectionStrategy, Component, Optional, Directive, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/utils';
import { uniqueIdFactory } from '@clr/angular/utils';
import * as i1 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i3 from '@clr/angular/icon';
import { ClarityIcons, angleIcon, ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCard {
    constructor() {
        this.footerCollapsible = true;
        this.expandedChange = new EventEmitter();
        this.headerContentId = `clr-card-header-content-${uniqueIdFactory()}`;
        this.contentId = `clr-card-content-${uniqueIdFactory()}`;
        this._collapsible = signal(false, ...(ngDevMode ? [{ debugName: "_collapsible" }] : /* istanbul ignore next */ []));
        this._expanded = signal(true, ...(ngDevMode ? [{ debugName: "_expanded" }] : /* istanbul ignore next */ []));
    }
    get collapsible() {
        return this._collapsible();
    }
    set collapsible(value) {
        this._collapsible.set(value);
    }
    get expanded() {
        return this._expanded();
    }
    set expanded(value) {
        this._expanded.set(value);
    }
    /**
     * Toggles the expanded state of a collapsible card and emits `clrCardExpandedChange`.
     * Setting the `clrCardExpanded` input programmatically does not emit.
     */
    toggle() {
        if (!this.collapsible) {
            return;
        }
        this._expanded.set(!this._expanded());
        this.expandedChange.emit(this._expanded());
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCard, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: ClrCard, isStandalone: false, selector: "clr-card", inputs: { footerCollapsible: ["clrCardFooterCollapsible", "footerCollapsible", booleanAttribute], collapsible: ["clrCardCollapsible", "collapsible", booleanAttribute], expanded: ["clrCardExpanded", "expanded", booleanAttribute] }, outputs: { expandedChange: "clrCardExpandedChange" }, host: { properties: { "class.card": "true", "class.clr-card": "true", "class.card-collapsible": "collapsible", "class.card-collapsed": "collapsible && !expanded" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-content select=\"clr-card-header\"></ng-content>\n<ng-template #bodyContent>\n  <ng-content></ng-content>\n</ng-template>\n<ng-template #footerContent>\n  <ng-content select=\"clr-card-footer\"></ng-content>\n</ng-template>\n@if (collapsible) {\n<div\n  role=\"region\"\n  class=\"card-collapsible-content\"\n  [id]=\"contentId\"\n  [attr.aria-hidden]=\"!expanded\"\n  [attr.inert]=\"!expanded ? '' : null\"\n  [attr.aria-labelledby]=\"headerContentId\"\n>\n  <div class=\"card-collapsible-inner\">\n    <ng-container *ngTemplateOutlet=\"bodyContent\"></ng-container>\n    @if (footerCollapsible) {\n    <ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n    }\n  </div>\n</div>\n@if (!footerCollapsible) {\n<ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n} } @else {\n<ng-container *ngTemplateOutlet=\"bodyContent\"></ng-container>\n<ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n}\n", dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCard, decorators: [{
            type: Component,
            args: [{ selector: 'clr-card', host: {
                        '[class.card]': 'true',
                        '[class.clr-card]': 'true',
                        '[class.card-collapsible]': 'collapsible',
                        '[class.card-collapsed]': 'collapsible && !expanded',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<ng-content select=\"clr-card-header\"></ng-content>\n<ng-template #bodyContent>\n  <ng-content></ng-content>\n</ng-template>\n<ng-template #footerContent>\n  <ng-content select=\"clr-card-footer\"></ng-content>\n</ng-template>\n@if (collapsible) {\n<div\n  role=\"region\"\n  class=\"card-collapsible-content\"\n  [id]=\"contentId\"\n  [attr.aria-hidden]=\"!expanded\"\n  [attr.inert]=\"!expanded ? '' : null\"\n  [attr.aria-labelledby]=\"headerContentId\"\n>\n  <div class=\"card-collapsible-inner\">\n    <ng-container *ngTemplateOutlet=\"bodyContent\"></ng-container>\n    @if (footerCollapsible) {\n    <ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n    }\n  </div>\n</div>\n@if (!footerCollapsible) {\n<ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n} } @else {\n<ng-container *ngTemplateOutlet=\"bodyContent\"></ng-container>\n<ng-container *ngTemplateOutlet=\"footerContent\"></ng-container>\n}\n" }]
        }], propDecorators: { footerCollapsible: [{
                type: Input,
                args: [{ alias: 'clrCardFooterCollapsible', transform: booleanAttribute }]
            }], expandedChange: [{
                type: Output,
                args: ['clrCardExpandedChange']
            }], collapsible: [{
                type: Input,
                args: [{ alias: 'clrCardCollapsible', transform: booleanAttribute }]
            }], expanded: [{
                type: Input,
                args: [{ alias: 'clrCardExpanded', transform: booleanAttribute }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardHeader {
    constructor(card, commonStrings) {
        this.card = card;
        this.commonStrings = commonStrings;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardHeader, deps: [{ token: ClrCard, optional: true }, { token: i2.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.2.23", type: ClrCardHeader, isStandalone: false, selector: "clr-card-header", inputs: { explicitHeadingLevel: ["clrHeadingLevel", "explicitHeadingLevel"] }, host: { properties: { "class.card-header": "true", "class.clr-card-header": "true" } }, ngImport: i0, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (card?.collapsible) {\n<button\n  type=\"button\"\n  class=\"card-header-toggle\"\n  (click)=\"card.toggle()\"\n  [attr.aria-controls]=\"card.contentId\"\n  [attr.aria-expanded]=\"card.expanded\"\n  [attr.aria-label]=\"card.expanded ? commonStrings.keys.collapseCardAriaLabel : commonStrings.keys.expandCardAriaLabel\"\n  [attr.aria-describedby]=\"card.headerContentId\"\n>\n  <cds-icon shape=\"angle\" direction=\"right\" class=\"card-header-icon\"></cds-icon>\n</button>\n}\n<div\n  class=\"clr-card-header-content\"\n  [attr.id]=\"card?.headerContentId\"\n  [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n  [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n>\n  <ng-content></ng-content>\n</div>\n", dependencies: [{ kind: "component", type: i3.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge", "innerOffset"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardHeader, decorators: [{
            type: Component,
            args: [{ selector: 'clr-card-header', host: {
                        '[class.card-header]': 'true',
                        '[class.clr-card-header]': 'true',
                    }, changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n@if (card?.collapsible) {\n<button\n  type=\"button\"\n  class=\"card-header-toggle\"\n  (click)=\"card.toggle()\"\n  [attr.aria-controls]=\"card.contentId\"\n  [attr.aria-expanded]=\"card.expanded\"\n  [attr.aria-label]=\"card.expanded ? commonStrings.keys.collapseCardAriaLabel : commonStrings.keys.expandCardAriaLabel\"\n  [attr.aria-describedby]=\"card.headerContentId\"\n>\n  <cds-icon shape=\"angle\" direction=\"right\" class=\"card-header-icon\"></cds-icon>\n</button>\n}\n<div\n  class=\"clr-card-header-content\"\n  [attr.id]=\"card?.headerContentId\"\n  [attr.role]=\"explicitHeadingLevel ? 'heading' : null\"\n  [attr.aria-level]=\"explicitHeadingLevel ? explicitHeadingLevel : null\"\n>\n  <ng-content></ng-content>\n</div>\n" }]
        }], ctorParameters: () => [{ type: ClrCard, decorators: [{
                    type: Optional
                }] }, { type: i2.ClrCommonStringsService }], propDecorators: { explicitHeadingLevel: [{
                type: Input,
                args: ['clrHeadingLevel']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardBody {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBody, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardBody, isStandalone: false, selector: "clr-card-body", host: { properties: { "class.card-block": "true", "class.clr-card-body": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBody, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-body',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-block]': 'true', '[class.clr-card-body]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardBodyTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBodyTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardBodyTitle, isStandalone: false, selector: "clr-card-body-title", inputs: { explicitHeadingLevel: ["clrHeadingLevel", "explicitHeadingLevel"] }, host: { properties: { "class.card-title": "true", "class.clr-card-body-title": "true", "attr.role": "explicitHeadingLevel ? \"heading\" : null", "attr.aria-level": "explicitHeadingLevel ? explicitHeadingLevel : null" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBodyTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-body-title',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.card-title]': 'true',
                        '[class.clr-card-body-title]': 'true',
                        '[attr.role]': 'explicitHeadingLevel ? "heading" : null',
                        '[attr.aria-level]': 'explicitHeadingLevel ? explicitHeadingLevel : null',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }], propDecorators: { explicitHeadingLevel: [{
                type: Input,
                args: ['clrHeadingLevel']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardBodyText {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBodyText, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardBodyText, isStandalone: false, selector: "clr-card-body-text", host: { properties: { "class.card-text": "true", "class.clr-card-body-text": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardBodyText, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-body-text',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-text]': 'true', '[class.clr-card-body-text]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardFooter {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardFooter, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardFooter, isStandalone: false, selector: "clr-card-footer", host: { properties: { "class.card-footer": "true", "class.clr-card-footer": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardFooter, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-footer',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-footer]': 'true', '[class.clr-card-footer]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardImage, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardImage, isStandalone: false, selector: "clr-card-image", host: { properties: { "class.card-img": "true", "class.clr-card-image": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardImage, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-image',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-img]': 'true', '[class.clr-card-image]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardDivider {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardDivider, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardDivider, isStandalone: false, selector: "clr-card-divider", host: { properties: { "class.card-divider": "true", "class.clr-card-divider": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardDivider, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-divider',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-divider]': 'true', '[class.clr-card-divider]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardMediaBlock {
    constructor() {
        this.clrCardMediaWrap = false;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaBlock, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "21.2.23", type: ClrCardMediaBlock, isStandalone: false, selector: "clr-card-media-block", inputs: { clrCardMediaWrap: ["clrCardMediaWrap", "clrCardMediaWrap", booleanAttribute] }, host: { properties: { "class.card-media-block": "true", "class.clr-card-media-block": "true", "class.wrap": "clrCardMediaWrap" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaBlock, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-media-block',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.card-media-block]': 'true',
                        '[class.clr-card-media-block]': 'true',
                        '[class.wrap]': 'clrCardMediaWrap',
                    },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }], propDecorators: { clrCardMediaWrap: [{
                type: Input,
                args: [{ alias: 'clrCardMediaWrap', transform: booleanAttribute }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardMediaDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaDescription, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardMediaDescription, isStandalone: false, selector: "clr-card-media-description", host: { properties: { "class.card-media-description": "true", "class.clr-card-media-description": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaDescription, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-card-media-description',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.card-media-description]': 'true', '[class.clr-card-media-description]': 'true' },
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardMediaImage {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaImage, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardMediaImage, isStandalone: false, selector: "img[clrCardMediaImage]", host: { properties: { "class.card-media-image": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaImage, decorators: [{
            type: Directive,
            args: [{
                    selector: 'img[clrCardMediaImage]',
                    host: { '[class.card-media-image]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardMediaTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaTitle, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardMediaTitle, isStandalone: false, selector: "[clrCardMediaTitle]", host: { properties: { "class.card-media-title": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaTitle, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrCardMediaTitle]',
                    host: { '[class.card-media-title]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrCardMediaText {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaText, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.2.23", type: ClrCardMediaText, isStandalone: false, selector: "[clrCardMediaText]", host: { properties: { "class.card-media-text": "true" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardMediaText, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrCardMediaText]',
                    host: { '[class.card-media-text]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const declarations = [
    ClrCard,
    ClrCardHeader,
    ClrCardBody,
    ClrCardBodyTitle,
    ClrCardBodyText,
    ClrCardFooter,
    ClrCardImage,
    ClrCardDivider,
    ClrCardMediaBlock,
    ClrCardMediaDescription,
    ClrCardMediaImage,
    ClrCardMediaTitle,
    ClrCardMediaText,
];
class ClrCardModule {
    constructor() {
        ClarityIcons.addIcons(angleIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.2.23", ngImport: i0, type: ClrCardModule, declarations: [ClrCard,
            ClrCardHeader,
            ClrCardBody,
            ClrCardBodyTitle,
            ClrCardBodyText,
            ClrCardFooter,
            ClrCardImage,
            ClrCardDivider,
            ClrCardMediaBlock,
            ClrCardMediaDescription,
            ClrCardMediaImage,
            ClrCardMediaTitle,
            ClrCardMediaText], imports: [CommonModule, ClrIcon], exports: [ClrCard,
            ClrCardHeader,
            ClrCardBody,
            ClrCardBodyTitle,
            ClrCardBodyText,
            ClrCardFooter,
            ClrCardImage,
            ClrCardDivider,
            ClrCardMediaBlock,
            ClrCardMediaDescription,
            ClrCardMediaImage,
            ClrCardMediaTitle,
            ClrCardMediaText] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardModule, imports: [CommonModule, ClrIcon] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.2.23", ngImport: i0, type: ClrCardModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon],
                    declarations: [...declarations],
                    exports: [...declarations],
                }]
        }], ctorParameters: () => [] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ClrCard, ClrCardBody, ClrCardBodyText, ClrCardBodyTitle, ClrCardDivider, ClrCardFooter, ClrCardHeader, ClrCardImage, ClrCardMediaBlock, ClrCardMediaDescription, ClrCardMediaImage, ClrCardMediaText, ClrCardMediaTitle, ClrCardModule };
//# sourceMappingURL=clr-angular-card.mjs.map
