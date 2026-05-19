import { BehaviorSubject, Observable } from 'rxjs';
import { AccordionStrategy } from '../enums/accordion-strategy.enum';
import { AccordionModel, AccordionPanelModel } from '../models/accordion.model';
import * as i0 from "@angular/core";
export declare class AccordionService {
    protected accordion: AccordionModel;
    protected readonly _panelsChanges: BehaviorSubject<AccordionPanelModel[]>;
    getPanelChanges(panelId: string): Observable<AccordionPanelModel>;
    setStrategy(strategy: AccordionStrategy): void;
    addPanel(panelId: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled?: boolean): void;
    updatePanelOrder(ids: string[]): void;
    protected emitUpdatedPanels(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AccordionService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AccordionService>;
}
