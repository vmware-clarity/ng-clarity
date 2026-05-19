export interface ClrDatagridStringFilterInterface<T> {
    accepts(item: T, search: string): boolean;
}
