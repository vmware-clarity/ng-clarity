import { ClrCommonStrings } from '../../utils/i18n/common-strings.interface';
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
}
