import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
export declare class ClrDatepickerActions {
    protected commonStrings: ClrCommonStringsService;
    private toggleService;
    private dateNavigationService;
    private dateFormControlService;
    constructor(commonStrings: ClrCommonStringsService, toggleService: ClrPopoverToggleService, dateNavigationService: DateNavigationService, dateFormControlService: DateFormControlService);
    protected apply(): void;
    protected cancel(): void;
}
