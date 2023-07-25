/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxModule, ClrInputModule, ClrPasswordModule, ClrSelectModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div class="login-wrapper">
        <div class="login">
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
            <label class="clr-sr-only">Username</label>
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
            <label class="clr-sr-only">Password</label>
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
  [ClrInputModule, ClrSelectModule, ClrCheckboxModule, ClrPasswordModule],
  defaultStory,
  defaultParameters,
  variants
);
