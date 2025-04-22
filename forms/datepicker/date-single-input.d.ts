import { EventEmitter } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
import * as i0 from "@angular/core";
export declare class ClrDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    set date(date: Date | string);
    set min(dateString: string);
    set max(dateString: string);
    protected get userSelectedDayChange(): import("rxjs").Observable<DayModel>;
    protected updateDayModel(dayModel: DayModel): void;
    private triggerControlValidation;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDateInput, "[clrDate]", never, { "date": "clrDate"; "min": "min"; "max": "max"; }, { "dateChange": "clrDateChange"; }, never, never, false, never>;
}
