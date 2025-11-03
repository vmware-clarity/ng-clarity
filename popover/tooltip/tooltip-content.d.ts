import { ElementRef, Injector, OnInit } from '@angular/core';
import { AbstractPopover } from '../common/abstract-popover';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
export declare class ClrTooltipContent extends AbstractPopover implements OnInit {
    private tooltipIdService;
    private tooltipMouseService;
    private _id;
    private _position;
    private _size;
    constructor(injector: Injector, parentHost: ElementRef<HTMLElement>, tooltipIdService: TooltipIdService, tooltipMouseService: TooltipMouseService);
    get id(): string;
    set id(value: string);
    get position(): string;
    set position(value: string);
    get size(): string;
    set size(value: string);
    ngOnInit(): void;
    private onMouseEnter;
    private onMouseLeave;
    private updateCssClass;
}
