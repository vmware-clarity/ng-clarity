export declare abstract class ComboboxModel<T> {
    model: T | T[];
    abstract containsItem(item: T): boolean;
    abstract select(item: T): void;
    abstract unselect(item: T): void;
    abstract toString(displayField?: string, index?: number): string;
    abstract isEmpty(): boolean;
    abstract pop(): T;
}
