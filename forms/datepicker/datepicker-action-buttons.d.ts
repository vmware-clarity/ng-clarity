import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrPopoverToggleService } from '../../utils/popover/providers/popover-toggle.service';
import { DateFormControlService } from './providers/date-form-control.service';
import { DateNavigationService } from './providers/date-navigation.service';
import * as i0 from "@angular/core";
export declare class ClrDatepickerActions {
    protected commonStrings: ClrCommonStringsService;
    private toggleService;
    private dateNavigationService;
    private dateFormControlService;
    constructor(commonStrings: ClrCommonStringsService, toggleService: ClrPopoverToggleService, dateNavigationService: DateNavigationService, dateFormControlService: DateFormControlService);
    protected apply(): void;
    protected cancel(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatepickerActions, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatepickerActions, "clr-datepicker-actions", never, {}, {}, never, never, false, never>;
}
