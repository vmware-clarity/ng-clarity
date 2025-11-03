import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import { NgControlService } from '../providers/ng-control.service';
export declare abstract class AbstractIfState {
    protected ifControlStateService: IfControlStateService;
    protected ngControlService: NgControlService;
    protected subscriptions: Subscription[];
    protected displayedContent: boolean;
    protected control: NgControl;
    protected additionalControls: NgControl[];
    protected constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService);
    ngOnDestroy(): void;
    protected handleState(_state: CONTROL_STATE): void;
}
