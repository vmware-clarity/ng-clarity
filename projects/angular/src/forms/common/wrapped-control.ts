/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  DoCheck,
  ElementRef,
  HostBinding,
  HostListener,
  InjectionToken,
  Injector,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnDestroy,
  OnInit,
  Renderer2,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CONTROL_SUFFIX } from './abstract-control';
import { ContainerIdService } from './providers/container-id.service';
import { ControlClassService } from './providers/control-class.service';
import { ControlIdService } from './providers/control-id.service';
import { MarkControlService } from './providers/mark-control.service';
import { NgControlService } from './providers/ng-control.service';
import { HostWrapper } from '../../utils/host-wrapping/host-wrapper';

export enum CHANGE_KEYS {
  FORM = 'form',
  MODEL = 'model',
}

@Directive()
export class WrappedFormControl<W> implements OnInit, DoCheck, OnDestroy {
  _id: string;

  protected controlIdService: ControlIdService;
  protected ngControlService: NgControlService;
  protected index = 0;
  protected subscriptions: Subscription[] = [];

  private controlClassService: ControlClassService;
  private markControlService: MarkControlService;
  private containerIdService: ContainerIdService;
  private _containerInjector: Injector;
  private differs: KeyValueDiffers;
  private differ: KeyValueDiffer<any, any>;
  private additionalDiffer = new Map<NgControl, KeyValueDiffer<any, any>>();
  private ngControl: NgControl | null;

  // I lost way too much time trying to make this work without injecting the ViewContainerRef and the Injector,
  // I'm giving up. So we have to inject these two manually for now.
  constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    injector: Injector,
    private _ngControl: NgControl | null,
    protected renderer: Renderer2,
    protected el: ElementRef<HTMLElement>
  ) {
    if (injector) {
      this.ngControlService = injector.get(NgControlService, null);
      this.markControlService = injector.get(MarkControlService, null);
      this.differs = injector.get(KeyValueDiffers, null);
    }

    if (this.markControlService) {
      this.subscriptions.push(
        this.markControlService.touchedChange.subscribe(() => {
          this.markAsTouched();
        })
      );
    }
  }

  @Input()
  @HostBinding()
  get id() {
    return this._id;
  }
  set id(value: string) {
    this._id = value;
    if (this.controlIdService) {
      this.controlIdService.id = value;
    }
  }

  @HostBinding('attr.aria-describedby')
  private get ariaDescribedById(): string | null {
    const helpers = this.ngControlService?.container?.helpers;

    if (!helpers?.show) {
      return null;
    }

    const elementId = this.containerIdService?.id || this.controlIdService?.id;
    /**
     * If ContainerIdService or ControlIdService are missing don't try to guess
     * Don't set anything.
     */
    if (!elementId) {
      return null;
    }

    /**
     * As the helper text is now always visible. If we have error/success then we should use both ids.
     */
    const describedByIds = [`${elementId}-${CONTROL_SUFFIX.HELPER}`];
    if (helpers.showInvalid) {
      describedByIds.push(`${elementId}-${CONTROL_SUFFIX.ERROR}`);
    } else if (helpers.showValid) {
      describedByIds.push(`${elementId}-${CONTROL_SUFFIX.SUCCESS}`);
    }

    return describedByIds.join(' ');
  }

  private get hasAdditionalControls() {
    return this.additionalDiffer.size > 0;
  }

  ngOnInit() {
    this._containerInjector = new HostWrapper(this.wrapperType, this.vcr, this.index);
    this.controlIdService = this._containerInjector.get(ControlIdService);

    this.injectControlClassService(this._containerInjector);

    /**
     * not all containers will provide `ContainerIdService`
     */
    this.containerIdService = this._containerInjector.get(ContainerIdService, null);

    if (this._id) {
      this.controlIdService.id = this._id;
    } else {
      this._id = this.controlIdService.id;
    }

    if (this.ngControlService && this._ngControl) {
      if (!this.ngControlService.control) {
        this.ngControl = this._ngControl;
        this.ngControlService.setControl(this.ngControl);
        this.differ = this.differs.find(this._ngControl).create();
      } else {
        this.ngControl = this.ngControlService.control;
        this.ngControlService.addAdditionalControl(this._ngControl);
        this.additionalDiffer.set(this._ngControl, this.differs.find(this._ngControl).create());
      }
    }
  }

  ngDoCheck() {
    this.triggerDoCheck(this.differ, this.ngControl ? this.ngControl : this._ngControl);
    if (this.hasAdditionalControls) {
      for (const [ngControl, differ] of this.additionalDiffer) {
        this.triggerDoCheck(differ, ngControl);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  // blur HostListener decorator MUST be 1 and on the parent.
  // overrides MUST NOT have HostListener decorator.
  @HostListener('blur')
  triggerValidation() {
    this._ngControl?.control.markAsTouched();
  }

  // @TODO This method has a try/catch due to an unknown issue that came when building the clrToggle feature
  // We need to figure out why this fails for the ClrToggle scenario but works for Date picker...
  // To see the error, remove the try/catch here and run the ClrToggle suite to see issues getting the container
  // injector in time, and this ONLY HAPPENS in tests and not in dev/prod mode.
  protected getProviderFromContainer<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    try {
      return this._containerInjector.get(token, notFoundValue);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return notFoundValue;
    }
  }

  private injectControlClassService(injector: Injector) {
    if (!this.controlClassService) {
      this.controlClassService = injector.get(ControlClassService, null);
      if (this.controlClassService) {
        this.controlClassService.initControlClass(this.renderer, this.el.nativeElement);
      }
    }
  }

  private triggerDoCheck(differ, ngControl) {
    if (differ) {
      const changes = differ.diff(ngControl);
      if (changes) {
        changes.forEachChangedItem(change => {
          if (
            (change.key === CHANGE_KEYS.FORM || change.key === CHANGE_KEYS.MODEL) &&
            change.currentValue !== change.previousValue
          ) {
            // if (this.ngControlService.control === ngControl) {
            //   this.ngControlService.emitControlChange(ngControl);
            // } else {
            //   this.ngControlService.emitAdditionalControlChange(this.ngControlService.additionalControls);
            // }

            this.triggerValidation();
          }
        });
      }
    }
  }

  private markAsTouched(): void {
    if (this.ngControl) {
      this.ngControl.control.markAsTouched();
      this.ngControl.control.updateValueAndValidity();
    }
    if (this.ngControlService && this.ngControlService.hasAdditionalControls) {
      this.ngControlService.additionalControls?.forEach((ngControl: NgControl) => {
        ngControl.control.markAsTouched();
        ngControl.control.updateValueAndValidity();
      });
    }
  }
}
