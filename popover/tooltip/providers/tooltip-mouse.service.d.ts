import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
import * as i0 from "@angular/core";
export declare class TooltipMouseService {
    private readonly toggleService;
    private mouseOverTrigger;
    private mouseOverContent;
    constructor(toggleService: ClrPopoverToggleService);
    onMouseEnterTrigger(): void;
    onMouseLeaveTrigger(): void;
    onMouseEnterContent(): void;
    onMouseLeaveContent(): void;
    private hideIfMouseOut;
    static ɵfac: i0.ɵɵFactoryDeclaration<TooltipMouseService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TooltipMouseService>;
}
