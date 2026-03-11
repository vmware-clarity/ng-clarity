/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAccordionModule, ClrDatagridModule, ClrIfExpanded } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const example = `
<clr-accordion>
  <clr-accordion-panel>
    <clr-accordion-title>Item 1</clr-accordion-title>
    <clr-accordion-content *clrIfExpanded>Content 1</clr-accordion-content>
  </clr-accordion-panel>

  <clr-accordion-panel>
    <clr-accordion-title>Item 2</clr-accordion-title>
    <clr-accordion-content *clrIfExpanded>Content 2</clr-accordion-content>
  </clr-accordion-panel>

  <clr-accordion-panel>
    <clr-accordion-title>Item 3</clr-accordion-title>
    <clr-accordion-content *clrIfExpanded>Content 3</clr-accordion-content>
  </clr-accordion-panel>
</clr-accordion>
`;

@Component({
  selector: 'clr-angular-accordion-demo',
  templateUrl: './angular-accordion.demo.html',
  imports: [ClrAccordionModule, ClrDatagridModule, ClrIfExpanded, StackblitzExampleComponent],
})
export class AngularAccordionDemo {
  example = example;
}
