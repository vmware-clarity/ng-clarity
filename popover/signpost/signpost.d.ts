import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrSignpostTrigger } from './signpost-trigger';
import * as i0 from "@angular/core";
import * as i1 from "../../utils/popover/popover-host.directive";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSignpost, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSignpost, "clr-signpost", never, { "signpostTriggerAriaLabel": "clrSignpostTriggerAriaLabel"; }, {}, ["customTrigger"], ["*"], false, [{ directive: typeof i1.ClrPopoverHostDirective; inputs: {}; outputs: {}; }]>;
}
