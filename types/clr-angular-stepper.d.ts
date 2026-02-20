import * as _angular_forms from '@angular/forms';
import { FormGroupName, NgModelGroup, FormGroupDirective, NgForm } from '@angular/forms';
import * as i0 from '@angular/core';
import { OnInit, ElementRef, ChangeDetectorRef, OnChanges, AfterViewInit, OnDestroy, QueryList, SimpleChanges } from '@angular/core';
import * as _clr_angular_accordion from '@clr/angular/accordion';
import { AccordionModel, AccordionService, ClrAccordionPanel, AccordionStatus } from '@clr/angular/accordion';
import { ClrCommonStringsService, IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import { Observable, Subscription } from 'rxjs';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';

declare class StepperModel extends AccordionModel {
    private stepperModelInitialize;
    private initialPanel;
    get allPanelsCompleted(): boolean;
    get shouldOpenFirstPanel(): boolean;
    addPanel(id: string, open?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    togglePanel(panelId: string): void;
    navigateToPreviousPanel(currentPanelId: string): void;
    navigateToNextPanel(currentPanelId: string, currentPanelValid?: boolean): void;
    overrideInitialPanel(panelId: string): void;
    setPanelValid(panelId: string): void;
    setPanelInvalid(panelId: string): void;
    setPanelsWithErrors(ids: string[]): void;
    resetPanels(): void;
    getNextPanel(currentPanelId: string): _clr_angular_accordion.AccordionPanelModel;
    getPreviousPanel(currentPanelId: string): _clr_angular_accordion.AccordionPanelModel;
    private resetAllFuturePanels;
    private resetPanel;
    private openFirstPanel;
    private completePanel;
    private openNextPanel;
    private openPreviousPanel;
    private setPanelError;
    private getFirstPanel;
    private getNumberOfIncompletePanels;
    private getNumberOfOpenPanels;
}

declare class StepperService extends AccordionService {
    readonly activeStep: Observable<string>;
    readonly panelsCompleted: Observable<boolean>;
    protected accordion: StepperModel;
    private _activeStepChanges;
    constructor();
    resetPanels(): void;
    setPanelValid(panelId: string): void;
    setPanelInvalid(panelId: string): void;
    setPanelsWithErrors(ids: string[]): void;
    navigateToPreviousPanel(currentPanelId: string): void;
    navigateToNextPanel(currentPanelId: string, currentPanelValid?: boolean): void;
    overrideInitialPanel(panelId: string): void;
    private updateNextStep;
    private updatePreviousStep;
    private getAllCompletedPanelChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StepperService>;
}

declare class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
    private platformId;
    commonStrings: ClrCommonStringsService;
    private formGroupName;
    private ngModelGroup;
    private stepperService;
    headerButton: ElementRef<HTMLButtonElement>;
    readonly AccordionStatus: typeof AccordionStatus;
    private subscriptions;
    constructor(platformId: any, commonStrings: ClrCommonStringsService, formGroupName: FormGroupName, ngModelGroup: NgModelGroup, stepperService: StepperService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(_value: string);
    get formGroup(): _angular_forms.FormGroup<any>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private listenToFocusChanges;
    private triggerAllFormControlValidationIfError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperPanel, [null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepperPanel, "clr-stepper-panel", never, {}, {}, never, ["clr-step-title", "clr-step-description", "*"], false, never>;
}

declare class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private formGroup;
    private ngForm;
    private stepperService;
    initialPanel: string;
    panels: QueryList<ClrStepperPanel>;
    subscriptions: Subscription[];
    form: FormGroupDirective | NgForm;
    constructor(formGroup: FormGroupDirective, ngForm: NgForm, stepperService: StepperService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    private listenForFormResetChanges;
    private listenForPanelsCompleted;
    private setPanelsWithFormErrors;
    private listenForDOMChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepper, [{ optional: true; }, { optional: true; }, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepper, "form[clrStepper]", never, { "initialPanel": { "alias": "clrInitialStep"; "required": false; }; }, {}, ["panels"], ["*"], false, never>;
}

declare enum ClrStepButtonType {
    Next = "next",
    Previous = "previous",
    Submit = "submit"
}
declare class ClrStepButton implements OnInit {
    private clrStep;
    private stepperService;
    type: ClrStepButtonType | string;
    submitButton: boolean;
    previousButton: boolean;
    constructor(clrStep: ClrStepperPanel, stepperService: StepperService);
    ngOnInit(): void;
    navigateToNextPanel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStepButton, "[clrStepButton]", never, { "type": { "alias": "clrStepButton"; "required": false; }; }, {}, never, never, false, never>;
}

declare class StepperWillyWonka extends WillyWonka {
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperWillyWonka, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StepperWillyWonka, "form[clrStepper]", never, {}, {}, never, never, false, never>;
}

declare class StepperOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: StepperWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StepperOompaLoompa, "clr-stepper-panel, [clrStepButton]", never, {}, {}, never, never, false, never>;
}

declare class ClrStepperModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStepperModule, [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof _clr_angular_accordion.ClrAccordionModule], [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka, typeof _clr_angular_accordion.ClrAccordionModule, typeof i7.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStepperModule>;
}

export { ClrStepButton, ClrStepButtonType, ClrStepper, ClrStepperModule, ClrStepperPanel, StepperOompaLoompa as ÇlrStepperOompaLoompa, StepperWillyWonka as ÇlrStepperWillyWonka };
