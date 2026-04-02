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
<clr-badge>1</clr-badge>
<clr-badge clrColor="purple">15</clr-badge>
<clr-badge clrColor="blue">2</clr-badge>
<clr-badge clrColor="orange">3</clr-badge>
<clr-badge clrColor="light-blue">12</clr-badge>
<clr-badge clrColor="gray">8</clr-badge>
<h6>Outlined</h6>
<clr-badge clrType="outlined">1</clr-badge>
<clr-badge clrType="outlined" clrColor="purple">15</clr-badge>
<clr-badge clrType="outlined" clrColor="blue">2</clr-badge>
<clr-badge clrType="outlined" clrColor="orange">3</clr-badge>
<clr-badge clrType="outlined" clrColor="light-blue">12</clr-badge>
<clr-badge clrType="outlined" clrColor="gray">8</clr-badge>
`;

@Component({
  selector: 'clr-badge-angular-colors-demo',
  templateUrl: './badge-angular-colors.demo.html',
  imports: [ClrBadge, StackblitzExampleComponent],
})
export class BadgeAngularColorsDemo {
  htmlExample = HTML_EXAMPLE;
}
