import * as i0 from '@angular/core';
import { ElementRef } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';
import * as i8 from '@clr/angular/progress/spinner';

declare enum ClrTimelineLayout {
    HORIZONTAL = "horizontal",
    VERTICAL = "vertical"
}

declare class ClrTimeline {
    layout: ClrTimelineLayout;
    get isVertical(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimeline, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimeline, "clr-timeline", never, { "layout": { "alias": "clrLayout"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare enum ClrTimelineStepState {
    NOT_STARTED = "not-started",
    CURRENT = "current",
    PROCESSING = "processing",
    SUCCESS = "success",
    ERROR = "error"
}

declare class TimelineIconAttributeService {
    private attributeMap;
    constructor(commonStrings: ClrCommonStringsService);
    getAriaLabel(step: ClrTimelineStepState): string;
    getIconShape(step: ClrTimelineStepState): string;
    getIconStatus(step: ClrTimelineStepState): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimelineIconAttributeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimelineIconAttributeService>;
}

declare class ClrTimelineStep {
    private iconAttributeService;
    private platformId;
    state: ClrTimelineStepState;
    stepTitle: ElementRef<HTMLElement>;
    stepTitleText: string;
    constructor(iconAttributeService: TimelineIconAttributeService, platformId: any);
    get iconAriaLabel(): string;
    get iconShape(): string;
    get iconStatus(): string;
    get isProcessing(): boolean;
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStep, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStep, "clr-timeline-step", never, { "state": { "alias": "clrState"; "required": false; }; }, {}, ["stepTitle"], ["clr-timeline-step-header", "clr-timeline-step-title", "clr-timeline-step-description"], false, never>;
}

declare class ClrTimelineStepDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepDescription, "clr-timeline-step-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTimelineStepHeader {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepHeader, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepHeader, "clr-timeline-step-header", never, {}, {}, never, ["*"], false, never>;
}

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
declare class ClrTimelineStepTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineStepTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStepTitle, "clr-timeline-step-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrTimelineModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTimelineModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTimelineModule, [typeof ClrTimeline, typeof ClrTimelineStep, typeof ClrTimelineStepDescription, typeof ClrTimelineStepHeader, typeof ClrTimelineStepTitle], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrSpinnerModule], [typeof ClrTimeline, typeof ClrTimelineStep, typeof ClrTimelineStepDescription, typeof ClrTimelineStepHeader, typeof ClrTimelineStepTitle, typeof i7.ClrIcon, typeof i8.ClrSpinnerModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTimelineModule>;
}

export { ClrTimeline, ClrTimelineLayout, ClrTimelineModule, ClrTimelineStep, ClrTimelineStepDescription, ClrTimelineStepHeader, ClrTimelineStepState, ClrTimelineStepTitle };
