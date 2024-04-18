/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormGroupName, NgModelGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, skipUntil, tap } from 'rxjs/operators';

import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { triggerAllFormControlValidation } from '../../utils/forms/validation';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { ClrAccordionPanel } from '../accordion-panel';
import { AccordionStatus } from '../enums/accordion-status.enum';
import { AccordionPanelModel } from '../models/accordion.model';
import { stepAnimation } from '../utils/animation';
import { StepperService } from './providers/stepper.service';

@Component({
  selector: 'clr-stepper-panel',
  templateUrl: '../accordion-panel.html',
  host: { '[class.clr-accordion-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: stepAnimation,
  providers: [IfExpandService],
})
export class ClrStepperPanel extends ClrAccordionPanel implements OnInit, AfterContentChecked {
  override isAccordion = false;
  formGroupWithUpdatesOnBlur: FormGroup = null;

  @ViewChild('headerButton') headerButton: ElementRef;

  private subscriptions: Subscription[] = [];

  // Didn't find an Angular API for that, we want to trigger invalidation of panels on focus change
  private formGroupControlsFocusChange: Observable<any>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public override commonStrings: ClrCommonStringsService,
    @Optional() private formGroupName: FormGroupName,
    @Optional() private ngModelGroup: NgModelGroup,
    private stepperService: StepperService,
    ifExpandService: IfExpandService,
    cdr: ChangeDetectorRef
  ) {
    super(commonStrings, stepperService, ifExpandService, cdr);
  }

  override get id(): string {
    return this.formGroupName ? this.formGroupName.name.toString() : this.ngModelGroup.name;
  }
  override set id(_value: string) {
    // overriding parent id required empty setter
  }

  get formGroup() {
    // eslint-disable-next-line no-constant-condition
    // if (this.formGroupName?.control?.controls && false) {
    //   if (!this.formGroupWithUpdatesOnBlur) {
    //     this.formGroupWithUpdatesOnBlur = new FormGroup(
    //         this.formGroupName?.control?.controls,
    //         {updateOn: 'blur'}
    //     );
    //   }
    //   return this.formGroupWithUpdatesOnBlur;
    // }
    return this.formGroupName ? this.formGroupName.control : this.ngModelGroup.control;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.panel = this.panel.pipe(tap(panel => this.triggerAllFormControlValidationIfError(panel)));
    this.stepperService.disablePanel(this.id, true);
    this.listenToFocusChanges();

    // not all stepper panels are guaranteed to have a form (i.e. empty template-driven)
    if (this.formGroup) {
      // set panel status on form status change only after the form becomes invalid
      const invalidStatusTrigger = this.formGroup.statusChanges.pipe(filter(status => status === 'INVALID'));

      this.subscriptions.push(
        this.formGroup.statusChanges
          .pipe(
            tap(_ => {
              console.log('in tap');
              console.log(_);
              console.log(this.formGroup);
            }),
            skipUntil(invalidStatusTrigger),
            distinctUntilChanged()
          )
          .subscribe(status => {
            if (status === 'VALID') {
              console.log('call service.resetPanel');
              this.stepperService.resetPanel(this.id);
              console.log('call service.setPanelValid');
              // this.stepperService.setPanelValid(this.id);
            } else if (status === 'INVALID') {
              console.log('call service.setPanelInvalid');
              this.stepperService.setPanelInvalid(this.id);
            }
          })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private listenToFocusChanges() {
    console.log('focus change');
    this.subscriptions.push(
      this.stepperService.activeStep
        .pipe(filter(panelId => isPlatformBrowser(this.platformId) && panelId === this.id))
        .subscribe(() => {
          //Adding timeout so that the status of the previous step is read by Voice Over on Safari,
          //before focusing on the next stepper panel header
          setTimeout(() => this.headerButton.nativeElement.focus(), 1500);
        })
    );
  }

  private triggerAllFormControlValidationIfError(panel: AccordionPanelModel) {
    if (panel.status === AccordionStatus.Error) {
      triggerAllFormControlValidation(this.formGroup);
    }
  }
}
