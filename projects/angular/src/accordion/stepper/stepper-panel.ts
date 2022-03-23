/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ChangeDetectionStrategy,
  Optional,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
  PLATFORM_ID,
} from '@angular/core';
import { FormGroupName, NgModelGroup } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { tap, filter, pairwise, takeUntil } from 'rxjs/operators';

import { UNIQUE_ID_PROVIDER, UNIQUE_ID } from '../../utils/id-generator/id-generator.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { StepperService } from './providers/stepper.service';
import { stepAnimation } from '../utils/animation';
import { triggerAllFormControlValidation } from '../../utils/forms/validation';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { AccordionPanelModel } from '../models/accordion.model';
import { AccordionStatus } from '../enums/accordion-status.enum';
import { ClrAccordionPanel } from '../accordion-panel';
import { ClrDestroyService } from '../../utils/destroy';

@Component({
  selector: 'clr-stepper-panel',
  templateUrl: './../accordion-panel.html',
  host: { '[class.clr-accordion-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: stepAnimation,
  providers: [IfExpandService, UNIQUE_ID_PROVIDER, ClrDestroyService],
})
export class ClrStepperPanel extends ClrAccordionPanel implements OnInit {
  override isAccordion = false;

  @ViewChild('headerButton') headerButton: ElementRef;

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
    @Inject(UNIQUE_ID) id: string,
    private destroy$: ClrDestroyService
  ) {
    super(commonStrings, stepperService, ifExpandService, id);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.panel = this.panel.pipe(tap(panel => this.triggerAllFormControlValidationIfError(panel)));
    this.stepperService.disablePanel(this.id, true);
    this.listenToFocusChanges();

    if (this.formGroup) {
      // not all stepper panels are guaranteed to have a form (i.e. empty template-driven)
      this.formGroup.statusChanges.pipe(pairwise(), takeUntil(this.destroy$)).subscribe(([prevStatus, newStatus]) => {
        if ('VALID' === prevStatus && 'INVALID' === newStatus) {
          this.stepperService.navigateToNextPanel(this.id, this.formGroup.valid);
        }
      });
    }
  }

  private listenToFocusChanges() {
    this.stepperService.activeStep
      .pipe(
        filter(panelId => isPlatformBrowser(this.platformId) && panelId === this.id),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.headerButton.nativeElement.focus());
  }

  private triggerAllFormControlValidationIfError(panel: AccordionPanelModel) {
    if (panel.status === AccordionStatus.Error) {
      triggerAllFormControlValidation(this.formGroup);
    }
  }
}
