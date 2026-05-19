import { AfterContentInit } from '@angular/core';
import { DatalistIdService } from './providers/datalist-id.service';
import * as i0 from "@angular/core";
export declare class ClrDatalist implements AfterContentInit {
    private datalistIdService;
    datalistId: string;
    private subscriptions;
    constructor(datalistIdService: DatalistIdService);
    set id(idValue: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalist, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalist, "datalist", never, { "id": "id"; }, {}, never, never, false, never>;
}
