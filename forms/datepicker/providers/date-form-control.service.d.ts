import { Observable } from 'rxjs';
export declare class DateFormControlService {
    disabled: boolean;
    private _touchedChange;
    private _dirtyChange;
    get touchedChange(): Observable<void>;
    get dirtyChange(): Observable<void>;
    markAsTouched(): void;
    markAsDirty(): void;
    setDisabled(state: boolean): void;
}
