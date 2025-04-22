import { AccordionModel } from '../../models/accordion.model';
export declare class StepperModel extends AccordionModel {
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
    getNextPanel(currentPanelId: string): import("../../models/accordion.model").AccordionPanelModel;
    getPreviousPanel(currentPanelId: string): import("../../models/accordion.model").AccordionPanelModel;
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
