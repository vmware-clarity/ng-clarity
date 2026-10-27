/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { TABS_EXAMPLES } from '@clr/examples/tabs';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-tabs-vertical-demo-static',
  templateUrl: './tabs-static-vertical.demo.html',
  imports: [DocExampleComponent],
})
export class TabsStaticVerticalDemo {
  readonly examples = TABS_EXAMPLES;
}
