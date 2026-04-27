import * as i0 from '@angular/core';
import { ElementRef, OnInit, Renderer2, Type } from '@angular/core';
import * as i1 from '@clr/angular/popover/common';
import { ClrPopoverService, ClrPopoverContent, ClrPopoverPosition } from '@clr/angular/popover/common';
import { Observable } from 'rxjs';
import * as i4 from '@angular/common';
import * as i5 from '@clr/angular/icon';

declare class ClrTooltip {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltip, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltip, "clr-tooltip", never, {}, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}

declare class TooltipIdService {
    private _id;
    get id(): Observable<string>;
    updateId(id: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipIdService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TooltipIdService>;
}

declare class TooltipMouseService {
    private readonly popoverService;
    private mouseOutDelay;
    private mouseOverTrigger;
    private mouseOverContent;
    constructor(popoverService: ClrPopoverService);
    onMouseEnterTrigger(): void;
    onMouseLeaveTrigger(): void;
    onMouseEnterContent(): void;
    onMouseLeaveContent(): void;
    private hideIfMouseOut;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipMouseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TooltipMouseService>;
}

declare class ClrTooltipTrigger {
    private popoverService;
    private tooltipMouseService;
    ariaDescribedBy: string;
    private subs;
    constructor(popoverService: ClrPopoverService, tooltipIdService: TooltipIdService, tooltipMouseService: TooltipMouseService, element: ElementRef);
    ngOnDestroy(): void;
    showTooltip(): void;
    hideTooltip(): void;
    private onMouseEnter;
    private onMouseLeave;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTooltipTrigger, "[clrTooltipTrigger]", never, {}, {}, never, never, false, never>;
}

declare class ClrTooltipContent implements OnInit {
    private tooltipIdService;
    el: ElementRef;
    private renderer;
    private tooltipMouseService;
    private popoverContent;
    private _id;
    private _position;
    private _size;
    constructor(parentHost: ElementRef<HTMLElement>, tooltipIdService: TooltipIdService, el: ElementRef, renderer: Renderer2, popoverService: ClrPopoverService, tooltipMouseService: TooltipMouseService, popoverContent: ClrPopoverContent);
    get id(): string;
    set id(value: string);
    get position(): string | ClrPopoverPosition;
    set position(value: string | ClrPopoverPosition);
    get size(): string;
    set size(value: string);
    ngOnInit(): void;
    private onMouseEnter;
    private onMouseLeave;
    private updateCssClass;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipContent, [{ optional: true; }, null, null, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrTooltipContent, "clr-tooltip-content", never, { "id": { "alias": "id"; "required": false; }; "position": { "alias": "clrPosition"; "required": false; }; "size": { "alias": "clrSize"; "required": false; }; }, {}, never, ["*"], false, [{ directive: typeof i1.ClrPopoverContent; inputs: {}; outputs: {}; }]>;
}

declare const CLR_TOOLTIP_DIRECTIVES: Type<any>[];
declare class ClrTooltipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrTooltipModule, [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent], [typeof i4.CommonModule, typeof i5.ClrIcon, typeof i1.ClrPopoverModuleNext], [typeof ClrTooltip, typeof ClrTooltipTrigger, typeof ClrTooltipContent, typeof i1.ClrIfOpen, typeof i5.ClrIcon]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrTooltipModule>;
}

export { CLR_TOOLTIP_DIRECTIVES, ClrTooltip, ClrTooltipContent, ClrTooltipModule, ClrTooltipTrigger };
