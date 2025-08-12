import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAlert } from './alert';
import { MultiAlertService } from './providers/multi-alert.service';
import * as i0 from "@angular/core";
export declare class ClrAlertsPager implements OnInit, OnDestroy {
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
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrAlertsPager, "clr-alerts-pager", never, { "currentAlert": "clrCurrentAlert"; "currentAlertIndex": "clrCurrentAlertIndex"; }, { "currentAlertChange": "clrCurrentAlertChange"; "currentAlertIndexChange": "clrCurrentAlertIndexChange"; }, never, never, false, never>;
}
