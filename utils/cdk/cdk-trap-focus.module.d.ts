import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
export declare class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, focusTrapFactory: FocusTrapFactory, document: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkTrapFocusModule_CdkTrapFocus, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkTrapFocusModule_CdkTrapFocus, "[cdkTrapFocus]", never, {}, {}, never, never, false, never>;
}
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
export declare class CdkTrapFocusModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkTrapFocusModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CdkTrapFocusModule, [typeof CdkTrapFocusModule_CdkTrapFocus], never, [typeof CdkTrapFocusModule_CdkTrapFocus]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CdkTrapFocusModule>;
}
