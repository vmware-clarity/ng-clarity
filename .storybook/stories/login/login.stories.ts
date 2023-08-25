/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxModule, ClrDropdownModule, ClrInputModule, ClrPasswordModule, ClrSelectModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div class="login-wrapper">
        <div class="login">
          <div class="login-header">
              <div class="actions">
                <clr-dropdown [clrCloseMenuOnItemClick]="clrCloseMenuOnItemClick">
                  <button class="btn btn-link btn-sm" clrDropdownTrigger>
                    Language
                    <cds-icon shape="angle" direction="down"></cds-icon>
                  </button>
                  <clr-dropdown-menu>
                    <div aria-label="Language 1" clrDropdownItem>Language 1</div>
                    <div aria-label="Language 2" clrDropdownItem>Language 2</div>
                    <div aria-label="Language 3" clrDropdownItem>Language 3</div>
                  </clr-dropdown-menu>
                </clr-dropdown>
              </div>
          </div>
          <div class="login-body">
            <section class="title">
                <h3 class="welcome">Welcome to</h3>
                Company Product Name
                <h5 class="hint">Use your Company ID to sign in or create one now</h5>
            </section>
            <form class="login-group">
                <clr-select-container>
                    <label>User Role</label>
                    <select clrSelect name="type" [(ngModel)]="type">
                        <option value="local">Local Users</option>
                        <option value="admin">Administrator</option>
                    </select>
                </clr-select-container>
                <clr-input-container>
                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    autocomplete="username"
                    clrInput
                    placeholder="Username"
                    [(ngModel)]="username"
                />
                </clr-input-container>
                <clr-password-container>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    autocomplete="current-password"
                    clrPassword
                    placeholder="Password"
                    [(ngModel)]="password"
                />
                </clr-password-container>
                <clr-checkbox-wrapper>
                <label>Remember me</label>
                <input type="checkbox" name="rememberMe" clrCheckbox [(ngModel)]="rememberMe" />
                </clr-checkbox-wrapper>

                <div class="error active">Invalid user name or password</div>
                <button type="submit" class="btn btn-primary">NEXT</button>
                <a href="javascript://" class="signup">Sign up for a Company ID</a>
            </form>
          </div>
          <div class="login-footer">
              <span class="copyright">2023 VMware, Inc.</span>
              <a href="javascript://">Terms</a>
              <a href="javascript://">Privacy</a>
              <a href="javascript://">California Privacy Rights</a>
          </div>
        </div>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Login/Login',
  argTypes: {},
  args: {
    type: 'local',
    username: '',
    password: '',
    rememberMe: false,
  },
};

const variants: Parameters[] = [];

setupStorybook(
  [ClrInputModule, ClrSelectModule, ClrCheckboxModule, ClrPasswordModule, ClrDropdownModule],
  defaultStory,
  defaultParameters,
  variants
);
