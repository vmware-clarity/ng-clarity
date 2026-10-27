/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { WIZARD_EXAMPLES } from '@clr/examples/wizard';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-wizard-jump-to',
  templateUrl: './wizard-jump-to.demo.html',
  imports: [DocExampleComponent],
})
export class WizardJumpToDemo {
  readonly examples = WIZARD_EXAMPLES;
}
