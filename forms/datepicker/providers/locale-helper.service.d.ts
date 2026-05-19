import { ClrDayOfWeek } from '../interfaces/day-of-week.interface';
import * as i0 from "@angular/core";
/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
export declare class LocaleHelperService {
    locale: string;
    private _firstDayOfWeek;
    private _localeDays;
    private _localeMonthsAbbreviated;
    private _localeMonthsWide;
    private _localeDateFormat;
    constructor(locale: string);
    get firstDayOfWeek(): number;
    get localeDays(): ReadonlyArray<ClrDayOfWeek>;
    get localeDaysNarrow(): ReadonlyArray<string>;
    get localeMonthsAbbreviated(): ReadonlyArray<string>;
    get localeMonthsWide(): ReadonlyArray<string>;
    get localeDateFormat(): string;
    /**
     * Initializes the locale data.
     */
    private initializeLocaleData;
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    private initializeLocaleDays;
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    private initializeLocaleMonthsAbbreviated;
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    private initializeLocaleMonthsWide;
    /**
     * Initializes the first day of the week based on the locale.
     */
    private initializeFirstDayOfWeek;
    private initializeLocaleDateFormat;
    static ɵfac: i0.ɵɵFactoryDeclaration<LocaleHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LocaleHelperService>;
}
