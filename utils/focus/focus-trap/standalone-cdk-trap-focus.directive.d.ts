import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { ElementRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrStandaloneCdkTrapFocus extends CdkTrapFocus {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, focusTrapFactory: FocusTrapFactory, document: any);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStandaloneCdkTrapFocus, [null, null, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStandaloneCdkTrapFocus, never, never, {}, {}, never, never, true, never>;
}
