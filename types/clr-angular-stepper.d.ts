import * as i0 from "@angular/core";
import { AfterViewInit, ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from "@angular/core";
import { FormGroupDirective, FormGroupName, NgForm, NgModelGroup } from "@angular/forms";
import { CollapsiblePanel, CollapsiblePanelGroupModel, CollapsiblePanelModel, CollapsiblePanelService } from "@clr/angular/collapsible-panel";
import { ClrCommonStringsService, IfExpandService } from "@clr/angular/utils";
import { Observable } from "rxjs";
import * as i7 from "@angular/common";
import * as i8 from "@clr/angular/icon";
export declare enum StepperPanelStatus {
  Inactive = "inactive",
  Error = "error",
  Complete = "complete"
}
export declare class StepperPanelModel extends CollapsiblePanelModel {
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
export declare class StepperService extends CollapsiblePanelService {
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
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
export declare class ClrStepDescription {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepDescription, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepDescription, "clr-step-description", never, {}, {}, never, ["*"], false, never>;
}
export declare class ClrStepperPanel extends CollapsiblePanel implements OnInit {
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
  protected animatesCollapse: boolean;
  private subscriptions;
  constructor(platformId: any, commonStrings: ClrCommonStringsService, formGroupName: FormGroupName, ngModelGroup: NgModelGroup, stepperService: StepperService, ifExpandService: IfExpandService, cdr: ChangeDetectorRef);
  get id(): string;
  set id(_value: string);
  get panelNumber(): number;
  get formGroup(): import("@angular/forms").FormGroup<any>;
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
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperPanel, [null, null, {
    optional: true;
  }, {
    optional: true;
  }, {
    optional: true;
  }, null, null]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepperPanel, "clr-stepper-panel", never, {}, {}, ["stepDescription"], ["clr-step-title", "clr-step-description", "*"], false, never>;
}
export declare class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepper, [{
    optional: true;
  }, {
    optional: true;
  }, null]>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepper, "form[clrStepper]", never, {
    "initialPanel": {
      "alias": "clrInitialStep";
      "required": false;
    };
  }, {}, ["panels"], ["*"], false, never>;
}
export declare enum ClrStepButtonType {
  Next = "next",
  Previous = "previous",
  Submit = "submit"
}
export declare class ClrStepButton implements OnInit {
  private clrStep;
  private stepperService;
  type: ClrStepButtonType | string;
  submitButton: boolean;
  previousButton: boolean;
  constructor(clrStep: ClrStepperPanel, stepperService: StepperService);
  ngOnInit(): void;
  navigateToNextPanel(): void;
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepButton, [{
    optional: true;
  }, {
    optional: true;
  }]>;
  static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStepButton, "[clrStepButton]", never, {
    "type": {
      "alias": "clrStepButton";
      "required": false;
    };
  }, {}, never, never, false, never>;
}
export declare class ClrStepTitle {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepTitle, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepTitle, "clr-step-title", never, {}, {}, never, ["*"], false, never>;
}
export declare class ClrStepContent {
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepContent, never>;
  static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepContent, "clr-step-content", never, {}, {}, never, ["*"], false, never>;
}
export declare class ClrStepperModule {
  constructor();
  static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<ClrStepperModule, [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepTitle, typeof ClrStepDescription, typeof ClrStepContent, typeof ClrStepperPanel], [typeof i7.CommonModule, typeof i8.ClrIcon], [typeof ClrStepper, typeof ClrStepButton, typeof ClrStepTitle, typeof ClrStepDescription, typeof ClrStepContent, typeof ClrStepperPanel, typeof i8.ClrIcon]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<ClrStepperModule>;
}
export {};