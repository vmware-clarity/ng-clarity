import { AfterContentInit, ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { ClrDatalistContainer } from './datalist-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { DatalistIdService } from './providers/datalist-id.service';
export declare class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
    private focusService;
    private datalistIdService;
    listValue: string;
    constructor(focusService: FocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, datalistIdService: DatalistIdService);
    ngAfterContentInit(): void;
    triggerFocus(): void;
    triggerValidation(): void;
}
