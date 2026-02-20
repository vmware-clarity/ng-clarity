import * as i0 from '@angular/core';
import { OnInit, ViewContainerRef, Injector, Renderer2, ElementRef, AfterContentInit, QueryList } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as i5 from '@clr/angular/forms/common';
import { ClrControlLabel, WrappedFormControl, ClrAbstractContainer, LayoutService, ControlClassService, NgControlService } from '@clr/angular/forms/common';
import * as i4 from '@angular/common';
import * as i6 from '@clr/angular/utils';
import * as i7 from '@clr/angular/icon';

declare class ClrRadioWrapper implements OnInit {
    label: ClrControlLabel;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioWrapper, "clr-radio-wrapper", never, {}, {}, ["label"], ["[clrRadio]", "label"], false, never>;
}

declare class ClrRadio extends WrappedFormControl<ClrRadioWrapper> {
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadio, [null, null, { optional: true; self: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrRadio, "[clrRadio]", never, {}, {}, never, never, false, never>;
}

declare class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    role: string;
    ariaLabelledBy: string;
    radios: QueryList<ClrRadio>;
    groupLabel: ElementRef<HTMLElement>;
    private inline;
    private _generatedId;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    ngAfterContentInit(): void;
    private setAriaRoles;
    private setAriaLabelledBy;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrRadioContainer, "clr-radio-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["groupLabel", "radios"], ["label", "clr-radio-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrRadioModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrRadioModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrRadioModule, [typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper], [typeof i4.CommonModule, typeof i5.ClrCommonFormsModule, typeof i6.ClrHostWrappingModule, typeof i7.ClrIcon], [typeof i5.ClrCommonFormsModule, typeof ClrRadio, typeof ClrRadioContainer, typeof ClrRadioWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrRadioModule>;
}

export { ClrRadio, ClrRadioContainer, ClrRadioModule, ClrRadioWrapper };
