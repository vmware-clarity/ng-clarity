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
import { FormGroupName, NgModelGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, pairwise, tap } from 'rxjs/operators';

import { ClrCommonStringsService } from '../../utils';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { triggerAllFormControlValidation } from '../../utils/forms/validation';
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
export class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
  override isAccordion = false;

  @ViewChild('headerButton') headerButton: ElementRef;
  private subscriptions: Subscription[] = [];

  get formGroup() {
    return this.formGroupName ? this.formGroupName.control : this.ngModelGroup.control;
  }

  override get id(): string {
    return this.formGroupName ? this.formGroupName.name.toString() : this.ngModelGroup.name;
  }

  override set id(_value: string) {
    // overriding parent id required empty setter
  }

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

  override ngOnInit(): void {
    super.ngOnInit();
    this.panel = this.panel.pipe(tap(panel => this.triggerAllFormControlValidationIfError(panel)));
    this.stepperService.disablePanel(this.id, true);
    this.listenToFocusChanges();
    this.listenToInitialStepperPanelChanges();

    if (this.formGroup) {
      // not all stepper panels are guaranteed to have a form (i.e. empty template-driven)
      this.subscriptions.push(
        this.formGroup.statusChanges.pipe(pairwise()).subscribe(([prevStatus, newStatus]) => {
          if ('VALID' === prevStatus && 'INVALID' === newStatus) {
            this.stepperService.navigateToNextPanel(this.id, this.formGroup.valid);
          }
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  private listenToFocusChanges() {
    this.subscriptions.push(
      this.stepperService.activeStep
        .pipe(filter(panelId => isPlatformBrowser(this.platformId) && panelId === this.id))
        .subscribe(() => this.headerButton.nativeElement.focus())
    );
  }

  private listenToInitialStepperPanelChanges() {
    this.subscriptions.push(
      this.accordionService.getPanelChanges(this.id).subscribe(() => {
          this.cdr.detectChanges();
      })
    )
  }

  private triggerAllFormControlValidationIfError(panel: AccordionPanelModel) {
    if (panel.status === AccordionStatus.Error) {
      triggerAllFormControlValidation(this.formGroup);
    }
  }
}
