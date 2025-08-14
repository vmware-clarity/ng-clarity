import { DateRange, DateRangeOption } from '../interfaces/date-range.interface';
import { LocaleHelperService } from './locale-helper.service';
import * as i0 from "@angular/core";
export declare class DateIOService {
    disabledDates: DateRange;
    cldrLocaleDateFormat: string;
    private dateRangeOptions;
    private localeDisplayFormat;
    private delimiters;
    constructor(localeHelperService: LocaleHelperService);
    get placeholderText(): string;
    setMinDate(date: string): void;
    setMaxDate(date: string): void;
    setRangeOptions(rangeOptions: DateRangeOption[]): void;
    getRangeOptions(): any;
    toLocaleDisplayFormatString(date: Date): string;
    getDateValueFromDateString(date: string): Date;
    private validateDateRangeOptions;
    private initializeLocaleDisplayFormat;
    private extractDelimiters;
    /**
     * Checks if the month entered by the user is valid or not.
     * Note: Month is 0 based.
     */
    private isValidMonth;
    /**
     * Checks if the date is valid depending on the year and month provided.
     */
    private isValidDate;
    /**
     * Validates the parameters provided and returns the date.
     * If the parameters are not
     * valid then return null.
     * NOTE: (Month here is 1 based since the user has provided that as an input)
     */
    private validateAndGetDate;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateIOService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DateIOService>;
}
