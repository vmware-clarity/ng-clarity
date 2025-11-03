import { EventEmitter } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
export declare class ClrStartDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): import("rxjs").Observable<DayModel>;
    ngOnInit(): void;
    protected updateDayModel(dayModel: DayModel): void;
}
