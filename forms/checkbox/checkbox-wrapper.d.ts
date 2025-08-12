import { InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClrLabel } from '../common/label';
import { ClrCheckbox } from './checkbox';
import * as i0 from "@angular/core";
export declare const IS_TOGGLE: InjectionToken<BehaviorSubject<boolean>>;
export declare function isToggleFactory(): BehaviorSubject<boolean>;
export declare const IS_TOGGLE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof isToggleFactory;
};
export declare class ClrCheckboxWrapper implements OnInit, OnDestroy {
    label: ClrLabel;
    checkbox: ClrCheckbox;
    toggle: boolean;
    private subscriptions;
    constructor(toggleService: BehaviorSubject<boolean>);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxWrapper, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxWrapper, "clr-checkbox-wrapper,clr-toggle-wrapper", never, {}, {}, ["label", "checkbox"], ["[clrCheckbox],[clrToggle]", "label"], false, never>;
}
