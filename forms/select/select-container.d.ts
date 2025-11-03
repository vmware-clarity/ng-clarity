import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
export declare class ClrSelectContainer extends ClrAbstractContainer {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    multiple: SelectMultipleControlValueAccessor;
    private multi;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    ngOnInit(): void;
    wrapperClass(): "clr-multiselect-wrapper" | "clr-select-wrapper";
}
