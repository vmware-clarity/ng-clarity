import { QueryList } from '@angular/core';
import { ClrLabel } from './label';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';
import * as i0 from "@angular/core";
export declare class ClrForm {
    layoutService: LayoutService;
    private markControlService;
    labels: QueryList<ClrLabel>;
    constructor(layoutService: LayoutService, markControlService: MarkControlService);
    set labelSize(size: number | string);
    onFormSubmit(): void;
    markAsTouched(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrForm, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrForm, "[clrForm]", never, { "labelSize": "clrLabelSize"; }, {}, ["labels"], never, false, never>;
}
