import { Observable } from 'rxjs';
import { NgControlService } from '../providers/ng-control.service';
import * as i0 from "@angular/core";
export declare enum CONTROL_STATE {
    NONE = "NONE",
    VALID = "VALID",
    INVALID = "INVALID"
}
export declare class IfControlStateService {
    readonly statusChanges: Observable<CONTROL_STATE>;
    private readonly triggerStatusChangeSubject;
    constructor(ngControlService: NgControlService);
    triggerStatusChange(): void;
    private getStatusChanges;
    static ɵfac: i0.ɵɵFactoryDeclaration<IfControlStateService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IfControlStateService>;
}
