import { AfterContentInit, AfterViewInit, ElementRef } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { ComboboxContainerService } from './providers/combobox-container.service';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
export declare class ClrComboboxContainer extends ClrAbstractContainer implements AfterContentInit, AfterViewInit {
    private containerService;
    private el;
    controlContainer: ElementRef<HTMLElement>;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, containerService: ComboboxContainerService, el: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
}
