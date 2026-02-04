import * as i0 from '@angular/core';
import { OnInit, OnChanges, EventEmitter, QueryList, ChangeDetectorRef, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ClrCommonStringsService, HeadingLevel, IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import * as i8 from '@angular/common';
import * as i9 from '@clr/angular/icon';
import * as _angular_animations from '@angular/animations';

declare class ClrAccordionDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionDescription, "clr-accordion-description, clr-step-description", never, {}, {}, never, ["*"], false, never>;
}

declare enum AccordionStatus {
    Inactive = "inactive",
    Error = "error",
    Complete = "complete"
}

declare enum AccordionStrategy {
    Default = "default",// only one panel at a time
    Multi = "multi"
}

declare class AccordionPanelModel {
    id: string;
    accordionId: number | string;
    status: AccordionStatus;
    index: number;
    disabled: boolean;
    open: boolean;
    templateId: string;
    constructor(id: string, accordionId: number | string);
}
declare class AccordionModel {
    protected strategy: AccordionStrategy;
    protected accordionCount: number;
    protected _panels: {
        [id: string]: AccordionPanelModel;
    };
    get panels(): AccordionPanelModel[];
    setStrategy(strategy: AccordionStrategy): void;
    updatePanelOrder(ids: string[]): void;
    addPanel(id: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled: boolean): void;
    private closeAllPanels;
    private removeOldPanels;
}

declare class AccordionService {
    protected accordion: AccordionModel;
    protected readonly _panelsChanges: BehaviorSubject<AccordionPanelModel[]>;
    getPanelChanges(panelId: string): Observable<AccordionPanelModel>;
    setStrategy(strategy: AccordionStrategy): void;
    addPanel(panelId: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    protected emitUpdatedPanels(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccordionService>;
}

declare class ClrAccordionPanel implements OnInit, OnChanges {
    private parent;
    commonStrings: ClrCommonStringsService;
    private accordionService;
    private ifExpandService;
    private cdr;
    disabled: boolean;
    panelOpen: boolean;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionPanel, "clr-accordion-panel", never, { "disabled": { "alias": "clrAccordionPanelDisabled"; "required": false; }; "panelOpen": { "alias": "clrAccordionPanelOpen"; "required": false; }; "explicitHeadingLevel": { "alias": "clrAccordionPanelHeadingLevel"; "required": false; }; }, { "panelOpenChange": "clrAccordionPanelOpenChange"; }, ["accordionDescription"], ["clr-accordion-title, clr-step-title", "clr-accordion-description, clr-step-description", "*"], false, never>;
}

declare class ClrAccordion implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordion, "clr-accordion", never, { "multiPanel": { "alias": "clrAccordionMultiPanel"; "required": false; }; }, {}, ["panels"], ["*"], false, never>;
}

declare class ClrAccordionTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionTitle, "clr-accordion-title, clr-step-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionContent, "clr-accordion-content, clr-step-content", never, {}, {}, never, ["*"], false, never>;
}

declare class AccordionWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccordionWillyWonka, "clr-accordion", never, {}, {}, never, never, false, never>;
}

declare class AccordionOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: AccordionWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AccordionOompaLoompa, "clr-accordion-panel", never, {}, {}, never, never, false, never>;
}

declare class ClrAccordionModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrAccordionModule, [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent, typeof AccordionOompaLoompa, typeof AccordionWillyWonka], [typeof i8.CommonModule, typeof i9.ClrIcon], [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent, typeof AccordionOompaLoompa, typeof AccordionWillyWonka]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrAccordionModule>;
}

declare const panelAnimation: _angular_animations.AnimationTriggerMetadata[];
declare const stepAnimation: _angular_animations.AnimationTriggerMetadata[];

export { AccordionModel, AccordionPanelModel, AccordionService, AccordionStatus, AccordionStrategy, ClrAccordion, ClrAccordionContent, ClrAccordionDescription, ClrAccordionModule, ClrAccordionPanel, ClrAccordionTitle, panelAnimation, stepAnimation, AccordionOompaLoompa as ÇlrAccordionOompaLoompa, AccordionWillyWonka as ÇlrAccordionWillyWonka };
