import { ClrCommonStringsService } from '../../../utils/i18n/common-strings.service';
import { AlertInfoObject } from '../utils/alert-info-object';
export declare class AlertIconAndTypesService {
    private commonStrings;
    private defaultIconShape;
    private _alertIconShape;
    private _alertType;
    constructor(commonStrings: ClrCommonStringsService);
    get alertType(): string;
    set alertType(val: string);
    get alertIconShape(): string;
    set alertIconShape(val: string);
    get alertIconTitle(): string;
    iconInfoFromType(type: string): AlertInfoObject;
}
