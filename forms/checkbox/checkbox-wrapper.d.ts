import { InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClrCheckbox } from './checkbox';
import { ClrControlLabel } from '../common/label';
export declare const IS_TOGGLE: InjectionToken<BehaviorSubject<boolean>>;
export declare function isToggleFactory(): BehaviorSubject<boolean>;
export declare const IS_TOGGLE_PROVIDER: {
    provide: InjectionToken<BehaviorSubject<boolean>>;
    useFactory: typeof isToggleFactory;
};
export declare class ClrCheckboxWrapper implements OnInit, OnDestroy {
    label: ClrControlLabel;
    checkbox: ClrCheckbox;
    toggle: boolean;
    private subscriptions;
    constructor(toggleService: BehaviorSubject<boolean>);
    ngOnInit(): void;
    ngOnDestroy(): void;
}
