import * as i0 from '@angular/core';
import { Renderer2, ViewContainerRef, Injector, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as i4 from '@clr/angular/forms/common';
import { ClrAbstractContainer, LayoutService, ControlClassService, NgControlService, ControlIdService, WrappedFormControl } from '@clr/angular/forms/common';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/utils';
import * as i6 from '@clr/angular/icon';

declare class ClrRangeContainer extends ClrAbstractContainer {
    private renderer;
    private idService;
    private _hasProgress;
    private lastRangeProgressFillWidth;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, renderer: Renderer2, idService: ControlIdService);
    get hasProgress(): boolean;
    set hasProgress(val: boolean);
    getRangeProgressFillWidth(): string;
    private selectRangeElement;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeContainer, [{ optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRangeContainer, "clr-range-container", never, { "hasProgress": { "alias": "clrRangeHasProgress"; "required": false; }; }, {}, never, ["label", "[clrRange]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRange extends WrappedFormControl<ClrRangeContainer> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRange, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRange, "[clrRange]", never, {}, {}, never, never, false, never>;
}

declare class ClrRangeModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRangeModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRangeModule, [typeof ClrRange, typeof ClrRangeContainer], [typeof i3.CommonModule, typeof i4.ClrCommonFormsModule, typeof i5.ClrHostWrappingModule, typeof i6.ClrIcon], [typeof i4.ClrCommonFormsModule, typeof ClrRange, typeof ClrRangeContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRangeModule>;
}

export { ClrRange, ClrRangeContainer, ClrRangeModule };
