import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
import { DateIOService } from './providers/date-io.service';
import { DateNavigationService } from './providers/date-navigation.service';
export declare class ClrDateInputValidator implements Validator {
    private dateIOService;
    constructor(dateIOService: DateIOService);
    validate(control: AbstractControl): ValidationErrors;
}
export declare class ClrStartDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
}
export declare class ClrEndDateInputValidator implements Validator {
    private dateIOService;
    private dateNavigationService;
    constructor(dateIOService: DateIOService, dateNavigationService: DateNavigationService);
    validate(control: AbstractControl): ValidationErrors;
}
