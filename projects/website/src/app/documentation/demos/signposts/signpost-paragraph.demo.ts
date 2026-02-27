/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrSignpostModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { SignpostDemo } from './signpost.demo';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const code = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrSignpostModule],
})
export class ExampleComponent {
  // Use *clrIfOpen directive to manage hide/show with the openState property.
  public openState: boolean = false;
}
`;

const html = `
<p>
  Signposts should be used when you want to show a small amount of contextual help of information
  without taking the user out of the current context. Use sparingly as a supplemental element and not as
  a primary method of adding detail.
  <clr-signpost>
    <clr-signpost-content *clrIfOpen="openState">
      <h3 style="margin-top: 0">Inline signpost</h3>
      <p>
        Position:
        <code cds-text="code">right-middle</code>
      </p>
    </clr-signpost-content>
  </clr-signpost>
</p>
`;

@Component({
  selector: 'clr-signpost-paragraph-demo',
  templateUrl: './signpost-paragraph.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrSignpostModule,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
    SignpostDemo,
  ],
})
export class SignpostParagraphDemo {
  openState = false;

  code = code;
  html = html;
}
