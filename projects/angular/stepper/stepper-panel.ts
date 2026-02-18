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
import {
  CollapsiblePanel,
  collapsiblePanelAnimation,
  CollapsiblePanelModel,
  CollapsiblePanelStatus,
} from '@clr/angular/collapsible-panel';
import { ClrCommonStringsService, IfExpandService, triggerAllFormControlValidation } from '@clr/angular/utils';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, skipUntil, tap } from 'rxjs/operators';

import { StepperService } from './providers/stepper.service';
import { ClrStepDescription } from './step-description';

@Component({
  selector: 'clr-stepper-panel',
  templateUrl: 'stepper-panel.html',
  host: { '[class.clr-stepper-panel]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: collapsiblePanelAnimation,
  providers: [IfExpandService],
  standalone: false,
})
export class ClrStepperPanel extends CollapsiblePanel implements OnInit {
  @ViewChild('headerButton') headerButton: ElementRef<HTMLButtonElement>;
  @ContentChildren(ClrStepDescription) stepDescription: QueryList<ClrStepDescription>;
  @HostBinding('class.clr-stepper-panel-disabled') disabled = false;
  readonly PanelStatus = CollapsiblePanelStatus;

  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    public commonStrings: ClrCommonStringsService,
    @Optional() private formGroupName: FormGroupName,
    @Optional() private ngModelGroup: NgModelGroup,
    private stepperService: StepperService,
    ifExpandService: IfExpandService,
    cdr: ChangeDetectorRef
  ) {
    super(stepperService, ifExpandService, cdr);
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

  getPanelStateClasses(panel: CollapsiblePanelModel) {
    return `clr-stepper-panel-${panel.status} ${panel.open ? 'clr-stepper-panel-open' : ''}`;
  }

  getContentId(id: string) {
    return `clr-stepper-content-${id}'`;
  }

  getHeaderId(id: string) {
    return `clr-stepper-header-${id}`;
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.panel = this.panel.pipe(tap(panel => this.triggerAllFormControlValidationIfError(panel)));
    this.stepperService.disablePanel(this.id, true);
    this.listenToFocusChanges();

    if (this.formGroup) {
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

  private triggerAllFormControlValidationIfError(panel: CollapsiblePanelModel) {
    if (panel.status === CollapsiblePanelStatus.Error) {
      triggerAllFormControlValidation(this.formGroup);
    }
  }
}
