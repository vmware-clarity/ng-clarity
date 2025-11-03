import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { ElementRef } from '@angular/core';
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
}
/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
export declare class CdkTrapFocusModule {
}
