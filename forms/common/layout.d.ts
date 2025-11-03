import { OnInit } from '@angular/core';
import { ClrFormLayout, LayoutService } from './providers/layout.service';
export declare class ClrLayout implements OnInit {
    layoutService: LayoutService;
    layout: ClrFormLayout | string;
    constructor(layoutService: LayoutService);
    ngOnInit(): void;
}
