/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCustomPopoverModule } from '@clr/angular';
import { moduleMetadata, Story } from '@storybook/angular';

import { ClrCustomPopover } from '../../../projects/angular/src/utils/custom-popover/custom-popover';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Custom Popover/Example',
  component: ClrCustomPopover,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCustomPopoverModule],
    }),
  ],
  argTypes: {
    // inputs
  },
  args: {},
};

const template = `
<div>
    <button class="btn btn-info-outline" type="button" #trigger (click)="open = !open">Trigger Button</button><br>

    <clr-custom-popover [(open)]="open" [anchorElement]="trigger" [hasBackdrop]="true">
      <div>
        1 + 2 + 3
      </div>
    </clr-custom-popover>
<button class="btn btn-info-outline">Other Button</button>
<button class="btn btn-info-outline">Other Button</button>

    </div>
  `;

export const Initial: Story = args => ({
  template,
  props: args,
});
