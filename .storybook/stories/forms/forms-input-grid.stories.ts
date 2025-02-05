/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Forms/Input Grid',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
};

const inputGridStory: StoryFn = args => ({
  template: `
    <clr-input-container>
      <label class="clr-col-2">My name</label>
      <input class="clr-col-10" clrInput />
    </clr-input-container>
    <clr-input-container>
      <label class="clr-col-2">Short Input</label>
      <input class="clr-col-3" clrInput />
    </clr-input-container>
  `,
  props: args,
});

export const InputGrid: StoryObj = {
  render: inputGridStory,
};
