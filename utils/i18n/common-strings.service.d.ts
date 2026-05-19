import { ClrCommonStrings } from '../../utils/i18n/common-strings.interface';
import * as i0 from "@angular/core";
export declare class ClrCommonStringsService {
    private _strings;
    /**
     * Access to all of the keys as strings
     */
    get keys(): Readonly<ClrCommonStrings>;
    /**
     * Allows you to pass in new overrides for localization
     */
    localize(overrides: Partial<ClrCommonStrings>): void;
    /**
     * Parse a string with a set of tokens to replace
     */
    parse(source: string, tokens?: {
        [key: string]: string;
    }): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCommonStringsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ClrCommonStringsService>;
}
