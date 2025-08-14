import { ChangeDetectorRef } from '@angular/core';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { IfExpandService } from '../../../utils/conditional/if-expanded.service';
import { StepperWillyWonka } from './stepper-willy-wonka';
import * as i0 from "@angular/core";
export declare class StepperOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: StepperWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<StepperOompaLoompa, [null, { optional: true; }, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StepperOompaLoompa, "clr-stepper-panel, [clrStepButton]", never, {}, {}, never, never, false, never>;
}
