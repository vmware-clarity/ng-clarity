import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrTimelineStepState } from '../enums/timeline-step-state.enum';
import * as i0 from "@angular/core";
export declare class TimelineIconAttributeService {
    private attributeMap;
    constructor(commonStrings: ClrCommonStringsService);
    getAriaLabel(step: ClrTimelineStepState): string;
    getIconShape(step: ClrTimelineStepState): string;
    getIconStatus(step: ClrTimelineStepState): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimelineIconAttributeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimelineIconAttributeService>;
}
