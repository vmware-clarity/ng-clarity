/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { STACK_VIEW_EXAMPLES } from '@clr/examples/stack-view';

import { RemoveStackViewHeadingsDirective } from './remove-stack-view-headings.directive';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-stack-view-angular-modal-edit-demo',
  templateUrl: './stack-view-angular-modal-edit.html',
  imports: [DocExampleComponent, RemoveStackViewHeadingsDirective],
})
export class StackViewAngularModalEditDemo {
  readonly examples = STACK_VIEW_EXAMPLES;
}
