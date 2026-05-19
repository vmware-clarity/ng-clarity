import { ElementRef, OnDestroy, OnInit } from '@angular/core';
import { ClrCommonStringsService } from '../utils';
import { PageCollectionService } from './providers/page-collection.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import { ClrWizardPage } from './wizard-page';
import * as i0 from "@angular/core";
export declare class ClrWizardStepnavItem implements OnInit, OnDestroy {
    navService: WizardNavigationService;
    pageCollection: PageCollectionService;
    commonStrings: ClrCommonStringsService;
    private readonly elementRef;
    page: ClrWizardPage;
    private subscription;
    /**
     * This is used to prevent the steps from scrolling as the user clicks on the steps.
     */
    private skipNextScroll;
    constructor(navService: WizardNavigationService, pageCollection: PageCollectionService, commonStrings: ClrCommonStringsService, elementRef: ElementRef<HTMLElement>);
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
    protected get icon(): {
        shape: string;
        label: string;
    } | null;
    ngOnInit(): void;
    ngOnDestroy(): void;
    click(): void;
    private pageGuard;
    private ensureCurrentStepIsScrolledIntoView;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardStepnavItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardStepnavItem, "[clr-wizard-stepnav-item]", never, { "page": "page"; }, {}, never, ["*"], false, never>;
}
