import * as i0 from '@angular/core';
import { OnChanges, EventEmitter, QueryList, ChangeDetectorRef, SimpleChanges, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CollapsiblePanel, CollapsiblePanelService, CollapsiblePanelModel, CollapsiblePanelGroupModel } from '@clr/angular/collapsible-panel';
import { HeadingLevel, IfExpandService } from '@clr/angular/utils';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';

declare class ClrAccordionDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionDescription, "clr-accordion-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionPanel extends CollapsiblePanel implements OnChanges {
    disabled: boolean;
    panelOpen: boolean;
    panelOpenChange: EventEmitter<boolean>;
    /**
     * Level of the accordion heading from 1 to 6.
     */
    explicitHeadingLevel: HeadingLevel;
    accordionDescription: QueryList<ClrAccordionDescription>;
    constructor(panelService: CollapsiblePanelService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    getPanelStateClasses(panel: CollapsiblePanelModel): "clr-accordion-panel-open" | "clr-accordion-panel-closed";
    getContentId(id: string): string;
    getHeaderId(id: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionPanel, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionPanel, "clr-accordion-panel", never, { "disabled": { "alias": "clrAccordionPanelDisabled"; "required": false; }; "panelOpen": { "alias": "clrAccordionPanelOpen"; "required": false; }; "explicitHeadingLevel": { "alias": "clrAccordionPanelHeadingLevel"; "required": false; }; }, { "panelOpenChange": "clrAccordionPanelOpenChange"; }, ["accordionDescription"], ["clr-accordion-title", "clr-accordion-description", "*"], false, never>;
}

/**
 * Controls how many panels can be open simultaneously within an accordion.
 */
declare enum AccordionStrategy {
    /** Only one panel can be open at a time. Opening a panel closes any previously open panel. */
    Single = "single",
    /** Multiple panels can be open simultaneously. */
    Multi = "multi"
}

declare class AccordionModel extends CollapsiblePanelGroupModel {
    private strategy;
    setStrategy(strategy: AccordionStrategy): void;
    togglePanel(panelId: string, open?: boolean): void;
    private closeAllPanels;
}

declare class AccordionService extends CollapsiblePanelService {
    protected panelGroup: AccordionModel;
    setStrategy(strategy: AccordionStrategy): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccordionService>;
}

declare class ClrAccordion implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private accordionService;
    multiPanel: boolean | string;
    panels: QueryList<ClrAccordionPanel>;
    private subscriptions;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionTitle, "clr-accordion-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAccordionContent, "clr-accordion-content", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrAccordionModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAccordionModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrAccordionModule, [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent], [typeof i6.CommonModule, typeof i7.ClrIcon], [typeof ClrAccordion, typeof ClrAccordionPanel, typeof ClrAccordionTitle, typeof ClrAccordionDescription, typeof ClrAccordionContent]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrAccordionModule>;
}

export { AccordionModel, AccordionService, AccordionStrategy, ClrAccordion, ClrAccordionContent, ClrAccordionDescription, ClrAccordionModule, ClrAccordionPanel, ClrAccordionTitle };
