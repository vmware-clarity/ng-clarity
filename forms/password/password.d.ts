import { ElementRef, Injector, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrPasswordContainer } from './password-container';
import * as i0 from "@angular/core";
export declare class ClrPassword extends WrappedFormControl<ClrPasswordContainer> implements OnInit, OnDestroy {
    private focusService;
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, focusService: FocusService, toggleService: BehaviorSubject<boolean>);
    triggerFocus(): void;
    triggerValidation(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ClrPassword, [null, null, { optional: true; self: true; }, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ClrPassword, "[clrPassword]", never, {}, {}, never, never, false, never>;
}
