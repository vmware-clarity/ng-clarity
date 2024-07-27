/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Dropdown/Dropdown Static',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdown,
};

const DropdownStaticTemplate: StoryFn = args => ({
  template: `
    <div style="margin-bottom: 200px; text-align: center">
      <div class="dropdown open">
        <button class="dropdown-toggle btn btn-primary" type="button">
          Dropdown
          <cds-icon shape="angle" direction="down"></cds-icon>
        </button>
        <div class="dropdown-menu" role="menu">
          <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
          <div aria-label="Dropdown header Action" class="dropdown-item active" role="menuitem">Action</div>
          <div
            aria-label="Dropdown header Disabled Link"
            class="dropdown-item disabled"
            role="menuitem"
            aria-disabled="true"
          >
            Disabled Link
          </div>
          <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
          <button class="dropdown-item" role="menuitem">Lorem</button>
          <div class="dropdown open right-bottom">
            <button class="dropdown-item active expandable" role="menuitem" aria-expanded="true" aria-haspopup="menu">
              Lorem ipsum
            </button>
            <div class="dropdown-menu" role="menu">
              <button class="dropdown-item" role="menuitem">Foo.</button>
              <div class="dropdown open right-top">
                <button class="dropdown-item active expandable" role="menuitem" aria-expanded="true" aria-haspopup="menu">
                  Bar
                </button>
                <div class="dropdown-menu" role="menu">
                  <div class="dropdown-item" role="menuitem">Baz</div>
                </div>
              </div>
              <div class="dropdown-item" role="menuitem">Foo 2</div>
            </div>
          </div>
          <div class="dropdown-item" role="menuitem">Ipsum</div>
        </div>
      </div>
    </div>
  `,
  props: args,
});

export const DropdownStatic: StoryObj = {
  render: DropdownStaticTemplate,
};
