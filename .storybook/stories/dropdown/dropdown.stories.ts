/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
      <button class="btn btn-outline-primary" clrDropdownTrigger>
        Dropdown
        <cds-icon shape="angle" direction="down"></cds-icon>
      </button>
      <clr-dropdown-menu>
        <div aria-label="Action 1" clrDropdownItem>Action 1</div>
        <div aria-label="Action 2" clrDropdownItem>Action 2</div>
        <div aria-label="Action 3" clrDropdownItem>Action 3</div>
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Dropdown/Dropdown',
  component: ClrDropdown,
};

const variants: Parameters[] = [];

setupStorybook(ClrDropdownModule, defaultStory, defaultParameters, variants);
