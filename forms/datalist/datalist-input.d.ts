import { AfterContentInit, ElementRef, Injector, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrDatalistContainer } from './datalist-container';
import { DatalistIdService } from './providers/datalist-id.service';
import * as i0 from "@angular/core";
export declare class ClrDatalistInput extends WrappedFormControl<ClrDatalistContainer> implements AfterContentInit {
    private focusService;
    private datalistIdService;
    listValue: string;
    constructor(focusService: FocusService, vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, datalistIdService: DatalistIdService);
    ngAfterContentInit(): void;
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrDatalistInput, [{ optional: true; }, null, null, { optional: true; self: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrDatalistInput, "[clrDatalistInput]", never, {}, {}, never, never, false, never>;
}
