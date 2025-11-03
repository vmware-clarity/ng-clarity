import { QueryList } from '@angular/core';
import { ClrControlLabel } from './label';
import { LayoutService } from './providers/layout.service';
import { MarkControlService } from './providers/mark-control.service';
export declare class ClrForm {
    layoutService: LayoutService;
    private markControlService;
    labels: QueryList<ClrControlLabel>;
    constructor(layoutService: LayoutService, markControlService: MarkControlService);
    set labelSize(size: number | string);
    onFormSubmit(): void;
    markAsTouched(): void;
}
