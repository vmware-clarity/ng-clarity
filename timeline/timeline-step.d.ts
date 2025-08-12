import { ElementRef } from '@angular/core';
import { ClrTimelineStepState } from './enums/timeline-step-state.enum';
import { TimelineIconAttributeService } from './providers/timeline-icon-attribute.service';
import * as i0 from "@angular/core";
export declare class ClrTimelineStep {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTimelineStep, "clr-timeline-step", never, { "state": "clrState"; }, {}, ["stepTitle"], ["clr-timeline-step-header", "clr-timeline-step-title", "clr-timeline-step-description"], false, never>;
}
