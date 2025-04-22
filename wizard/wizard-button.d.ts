import { EventEmitter } from '@angular/core';
import { ButtonHubService } from './providers/button-hub.service';
import { WizardNavigationService } from './providers/wizard-navigation.service';
import * as i0 from "@angular/core";
export declare const DEFAULT_BUTTON_TYPES: any;
export declare const CUSTOM_BUTTON_TYPES: any;
export declare class ClrWizardButton {
    navService: WizardNavigationService;
    buttonService: ButtonHubService;
    type: string;
    disabled: boolean;
    hidden: boolean;
    wasClicked: EventEmitter<string>;
    constructor(navService: WizardNavigationService, buttonService: ButtonHubService);
    get isCancel(): boolean;
    get isNext(): boolean;
    get isPrevious(): boolean;
    get isFinish(): boolean;
    get isDanger(): boolean;
    get isPrimaryAction(): boolean;
    get _disabledAttribute(): string | null;
    get isDisabled(): boolean;
    get isHidden(): boolean;
    click(): void;
    private checkDefaultAndCustomType;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrWizardButton, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrWizardButton, "clr-wizard-button", never, { "type": "type"; "disabled": "clrWizardButtonDisabled"; "hidden": "clrWizardButtonHidden"; }, { "wasClicked": "clrWizardButtonClicked"; }, never, ["*"], false, never>;
}
