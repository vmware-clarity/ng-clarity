import { AccordionStatus } from '../enums/accordion-status.enum';
import { AccordionStrategy } from '../enums/accordion-strategy.enum';
export declare class AccordionPanelModel {
    id: string;
    accordionId: number | string;
    status: AccordionStatus;
    index: number;
    disabled: boolean;
    open: boolean;
    templateId: string;
    constructor(id: string, accordionId: number | string);
}
export declare class AccordionModel {
    protected strategy: AccordionStrategy;
    protected accordionCount: number;
    protected _panels: {
        [id: string]: AccordionPanelModel;
    };
    get panels(): AccordionPanelModel[];
    setStrategy(strategy: AccordionStrategy): void;
    updatePanelOrder(ids: string[]): void;
    addPanel(id: string, open?: boolean): void;
    togglePanel(panelId: string, open?: boolean): void;
    disablePanel(panelId: string, disabled: boolean): void;
    private closeAllPanels;
    private removeOldPanels;
}
