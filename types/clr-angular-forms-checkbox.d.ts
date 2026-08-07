import * as i0 from '@angular/core';
import { OnInit, OnDestroy, InjectionToken, ViewContainerRef, Injector, Renderer2, ElementRef, AfterContentInit, QueryList } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrControlLabel, WrappedFormControl, ClrAbstractContainer, LayoutService, ControlClassService, NgControlService } from '@clr/angular/forms/common';
import { BehaviorSubject } from 'rxjs';
import * as i4 from '@angular/common';
import * as i5 from '@clr/angular/icon';
import * as i7 from '@clr/angular/utils';

declare const IS_TOGGLE: InjectionToken<BehaviorSubject<boolean>>;
declare function isToggleFactory(): BehaviorSubject<boolean>;
declare const IS_TOGGLE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof isToggleFactory;
};
declare class ClrCheckboxWrapper implements OnInit, OnDestroy {
    label: ClrControlLabel;
    checkbox: ClrCheckbox;
    toggle: boolean;
    private subscriptions;
    constructor(toggleService: BehaviorSubject<boolean>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxWrapper, "clr-checkbox-wrapper,clr-toggle-wrapper", never, {}, {}, ["label", "checkbox"], ["[clrCheckbox],[clrToggle]", "label"], false, never>;
}

/**
 * This implements both the clrCheckbox and clrToggle functionality, since they are both just checkboxes with different
 * visual styling. The challenge is that the container needs to know which selector was used, which the @Attribute
 * decorator gets for us to determine if the toggle is used, and emits a value to the wrapper container to tell it
 * there is a toggle switch instead.
 */
declare class ClrCheckbox extends WrappedFormControl<ClrCheckboxWrapper> {
    private control;
    protected toggle: string;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, toggle: string);
    get controlDisabled(): boolean;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckbox, [null, null, { optional: true; self: true; }, null, null, { attribute: "clrToggle"; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrCheckbox, "[clrCheckbox],[clrToggle]", never, {}, {}, never, never, false, never>;
}

declare class ClrCheckboxContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    role: string;
    checkboxes: QueryList<ClrCheckbox>;
    private inline;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    protected get allCheckboxesDisabled(): boolean;
    ngAfterContentInit(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxContainer, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxContainer, "clr-checkbox-container,clr-toggle-container", never, { "clrInline": { "alias": "clrInline"; "required": false; }; }, {}, ["checkboxes"], ["label", "clr-checkbox-wrapper,clr-toggle-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrCheckboxModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrCheckboxModule, [typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper], [typeof i4.CommonModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule, typeof i7.ClrHostWrappingModule], [typeof i6.ClrCommonFormsModule, typeof ClrCheckbox, typeof ClrCheckboxContainer, typeof ClrCheckboxWrapper]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrCheckboxModule>;
}

export { ClrCheckbox, ClrCheckboxContainer, ClrCheckboxModule, ClrCheckboxWrapper, IS_TOGGLE, IS_TOGGLE_PROVIDER, isToggleFactory };
