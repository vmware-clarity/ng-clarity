import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
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
}
