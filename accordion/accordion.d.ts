import { AfterViewInit, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { ClrAccordionPanel } from './accordion-panel';
import { AccordionService } from './providers/accordion.service';
import * as i0 from "@angular/core";
export declare class ClrAccordion implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private accordionService;
    multiPanel: boolean | string;
    panels: QueryList<ClrAccordionPanel>;
    subscriptions: Subscription[];
    constructor(accordionService: AccordionService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private setAccordionStrategy;
    private listenForDOMChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordion, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordion, "clr-accordion", never, { "multiPanel": "clrAccordionMultiPanel"; }, {}, ["panels"], ["*"], false, never>;
}
