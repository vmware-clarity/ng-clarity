import { ChangeDetectorRef } from '@angular/core';
import { StepperWillyWonka } from './stepper-willy-wonka';
import { OompaLoompa } from '../../../utils/chocolate/oompa-loompa';
import { IfExpandService } from '../../../utils/conditional/if-expanded.service';
export declare class StepperOompaLoompa extends OompaLoompa {
    private expand;
    constructor(cdr: ChangeDetectorRef, willyWonka: StepperWillyWonka, ifExpandService: IfExpandService);
    get flavor(): boolean;
}
