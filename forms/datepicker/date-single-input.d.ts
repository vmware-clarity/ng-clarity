import { EventEmitter } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
export declare class ClrDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    set date(date: Date | string);
    set min(dateString: string);
    set max(dateString: string);
    protected get userSelectedDayChange(): import("rxjs").Observable<DayModel>;
    protected updateDayModel(dayModel: DayModel): void;
}
