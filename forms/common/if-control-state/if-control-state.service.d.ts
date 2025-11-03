import { Observable } from 'rxjs';
import { NgControlService } from '../providers/ng-control.service';
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
}
