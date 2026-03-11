/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<button type="button" class="btn btn-icon" aria-label="home">
  <clr-icon shape="home"></clr-icon>
</button>
<button type="button" class="btn btn-icon btn-primary" aria-label="settings">
  <clr-icon shape="cog"></clr-icon>
</button>
<button type="button" class="btn btn-icon btn-warning" aria-label="warning">
  <clr-icon shape="warning-standard"></clr-icon>
</button>
<button type="button" class="btn btn-icon btn-danger" aria-label="error">
  <clr-icon shape="error-standard"></clr-icon>
</button>
<button type="button" class="btn btn-icon btn-success" aria-label="done">
  <clr-icon shape="check"></clr-icon>
</button>
<button type="button" class="btn btn-icon" disabled aria-label="home">
  <clr-icon shape="home"></clr-icon>
</button>
`;

@Component({
  selector: 'cds-icon-buttons-demo',
  templateUrl: './icon-buttons.html',
  styleUrl: './buttons.demo.scss',
  imports: [ClrIcon, ClrIconModule, StackblitzExampleComponent],
})
export class IconButtonsDemo {
  htmlExample = HTML_EXAMPLE;
}
