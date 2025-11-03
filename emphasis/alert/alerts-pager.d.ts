import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ClrAlert } from './alert';
import { MultiAlertService } from './providers/multi-alert.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
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
}
