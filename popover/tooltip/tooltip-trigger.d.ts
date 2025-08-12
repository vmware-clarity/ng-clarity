import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import * as i0 from "@angular/core";
export declare class ClrTooltipTrigger {
    private toggleService;
    private tooltipMouseService;
    ariaDescribedBy: string;
    private subs;
    constructor(toggleService: ClrPopoverToggleService, tooltipIdService: TooltipIdService, tooltipMouseService: TooltipMouseService);
    ngOnDestroy(): void;
    showTooltip(): void;
    hideTooltip(): void;
    private onMouseEnter;
    private onMouseLeave;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrTooltipTrigger, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrTooltipTrigger, "[clrTooltipTrigger]", never, {}, {}, never, never, false, never>;
}
