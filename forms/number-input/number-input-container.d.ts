import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrNumberInput } from './number-input';
import * as i0 from "@angular/core";
export declare class ClrNumberInputContainer extends ClrAbstractContainer {
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    protected readonly input: ClrNumberInput;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FocusService, ifControlStateService: IfControlStateService);
    focusOut(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrNumberInputContainer, [null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrNumberInputContainer, "clr-number-input-container", never, {}, {}, ["input"], ["label", "[clrNumberInput]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
