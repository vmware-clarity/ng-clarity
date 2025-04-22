import { AfterContentInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClrControlError } from './error';
import { ClrControlHelper } from './helper';
import { IfControlStateService } from './if-control-state/if-control-state.service';
import { ClrLabel } from './label';
import { ControlClassService } from './providers/control-class.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';
import { ClrControlSuccess } from './success';
import * as i0 from "@angular/core";
export declare abstract class ClrAbstractContainer implements OnDestroy, AfterContentInit {
    protected ifControlStateService: IfControlStateService;
    protected layoutService: LayoutService;
    protected controlClassService: ControlClassService;
    protected ngControlService: NgControlService;
    label: ClrLabel;
    controlSuccessComponent: ClrControlSuccess;
    controlErrorComponent: ClrControlError;
    controlHelperComponent: ClrControlHelper;
    control: NgControl;
    additionalControls: NgControl[];
    protected subscriptions: Subscription[];
    private state;
    constructor(ifControlStateService: IfControlStateService, layoutService: LayoutService, controlClassService: ControlClassService, ngControlService: NgControlService);
    /**
     * @NOTE
     * Helper control is a bit different than the others, it must be always visible:
     *   -  Labels and instructions must always accompany forms and are persistent.
     *   -  The recommendation here is to always have helper text or anything instructions visible.
     *   -  The expectation is to have error text + helper text in the errored state. this way all users will have the helper text information always available.
     */
    get showHelper(): boolean;
    get showValid(): boolean;
    get showInvalid(): boolean;
    protected get successMessagePresent(): boolean;
    protected get errorMessagePresent(): boolean;
    private get touched();
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    controlClass(): string;
    addGrid(): boolean;
    private updateHelpers;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrAbstractContainer, [null, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrAbstractContainer, never, never, {}, {}, ["label", "controlSuccessComponent", "controlErrorComponent", "controlHelperComponent"], never, false, never>;
}
