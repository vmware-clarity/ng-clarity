import * as i0 from '@angular/core';
import { InjectionToken, OnInit, OnDestroy, ViewContainerRef, Injector, Renderer2, ElementRef } from '@angular/core';
import * as i4 from '@angular/forms';
import { NgControl } from '@angular/forms';
import * as i6 from '@clr/angular/forms/common';
import { ClrAbstractContainer, FormsFocusService, LayoutService, ControlClassService, NgControlService, WrappedFormControl } from '@clr/angular/forms/common';
import { BehaviorSubject } from 'rxjs';
import { ClrCommonStringsService } from '@clr/angular/utils';
import * as i3 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare const TOGGLE_SERVICE: InjectionToken<BehaviorSubject<boolean>>;
declare function ToggleServiceFactory(): BehaviorSubject<boolean>;
declare const TOGGLE_SERVICE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof ToggleServiceFactory;
};
declare class ClrPasswordContainer extends ClrAbstractContainer {
    focusService: FormsFocusService;
    private toggleService;
    commonStrings: ClrCommonStringsService;
    show: boolean;
    focus: boolean;
    private _toggle;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, focusService: FormsFocusService, toggleService: BehaviorSubject<boolean>, commonStrings: ClrCommonStringsService);
    get clrToggle(): boolean;
    set clrToggle(state: boolean);
    toggle(): void;
    showPasswordText(label: string): string;
    hidePasswordText(label: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordContainer, [{ optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrPasswordContainer, "clr-password-container", never, { "clrToggle": { "alias": "clrToggle"; "required": false; }; }, {}, never, ["label", "[clrPassword]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}

declare class ClrPassword extends WrappedFormControl<ClrPasswordContainer> implements OnInit, OnDestroy {
    private focusService;
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, focusService: FormsFocusService, toggleService: BehaviorSubject<boolean>);
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPassword, [null, null, { optional: true; self: true; }, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPassword, "[clrPassword]", never, {}, {}, never, never, false, never>;
}

declare class ClrPasswordModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrPasswordModule, [typeof ClrPassword, typeof ClrPasswordContainer], [typeof i3.CommonModule, typeof i4.FormsModule, typeof i5.ClrIcon, typeof i6.ClrCommonFormsModule], [typeof i6.ClrCommonFormsModule, typeof ClrPassword, typeof ClrPasswordContainer]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrPasswordModule>;
}

export { ClrPassword, ClrPasswordContainer, ClrPasswordModule, TOGGLE_SERVICE, TOGGLE_SERVICE_PROVIDER, ToggleServiceFactory };
