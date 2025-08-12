import { AfterContentInit, AfterViewInit, ElementRef } from '@angular/core';
import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ComboboxContainerService } from './providers/combobox-container.service';
import * as i0 from "@angular/core";
export declare class ClrComboboxContainer extends ClrAbstractContainer implements AfterContentInit, AfterViewInit {
    private containerService;
    private el;
    controlContainer: ElementRef<HTMLElement>;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService, containerService: ComboboxContainerService, el: ElementRef<HTMLElement>);
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrComboboxContainer, [null, { optional: true; }, null, null, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ClrComboboxContainer, "clr-combobox-container", never, {}, {}, never, ["label", "clr-combobox", "clr-control-helper", "clr-control-error", "clr-control-success"], false, never>;
}
