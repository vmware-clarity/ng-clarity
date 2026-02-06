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

  // I lost way too much time trying to make this work without injecting the ViewContainerRef and the Injector,
  // I'm giving up. So we have to inject these two manually for now.
  constructor(
    protected vcr: ViewContainerRef,
    protected wrapperType: Type<W>,
    injector: Injector,
    private ngControl: NgControl | null,
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

    // 4 possible variations
    // 1. NO  ngControlService and NO  ngControl
    // 2. NO  ngControlService and YES ngControl
    // 3. YES ngControlService and NO  ngControl
    // 4. YES ngControlService and YES ngControl

    if (this.ngControl) {
      this.differ = this.differs.find(this.ngControl).create();
    }

    if (this.ngControlService && this.ngControl) {
      this.ngControlService.addControl(this.ngControl);
    }
  }

  ngDoCheck() {
    if (this.ngControl) {
      this.triggerDoCheck(this.differ, this.ngControl);
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
  }

  // blur HostListener decorator MUST be 1 and on the parent.
  // overrides MUST NOT have HostListener decorator.
  @HostListener('blur')
  triggerValidation() {
    if (this.ngControl?.control?.markAsTouched) {
      this.ngControl.control.markAsTouched();
    }
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

  private triggerDoCheck(differ: KeyValueDiffer<any, any>, ngControl: NgControl) {
    if (differ) {
      const changes = differ.diff(ngControl);
      if (changes) {
        changes.forEachChangedItem(change => {
          if (
            (change.key === CHANGE_KEYS.FORM || change.key === CHANGE_KEYS.MODEL) &&
            change.currentValue !== change.previousValue
          ) {
            if (this.ngControlService) {
              this.ngControlService.emitControlsChange(this.ngControlService.controls);
            }

            this.triggerValidation();
          }
        });
      }
    }
  }

  private markAsTouched(): void {
    if (this.ngControlService && this.ngControlService.hasMultipleControls) {
      this.ngControlService.controls.forEach((ngControl: NgControl) => {
        ngControl.control.markAsTouched();
        ngControl.control.updateValueAndValidity();
      });

      return;
    }

    if (this.ngControl) {
      this.ngControl.control.markAsTouched();
      this.ngControl.control.updateValueAndValidity();
    }
  }
}
