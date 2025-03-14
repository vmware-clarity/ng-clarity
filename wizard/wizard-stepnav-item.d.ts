import { ClrCommonStringsService } from '../utils';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardPage } from './wizard-page';
import * as i0 from "@angular/core";
export declare class ClrWizardStepnavItem {
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    commonStrings: ClrCommonStringsService;
    page: ClrWizardPage;
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, commonStrings: ClrCommonStringsService);
    get id(): string;
    get stepAriaCurrent(): string;
    get isDisabled(): boolean;
    get isCurrent(): boolean;
    get isComplete(): boolean;
    get hasError(): boolean;
    get canNavigate(): boolean;
    protected get stepIconId(): string;
    protected get stepTextId(): string;
    protected get stepNumberId(): string;
    protected get stepTitleId(): string;
    protected get labelledby(): string;
    click(): void;
    private pageGuard;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnavItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnavItem, "[clr-wizard-stepnav-item]", never, { "page": "page"; }, {}, never, ["*"], false, never>;
}
