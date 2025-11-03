import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrTimelineStepState } from '../enums/timeline-step-state.enum';
export declare class TimelineIconAttributeService {
    private attributeMap;
    constructor(commonStrings: ClrCommonStringsService);
    getAriaLabel(step: ClrTimelineStepState): string;
    getIconShape(step: ClrTimelineStepState): string;
    getIconStatus(step: ClrTimelineStepState): string;
}
