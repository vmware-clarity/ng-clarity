import { TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class ClrOptionSelected<T> {
    template: TemplateRef<{
        $implicit: T;
    }>;
    selected: T;
    constructor(template: TemplateRef<{
        $implicit: T;
    }>);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrOptionSelected<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrOptionSelected<any>, "[clrOptionSelected]", never, { "selected": "clrOptionSelected"; }, {}, never, never, false, never>;
}
