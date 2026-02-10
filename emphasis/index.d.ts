import * as i0 from '@angular/core';
import { QueryList, OnInit, OnDestroy, EventEmitter, ChangeDetectorRef, Renderer2, ElementRef, AfterContentInit, Type } from '@angular/core';
import * as i1 from '@clr/angular/emphasis/badge';
import * as i2 from '@clr/angular/emphasis/label';
import * as i3 from '@clr/angular/emphasis/alert';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Observable } from 'rxjs';
import * as i6 from '@angular/common';
import * as i7 from '@clr/angular/icon';
import * as i8 from '@clr/angular/popover/dropdown';
import * as i9 from '@clr/angular/progress/spinner';
import { Type as Type$1 } from '@clr/angular/emphasis/common';

declare class ClrEmphasisModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrEmphasisModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrEmphasisModule, never, [typeof i1.ClrBadge, typeof i2.ClrLabel], [typeof i3.ClrAlertModule, typeof i1.ClrBadge, typeof i2.ClrLabel]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrEmphasisModule>;
}

interface AlertInfoObject {
    shape: string;
    cssClass: string;
    title: string;
}

declare class AlertIconAndTypesService {
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
    static ɵfac: i0.ɵɵFactoryDeclaration<AlertIconAndTypesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AlertIconAndTypesService>;
}

declare class MultiAlertService {
    private subscription;
    private allAlerts;
    private _change;
    private _current;
    /**
     * The Observable that lets other classes subscribe to changes
     */
    get changes(): Observable<number>;
    get current(): number;
    set current(index: number);
    get activeAlerts(): ClrAlert[];
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    get count(): number;
    manage(alerts: QueryList<ClrAlert>): void;
    next(): void;
    previous(): void;
    open(): void;
    close(isCurrentAlert: boolean): void;
    destroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MultiAlertService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MultiAlertService>;
}

