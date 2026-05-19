import { EventEmitter } from '@angular/core';
import { ClrDateInputBase } from './date-input';
import { DayModel } from './model/day.model';
import * as i0 from "@angular/core";
export declare class ClrEndDateInput extends ClrDateInputBase {
    dateChange: EventEmitter<Date>;
    inputWidth: number;
    set date(date: Date | string);
    get inputSize(): number;
    protected get userSelectedDayChange(): import("rxjs").Observable<DayModel>;
    triggerControlInputValidation(): void;
    protected updateDayModel(dayModel: DayModel): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEndDateInput, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrEndDateInput, "[clrEndDate]", never, { "inputWidth": "inputWidth"; "date": "clrEndDate"; }, { "dateChange": "clrEndDateChange"; }, never, never, false, never>;
}
