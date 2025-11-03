import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { ElementRef } from '@angular/core';
export declare class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, focusTrapFactory: FocusTrapFactory, document: any);
}
