import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { FocusService } from '../common/providers/focus.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
export declare class ClrDatalistContainer extends ClrAbstractContainer {
    protected ifControlStateService: IfControlStateService;
    focus: boolean;
    constructor(controlClassService: ControlClassService, layoutService: LayoutService, ngControlService: NgControlService, focusService: FocusService, ifControlStateService: IfControlStateService);
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistContainer, [null, { optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrDatalistContainer, "clr-datalist-container", never, {}, {}, never, ["label", "[clrDatalistInput]", "datalist", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
