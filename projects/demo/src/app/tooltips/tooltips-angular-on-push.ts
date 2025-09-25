/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TooltipsAngularDemo } from './tooltips-angular';

@Component({
  selector: 'clr-tooltips-angular-on-push-demo',
  styleUrls: ['./tooltips.demo.scss'],
  templateUrl: './tooltips-angular.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TooltipsAngularOnPushDemo extends TooltipsAngularDemo {}
