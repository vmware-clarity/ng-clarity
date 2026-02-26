import * as _angular_forms from '@angular/forms';
import { FormGroupName, NgModelGroup, FormGroupDirective, NgForm } from '@angular/forms';
import * as i0 from '@angular/core';
import { OnInit, ElementRef, QueryList, ChangeDetectorRef, OnChanges, AfterViewInit, OnDestroy, SimpleChanges } from '@angular/core';
import { CollapsiblePanelModel, CollapsiblePanelGroupModel, CollapsiblePanelService, CollapsiblePanel } from '@clr/angular/collapsible-panel';
import { ClrCommonStringsService, IfExpandService, WillyWonka, OompaLoompa } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i9 from '@angular/common';
import * as i10 from '@clr/angular/icon';

declare enum StepperPanelStatus {
    Inactive = "inactive",
    Error = "error",
    Complete = "complete"
}

declare class StepperPanelModel extends CollapsiblePanelModel {
    status: StepperPanelStatus;
}

declare class StepperModel extends CollapsiblePanelGroupModel {
    protected _panels: {
        [id: string]: StepperPanelModel;
    };
    private stepperModelInitialize;
    private initialPanel;
    get panels(): StepperPanelModel[];
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
    getNextPanel(currentPanelId: string): StepperPanelModel;
    getPreviousPanel(currentPanelId: string): StepperPanelModel;
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

declare class StepperService extends CollapsiblePanelService {
    readonly activeStep: Observable<string>;
    readonly panelsCompleted: Observable<boolean>;
    protected panelGroup: StepperModel;
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

declare class ClrStepDescription {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepDescription, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepDescription, "clr-step-description", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrStepperPanel extends CollapsiblePanel implements OnInit {
    private platformId;
    commonStrings: ClrCommonStringsService;
    private formGroupName;
    private ngModelGroup;
    private stepperService;
    headerButton: ElementRef<HTMLButtonElement>;
    stepDescription: QueryList<ClrStepDescription>;
    disabled: boolean;
    readonly PanelStatus: typeof StepperPanelStatus;
    panel: Observable<StepperPanelModel>;
    private subscriptions;
    constructor(platformId: any, commonStrings: ClrCommonStringsService, formGroupName: FormGroupName, ngModelGroup: NgModelGroup, stepperService: StepperService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
    get id(): string;
    set id(_value: string);
    get panelNumber(): number;
    get formGroup(): _angular_forms.FormGroup<any>;
    getPanelStatus(panel: StepperPanelModel): StepperPanelStatus;
    getPanelStateClasses(panel: StepperPanelModel): string;
    getContentId(id: string): string;
    getHeaderId(id: string): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    protected stepCompleteText(panelNumber: number): string;
    protected stepErrorText(panelNumber: number): string;
    private listenToFocusChanges;
    private triggerAllFormControlValidationIfError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperPanel, [null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepperPanel, "clr-stepper-panel", never, {}, {}, ["stepDescription"], ["clr-step-title", "clr-step-description", "*"], false, never>;
}

declare class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    private formGroup;
    private ngForm;
    private stepperService;
    initialPanel: string;
    panels: QueryList<ClrStepperPanel>;
    form: FormGroupDirective | NgForm;
    private subscriptions;
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

declare class ClrStepTitle {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepTitle, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepTitle, "clr-step-title", never, {}, {}, never, ["*"], false, never>;
}

declare class ClrStepContent {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepContent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepContent, "clr-step-content", never, {}, {}, never, ["*"], false, never>;
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
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStepperModule, [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepTitle, typeof ClrStepDescription, typeof ClrStepContent, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka], [typeof i9.CommonModule, typeof i10.ClrIcon], [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepTitle, typeof ClrStepDescription, typeof ClrStepContent, typeof ClrStepperPanel, typeof StepperOompaLoompa, typeof StepperWillyWonka, typeof i10.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrStepperModule>;
}

export { ClrStepButton, ClrStepButtonType, ClrStepContent, ClrStepDescription, ClrStepTitle, ClrStepper, ClrStepperModule, ClrStepperPanel, StepperPanelModel, StepperPanelStatus, StepperService, StepperOompaLoompa as ÇlrStepperOompaLoompa, StepperWillyWonka as ÇlrStepperWillyWonka };
