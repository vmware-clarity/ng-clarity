import { AfterViewInit, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StepperService } from './providers/stepper.service';
import { ClrStepperPanel } from './stepper-panel';
export declare class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
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
}
