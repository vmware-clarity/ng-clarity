/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrStackViewModule } from '@clr/angular';

import { RemoveStackViewHeadingsDirective } from './remove-stack-view-headings.directive';
import { StackViewNgDemo } from './stack-view-ng-demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-stack-view>
  <clr-stack-header>Angular stack view</clr-stack-header>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 1</clr-stack-label>
    <clr-stack-content>Content 1</clr-stack-content>
  </clr-stack-block>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 2</clr-stack-label>
    <clr-stack-content>Content 2</clr-stack-content>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 1</clr-stack-label>
      <clr-stack-content>Sub-content 1</clr-stack-content>
    </clr-stack-block>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 2</clr-stack-label>
      <clr-stack-content>Sub-content 2</clr-stack-content>
    </clr-stack-block>
    <clr-stack-block [clrStackViewLevel]="2">
      <clr-stack-label>Sub-label 3</clr-stack-label>
      <clr-stack-content>Sub-content 3</clr-stack-content>
    </clr-stack-block>
  </clr-stack-block>

  <clr-stack-block [clrStackViewLevel]="1">
    <clr-stack-label>Label 3</clr-stack-label>
    <clr-stack-content>Content 3</clr-stack-content>
    <clr-stack-block>
      <clr-stack-label>Sub-label 4</clr-stack-label>
      <clr-stack-content>Sub-content 4</clr-stack-content>
    </clr-stack-block>
    <clr-stack-block>
      <clr-stack-label>Sub-label 5</clr-stack-label>
      <clr-stack-content>Sub-content 5</clr-stack-content>
    </clr-stack-block>
  </clr-stack-block>
</clr-stack-view>
`;

@Component({
  selector: 'clr-stack-view-angular-basic-demo',
  templateUrl: './stack-view-angular-basic.html',
  styleUrl: './stack-view.demo.scss',
  imports: [ClrStackViewModule, RemoveStackViewHeadingsDirective, StackblitzExampleComponent],
})
export class StackViewAngularBasicDemo extends StackViewNgDemo {
  example = EXAMPLE;
}
