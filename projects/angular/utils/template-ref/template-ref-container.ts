/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: false,
})
export class TemplateRefContainer {
  @ViewChild(TemplateRef) template: TemplateRef<any>;
}
