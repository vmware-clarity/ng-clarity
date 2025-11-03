import { AfterContentInit } from '@angular/core';
import { DatalistIdService } from './providers/datalist-id.service';
export declare class ClrDatalist implements AfterContentInit {
    private datalistIdService;
    datalistId: string;
    private subscriptions;
    constructor(datalistIdService: DatalistIdService);
    set id(idValue: string);
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
}
