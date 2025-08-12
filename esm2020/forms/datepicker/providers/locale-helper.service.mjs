/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */
import { FormatWidth, FormStyle, getLocaleDateFormat, getLocaleDayNames, getLocaleFirstDayOfWeek, getLocaleMonthNames, TranslationWidth, } from '@angular/common';
import { Inject, Injectable, LOCALE_ID } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * This service extracts the Angular CLDR data needed by the datepicker.
 */
export class LocaleHelperService {
    constructor(locale) {
        this.locale = locale;
        this._firstDayOfWeek = 0;
        this.initializeLocaleData();
    }
    get firstDayOfWeek() {
        return this._firstDayOfWeek;
    }
    get localeDays() {
        return this._localeDays;
    }
    // leave for backward compatibility
    get localeDaysNarrow() {
        return this._localeDays.map(day => day.narrow);
    }
    get localeMonthsAbbreviated() {
        return this._localeMonthsAbbreviated;
    }
    get localeMonthsWide() {
        return this._localeMonthsWide;
    }
    get localeDateFormat() {
        return this._localeDateFormat;
    }
    /**
     * Initializes the locale data.
     */
    initializeLocaleData() {
        // Order in which these functions is called is very important.
        this.initializeFirstDayOfWeek();
        this.initializeLocaleDateFormat();
        this.initializeLocaleMonthsAbbreviated();
        this.initializeLocaleMonthsWide();
        this.initializeLocaleDays();
    }
    /**
     * Initialize day names based on the locale.
     * eg: [{day: Sunday, narrow: S}, {day: Monday, narrow: M}...] for en-US.
     */
    initializeLocaleDays() {
        // Get locale day names starting with Sunday
        const tempArr = [];
        const tempWideArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
        const tempNarrowArr = getLocaleDayNames(this.locale, FormStyle.Standalone, TranslationWidth.Narrow).slice();
        // Get first day of the week based on the locale
        const firstDayOfWeek = this.firstDayOfWeek;
        for (let i = 0; i < 7; i++) {
            tempArr.push({ day: tempWideArr[i], narrow: tempNarrowArr[i] });
        }
        // Rearrange the tempArr to start with the first day of the week based on the locale.
        if (firstDayOfWeek > 0) {
            const prevDays = tempArr.splice(0, firstDayOfWeek);
            tempArr.push(...prevDays);
        }
        this._localeDays = tempArr;
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Abbreviated format.
     * e.g. `[Jan, Feb, ...]` for en-US
     */
    initializeLocaleMonthsAbbreviated() {
        this._localeMonthsAbbreviated = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Abbreviated).slice();
    }
    /**
     * Initializes the array of month names in the TranslationWidth.Wide format.
     * e.g. `[January, February, ...]` for en-US
     */
    initializeLocaleMonthsWide() {
        this._localeMonthsWide = getLocaleMonthNames(this.locale, FormStyle.Standalone, TranslationWidth.Wide).slice();
    }
    /**
     * Initializes the first day of the week based on the locale.
     */
    initializeFirstDayOfWeek() {
        this._firstDayOfWeek = getLocaleFirstDayOfWeek(this.locale);
    }
    initializeLocaleDateFormat() {
        this._localeDateFormat = getLocaleDateFormat(this.locale, FormatWidth.Short);
    }
}
LocaleHelperService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LocaleHelperService, deps: [{ token: LOCALE_ID }], target: i0.ɵɵFactoryTarget.Injectable });
LocaleHelperService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LocaleHelperService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.2", ngImport: i0, type: LocaleHelperService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [LOCALE_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jYWxlLWhlbHBlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvYW5ndWxhci9zcmMvZm9ybXMvZGF0ZXBpY2tlci9wcm92aWRlcnMvbG9jYWxlLWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztHQUtHO0FBRUgsT0FBTyxFQUNMLFdBQVcsRUFDWCxTQUFTLEVBQ1QsbUJBQW1CLEVBQ25CLGlCQUFpQixFQUNqQix1QkFBdUIsRUFDdkIsbUJBQW1CLEVBQ25CLGdCQUFnQixHQUNqQixNQUFNLGlCQUFpQixDQUFDO0FBQ3pCLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJOUQ7O0dBRUc7QUFFSCxNQUFNLE9BQU8sbUJBQW1CO0lBTzlCLFlBQXNDLE1BQWM7UUFBZCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBTjVDLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBTzFCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzlCLENBQUM7SUFFRCxJQUFJLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDMUIsQ0FBQztJQUVELG1DQUFtQztJQUNuQyxJQUFJLGdCQUFnQjtRQUNsQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxJQUFJLHVCQUF1QjtRQUN6QixPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxnQkFBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUM7SUFDaEMsQ0FBQztJQUVELElBQUksZ0JBQWdCO1FBQ2xCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDO0lBQ2hDLENBQUM7SUFFRDs7T0FFRztJQUNLLG9CQUFvQjtRQUMxQiw4REFBOEQ7UUFDOUQsSUFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7UUFDaEMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLENBQUM7UUFDekMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVEOzs7T0FHRztJQUNLLG9CQUFvQjtRQUMxQiw0Q0FBNEM7UUFDNUMsTUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ25CLE1BQU0sV0FBVyxHQUFhLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsSCxNQUFNLGFBQWEsR0FBYSxpQkFBaUIsQ0FDL0MsSUFBSSxDQUFDLE1BQU0sRUFDWCxTQUFTLENBQUMsVUFBVSxFQUNwQixnQkFBZ0IsQ0FBQyxNQUFNLENBQ3hCLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDVixnREFBZ0Q7UUFDaEQsTUFBTSxjQUFjLEdBQVcsSUFBSSxDQUFDLGNBQWMsQ0FBQztRQUNuRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QscUZBQXFGO1FBQ3JGLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRTtZQUN0QixNQUFNLFFBQVEsR0FBc0MsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDdEYsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUM7SUFDN0IsQ0FBQztJQUVEOzs7T0FHRztJQUNLLGlDQUFpQztRQUN2QyxJQUFJLENBQUMsd0JBQXdCLEdBQUcsbUJBQW1CLENBQ2pELElBQUksQ0FBQyxNQUFNLEVBQ1gsU0FBUyxDQUFDLFVBQVUsRUFDcEIsZ0JBQWdCLENBQUMsV0FBVyxDQUM3QixDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVEOzs7T0FHRztJQUNLLDBCQUEwQjtRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsVUFBVSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ2pILENBQUM7SUFFRDs7T0FFRztJQUNLLHdCQUF3QjtRQUM5QixJQUFJLENBQUMsZUFBZSxHQUFHLHVCQUF1QixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRU8sMEJBQTBCO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvRSxDQUFDOztnSEF2R1UsbUJBQW1CLGtCQU9WLFNBQVM7b0hBUGxCLG1CQUFtQjsyRkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVOzswQkFRSSxNQUFNOzJCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IChjKSAyMDE2LTIwMjUgQnJvYWRjb20uIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBUaGUgdGVybSBcIkJyb2FkY29tXCIgcmVmZXJzIHRvIEJyb2FkY29tIEluYy4gYW5kL29yIGl0cyBzdWJzaWRpYXJpZXMuXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlLlxuICogVGhlIGZ1bGwgbGljZW5zZSBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gTElDRU5TRSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBwcm9qZWN0LlxuICovXG5cbmltcG9ydCB7XG4gIEZvcm1hdFdpZHRoLFxuICBGb3JtU3R5bGUsXG4gIGdldExvY2FsZURhdGVGb3JtYXQsXG4gIGdldExvY2FsZURheU5hbWVzLFxuICBnZXRMb2NhbGVGaXJzdERheU9mV2VlayxcbiAgZ2V0TG9jYWxlTW9udGhOYW1lcyxcbiAgVHJhbnNsYXRpb25XaWR0aCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgTE9DQUxFX0lEIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENsckRheU9mV2VlayB9IGZyb20gJy4uL2ludGVyZmFjZXMvZGF5LW9mLXdlZWsuaW50ZXJmYWNlJztcblxuLyoqXG4gKiBUaGlzIHNlcnZpY2UgZXh0cmFjdHMgdGhlIEFuZ3VsYXIgQ0xEUiBkYXRhIG5lZWRlZCBieSB0aGUgZGF0ZXBpY2tlci5cbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvY2FsZUhlbHBlclNlcnZpY2Uge1xuICBwcml2YXRlIF9maXJzdERheU9mV2VlayA9IDA7XG4gIHByaXZhdGUgX2xvY2FsZURheXM6IFJlYWRvbmx5QXJyYXk8Q2xyRGF5T2ZXZWVrPjtcbiAgcHJpdmF0ZSBfbG9jYWxlTW9udGhzQWJicmV2aWF0ZWQ6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPjtcbiAgcHJpdmF0ZSBfbG9jYWxlTW9udGhzV2lkZTogUmVhZG9ubHlBcnJheTxzdHJpbmc+O1xuICBwcml2YXRlIF9sb2NhbGVEYXRlRm9ybWF0OiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoQEluamVjdChMT0NBTEVfSUQpIHB1YmxpYyBsb2NhbGU6IHN0cmluZykge1xuICAgIHRoaXMuaW5pdGlhbGl6ZUxvY2FsZURhdGEoKTtcbiAgfVxuXG4gIGdldCBmaXJzdERheU9mV2VlaygpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9maXJzdERheU9mV2VlaztcbiAgfVxuXG4gIGdldCBsb2NhbGVEYXlzKCk6IFJlYWRvbmx5QXJyYXk8Q2xyRGF5T2ZXZWVrPiB7XG4gICAgcmV0dXJuIHRoaXMuX2xvY2FsZURheXM7XG4gIH1cblxuICAvLyBsZWF2ZSBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuICBnZXQgbG9jYWxlRGF5c05hcnJvdygpOiBSZWFkb25seUFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGVEYXlzLm1hcChkYXkgPT4gZGF5Lm5hcnJvdyk7XG4gIH1cblxuICBnZXQgbG9jYWxlTW9udGhzQWJicmV2aWF0ZWQoKTogUmVhZG9ubHlBcnJheTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlTW9udGhzQWJicmV2aWF0ZWQ7XG4gIH1cblxuICBnZXQgbG9jYWxlTW9udGhzV2lkZSgpOiBSZWFkb25seUFycmF5PHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLl9sb2NhbGVNb250aHNXaWRlO1xuICB9XG5cbiAgZ2V0IGxvY2FsZURhdGVGb3JtYXQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fbG9jYWxlRGF0ZUZvcm1hdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgbG9jYWxlIGRhdGEuXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVMb2NhbGVEYXRhKCk6IHZvaWQge1xuICAgIC8vIE9yZGVyIGluIHdoaWNoIHRoZXNlIGZ1bmN0aW9ucyBpcyBjYWxsZWQgaXMgdmVyeSBpbXBvcnRhbnQuXG4gICAgdGhpcy5pbml0aWFsaXplRmlyc3REYXlPZldlZWsoKTtcbiAgICB0aGlzLmluaXRpYWxpemVMb2NhbGVEYXRlRm9ybWF0KCk7XG4gICAgdGhpcy5pbml0aWFsaXplTG9jYWxlTW9udGhzQWJicmV2aWF0ZWQoKTtcbiAgICB0aGlzLmluaXRpYWxpemVMb2NhbGVNb250aHNXaWRlKCk7XG4gICAgdGhpcy5pbml0aWFsaXplTG9jYWxlRGF5cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZGF5IG5hbWVzIGJhc2VkIG9uIHRoZSBsb2NhbGUuXG4gICAqIGVnOiBbe2RheTogU3VuZGF5LCBuYXJyb3c6IFN9LCB7ZGF5OiBNb25kYXksIG5hcnJvdzogTX0uLi5dIGZvciBlbi1VUy5cbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUxvY2FsZURheXMoKTogdm9pZCB7XG4gICAgLy8gR2V0IGxvY2FsZSBkYXkgbmFtZXMgc3RhcnRpbmcgd2l0aCBTdW5kYXlcbiAgICBjb25zdCB0ZW1wQXJyID0gW107XG4gICAgY29uc3QgdGVtcFdpZGVBcnI6IHN0cmluZ1tdID0gZ2V0TG9jYWxlRGF5TmFtZXModGhpcy5sb2NhbGUsIEZvcm1TdHlsZS5TdGFuZGFsb25lLCBUcmFuc2xhdGlvbldpZHRoLldpZGUpLnNsaWNlKCk7XG4gICAgY29uc3QgdGVtcE5hcnJvd0Fycjogc3RyaW5nW10gPSBnZXRMb2NhbGVEYXlOYW1lcyhcbiAgICAgIHRoaXMubG9jYWxlLFxuICAgICAgRm9ybVN0eWxlLlN0YW5kYWxvbmUsXG4gICAgICBUcmFuc2xhdGlvbldpZHRoLk5hcnJvd1xuICAgICkuc2xpY2UoKTtcbiAgICAvLyBHZXQgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIGJhc2VkIG9uIHRoZSBsb2NhbGVcbiAgICBjb25zdCBmaXJzdERheU9mV2VlazogbnVtYmVyID0gdGhpcy5maXJzdERheU9mV2VlaztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDc7IGkrKykge1xuICAgICAgdGVtcEFyci5wdXNoKHsgZGF5OiB0ZW1wV2lkZUFycltpXSwgbmFycm93OiB0ZW1wTmFycm93QXJyW2ldIH0pO1xuICAgIH1cbiAgICAvLyBSZWFycmFuZ2UgdGhlIHRlbXBBcnIgdG8gc3RhcnQgd2l0aCB0aGUgZmlyc3QgZGF5IG9mIHRoZSB3ZWVrIGJhc2VkIG9uIHRoZSBsb2NhbGUuXG4gICAgaWYgKGZpcnN0RGF5T2ZXZWVrID4gMCkge1xuICAgICAgY29uc3QgcHJldkRheXM6IHsgZGF5OiBzdHJpbmc7IG5hcnJvdzogc3RyaW5nIH1bXSA9IHRlbXBBcnIuc3BsaWNlKDAsIGZpcnN0RGF5T2ZXZWVrKTtcbiAgICAgIHRlbXBBcnIucHVzaCguLi5wcmV2RGF5cyk7XG4gICAgfVxuICAgIHRoaXMuX2xvY2FsZURheXMgPSB0ZW1wQXJyO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBhcnJheSBvZiBtb250aCBuYW1lcyBpbiB0aGUgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZCBmb3JtYXQuXG4gICAqIGUuZy4gYFtKYW4sIEZlYiwgLi4uXWAgZm9yIGVuLVVTXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVMb2NhbGVNb250aHNBYmJyZXZpYXRlZCgpOiB2b2lkIHtcbiAgICB0aGlzLl9sb2NhbGVNb250aHNBYmJyZXZpYXRlZCA9IGdldExvY2FsZU1vbnRoTmFtZXMoXG4gICAgICB0aGlzLmxvY2FsZSxcbiAgICAgIEZvcm1TdHlsZS5TdGFuZGFsb25lLFxuICAgICAgVHJhbnNsYXRpb25XaWR0aC5BYmJyZXZpYXRlZFxuICAgICkuc2xpY2UoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplcyB0aGUgYXJyYXkgb2YgbW9udGggbmFtZXMgaW4gdGhlIFRyYW5zbGF0aW9uV2lkdGguV2lkZSBmb3JtYXQuXG4gICAqIGUuZy4gYFtKYW51YXJ5LCBGZWJydWFyeSwgLi4uXWAgZm9yIGVuLVVTXG4gICAqL1xuICBwcml2YXRlIGluaXRpYWxpemVMb2NhbGVNb250aHNXaWRlKCk6IHZvaWQge1xuICAgIHRoaXMuX2xvY2FsZU1vbnRoc1dpZGUgPSBnZXRMb2NhbGVNb250aE5hbWVzKHRoaXMubG9jYWxlLCBGb3JtU3R5bGUuU3RhbmRhbG9uZSwgVHJhbnNsYXRpb25XaWR0aC5XaWRlKS5zbGljZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemVzIHRoZSBmaXJzdCBkYXkgb2YgdGhlIHdlZWsgYmFzZWQgb24gdGhlIGxvY2FsZS5cbiAgICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZUZpcnN0RGF5T2ZXZWVrKCk6IHZvaWQge1xuICAgIHRoaXMuX2ZpcnN0RGF5T2ZXZWVrID0gZ2V0TG9jYWxlRmlyc3REYXlPZldlZWsodGhpcy5sb2NhbGUpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplTG9jYWxlRGF0ZUZvcm1hdCgpOiB2b2lkIHtcbiAgICB0aGlzLl9sb2NhbGVEYXRlRm9ybWF0ID0gZ2V0TG9jYWxlRGF0ZUZvcm1hdCh0aGlzLmxvY2FsZSwgRm9ybWF0V2lkdGguU2hvcnQpO1xuICB9XG59XG4iXX0=