import { TemplateRef, ViewContainerRef } from '@angular/core';
import { NgControlService } from '../providers/ng-control.service';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import * as i0 from "@angular/core";
export declare class ClrIfError extends AbstractIfState {
    private template;
    private container;
    error: string;
    private embeddedViewRef;
    constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
    private displayError;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrIfError, [{ optional: true; }, { optional: true; }, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrIfError, "[clrIfError]", never, { "error": "clrIfError"; }, {}, never, never, false, never>;
}
