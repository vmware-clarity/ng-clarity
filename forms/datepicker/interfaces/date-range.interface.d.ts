import { DayModel } from '../model/day.model';
export interface DateRange {
    minDate?: DayModel;
    maxDate?: DayModel;
}
export interface DateRangeInput {
    startDate: DayModel;
    endDate?: DayModel;
}
export interface DateRangeOption {
    label: string;
    value: Date[];
}
