import * as i0 from '@angular/core';
import { ViewContainerRef, Injector, Renderer2, ElementRef } from '@angular/core';
import * as i4 from '@angular/forms';
import { NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrAbstractContainer, WrappedFormControl } from '@clr/angular/forms/common';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare class ClrTextareaContainer extends ClrAbstractContainer {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaContainer, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTextareaContainer, "clr-textarea-container", never, {}, {}, never, ["label", "[clrTextarea]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrTextarea extends WrappedFormControl<ClrTextareaContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLTextAreaElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextarea, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTextarea, "[clrTextarea]", never, {}, {}, never, never, false, never>;
}

declare class ClrTextareaModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTextareaModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTextareaModule, [typeof ClrTextarea, typeof ClrTextareaContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrTextarea, typeof ClrTextareaContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTextareaModule>;
}

export { ClrTextarea, ClrTextareaContainer, ClrTextareaModule };
