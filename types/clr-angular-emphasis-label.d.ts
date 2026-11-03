import * as i0 from '@angular/core';
import { ElementRef } from '@angular/core';
import { Type } from '@clr/angular/emphasis/common';

declare enum ClrLabelColors {
    None = "",
    Info = "info",
    Warning = "warning",
    Danger = "danger",
    Success = "success",
    Gray = "gray",
    Blue = "blue",
    LightBlue = "light-blue",
    Orange = "orange",
    Purple = "purple"
}
declare class ClrLabel {
    private el;
    color: ClrLabelColors | string;
    badgeText: string;
    textContent: string;
    clickable: boolean;
    disabled: boolean;
    type: Type | string;
    constructor(el: ElementRef<HTMLElement>);
    get isSolid(): boolean;
    get colorClass(): string;
    private stopClickIfDisabled;
    private onActivationKeydown;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrLabel, "clr-label", never, { "color": { "alias": "clrColor"; "required": false; }; "badgeText": { "alias": "clrBadgeText"; "required": false; }; "textContent": { "alias": "clrText"; "required": false; }; "clickable": { "alias": "clrClickable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; "type": { "alias": "clrType"; "required": false; }; }, {}, never, ["*"], true, never>;
}

export { ClrLabel, ClrLabelColors };
