import { OnInit } from '@angular/core';
import { ClrFormLayout, LayoutService } from './providers/layout.service';
import * as i0 from "@angular/core";
export declare class ClrLayout implements OnInit {
    layoutService: LayoutService;
    layout: ClrFormLayout | string;
    constructor(layoutService: LayoutService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLayout, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrLayout, "[clrForm][clrLayout]", never, { "layout": "clrLayout"; }, {}, never, never, false, never>;
}
