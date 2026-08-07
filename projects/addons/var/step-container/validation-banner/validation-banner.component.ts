/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { StepValidationState } from '../../model/step-validation-state';

@Component({
  selector: 'appfx-validation-banner-internal',
  standalone: false,
  template: ` <clr-alert
    role="alert"
    aria-live="polite"
    [clrAlertType]="type"
    *ngIf="items?.length"
    [clrAlertClosable]="closable"
    [(clrAlertClosed)]="closed"
  >
    <clr-alert-item *ngFor="let item of items">
      <span class="alert-text" [textContent]="item"></span>
    </clr-alert-item>
  </clr-alert>`,
})
export class ValidationBannerInternalComponent {
  @Input() type: string;

  @Input() closable = true;

  @Input() closed = false;

  #items: string[] = [];

  get items(): string[] {
    return this.#items;
  }

  @Input()
  set items(value: string[]) {
    this.#items = value;

    // every time we get new items - were remove closed state and become visible again
    this.closed = false;
  }
}

@Component({
  selector: 'appfx-validation-banner',
  standalone: false,
  template: `
    <appfx-validation-banner-internal
      *ngIf="state && state.errors?.length"
      [items]="state.errors"
      [type]="'danger'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.warnings?.length"
      [items]="state.warnings"
      [type]="'warning'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.infos?.length"
      [items]="state.infos"
      [type]="'info'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: var(--cds-global-space-4);
      }
    `,
  ],
})
export class ValidationBannerComponent {
  @Input() state?: StepValidationState;

  @Input() closable = true;

  get closed() {
    return !this.state || this.state.isEmpty();
  }
}
