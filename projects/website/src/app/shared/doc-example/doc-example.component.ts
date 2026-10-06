/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, input } from '@angular/core';
import { Example } from '@clr/examples';

import { StackblitzExampleComponent } from '../stackblitz-example/stackblitz-example.component';

/**
 * Renders a shared example from projects/examples followed by its code, so that the code shown and opened in
 * StackBlitz is always the code that renders the example.
 */
@Component({
  selector: 'app-doc-example',
  template: `
    <ng-container *ngComponentOutlet="example().component"></ng-container>
    <app-stackblitz-example
      [name]="example().title"
      [componentTemplate]="example().source.html"
      [componentClass]="example().source.ts"
      [showComponentClass]="example().source.hasLogic"
      [componentStyles]="example().source.scss"
      [showComponentStyles]="example().showStyles"
    ></app-stackblitz-example>
  `,
  imports: [NgComponentOutlet, StackblitzExampleComponent],
})
export class DocExampleComponent {
  readonly example = input.required<Example>();
}
