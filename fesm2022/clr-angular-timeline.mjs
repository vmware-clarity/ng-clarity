import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as i0 from '@angular/core';
import { Injectable, HostBinding, Input, Component, PLATFORM_ID, ElementRef, ContentChild, Inject, NgModule } from '@angular/core';
import * as i2 from '@clr/angular/icon';
import { ClarityIcons, circleIcon, dotCircleIcon, errorStandardIcon, successStandardIcon, ClrIcon } from '@clr/angular/icon';
import * as i3 from '@clr/angular/progress/spinner';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import * as i1 from '@clr/angular/utils';

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrTimelineLayout;
(function (ClrTimelineLayout) {
    ClrTimelineLayout["HORIZONTAL"] = "horizontal";
    ClrTimelineLayout["VERTICAL"] = "vertical";
})(ClrTimelineLayout || (ClrTimelineLayout = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
var ClrTimelineStepState;
(function (ClrTimelineStepState) {
    ClrTimelineStepState["NOT_STARTED"] = "not-started";
    ClrTimelineStepState["CURRENT"] = "current";
    ClrTimelineStepState["PROCESSING"] = "processing";
    ClrTimelineStepState["SUCCESS"] = "success";
    ClrTimelineStepState["ERROR"] = "error";
})(ClrTimelineStepState || (ClrTimelineStepState = {}));

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class TimelineIconAttributeService {
    constructor(commonStrings) {
        this.attributeMap = new Map();
        this.attributeMap.set(ClrTimelineStepState.NOT_STARTED, {
            iconShape: 'circle',
            iconStatus: null,
            ariaLabel: commonStrings.keys.timelineStepNotStarted,
        });
        this.attributeMap.set(ClrTimelineStepState.CURRENT, {
            iconShape: 'dot-circle',
            iconStatus: 'info',
            ariaLabel: commonStrings.keys.timelineStepCurrent,
        });
        this.attributeMap.set(ClrTimelineStepState.PROCESSING, {
            iconShape: undefined,
            iconStatus: null,
            ariaLabel: commonStrings.keys.timelineStepProcessing,
        });
        this.attributeMap.set(ClrTimelineStepState.SUCCESS, {
            iconShape: 'success-standard',
            iconStatus: 'success',
            ariaLabel: commonStrings.keys.timelineStepSuccess,
        });
        this.attributeMap.set(ClrTimelineStepState.ERROR, {
            iconShape: 'error-standard',
            iconStatus: 'danger',
            ariaLabel: commonStrings.keys.timelineStepError,
        });
    }
    getAriaLabel(step) {
        return this.attributeMap.get(step).ariaLabel;
    }
    getIconShape(step) {
        return this.attributeMap.get(step).iconShape;
    }
    getIconStatus(step) {
        return this.attributeMap.get(step).iconStatus;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TimelineIconAttributeService, deps: [{ token: i1.ClrCommonStringsService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TimelineIconAttributeService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: TimelineIconAttributeService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.ClrCommonStringsService }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTimeline {
    constructor() {
        this.layout = ClrTimelineLayout.HORIZONTAL;
    }
    get isVertical() {
        return this.layout === ClrTimelineLayout.VERTICAL;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimeline, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTimeline, isStandalone: false, selector: "clr-timeline", inputs: { layout: ["clrLayout", "layout"] }, host: { properties: { "class.clr-timeline": "true", "attr.role": "\"list\"", "class.clr-timeline-vertical": "this.isVertical" } }, providers: [TimelineIconAttributeService], ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimeline, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline]': 'true', '[attr.role]': '"list"' },
                    providers: [TimelineIconAttributeService],
                    standalone: false,
                }]
        }], propDecorators: { layout: [{
                type: Input,
                args: ['clrLayout']
            }], isVertical: [{
                type: HostBinding,
                args: ['class.clr-timeline-vertical']
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
/**
 * Note: Why does this component have aria-hidden attribute?
 *
 * tl;dr: we want screen readers to ignore this element when its reading out to blind users.
 *
 * In order to make a timeline step accessible to screen readers we need the title read out before the
 * icon. In order to do this, ClrTimeLine step has a ContentChild that queries for the ClrTimelineStepTitle and
 * then adds the projected text into a .clr-sr-only element that is a sibling element to the icon. See the
 * ClrTimlineStep template for the DOM structure.
 */
class ClrTimelineStepTitle {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepTitle, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTimelineStepTitle, isStandalone: false, selector: "clr-timeline-step-title", host: { properties: { "class.clr-timeline-step-title": "true", "attr.aria-hidden": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepTitle, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step-title',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline-step-title]': 'true', '[attr.aria-hidden]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTimelineStep {
    constructor(iconAttributeService, platformId) {
        this.iconAttributeService = iconAttributeService;
        this.platformId = platformId;
        this.state = ClrTimelineStepState.NOT_STARTED;
    }
    get iconAriaLabel() {
        return this.iconAttributeService.getAriaLabel(this.state);
    }
    get iconShape() {
        return this.iconAttributeService.getIconShape(this.state);
    }
    get iconStatus() {
        return this.iconAttributeService.getIconStatus(this.state);
    }
    get isProcessing() {
        return this.state === ClrTimelineStepState.PROCESSING;
    }
    ngAfterContentInit() {
        if (this.stepTitle && isPlatformBrowser(this.platformId)) {
            this.stepTitleText = this.stepTitle.nativeElement.innerText;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStep, deps: [{ token: TimelineIconAttributeService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "20.2.2", type: ClrTimelineStep, isStandalone: false, selector: "clr-timeline-step", inputs: { state: ["clrState", "state"] }, host: { properties: { "class.clr-timeline-step": "true", "attr.role": "\"listitem\"" } }, queries: [{ propertyName: "stepTitle", first: true, predicate: ClrTimelineStepTitle, descendants: true, read: ElementRef }], ngImport: i0, template: `
    <ng-content select="clr-timeline-step-header"></ng-content>
    <span class="clr-sr-only">{{ stepTitleText }}</span>
    @if (!isProcessing) {
      <cds-icon [status]="iconStatus" [shape]="iconShape" [attr.aria-label]="iconAriaLabel" role="img"></cds-icon>
    } @else {
      <clr-spinner clrMedium [attr.aria-label]="iconAriaLabel"></clr-spinner>
    }
    <div class="clr-timeline-step-body">
      <ng-content select="clr-timeline-step-title"></ng-content>
      <ng-content select="clr-timeline-step-description"></ng-content>
    </div>
  `, isInline: true, dependencies: [{ kind: "component", type: i2.ClrIcon, selector: "clr-icon, cds-icon", inputs: ["shape", "size", "direction", "flip", "solid", "status", "inverse", "badge"] }, { kind: "component", type: i3.ClrSpinner, selector: "clr-spinner", inputs: ["clrInline", "clrInverse", "clrSmall", "clrMedium"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStep, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step',
                    template: `
    <ng-content select="clr-timeline-step-header"></ng-content>
    <span class="clr-sr-only">{{ stepTitleText }}</span>
    @if (!isProcessing) {
      <cds-icon [status]="iconStatus" [shape]="iconShape" [attr.aria-label]="iconAriaLabel" role="img"></cds-icon>
    } @else {
      <clr-spinner clrMedium [attr.aria-label]="iconAriaLabel"></clr-spinner>
    }
    <div class="clr-timeline-step-body">
      <ng-content select="clr-timeline-step-title"></ng-content>
      <ng-content select="clr-timeline-step-description"></ng-content>
    </div>
  `,
                    host: { '[class.clr-timeline-step]': 'true', '[attr.role]': '"listitem"' },
                    standalone: false,
                }]
        }], ctorParameters: () => [{ type: TimelineIconAttributeService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }], propDecorators: { state: [{
                type: Input,
                args: ['clrState']
            }], stepTitle: [{
                type: ContentChild,
                args: [ClrTimelineStepTitle, { read: ElementRef }]
            }] } });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTimelineStepDescription {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepDescription, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTimelineStepDescription, isStandalone: false, selector: "clr-timeline-step-description", host: { properties: { "class.clr-timeline-step-description": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepDescription, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step-description',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline-step-description]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
class ClrTimelineStepHeader {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepHeader, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "20.2.2", type: ClrTimelineStepHeader, isStandalone: false, selector: "clr-timeline-step-header", host: { properties: { "class.clr-timeline-step-header": "true" } }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineStepHeader, decorators: [{
            type: Component,
            args: [{
                    selector: 'clr-timeline-step-header',
                    template: `<ng-content></ng-content>`,
                    host: { '[class.clr-timeline-step-header]': 'true' },
                    standalone: false,
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
const CLR_TIMELINE_DIRECTIVES = [
    ClrTimeline,
    ClrTimelineStep,
    ClrTimelineStepDescription,
    ClrTimelineStepHeader,
    ClrTimelineStepTitle,
];
class ClrTimelineModule {
    constructor() {
        ClarityIcons.addIcons(circleIcon, dotCircleIcon, errorStandardIcon, successStandardIcon);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineModule, declarations: [ClrTimeline,
            ClrTimelineStep,
            ClrTimelineStepDescription,
            ClrTimelineStepHeader,
            ClrTimelineStepTitle], imports: [CommonModule, ClrIcon, ClrSpinnerModule], exports: [ClrTimeline,
            ClrTimelineStep,
            ClrTimelineStepDescription,
            ClrTimelineStepHeader,
            ClrTimelineStepTitle, ClrIcon, ClrSpinnerModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineModule, imports: [CommonModule, ClrIcon, ClrSpinnerModule, ClrSpinnerModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.2.2", ngImport: i0, type: ClrTimelineModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ClrIcon, ClrSpinnerModule],
                    exports: [...CLR_TIMELINE_DIRECTIVES, ClrIcon, ClrSpinnerModule],
                    declarations: [CLR_TIMELINE_DIRECTIVES],
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

export { ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStep, ClrTimelineStepDescription, ClrTimelineStepHeader, ClrTimelineStepState, ClrTimelineStepTitle };
//# sourceMappingURL=clr-angular-timeline.mjs.map
