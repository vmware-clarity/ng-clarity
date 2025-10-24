import { Type } from '@angular/core';
import { FocusableItem } from './focusable-item';
export declare function customFocusableItemProvider<T>(implementation: Type<T>): (Type<T> | {
    provide: typeof FocusableItem;
    useExisting: Type<T>;
})[];
