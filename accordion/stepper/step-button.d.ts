import { OnInit } from '@angular/core';
import { StepperService } from './providers/stepper.service';
import { ClrStepperPanel } from './stepper-panel';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStepButton, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStepButton, "[clrStepButton]", never, { "type": "clrStepButton"; }, {}, never, never, false, never>;
}
