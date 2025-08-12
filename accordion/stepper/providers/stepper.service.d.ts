import { Observable } from 'rxjs';
import { AccordionService } from '../../providers/accordion.service';
import { StepperModel } from '../models/stepper.model';
import * as i0 from "@angular/core";
export declare class StepperService extends AccordionService {
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
