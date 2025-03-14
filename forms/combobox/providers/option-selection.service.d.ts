import { Observable } from 'rxjs';
import { ComboboxModel } from '../model/combobox.model';
import * as i0 from "@angular/core";
export declare class OptionSelectionService<T> {
    loading: boolean;
    displayField: string;
    selectionModel: ComboboxModel<T>;
    inputChanged: Observable<string>;
    showAllOptions: boolean;
    private _currentInput;
    private _inputChanged;
    private _selectionChanged;
    constructor();
    get currentInput(): string;
    set currentInput(input: string);
    get selectionChanged(): Observable<ComboboxModel<T>>;
    get multiselectable(): boolean;
    select(item: T): void;
    toggle(item: T): void;
    unselect(item: T): void;
    setSelectionValue(value: T | T[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OptionSelectionService<any>, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OptionSelectionService<any>>;
}
