/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { BADGE_EXAMPLES } from '@clr/examples/badge';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-badge-angular-status-demo',
  templateUrl: './badge-angular-status.demo.html',
  imports: [DocExampleComponent],
})
export class BadgeAngularStatusDemo {
  readonly examples = BADGE_EXAMPLES;
}
