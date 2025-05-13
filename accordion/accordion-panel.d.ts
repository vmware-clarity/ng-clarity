import { ChangeDetectorRef, EventEmitter, OnChanges, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { IfExpandService } from '../utils/conditional/if-expanded.service';
import { ClrCommonStringsService } from '../utils/i18n/common-strings.service';
import { HeadingLevel } from '../wizard';
import { ClrAccordionDescription } from './accordion-description';
import { AccordionPanelModel } from './models/accordion.model';
import { AccordionService } from './providers/accordion.service';
import * as i0 from "@angular/core";
export declare class ClrAccordionPanel implements OnInit, OnChanges {
    private parent;
    commonStrings: ClrCommonStringsService;
    private accordionService;
    private ifExpandService;
    private cdr;
    disabled: boolean;
    panelOpen: boolean;
    headingEnabled: boolean;
    /**
     * Level of the accordion/stepper heading from 1 to 6.
     */
    explicitHeadingLevel: HeadingLevel;
    panelOpenChange: EventEmitter<boolean>;
    accordionDescription: QueryList<ClrAccordionDescription>;
    panel: Observable<AccordionPanelModel>;
    private _id;
    private _panelIndex;
    constructor(parent: ClrAccordionPanel, commonStrings: ClrCommonStringsService, accordionService: AccordionService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(value: string);
    get panelNumber(): number;
    get headingLevel(): HeadingLevel;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    togglePanel(): void;
    collapsePanelOnAnimationDone(panel: AccordionPanelModel): void;
    getPanelStateClasses(panel: AccordionPanelModel): string;
    getAccordionContentId(id: string): string;
    getAccordionHeaderId(id: string): string;
    protected stepCompleteText(panelNumber: number): string;
    protected stepErrorText(panelNumber: number): string;
    private emitPanelChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionPanel, [{ optional: true; skipSelf: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionPanel, "clr-accordion-panel", never, { "disabled": "clrAccordionPanelDisabled"; "panelOpen": "clrAccordionPanelOpen"; "headingEnabled": "clrAccordionPanelHeadingEnabled"; "explicitHeadingLevel": "clrAccordionPanelHeadingLevel"; }, { "panelOpenChange": "clrAccordionPanelOpenChange"; }, ["accordionDescription"], ["clr-accordion-title, clr-step-title", "clr-accordion-description, clr-step-description", "*"], false, never>;
}
