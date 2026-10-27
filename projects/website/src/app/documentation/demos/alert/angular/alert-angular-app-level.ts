/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ALERT_EXAMPLES } from '@clr/examples/alert';

import { DocExampleComponent } from '../../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-alert-app-level-demo-angular',
  templateUrl: './alert-angular-app-level.demo.html',
  imports: [DocExampleComponent],
})
export class AlertAngularAppLevelDemo {
  readonly examples = ALERT_EXAMPLES;
}
