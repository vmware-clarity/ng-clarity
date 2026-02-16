/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

export interface ComponentList {
  component: string;
  description: string;
}

@Component({
  selector: 'app-nesting-table',
  templateUrl: './nesting-table.component.html',
  styleUrl: './nesting-table.component.scss',
  imports: [CommonModule, ClrAlertModule],
})
export class NestingTableComponent {
  @Input({ required: true }) componentName: string | undefined;
  @Input() subComponentName: string | undefined;
  @Input() canNestComponents: string | undefined;
  @Input() cannotNestComponents: string | undefined;
  @Input() conditionalNesting: ComponentList[] | undefined;
}
