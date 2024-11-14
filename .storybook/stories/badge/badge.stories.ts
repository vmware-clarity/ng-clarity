/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryFn } from '@storybook/angular';

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
export const Initial: StoryFn = args => ({
  template: `
    <div style="margin-top: 5px" *ngFor="let status of modifierClasses">
      <span class="badge" [ngClass]="status">{{ context }}</span>
      <a href="#" class="badge" [ngClass]="status">{{ context }}</a>
    </div>
  `,
  props: args,
});
