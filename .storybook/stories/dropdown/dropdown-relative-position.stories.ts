/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDropdown, ClrDropdownModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

/** The story renders `<clr-dropdown>` with a fixed template and declares no args of its own. */
type DropdownRelativePositionArgs = ClrDropdown;

const meta: Meta<DropdownRelativePositionArgs> = {
  title: 'Dropdown/Dropdown Relative Position',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDropdownModule],
    }),
  ],
  component: ClrDropdown,
  render: args => ({
    template: `
      <div class="content-area" style="position: relative">
        <div style="margin-top: 400px"></div>
        <clr-dropdown>
          <button class="btn btn-outline-primary" clrDropdownTrigger>
            Dropdown
            <cds-icon shape="angle" direction="down"></cds-icon>
          </button>
          <clr-dropdown-menu clrPosition="bottom-left" *clrIfOpen>
            <label class="dropdown-header" aria-hidden="true">Dropdown header</label>
            <div aria-label="Dropdown header Action 1" clrDropdownItem>Action 1</div>
            <div aria-label="Dropdown header Disabled Action" [clrDisabled]="true" clrDropdownItem>Disabled Action</div>
            <div class="dropdown-divider" role="separator" aria-hidden="true"></div>
            <clr-dropdown>
              <button clrDropdownTrigger>Link 1</button>
              <clr-dropdown-menu>
                <button clrDropdownItem>Foo</button>
                <clr-dropdown>
                  <button clrDropdownTrigger>Bar</button>
                  <clr-dropdown-menu clrPosition="left-top">
                    <button clrDropdownItem>Baz</button>
                  </clr-dropdown-menu>
                </clr-dropdown>
              </clr-dropdown-menu>
            </clr-dropdown>
            <div clrDropdownItem>Link 2</div>
          </clr-dropdown-menu>
        </clr-dropdown>
        <div style="margin-top: 800px"></div>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<DropdownRelativePositionArgs>;

export const DropdownRelativePostion: Story = {};
