import { Renderer2 } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
export declare class ClrRangeContainer extends ClrAbstractContainer {
    private renderer;
    private idService;
    protected ifControlStateService: IfControlStateService;
    private _hasProgress;
    private lastRangeProgressFillWidth;
    constructor(layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, renderer: Renderer2, idService: ControlIdService, ifControlStateService: IfControlStateService);
    get hasProgress(): boolean;
    set hasProgress(val: boolean);
    getRangeProgressFillWidth(): string;
    private selectRangeElement;
}
