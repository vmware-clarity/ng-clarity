import * as i0 from '@angular/core';
import { ElementRef, ViewContainerRef, Injector, Renderer2 } from '@angular/core';
import * as i4 from '@angular/forms';
import { NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrAbstractContainer, ControlClassService, LayoutService, NgControlService, FormsFocusService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare class ClrNumberInputContainer extends ClrAbstractContainer {
    focus: boolean;
    protected readonly input: ClrNumberInput;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FormsFocusService);
    focusOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputContainer, [null, { optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrNumberInputContainer, "clr-number-input-container", never, {}, {}, ["input"], ["label", "[clrNumberInput]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrNumberInput extends WrappedFormControl<ClrNumberInputContainer> {
    private focusService;
    private control;
    protected el: ElementRef<HTMLInputElement>;
    protected index: number;
    constructor(focusService: FormsFocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    get readonly(): boolean;
    triggerFocus(): void;
    triggerValidation(): void;
    stepUp(): void;
    stepDown(): void;
    dispatchBlur(): void;
    private dispatchStepChangeEvents;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrNumberInput, "input[type=\"number\"][clrNumberInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrNumberInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrNumberInputModule, [typeof ClrNumberInput, typeof ClrNumberInputContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrNumberInput, typeof ClrNumberInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrNumberInputModule>;
}

export { ClrNumberInput, ClrNumberInputContainer, ClrNumberInputModule };
