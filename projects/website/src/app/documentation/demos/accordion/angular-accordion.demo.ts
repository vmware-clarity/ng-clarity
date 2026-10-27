/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ACCORDION_EXAMPLES } from '@clr/examples/accordion';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-angular-accordion-demo',
  templateUrl: './angular-accordion.demo.html',
  imports: [DocExampleComponent],
})
export class AngularAccordionDemo {
  readonly examples = ACCORDION_EXAMPLES;
}
