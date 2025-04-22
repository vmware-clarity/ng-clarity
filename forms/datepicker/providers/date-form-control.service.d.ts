import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class DateFormControlService {
    disabled: boolean;
    private _touchedChange;
    private _dirtyChange;
    get touchedChange(): Observable<void>;
    get dirtyChange(): Observable<void>;
    markAsTouched(): void;
    markAsDirty(): void;
    setDisabled(state: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateFormControlService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateFormControlService>;
}
