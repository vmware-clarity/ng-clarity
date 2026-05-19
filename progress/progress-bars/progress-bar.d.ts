import * as i0 from "@angular/core";
export declare class ClrProgressBar {
    max: number | string;
    displayval: string;
    color: string;
    value: number | string;
    externalId: string;
    private _ID;
    private _labeled;
    private _fade;
    private _loop;
    private _flash;
    private _flashDanger;
    private _compact;
    get id(): string;
    set id(value: string);
    get progressClass(): boolean;
    set clrCompact(value: boolean | string);
    get compactClass(): boolean;
    set clrLabeled(value: boolean | string);
    get labeledClass(): boolean;
    set clrFade(value: boolean | string);
    get fadeClass(): boolean;
    set clrLoop(value: boolean | string);
    get loopClass(): boolean;
    get warningClass(): boolean;
    get successClass(): boolean;
    get dangerClass(): boolean;
    set clrFlash(value: boolean | string);
    get flashClass(): boolean;
    /** @deprecated since 2.0, remove in 4.0 */
    set clrFlashDanger(value: boolean | string);
    get flashDangerClass(): boolean;
    /**
     * Make sure that we always will have something that is readable
     * for the screen reader
     */
    get displayValue(): string;
    /**
     * Display optional text only when labeled is eneabled
     */
    displayStringValue(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrProgressBar, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrProgressBar, "clr-progress-bar", never, { "max": "clrMax"; "displayval": "clrDisplayval"; "color": "clrColor"; "value": "clrValue"; "id": "id"; "clrCompact": "clrCompact"; "clrLabeled": "clrLabeled"; "clrFade": "clrFade"; "clrLoop": "clrLoop"; "clrFlash": "clrFlash"; "clrFlashDanger": "clrFlashDanger"; }, {}, never, never, false, never>;
}
