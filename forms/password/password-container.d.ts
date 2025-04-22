import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
export declare const TOGGLE_SERVICE: InjectionToken<BehaviorSubject<boolean>>;
export declare function ToggleServiceFactory(): BehaviorSubject<boolean>;
export declare const TOGGLE_SERVICE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof ToggleServiceFactory;
};
export declare class ClrPasswordContainer extends ClrAbstractContainer {
    focusService: FocusService;
    private toggleService;
    commonStrings: ClrCommonStringsService;
    show: boolean;
    focus: boolean;
    private _toggle;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, focusService: FocusService, toggleService: BehaviorSubject<boolean>, commonStrings: ClrCommonStringsService);
    get clrToggle(): boolean;
    set clrToggle(state: boolean);
    toggle(): void;
    showPasswordText(label: string): string;
    hidePasswordText(label: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPasswordContainer, [null, { optional: true; }, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrPasswordContainer, "clr-password-container", never, { "clrToggle": "clrToggle"; }, {}, never, ["label", "[clrPassword]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
