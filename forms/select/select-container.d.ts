import { SelectMultipleControlValueAccessor } from '@angular/forms';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrSelectContainer, [{ optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrSelectContainer, "clr-select-container", never, {}, {}, ["multiple"], ["label", "[clrSelect]", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
