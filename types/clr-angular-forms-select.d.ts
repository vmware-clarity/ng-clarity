import * as i0 from '@angular/core';
import { ViewContainerRef, Injector, Renderer2, ElementRef } from '@angular/core';
import * as i4 from '@angular/forms';
import { SelectMultipleControlValueAccessor, NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrAbstractContainer, LayoutService, ControlClassService, NgControlService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare class ClrSelectContainer extends ClrAbstractContainer {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    multiple: SelectMultipleControlValueAccessor;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    private get multi();
    wrapperClass(): "clr-multiselect-wrapper" | "clr-select-wrapper";
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSelectContainer, "clr-select-container", never, {}, {}, ["multiple"], ["label", "[clrSelect]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrSelect extends WrappedFormControl<ClrSelectContainer> {
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLSelectElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelect, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrSelect, "[clrSelect]", never, {}, {}, never, never, false, never>;
}

declare class ClrSelectModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSelectModule, [typeof ClrSelect, typeof ClrSelectContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrSelect, typeof ClrSelectContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSelectModule>;
}

export { ClrSelect, ClrSelectContainer, ClrSelectModule };