declare class ClrAlert implements OnInit, OnDestroy {
    private iconService;
    private cdr;
    private multiAlertService;
    private commonStrings;
    private renderer;
    private hostElement;
    isSmall: boolean;
    closable: boolean;
    isAppLevel: boolean;
    clrCloseButtonAriaLabel: string;
    _closedChanged: EventEmitter<boolean>;
    _closed: boolean;
    private _hidden;
    private subscriptions;
    private _isLightweight;
    private _origAlertType;
    constructor(iconService: AlertIconAndTypesService, cdr: ChangeDetectorRef, multiAlertService: MultiAlertService, commonStrings: ClrCommonStringsService, renderer: Renderer2, hostElement: ElementRef<HTMLElement>);
    get isLightweight(): boolean;
    set isLightweight(val: boolean);
    get alertType(): string;
    set alertType(val: string);
    set alertIconShape(value: string);
    set closed(value: boolean);
    get alertClass(): string;
    get hidden(): boolean;
    set hidden(value: boolean);
    ngOnInit(): void;
    ngOnDestroy(): void;
    configAlertType(val: string): void;
    open(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlert, [null, null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlert, "clr-alert", never, { "isSmall": { "alias": "clrAlertSizeSmall"; "required": false; }; "closable": { "alias": "clrAlertClosable"; "required": false; }; "isAppLevel": { "alias": "clrAlertAppLevel"; "required": false; }; "clrCloseButtonAriaLabel": { "alias": "clrCloseButtonAriaLabel"; "required": false; }; "isLightweight": { "alias": "clrAlertLightweight"; "required": false; }; "alertType": { "alias": "clrAlertType"; "required": false; }; "alertIconShape": { "alias": "clrAlertIcon"; "required": false; }; "closed": { "alias": "clrAlertClosed"; "required": false; }; }, { "_closedChanged": "clrAlertClosedChange"; }, never, ["*"], false, never>;
}

declare class ClrAlertItem {
    iconService: AlertIconAndTypesService;
    constructor(iconService: AlertIconAndTypesService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertItem, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlertItem, "clr-alert-item", never, {}, {}, never, ["*"], false, never>;
}

/**
 * @remark
 * This directive is used only of selectin alert text.
 */
declare class ClrAlertText {
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertText, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAlertText, ".alert-text", never, {}, {}, never, never, false, never>;
}

declare class ClrAlerts implements AfterContentInit, OnDestroy {
    multiAlertService: MultiAlertService;
    currentAlertChange: EventEmitter<ClrAlert>;
    currentAlertIndexChange: EventEmitter<number>;
    private subscriptions;
    constructor(multiAlertService: MultiAlertService);
    set allAlerts(value: QueryList<ClrAlert>);
    /**
     * Input/Output to support two way binding on current alert index
     */
    set _inputCurrentIndex(index: number);
    get currentAlertIndex(): number;
    set currentAlertIndex(index: number);
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    /**
     * Ensure we are only dealing with alerts that have not been closed yet
     */
    get alerts(): ClrAlert[];
    get currentAlertType(): string;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlerts, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlerts, "clr-alerts", never, { "_inputCurrentIndex": { "alias": "clrCurrentAlertIndex"; "required": false; }; "currentAlert": { "alias": "clrCurrentAlert"; "required": false; }; }, { "currentAlertChange": "clrCurrentAlertChange"; "currentAlertIndexChange": "clrCurrentAlertIndexChange"; }, ["allAlerts"], ["clr-alert"], false, never>;
}

declare class ClrAlertsPager implements OnInit, OnDestroy {
    multiAlertService: MultiAlertService;
    commonStrings: ClrCommonStringsService;
    currentAlertChange: EventEmitter<ClrAlert>;
    currentAlertIndexChange: EventEmitter<number>;
    private multiAlertServiceChanges;
    constructor(multiAlertService: MultiAlertService, commonStrings: ClrCommonStringsService);
    /**
     * Input/Output to support two way binding on current alert instance
     */
    get currentAlert(): ClrAlert;
    set currentAlert(alert: ClrAlert);
    /**
     * Input/Output to support two way binding on current alert index
     */
    get currentAlertIndex(): number;
    set currentAlertIndex(index: number);
    protected get previousAlertAriaLabel(): string;
    protected get nextAlertAriaLabel(): string;
    ngOnInit(): void;
    ngOnDestroy(): void;
    pageUp(): void;
    pageDown(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertsPager, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlertsPager, "clr-alerts-pager", never, { "currentAlert": { "alias": "clrCurrentAlert"; "required": false; }; "currentAlertIndex": { "alias": "clrCurrentAlertIndex"; "required": false; }; }, { "currentAlertChange": "clrCurrentAlertChange"; "currentAlertIndexChange": "clrCurrentAlertIndexChange"; }, never, never, false, never>;
}

declare const CLR_ALERT_DIRECTIVES: Type<any>[];
declare class ClrAlertModule {
    constructor();
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAlertModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ClrAlertModule, [typeof ClrAlert, typeof ClrAlertItem, typeof ClrAlerts, typeof ClrAlertsPager, typeof ClrAlertText], [typeof i6.CommonModule, typeof i7.ClrIcon, typeof i8.ClrDropdownModule, typeof i9.ClrSpinnerModule], [typeof ClrAlert, typeof ClrAlertItem, typeof ClrAlerts, typeof ClrAlertsPager, typeof ClrAlertText]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ClrAlertModule>;
}

declare const ALERT_TYPES: string[];

declare enum ClrBadgeColors {
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
declare class ClrBadge {
    color: ClrBadgeColors | string;
    type: Type$1 | string;
    get isOutlined(): boolean;
    get colorClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrBadge, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrBadge, "clr-badge", never, { "color": { "alias": "clrColor"; "required": false; }; "type": { "alias": "clrType"; "required": false; }; }, {}, never, ["*"], true, never>;
}

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
    color: ClrLabelColors | string;
    badgeText: string;
    textContent: string;
    clickable: boolean;
    disabled: boolean;
    type: Type$1 | string;
    get isSolid(): boolean;
    get colorClass(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrLabel, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrLabel, "clr-label", never, { "color": { "alias": "clrColor"; "required": false; }; "badgeText": { "alias": "clrBadgeText"; "required": false; }; "textContent": { "alias": "clrText"; "required": false; }; "clickable": { "alias": "clrClickable"; "required": false; }; "disabled": { "alias": "clrDisabled"; "required": false; }; "type": { "alias": "clrType"; "required": false; }; }, {}, never, ["*"], true, never>;
}

export { ALERT_TYPES, CLR_ALERT_DIRECTIVES, ClrAlert, ClrAlertItem, ClrAlertModule, ClrAlertText, ClrAlerts, ClrAlertsPager, ClrBadge, ClrBadgeColors, ClrEmphasisModule, ClrLabel, ClrLabelColors };
