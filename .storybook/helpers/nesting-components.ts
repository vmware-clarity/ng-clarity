/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface Component {
  name: string;
  template: string;
}

export const nestingComponents: Component[] = [
  {
    name: 'accordion',
    template: `
<clr-accordion>
  <clr-accordion-panel [clrAccordionPanelOpen]="true">
    <clr-accordion-title>Nested Title</clr-accordion-title>
    <clr-accordion-content>Nested content</clr-accordion-content>
  </clr-accordion-panel>
</clr-accordion>`,
  },
  {
    name: 'alert',
    template: `<clr-alert><clr-alert-item><span class="alert-text">Alert text</span></clr-alert-item></clr-alert>`,
  },
  {
    name: 'badge',
    template: `<span class="badge badge-info">2</span><br/>`,
  },
  {
    name: 'button',
    template: `<button class="btn">Default</button><br/>`,
  },
  {
    name: 'button-group',
    template: `
<clr-button-group>
  <clr-button><cds-icon shape="home"></cds-icon>Button 1</clr-button>
  <clr-button><cds-icon shape="home"></cds-icon>Button 2</clr-button>
</clr-button-group>`,
  },
];
