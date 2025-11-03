import { ClrNumberInput } from './number-input';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
export declare class ClrNumberInputContainer extends ClrAbstractContainer {
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    protected readonly input: ClrNumberInput;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FocusService, ifControlStateService: IfControlStateService);
    focusOut(): void;
}
