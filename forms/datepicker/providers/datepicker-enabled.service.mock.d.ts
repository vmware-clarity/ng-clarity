import { DatepickerEnabledService } from './datepicker-enabled.service';
export declare class MockDatepickerEnabledService extends DatepickerEnabledService {
    fakeIsEnabled: boolean;
    get isEnabled(): boolean;
}
