import { Observable } from 'rxjs';
export declare class FocusService {
    private _focused;
    get focusChange(): Observable<boolean>;
    set focused(state: boolean);
}
