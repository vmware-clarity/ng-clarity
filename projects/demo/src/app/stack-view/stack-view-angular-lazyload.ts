/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackViewNgDemo } from './stack-view-ng-demo';

@Component({
  selector: 'clr-stack-view-angular-lazyload-demo',
  templateUrl: './stack-view-angular-lazyload.html',
  styleUrls: ['./stack-view.demo.scss'],
  standalone: false,
})
export class StackViewAngularLazyloadDemo extends StackViewNgDemo {}
