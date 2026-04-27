import * as i0 from '@angular/core';
import { Type } from '@angular/core';
import * as i2 from '@angular/common';

declare class ClrSpinner {
    private _inline;
    private _inverse;
    private _small;
    private _medium;
    /**
     * Default class for all spinners. This class is always true
     */
    get spinnerClass(): boolean;
    get inlineClass(): boolean;
    set clrInline(value: boolean | string);
    get inverseClass(): boolean;
    set clrInverse(value: boolean | string);
    get smallClass(): boolean;
    set clrSmall(value: boolean | string);
    /**
     * When clrSmall & clrMedium are set both to true.
     * The CSS with high priority will be small - so medium size will be ignored.
     *
     * For this reason if clrSmall is set we won't add clrMedium class.
     *
     * NOTE: This is dictated by the CSS rules.
     * DON'T USE clrSmall & clrMedium to toggle classes. This could change without notice.
     *
     * Also there is no logical need to have both of them set to TRUE or FALSE.
     */
    get mediumClass(): boolean;
    set clrMedium(value: boolean | string);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSpinner, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSpinner, "clr-spinner", never, { "clrInline": { "alias": "clrInline"; "required": false; }; "clrInverse": { "alias": "clrInverse"; "required": false; }; "clrSmall": { "alias": "clrSmall"; "required": false; }; "clrMedium": { "alias": "clrMedium"; "required": false; }; }, {}, never, ["*"], false, never>;
}

declare const CLR_SPINNER_DIRECTIVES: Type<any>[];
declare class ClrSpinnerModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSpinnerModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrSpinnerModule, [typeof ClrSpinner], [typeof i2.CommonModule], [typeof ClrSpinner]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrSpinnerModule>;
}

export { CLR_SPINNER_DIRECTIVES, ClrSpinner, ClrSpinnerModule };
