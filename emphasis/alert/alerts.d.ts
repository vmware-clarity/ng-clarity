import { AfterContentInit, EventEmitter, OnDestroy, QueryList } from '@angular/core';
import { ClrAlert } from './alert';
import { MultiAlertService } from './providers/multi-alert.service';
export declare class ClrAlerts implements AfterContentInit, OnDestroy {
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
}
