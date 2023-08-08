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
  <div class="dropdown open">
    <button class="dropdown-toggle btn btn-primary" type="button">
      Dropdown
      <cds-icon shape="angle" direction="down"></cds-icon>
    </button>
    <div class="dropdown-menu">
      <h4 class="dropdown-header" aria-hidden="true">Dropdown header</h4>
      <div aria-label="Dropdown header Action" class="dropdown-item active">Action</div>
      <div aria-label="Dropdown header Disabled Link" class="dropdown-item disabled">Disabled Link</div>
      <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
      <button class="dropdown-item">Lorem</button>
      <div class="dropdown open right-bottom">
        <button class="dropdown-item active expandable">Lorem ipsum</button>
        <div class="dropdown-menu">
          <button class="dropdown-item">Foo.</button>
          <div class="dropdown open right-top">
            <button class="dropdown-item active expandable">Bar</button>
            <div class="dropdown-menu">
              <div class="dropdown-item">Baz</div>
            </div>
          </div>
          <div class="dropdown-item">Foo 2</div>
        </div>
      </div>
      <div class="dropdown-item">Ipsum</div>
    </div>
  </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Dropdown/Dropdown Static',
  component: ClrDropdown,
};

const variants: Parameters[] = [];

setupStorybook(ClrDropdownModule, defaultStory, defaultParameters, variants);
