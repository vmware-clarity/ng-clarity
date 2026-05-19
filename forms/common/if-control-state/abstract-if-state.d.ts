import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgControlService } from '../providers/ng-control.service';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<AbstractIfState, [{ optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<AbstractIfState, never, never, {}, {}, never, never, false, never>;
}
