import { NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export interface Helpers {
    show?: boolean;
    showInvalid?: boolean;
    showValid?: boolean;
    showHelper?: boolean;
}
export declare class NgControlService {
    private _control;
    private _additionalControls;
    private _controlChanges;
    private _additionalControlsChanges;
    private _helpers;
    get control(): NgControl;
    get controlChanges(): Observable<NgControl>;
    get additionalControls(): NgControl[];
    get additionalControlsChanges(): Observable<NgControl[]>;
    get hasAdditionalControls(): boolean;
    get helpersChange(): Observable<Helpers>;
    setControl(control: NgControl): void;
    addAdditionalControl(control: NgControl): void;
    setHelpers(state: Helpers): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NgControlService>;
}
