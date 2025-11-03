import { Observable } from 'rxjs';
export declare class MarkControlService {
    private _touched;
    get touchedChange(): Observable<void>;
    markAsTouched(): void;
}
