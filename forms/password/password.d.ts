import { ElementRef, Injector, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ClrPasswordContainer } from './password-container';
import { FocusService } from '../common/providers/focus.service';
import { WrappedFormControl } from '../common/wrapped-control';
export declare class ClrPassword extends WrappedFormControl<ClrPasswordContainer> implements OnInit, OnDestroy {
    private focusService;
    protected index: number;
    constructor(vcr: ViewContainerRef, injector: Injector, control: NgControl, renderer: Renderer2, el: ElementRef<HTMLInputElement>, focusService: FocusService, toggleService: BehaviorSubject<boolean>);
    triggerFocus(): void;
    triggerValidation(): void;
}
