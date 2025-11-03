import { TemplateRef } from '@angular/core';
export declare class ClrOptionSelected<T> {
    template: TemplateRef<{
        $implicit: T;
    }>;
    selected: T;
    constructor(template: TemplateRef<{
        $implicit: T;
    }>);
}
