/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, input } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

export interface ComponentList {
  component: string;
  description: string;
}

@Component({
  selector: 'app-nesting-table',
  templateUrl: './nesting-table.component.html',
  styleUrl: './nesting-table.component.scss',
  imports: [ClrAlertModule],
})
export class NestingTableComponent {
  readonly componentName = input.required<string | undefined>();
  readonly subComponentName = input<string | undefined>(undefined);
  @Input() canNestComponents: string | undefined;
  @Input() cannotNestComponents: string | undefined;
  readonly conditionalNesting = input<ComponentList[] | undefined>(undefined);
}
