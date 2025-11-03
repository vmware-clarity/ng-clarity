import { TemplateRef, ViewContainerRef } from '@angular/core';
import { AbstractIfState } from './abstract-if-state';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';
import { NgControlService } from '../providers/ng-control.service';
export declare class ClrIfSuccess extends AbstractIfState {
    private template;
    private container;
    constructor(ifControlStateService: IfControlStateService, ngControlService: NgControlService, template: TemplateRef<any>, container: ViewContainerRef);
    /**
     * @param state CONTROL_STATE
     */
    protected handleState(state: CONTROL_STATE): void;
}
