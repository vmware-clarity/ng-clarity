import { AfterContentInit, ElementRef, QueryList } from '@angular/core';
import { ClrRadio } from './radio';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
export declare class ClrRadioContainer extends ClrAbstractContainer implements AfterContentInit {
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    protected ifControlStateService: IfControlStateService;
    role: string;
    ariaLabelledBy: string;
    radios: QueryList<ClrRadio>;
    groupLabel: ElementRef<HTMLElement>;
    private inline;
    private _generatedId;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, ifControlStateService: IfControlStateService);
    get clrInline(): boolean | string;
    set clrInline(value: boolean | string);
    ngAfterContentInit(): void;
    private setAriaRoles;
    private setAriaLabelledBy;
}
