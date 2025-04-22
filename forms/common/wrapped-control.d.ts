import { DoCheck, ElementRef, InjectionToken, Injector, OnDestroy, OnInit, Renderer2, Type, ViewContainerRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ControlIdService } from './providers/control-id.service';
import { NgControlService } from './providers/ng-control.service';
import * as i0 from "@angular/core";
export declare enum CHANGE_KEYS {
    FORM = "form",
    MODEL = "model"
}
export declare class WrappedFormControl<W> implements OnInit, DoCheck, OnDestroy {
    protected vcr: ViewContainerRef;
    protected wrapperType: Type<W>;
    private _ngControl;
    protected renderer: Renderer2;
    protected el: ElementRef<HTMLElement>;
    _id: string;
    protected controlIdService: ControlIdService;
    protected ngControlService: NgControlService;
    protected index: number;
    protected subscriptions: Subscription[];
    private ifControlStateService;
    private controlClassService;
    private markControlService;
    private containerIdService;
    private _containerInjector;
    private differs;
    private differ;
    private additionalDiffer;
    private ngControl;
    constructor(vcr: ViewContainerRef, wrapperType: Type<W>, injector: Injector, _ngControl: NgControl | null, renderer: Renderer2, el: ElementRef<HTMLElement>);
    get id(): string;
    set id(value: string);
    private get hasAdditionalControls();
    ngOnInit(): void;
    ngDoCheck(): void;
    ngOnDestroy(): void;
    triggerValidation(): void;
    protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T;
    private triggerDoCheck;
    private markAsTouched;
    private setAriaDescribedBy;
    private getAriaDescribedById;
    static ɵfac: i0.ɵɵFactoryDeclaration<WrappedFormControl<any>, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<WrappedFormControl<any>, never, never, { "id": "id"; }, {}, never, never, false, never>;
}
