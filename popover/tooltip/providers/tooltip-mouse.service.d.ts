import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
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
}
