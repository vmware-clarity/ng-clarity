/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, AfterViewInit, Component, ElementRef, Optional, ViewChild } from '@angular/core';

import { ClrAbstractContainer } from '../common/abstract-container';
import { IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { ControlIdService } from '../common/providers/control-id.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlService } from '../common/providers/ng-control.service';
import { ComboboxContainerService } from './providers/combobox-container.service';

@Component({
  selector: 'clr-combobox-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()" #controlContainer>
      <ng-content select="clr-combobox"></ng-content>
      <cds-icon
        *ngIf="showInvalid"
        class="clr-validate-icon"
        shape="exclamation-circle"
        status="danger"
        aria-hidden="true"
      ></cds-icon>
      <cds-icon
        *ngIf="showValid"
        class="clr-validate-icon"
        shape="check-circle"
        status="success"
        aria-hidden="true"
      ></cds-icon>
      <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
      <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
      <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
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
