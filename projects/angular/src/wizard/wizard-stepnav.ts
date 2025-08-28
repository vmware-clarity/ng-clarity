/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { PageCollectionService } from './providers/page-collection.service';

@Component({
  selector: 'clr-wizard-stepnav',
  template: `
    <nav [attr.aria-label]="label">
      <ol class="clr-wizard-stepnav-list">
        <li
          *ngFor="let page of pageService.pages; let i = index"
          clr-wizard-stepnav-item
          [page]="page"
          class="clr-wizard-stepnav-item"
        >
          {{ i + 1 }}
        </li>
      </ol>
    </nav>
  `,
  host: { class: 'clr-wizard-stepnav' },
  standalone: false,
})
export class ClrWizardStepnav {
  @Input() label: string;

  constructor(public pageService: PageCollectionService) {}
}
