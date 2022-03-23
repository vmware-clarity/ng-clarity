/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  Optional,
  ChangeDetectionStrategy,
  Input,
  SimpleChanges,
  OnInit,
  AfterViewInit,
  OnChanges,
  Inject,
} from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { startWith, filter, takeUntil } from 'rxjs/operators';

import { StepperService } from './providers/stepper.service';
import { AccordionService } from '../providers/accordion.service';
import { ClrStepperPanel } from './stepper-panel';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'form[clrStepper]',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.clr-accordion]': 'true',
    '[class.clr-stepper-forms]': 'true',
  },
  providers: [StepperService, { provide: AccordionService, useExisting: StepperService }, ClrDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrStepper implements OnInit, OnChanges, AfterViewInit {
  @Input('clrInitialStep') initialPanel: string;
  @ContentChildren(ClrStepperPanel, { descendants: true })
  panels: QueryList<ClrStepperPanel>;
  form: FormGroupDirective | NgForm;

  constructor(
    @Optional() @Inject(FormGroupDirective) private formGroup: FormGroupDirective | null,
    @Optional() @Inject(NgForm) private ngForm: NgForm | null,
    private stepperService: StepperService,
    private destroy$: ClrDestroyService
  ) {}

  ngOnInit() {
    if (!this.formGroup && !this.ngForm) {
      throw new Error('To use stepper a Reactive or Template Form is required.');
    }

    this.form = this.formGroup ? this.formGroup : this.ngForm;
    this.listenForPanelsCompleted();
    this.listenForFormResetChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.initialPanel.currentValue !== changes.initialPanel.previousValue) {
      this.stepperService.overrideInitialPanel(this.initialPanel);
    }
  }

  ngAfterViewInit() {
    this.listenForDOMChanges();
  }

  private listenForFormResetChanges() {
    this.form.statusChanges
      .pipe(
        filter(() => this.form.pristine),
        takeUntil(this.destroy$)
      ) // https://github.com/angular/angular/issues/10887
      .subscribe(() => this.stepperService.resetPanels());
  }

  private listenForPanelsCompleted() {
    this.stepperService.panelsCompleted.pipe(takeUntil(this.destroy$)).subscribe(panelsCompleted => {
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
    // Note: doesn't need to unsubscribe, because `changes`
    // gets completed by Angular when the view is destroyed.
    this.panels.changes.pipe(startWith(this.panels)).subscribe((panels: QueryList<ClrStepperPanel>) => {
      this.stepperService.updatePanelOrder(panels.toArray().map(p => p.id));

      if (this.initialPanel) {
        this.stepperService.overrideInitialPanel(this.initialPanel);
      }
    });
  }
}
