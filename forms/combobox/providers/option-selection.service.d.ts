import { Observable } from 'rxjs';
import { ComboboxModel } from '../model/combobox.model';
export declare class OptionSelectionService<T> {
    loading: boolean;
    editable: boolean;
    filtering: boolean;
    selectionModel: ComboboxModel<T>;
    inputChanged: Observable<string>;
    showAllOptions: boolean;
    private _currentInput;
    private _displayField;
    private _inputChanged;
    private _selectionChanged;
    constructor();
    get displayField(): string;
    set displayField(value: string);
    get currentInput(): string;
    set currentInput(input: string);
    get selectionChanged(): Observable<ComboboxModel<T>>;
    get multiselectable(): boolean;
    select(item: T): void;
    toggle(item: T): void;
    unselect(item: T): void;
    setSelectionValue(value: T | T[]): void;
    parseStringToModel(value: string): T;
}
