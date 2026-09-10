import * as i0 from '@angular/core';
import { ViewContainerRef, Injector, Renderer2, ElementRef } from '@angular/core';
import * as i4 from '@angular/forms';
import { NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrAbstractContainer, WrappedFormControl } from '@clr/angular/forms/common';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare class ClrInputContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrInputContainer, "clr-input-container", never, {}, {}, never, ["label", "[clrInputPrefix]", "[clrInput]", "[clrInputSuffix]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrInput extends WrappedFormControl<ClrInputContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInput, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrInput, "[clrInput]", never, {}, {}, never, never, false, never>;
}

declare class ClrInputModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrInputModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrInputModule, [typeof ClrInput, typeof ClrInputContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrInput, typeof ClrInputContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrInputModule>;
}

export { ClrInput, ClrInputContainer, ClrInputModule };
