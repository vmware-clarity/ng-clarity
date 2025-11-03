import { ElementRef } from '@angular/core';
import { ClrTimelineStepState } from './enums/timeline-step-state.enum';
import { TimelineIconAttributeService } from './providers/timeline-icon-attribute.service';
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
}
