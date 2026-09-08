/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { CollapsiblePanelService } from '@clr/angular/collapsible-panel';
import { merge, Observable, Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { StepperService } from './providers/stepper.service';
import { ClrStepperPanel } from './stepper-panel';

@Component({
  selector: 'form[clrStepper]',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-stepper-forms]': 'true',
    '[class.clr-stepper-has-step-description]': 'hasStepDescription',
  },
  providers: [StepperService, { provide: CollapsiblePanelService, useExisting: StepperService }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrStepper implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input('clrInitialStep') initialPanel: string;
  @ContentChildren(ClrStepperPanel) panels: QueryList<ClrStepperPanel>;
  form: FormGroupDirective | NgForm;
  hasStepDescription = false;
  private subscriptions: Subscription[] = [];
  private stepDescriptionSubscription: Subscription;

  constructor(
    @Optional() private formGroup: FormGroupDirective,
    @Optional() private ngForm: NgForm,
    private stepperService: StepperService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.formGroup && !this.ngForm) {
      throw new Error('To use stepper a Reactive or Template Form is required.');
    }

    this.form = this.formGroup ? this.formGroup : this.ngForm;
    this.subscriptions.push(this.listenForPanelsCompleted());
    this.subscriptions.push(this.listenForFormResetChanges());
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes.initialPanel &&
      !changes.initialPanel.firstChange &&
      changes.initialPanel.currentValue !== changes.initialPanel.previousValue
    ) {
      this.stepperService.overrideInitialPanel(this.initialPanel);
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(this.listenForDOMChanges());
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
    this.stepDescriptionSubscription?.unsubscribe();
  }

  private listenForFormResetChanges() {
    return fromControlReset(this.form.form).subscribe(() => this.stepperService.resetPanels());
  }

  private listenForPanelsCompleted() {
    return this.stepperService.panelsCompleted.subscribe(panelsCompleted => {
      if (panelsCompleted && this.form.valid) {
        this.form.ngSubmit.emit();
      } else if (!this.form.valid && this.form.touched) {
        this.setPanelsWithFormErrors();
      }
    });
  }

  private setPanelsWithFormErrors() {
    const panelsWithErrors = this.panels.reduce((panels, p) => (p.formGroup.invalid ? [...panels, p.id] : panels), []);
    this.stepperService.setPanelsWithErrors(panelsWithErrors);
  }

  private listenForDOMChanges() {
    return this.panels.changes.pipe(startWith(this.panels)).subscribe((panels: QueryList<ClrStepperPanel>) => {
      this.stepperService.updatePanelOrder(panels.toArray().map(p => p.id));

      if (this.initialPanel) {
        this.stepperService.overrideInitialPanel(this.initialPanel);
      }

      this.listenForStepDescriptionChanges(panels.toArray());
    });
  }

  private listenForStepDescriptionChanges(panels: ClrStepperPanel[]) {
    this.stepDescriptionSubscription?.unsubscribe();

    if (!panels.length) {
      this.updateHasStepDescription(panels);
      return;
    }

    this.stepDescriptionSubscription = merge(
      ...panels.map(panel => panel.stepDescription.changes.pipe(startWith(panel.stepDescription)))
    ).subscribe(() => this.updateHasStepDescription(panels));
  }

  private updateHasStepDescription(panels: ClrStepperPanel[]) {
    this.hasStepDescription = panels.some(panel => panel.stepDescription.length > 0);
    this.cdr.markForCheck();
  }
}

function fromControlReset(control: AbstractControl) {
  return new Observable<void>(observer => {
    const unpatchedControlReset = control.reset;

    control.reset = () => {
      observer.next();
      unpatchedControlReset.apply(control);
    };

    return () => {
      control.reset = unpatchedControlReset;
    };
  });
}
