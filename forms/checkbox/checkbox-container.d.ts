import { AfterContentInit, QueryList } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ClrCheckbox } from './checkbox';
import * as i0 from "@angular/core";
export declare class ClrCheckboxContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    role: string;
    checkboxes: QueryList<ClrCheckbox>;
    private inline;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    protected get allCheckboxesDisabled(): boolean;
    ngAfterContentInit(): void;
    private setAriaRoles;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrCheckboxContainer, [{ optional: true; }, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrCheckboxContainer, "clr-checkbox-container,clr-toggle-container", never, { "clrInline": "clrInline"; }, {}, ["checkboxes"], ["label", "clr-checkbox-wrapper,clr-toggle-wrapper", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
