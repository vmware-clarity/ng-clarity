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
<clr-badge clrType="outlined">1</clr-badge>
<clr-badge clrType="outlined" clrColor="purple">15</clr-badge>
<clr-badge clrType="outlined" clrColor="blue">2</clr-badge>
<clr-badge clrType="outlined" clrColor="orange">3</clr-badge>
<clr-badge clrType="outlined" clrColor="light-blue">12</clr-badge>
<clr-badge clrType="outlined" clrColor="gray">8</clr-badge>
<br />
<clr-badge clrType="outlined" clrColor="info">15</clr-badge>
<clr-badge clrType="outlined" clrColor="success">2</clr-badge>
<clr-badge clrType="outlined" clrColor="warning">3</clr-badge>
<clr-badge clrType="outlined" clrColor="danger">12</clr-badge>
`;

@Component({
  selector: 'clr-badge-angular-outlined-demo',
  templateUrl: './badge-angular-outlined.demo.html',
  imports: [ClrBadge, StackblitzExampleComponent],
})
export class BadgeAngularOutlinedDemo {
  htmlExample = HTML_EXAMPLE;
}
