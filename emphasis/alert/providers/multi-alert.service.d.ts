import { QueryList } from '@angular/core';
import { Observable } from 'rxjs';
import { ClrAlert } from '../alert';
import * as i0 from "@angular/core";
export declare class MultiAlertService {
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
