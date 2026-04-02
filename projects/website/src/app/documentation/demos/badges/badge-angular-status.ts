/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrBadge } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<h6>Solid</h6>
<clr-badge clrColor="info">15</clr-badge>
<clr-badge clrColor="success">2</clr-badge>
<clr-badge clrColor="warning">3</clr-badge>
<clr-badge clrColor="danger">12</clr-badge>
<h6>Outlined</h6>
<clr-badge clrType="outlined" clrColor="info">15</clr-badge>
<clr-badge clrType="outlined" clrColor="success">2</clr-badge>
<clr-badge clrType="outlined" clrColor="warning">3</clr-badge>
<clr-badge clrType="outlined" clrColor="danger">12</clr-badge>
`;

@Component({
  selector: 'clr-badge-angular-status-demo',
  templateUrl: './badge-angular-status.demo.html',
  imports: [ClrBadge, StackblitzExampleComponent],
})
export class BadgeAngularStatusDemo {
  htmlExample = HTML_EXAMPLE;
}
