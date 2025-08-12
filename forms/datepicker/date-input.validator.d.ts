import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
import * as i0 from "@angular/core";
export declare class ClrDateInputValidator implements Validator {
    private dateIOService;
    constructor(dateIOService: DateIOService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInputValidator, [{ optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInputValidator, "[clrDate], [clrStartDate], [clrEndDate]", never, {}, {}, never, never, false, never>;
}
export declare class ClrStartDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrStartDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrStartDateInputValidator, "[clrStartDate]", never, {}, {}, never, never, false, never>;
}
export declare class ClrEndDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInputValidator, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInputValidator, "[clrEndDate]", never, {}, {}, never, never, false, never>;
}
