/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, AfterViewInit, Component, ElementRef, Optional, ViewChild } from '@angular/core';
import {
  ClrAbstractContainer,
  ControlClassService,
  ControlIdService,
  IfControlStateService,
  LayoutService,
  NgControlService,
} from '@clr/angular/src/forms/common';

import { ComboboxContainerService } from './providers/combobox-container.service';
@Component({
  selector: 'clr-combobox-container',
  template: `
    <ng-content select="label"></ng-content>
    @if (!label && addGrid()) {
      <label></label>
    }
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
      @if (showInvalid) {
        <cds-icon class="clr-validate-icon" shape="exclamation-circle" status="danger" aria-hidden="true"></cds-icon>
      }
      @if (showValid) {
        <cds-icon class="clr-validate-icon" shape="check-circle" status="success" aria-hidden="true"></cds-icon>
      }
      @if (showHelper) {
        <ng-content select="clr-control-helper"></ng-content>
      }
      @if (showInvalid) {
        <ng-content select="clr-control-error"></ng-content>
      }
      @if (showValid) {
        <ng-content select="clr-control-success"></ng-content>
      }
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    '[class.clr-combobox-form-control]': 'true',
    '[class.clr-form-control-disabled]': 'control?.disabled',
    '[class.clr-row]': 'addGrid()',
  },
  providers: [IfControlStateService, NgControlService, ControlIdService, ControlClassService, ComboboxContainerService],
  standalone: false,
})
export class ClrComboboxContainer extends ClrAbstractContainer implements AfterContentInit, AfterViewInit {
  @ViewChild('controlContainer') controlContainer: ElementRef<HTMLElement>;

  constructor(
    ifControlStateService: IfControlStateService,
    @Optional() layoutService: LayoutService,
    controlClassService: ControlClassService,
    ngControlService: NgControlService,
    private containerService: ComboboxContainerService,
    private el: ElementRef<HTMLElement>
  ) {
    super(ifControlStateService, layoutService, controlClassService, ngControlService);
  }

  override ngAfterContentInit() {
    if (this.label) {
      this.containerService.labelText = this.label.labelText;
    }
  }

  ngAfterViewInit() {
    this.containerService.labelOffset =
      this.controlContainer.nativeElement.offsetHeight - this.el.nativeElement.offsetHeight;
  }
}
