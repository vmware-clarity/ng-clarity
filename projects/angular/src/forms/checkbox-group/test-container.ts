/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChildren, Optional, QueryList } from '@angular/core';

import { ClrCheckbox } from '../checkbox';
import { ClrAbstractGroupContainer } from '../common/abstract-group-container';
import { IfControlGroupStateService } from '../common/if-control-state/if-control-group-state.service';
import { ContainerIdService } from '../common/providers/container-id.service';
import { ControlClassService } from '../common/providers/control-class.service';
import { LayoutService } from '../common/providers/layout.service';
import { NgControlGroupService } from '../common/providers/ng-control-group.service';

@Component({
  selector: 'clr-test-container',
  template: `
    <ng-content select="label"></ng-content>
    <label *ngIf="!label && addGrid()"></label>
    <div class="clr-control-container" [ngClass]="controlClass()">
      <ng-content select="clr-checkbox-wrapper,clr-toggle-wrapper"></ng-content>
      <div class="clr-subtext-wrapper">
        <ng-content select="clr-control-helper" *ngIf="showHelper"></ng-content>
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
        <ng-content select="clr-control-error" *ngIf="showInvalid"></ng-content>
        <ng-content select="clr-control-success" *ngIf="showValid"></ng-content>
      </div>
    </div>
  `,
  host: {
    '[class.clr-form-control]': 'true',
    // TODO: Double check this and improve
  },
  providers: [IfControlGroupStateService, NgControlGroupService, ControlClassService, ContainerIdService],
})
export class ClrTestContainer extends ClrAbstractGroupContainer {
  @ContentChildren(ClrCheckbox, { descendants: true }) checkboxes: QueryList<ClrCheckbox>;

  constructor(
    @Optional() protected override layoutService: LayoutService,
    protected override controlClassService: ControlClassService,
    protected override ngControlGroupService: NgControlGroupService,
    protected override ifControlGroupStateService: IfControlGroupStateService
  ) {
    super(ifControlGroupStateService, layoutService, controlClassService, ngControlGroupService);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
}
