import { ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { FormGroupName, NgModelGroup } from '@angular/forms';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAccordionPanel } from '../accordion-panel';
import { AccordionStatus } from '../enums/accordion-status.enum';
import { StepperService } from './providers/stepper.service';
import * as i0 from "@angular/core";
export declare class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
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
    get formGroup(): import("@angular/forms").FormGroup<any>;
    ngOnInit(): void;
    ngOnDestroy(): void;
    private listenToFocusChanges;
    private triggerAllFormControlValidationIfError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepperPanel, [null, null, { optional: true; }, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrStepperPanel, "clr-stepper-panel", never, {}, {}, never, ["clr-step-title", "clr-step-description", "*"], false, never>;
}
