import * as i0 from '@angular/core';
import { Type } from '@angular/core';
import * as i2 from '@angular/common';

declare class ClrProgressBar {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrProgressBar, "clr-progress-bar", never, { "max": { "alias": "clrMax"; "required": false; }; "displayval": { "alias": "clrDisplayval"; "required": false; }; "color": { "alias": "clrColor"; "required": false; }; "value": { "alias": "clrValue"; "required": false; }; "id": { "alias": "id"; "required": false; }; "clrCompact": { "alias": "clrCompact"; "required": false; }; "clrLabeled": { "alias": "clrLabeled"; "required": false; }; "clrFade": { "alias": "clrFade"; "required": false; }; "clrLoop": { "alias": "clrLoop"; "required": false; }; "clrFlash": { "alias": "clrFlash"; "required": false; }; "clrFlashDanger": { "alias": "clrFlashDanger"; "required": false; }; }, {}, never, never, false, never>;
}

declare const CLR_PROGRESS_BAR_DIRECTIVES: Type<any>[];
declare class ClrProgressBarModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrProgressBarModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrProgressBarModule, [typeof ClrProgressBar], [typeof i2.CommonModule], [typeof ClrProgressBar]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrProgressBarModule>;
}

export { CLR_PROGRESS_BAR_DIRECTIVES, ClrProgressBar, ClrProgressBarModule };
