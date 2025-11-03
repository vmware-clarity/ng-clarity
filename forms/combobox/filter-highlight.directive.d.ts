import { AfterViewInit, ElementRef, OnDestroy } from '@angular/core';
import { OptionSelectionService } from './providers/option-selection.service';
export declare class ClrFilterHighlight<T> implements AfterViewInit, OnDestroy {
    private element;
    private optionSelectionService;
    private platformId;
    elementClass: string;
    private subscriptions;
    private initialHtml;
    private filter;
    constructor(element: ElementRef<HTMLElement>, optionSelectionService: OptionSelectionService<T>, platformId: any);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private sanitizeForRegexp;
    private findMatches;
}
