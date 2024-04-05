/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Story } from '@storybook/angular';

const modifierClasses = ['', 'badge-info', 'badge-success', 'badge-warning', 'badge-danger'];

export default {
  title: 'Badge/Badge',
  argTypes: {
    // story helpers
    modifierClasses: {
      description: `Class can be none, \`badge-info\`, \`badge-success\`, \`badge-warning\`, or \`badge-danger\``,
      table: false,
      control: false,
    },
  },
  args: {
    // story helpers
    context: '42',
    modifierClasses,
  },
};
export const Initial: Story = args => ({
  template: `
    <div style="margin-top: 5px" *ngFor="let status of modifierClasses">
      <span class="badge" [ngClass]="status">{{ context }}</span>
      <a href="#" class="badge" [ngClass]="status">{{ context }}</a>
    </div>
  `,
  props: args,
});
