import * as i0 from '@angular/core';
import { Injectable, Component, HostListener, Directive, Input, Optional, Inject, NgModule } from '@angular/core';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverHostDirective, ClrPopoverPosition, ClrPopoverType, TOOLTIP_POSITIONS, POPOVER_HOST_ANCHOR, ClrPopoverContent, ClrIfOpen, ÇlrClrPopoverModuleNext as _lrClrPopoverModuleNext } from '@clr/angular/popover/common';
import { Subject } from 'rxjs';
import { uniqueIdFactory } from '@clr/angular/utils';
import { CommonModule } from '@angular/common';
import { ClrIcon } from '@clr/angular/icon';

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TooltipIdService {
    constructor() {
        this._id = new Subject();
    }
    get id() {
        return this._id.asObservable();
    }
    updateId(id) {
        this._id.next(id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipIdService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipIdService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipIdService, decorators: [{
            type: Injectable
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TooltipMouseService {
    constructor(popoverService) {
        this.popoverService = popoverService;
        this.mouseOutDelay = 100;
    }
    onMouseEnterTrigger() {
        this.mouseOverTrigger = true;
        this.popoverService.open = true;
    }
    onMouseLeaveTrigger() {
        this.mouseOverTrigger = false;
        this.hideIfMouseOut();
    }
    onMouseEnterContent() {
        this.mouseOverContent = true;
    }
    onMouseLeaveContent() {
        this.mouseOverContent = false;
        this.hideIfMouseOut();
    }
    hideIfMouseOut() {
        // A zero timeout is used so that the code has a chance to update
        // the `mouseOverContent` property after the user moves the mouse from the trigger to the content.
        setTimeout(() => {
            if (!this.mouseOverTrigger && !this.mouseOverContent) {
                this.popoverService.open = false;
            }
        }, this.mouseOutDelay);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipMouseService, deps: [{ token: i1.ClrPopoverService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipMouseService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TooltipMouseService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ClrPopoverService }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTooltip {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltip, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTooltip, isStandalone: false, selector: "clr-tooltip", host: { properties: { "class.clr-tooltip-container": "true" } }, providers: [TooltipIdService, TooltipMouseService], hostDirectives: [{ directive: i1.ClrPopoverHostDirective }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltip, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.clr-tooltip-container]': 'true',
                    },
                    providers: [TooltipIdService, TooltipMouseService],
                    hostDirectives: [ClrPopoverHostDirective],
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTooltipTrigger {
    constructor(popoverService, tooltipIdService, tooltipMouseService, element) {
        this.popoverService = popoverService;
        this.tooltipMouseService = tooltipMouseService;
        this.subs = [];
        // The aria-described by comes from the id of content. It
        this.subs.push(tooltipIdService.id.subscribe(tooltipId => (this.ariaDescribedBy = tooltipId)));
        popoverService.anchorElementRef = element;
    }
    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    showTooltip() {
        this.popoverService.open = true;
    }
    hideTooltip() {
        this.popoverService.open = false;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterTrigger();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveTrigger();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipTrigger, deps: [{ token: i1.ClrPopoverService }, { token: TooltipIdService }, { token: TooltipMouseService }, { token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "20.2.2", type: ClrTooltipTrigger, isStandalone: false, selector: "[clrTooltipTrigger]", host: { attributes: { "tabindex": "0" }, listeners: { "focus": "showTooltip()", "blur": "hideTooltip()", "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-trigger": "true", "attr.aria-describedby": "ariaDescribedBy", "attr.role": "\"button\"" } }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipTrigger, decorators: [{
            type: Directive,
            args: [{
                    selector: '[clrTooltipTrigger]',
                    host: {
                        tabindex: '0',
                        '[class.tooltip-trigger]': 'true',
                        '[attr.aria-describedby]': 'ariaDescribedBy',
                        '[attr.role]': '"button"',
                    },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: i1.ClrPopoverService }, { type: TooltipIdService }, { type: TooltipMouseService }, { type: i0.ElementRef }], propDecorators: { showTooltip: [{
                type: HostListener,
                args: ['focus']
            }], hideTooltip: [{
                type: HostListener,
                args: ['blur']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const SIZES = ['xs', 'sm', 'md', 'lg'];
const defaultPosition = ClrPopoverPosition.RIGHT;
const defaultSize = 'sm';
class ClrTooltipContent {
    constructor(parentHost, tooltipIdService, el, renderer, popoverService, tooltipMouseService, popoverContent) {
        this.tooltipIdService = tooltipIdService;
        this.el = el;
        this.renderer = renderer;
        this.tooltipMouseService = tooltipMouseService;
        this.popoverContent = popoverContent;
        popoverService.panelClass.push('clr-tooltip-container');
        popoverContent.contentType = ClrPopoverType.TOOLTIP;
        popoverContent.scrollToClose = true;
        if (!parentHost) {
            throw new Error('clr-tooltip-content should only be used inside of a clr-tooltip');
        }
        // Set the default id in case consumer does not supply a custom id.
        this.id = uniqueIdFactory();
    }
    get id() {
        return this._id;
    }
    set id(value) {
        const id = value || '';
        this._id = id;
        this.tooltipIdService.updateId(id);
    }
    get position() {
        return this._position;
    }
    set position(value) {
        const posIndex = TOOLTIP_POSITIONS.indexOf(value);
        this._position = value && posIndex > -1 ? TOOLTIP_POSITIONS[posIndex] : defaultPosition;
        this.popoverContent.contentAt = this._position;
    }
    get size() {
        return this._size;
    }
    set size(value) {
        const oldSize = this._size;
        const newSize = SIZES.includes(value) ? value : defaultSize;
        this._size = newSize;
        this.updateCssClass({ oldClass: `tooltip-${oldSize}`, newClass: `tooltip-${newSize}` });
    }
    ngOnInit() {
        this.size = this.size || defaultSize;
        this.position = this.position || defaultPosition;
    }
    onMouseEnter() {
        this.tooltipMouseService.onMouseEnterContent();
    }
    onMouseLeave() {
        this.tooltipMouseService.onMouseLeaveContent();
    }
    updateCssClass({ oldClass, newClass }) {
        this.renderer.removeClass(this.el.nativeElement, oldClass);
        this.renderer.addClass(this.el.nativeElement, newClass);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipContent, deps: [{ token: POPOVER_HOST_ANCHOR, optional: true }, { token: TooltipIdService }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.ClrPopoverService }, { token: TooltipMouseService }, { token: i1.ClrPopoverContent }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTooltipContent, isStandalone: false, selector: "clr-tooltip-content", inputs: { id: "id", position: ["clrPosition", "position"], size: ["clrSize", "size"] }, host: { listeners: { "mouseenter": "onMouseEnter()", "mouseleave": "onMouseLeave()" }, properties: { "class.tooltip-content": "true", "style.opacity": "1", "attr.role": "\"tooltip\"", "id": "id" } }, hostDirectives: [{ directive: i1.ClrPopoverContent }], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipContent, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-tooltip-content',
                    template: `<ng-content></ng-content>`,
                    host: {
                        '[class.tooltip-content]': 'true',
                        '[style.opacity]': '1',
                        '[attr.role]': '"tooltip"',
                        '[id]': 'id',
                    },
                    standalone: false,
                    hostDirectives: [ClrPopoverContent],
                }]
        }], ctorParameters: () => [{ type: i0.ElementRef, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [POPOVER_HOST_ANCHOR]
                }] }, { type: TooltipIdService }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.ClrPopoverService }, { type: TooltipMouseService }, { type: i1.ClrPopoverContent }], propDecorators: { id: [{
                type: Input
            }], position: [{
                type: Input,
                args: ['clrPosition']
            }], size: [{
                type: Input,
                args: ['clrSize']
            }], onMouseEnter: [{
                type: HostListener,
                args: ['mouseenter']
            }], onMouseLeave: [{
                type: HostListener,
                args: ['mouseleave']
            }] } });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TOOLTIP_DIRECTIVES = [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent];
class ClrTooltipModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipModule, declarations: [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent], imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext], exports: [ClrTooltip, ClrTooltipTrigger, ClrTooltipContent, ClrIfOpen, ClrIcon] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipModule, imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, _lrClrPopoverModuleNext],
                    declarations: [CLR_TOOLTIP_DIRECTIVES],
                    exports: [CLR_TOOLTIP_DIRECTIVES, ClrIfOpen, ClrIcon],
                }]
        }] });

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { CLR_TOOLTIP_DIRECTIVES, ClrTooltip, ClrTooltipContent, ClrTooltipModule, ClrTooltipTrigger };
//# sourceMappingURL=clr-angular-popover-tooltip.mjs.map
