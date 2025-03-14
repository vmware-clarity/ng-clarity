import { ComboboxModel } from './combobox.model';
export declare class SingleSelectComboboxModel<T> implements ComboboxModel<T> {
    model: T;
    containsItem(item: T): boolean;
    select(item: T): void;
    unselect(item: T): void;
    isEmpty(): boolean;
    pop(): T;
    toString(displayField?: string): string;
}
