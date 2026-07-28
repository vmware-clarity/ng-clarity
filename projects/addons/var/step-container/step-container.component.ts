/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ErrorComponent } from '../error/error.component';
import { ActivationError } from '../error/interfaces';
import { StepInternal } from '../model/step';
import { ModelChanges } from '../model/step-interfaces';
import { StepModel } from '../model/step.model';

/**
 * Dynamically renders a step component specified by the step descriptor.
 */
@Component({
  selector: 'appfx-step-container',
  standalone: false,
  templateUrl: 'step-container.component.html',
})
export class StepContainerComponent implements OnInit, OnDestroy {
  @Input() step: StepInternal;

  @Input() description?: string;

  @Output() onRetry: EventEmitter<StepInternal> = new EventEmitter();

  // eslint-disable-next-line decorator-position/decorator-position
  @ViewChild('componentContainer', { read: ViewContainerRef, static: true })
  private componentContainer: ViewContainerRef;

  private pageComponent?: any;
  private retrySubscription: Subscription;

  get readyToComplete(): boolean {
    if (this.pageComponent?.model) {
      const stepModel: StepModel = this.pageComponent.model;
      return stepModel.readyToComplete === undefined ? true : stepModel.readyToComplete;
    }
    return true;
  }

  private get isValid(): boolean {
    return this.readyToComplete && this.isPageStateValid;
  }

  private get isPageStateValid(): boolean {
    if (this.pageComponent?.model?.validationState) {
      return this.pageComponent.model.validationState.isValid();
    }
    return true;
  }

  ngOnInit(): void {
    if (!this.step.instantiateLazy) {
      this.loadComponent();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeRetry();
  }

  onActivate(
    error?: ActivationError,
    stepModelChanges?: ModelChanges,
    recreateComponent?: boolean,
    resetValidationState = true
  ): void {
    this.unsubscribeRetry();
    if (error) {
      this.loadErrorComponent(error);
      return;
    }

    if (recreateComponent || (!this.pageComponent && !!this.step.instantiateLazy)) {
      this.loadComponent();
    }
    if (!this.pageComponent) {
      return;
    }
    if (resetValidationState) {
      this.resetValidationState();
    }
    if (typeof this.pageComponent.activate === 'function') {
      this.pageComponent.activate(stepModelChanges);
    }
  }

  onCommit(): Observable<boolean> {
    if (!this.pageComponent) {
      return of(true);
    }
    if (typeof this.pageComponent.validate === 'function') {
      const result = this.pageComponent.validate();
      if (!(result instanceof Observable)) {
        throw new Error("'validate' function must return Observable<boolean>");
      }
      return result.pipe(map((isValid: boolean) => isValid && this.isValid));
    }
    return of(this.isValid);
  }

  private loadComponent(): void {
    if (!this.step.componentClass) {
      return;
    }
    this.componentContainer.clear();
    const cr = this.componentContainer.createComponent(this.step.componentClass);
    this.pageComponent = cr.instance;
    this.pageComponent.model = this.step.modelInstance;
  }

  private loadErrorComponent(error: ActivationError): void {
    this.componentContainer.clear();
    const cr = this.componentContainer.createComponent(ErrorComponent);
    this.pageComponent = cr.instance;
    (this.pageComponent as ErrorComponent).error = error;
    this.retrySubscription = (this.pageComponent as ErrorComponent).onRetry
      .pipe(take(1))
      .subscribe(() => this.onRetry.emit(this.step));
  }

  private unsubscribeRetry(): void {
    if (this.retrySubscription && !this.retrySubscription.closed) {
      this.retrySubscription.unsubscribe();
    }
  }

  private resetValidationState(): void {
    if (this.pageComponent?.model) {
      this.pageComponent.model.readyToComplete = true;
      if (this.pageComponent.model.validationState) {
        this.pageComponent.model.validationState.errors = [];
        this.pageComponent.model.validationState.warnings = [];
        this.pageComponent.model.validationState.infos = [];
      }
    }
  }
}
