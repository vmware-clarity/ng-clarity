import { QueryList } from '@angular/core';
import { ClrWizardHeaderAction } from '../wizard-header-action';
import { WizardNavigationService } from './wizard-navigation.service';
export declare class HeaderActionService {
    navService: WizardNavigationService;
    wizardHeaderActions: QueryList<ClrWizardHeaderAction>;
    constructor(navService: WizardNavigationService);
    get wizardHasHeaderActions(): boolean;
    get currentPageHasHeaderActions(): boolean;
    get showWizardHeaderActions(): boolean;
    get displayHeaderActionsWrapper(): boolean;
}
