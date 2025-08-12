import { Observable } from 'rxjs';
import { SingleSelectComboboxModel } from './single-select-combobox.model';
export declare class PseudoFocusModel<T> extends SingleSelectComboboxModel<T> {
    private _focusChanged;
    get focusChanged(): Observable<T>;
    select(item: T): void;
}
