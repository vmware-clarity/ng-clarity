/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Inject,
  OnInit,
  Optional,
  PLATFORM_ID,
  QueryList,
  ViewChild,
} from '@angular/core';
import { FormGroupName, NgModelGroup } from '@angular/forms';
import { AccordionPanelModel, AccordionStatus, ClrAccordionPanel } from '@clr/angular/accordion';
import { ClrCommonStringsService, IfExpandService, triggerAllFormControlValidation } from '@clr/angular/utils';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, skipUntil, tap } from 'rxjs/operators';

import { StepperService } from './providers/stepper.service';
import { ClrStepDescription } from './step-description';
import { stepAnimation } from './utils/animation';

@Component({
  selector: 'clr-stepper-panel',
  templateUrl: 'stepper-panel.html',
  host: { '[class.clr-stepper-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: stepAnimation,
  providers: [IfExpandService],
  standalone: false,
})
export class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
  @ViewChild('headerButton') headerButton: ElementRef<HTMLButtonElement>;
  @ContentChildren(ClrStepDescription) override accordionDescription: QueryList<ClrStepDescription>;
  @HostBinding('class.clr-stepper-panel-disabled') override disabled = false;
  readonly AccordionStatus = AccordionStatus;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public override commonStrings: ClrCommonStringsService,
    @Optional() private formGroupName: FormGroupName,
    @Optional() private ngModelGroup: NgModelGroup,
    private stepperService: StepperService,
    ifExpandService: IfExpandService,
    cdr: ChangeDetectorRef
  ) {
    super(null, commonStrings, stepperService, ifExpandService, cdr);
  }

  override get id(): string {
    return this.formGroupName ? this.formGroupName.name.toString() : this.ngModelGroup.name;
  }
  override set id(_value: string) {
    // overriding parent id required empty setter
  }

  get panelNumber() {
    return this._panelIndex + 1;
  }

  get formGroup() {
    return this.formGroupName ? this.formGroupName.control : this.ngModelGroup.control;
  }

  override getPanelStateClasses(panel: AccordionPanelModel) {
    return `clr-stepper-panel-${panel.status} ${panel.open ? 'clr-stepper-panel-open' : ''}`;
  }

  override getAccordionContentId(id: string) {
    return `clr-stepper-content-${id}'`;
  }

  override getAccordionHeaderId(id: string) {
    return `clr-stepper-header-${id}`;
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
        this.formGroup.statusChanges.pipe(skipUntil(invalidStatusTrigger), distinctUntilChanged()).subscribe(status => {
          if (!this.formGroup.touched) {
            return;
          }

          if (status === 'VALID') {
            this.stepperService.setPanelValid(this.id);
          } else if (status === 'INVALID') {
            this.stepperService.setPanelInvalid(this.id);
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  protected stepCompleteText(panelNumber: number) {
    return this.commonStrings.parse(this.commonStrings.keys.stepComplete, { STEP: panelNumber.toString() });
  }

  protected stepErrorText(panelNumber: number) {
    return this.commonStrings.parse(this.commonStrings.keys.stepError, { STEP: panelNumber.toString() });
  }

  private listenToFocusChanges() {
    this.subscriptions.push(
      this.stepperService.activeStep
        .pipe(filter(panelId => isPlatformBrowser(this.platformId) && panelId === this.id))
        .subscribe(() => {
          this.headerButton.nativeElement.focus();
        })
    );
  }

  private triggerAllFormControlValidationIfError(panel: AccordionPanelModel) {
    if (panel.status === AccordionStatus.Error) {
      triggerAllFormControlValidation(this.formGroup);
    }
  }
}
