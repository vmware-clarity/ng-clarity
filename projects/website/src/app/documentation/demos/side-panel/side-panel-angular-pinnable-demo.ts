/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { SIDE_PANEL_EXAMPLES } from '@clr/examples/side-panel';

import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';

@Component({
  selector: 'clr-side-panel-angular-pinnable-demo',
  templateUrl: './side-panel-angular-pinnable-demo.html',
  imports: [NgComponentOutlet, DocExampleComponent],
})
export class SidePanelAngularPinnableDemo {
  readonly showCode = input(true);
  readonly examples = SIDE_PANEL_EXAMPLES;
}
