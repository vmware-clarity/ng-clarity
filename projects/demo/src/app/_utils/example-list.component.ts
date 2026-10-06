/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Example } from '@clr/examples';

/**
 * Renders the shared examples from projects/examples that target the demo app.
 * Pass them in the route data: `{ path: 'examples', component: ExampleListComponent, data: { examples } }`.
 */
@Component({
  selector: 'clr-example-list',
  template: `
    @for (example of examples; track example.id) {
      <h4>{{ example.title }}</h4>
      <ng-container *ngComponentOutlet="example.component"></ng-container>
    }
  `,
  imports: [NgComponentOutlet],
})
export class ExampleListComponent {
  protected readonly examples = Object.values<Example>(inject(ActivatedRoute).snapshot.data['examples']).filter(
    example => example.targets.includes('demo')
  );
}
