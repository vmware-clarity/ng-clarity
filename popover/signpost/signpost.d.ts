import { ClrSignpostTrigger } from './signpost-trigger';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
export declare class ClrSignpost {
    commonStrings: ClrCommonStringsService;
    /**********
     * @property useCustomTrigger
     *
     * @description
     * Flag used to determine if we need to use the default trigger or a user supplied trigger element.
     *
     */
    useCustomTrigger: boolean;
    signpostTriggerAriaLabel: string;
    constructor(commonStrings: ClrCommonStringsService);
    /**********
     * @property signPostTrigger
     *
     * @description
     * Uses ContentChild to check for a user supplied element with the ClrSignpostTrigger on it.
     *
     */
    set customTrigger(trigger: ClrSignpostTrigger);
}
