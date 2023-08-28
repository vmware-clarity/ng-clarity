/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrButton } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <h6>Default Button</h6>
    <button class="btn">Default</button>
    
    <h6>Primary Buttons</h6>
    <button class="btn btn-primary">Primary</button>
    <button class="btn btn-secondary">Secondary</button>
    <button class="btn btn-warning">Warning</button>
    <button class="btn btn-danger">Danger</button>
    <button class="btn btn-success">Success</button>
    
    <h6>Old Outline Buttons</h6>
    <button class="btn btn-primary-outline">Primary</button>
    <button class="btn btn-secondary-outline">Secondary</button>
    <button class="btn btn-warning-outline">Warning</button>
    <button class="btn btn-danger-outline">Danger</button>
    <button class="btn btn-success-outline">Success</button>
    
    <h6>New Outline Buttons</h6>
    <button class="btn btn-outline-primary">Primary</button>
    <button class="btn btn-outline-secondary">Secondary</button>
    <button class="btn btn-outline-warning">Warning</button>
    <button class="btn btn-outline-danger">Danger</button>
    <button class="btn btn-outline-success">Success</button>
    
    <h6>Link Buttons</h6>
    <button class="btn btn-link">Link Button</button>
    
    <h6>Inverse Buttons</h6>
    <div style="background: #313131; padding: 24px">
      <button class="btn btn-inverse">Inverse</button>
    </div>
    
    <h6>Block Buttons</h6>
    <button href="javascript://" class="btn btn-block">
      <cds-icon shape="user"></cds-icon>
      Block Button
      <cds-icon shape="home"></cds-icon>
    </button>
    
    <h6>Small Primary Buttons</h6>
    <button class="btn btn-sm btn-primary">Primary</button>
    <button class="btn btn-sm btn-secondary">Secondary</button>
    <button class="btn btn-sm btn-warning">Warning</button>
    <button class="btn btn-sm btn-danger">Danger</button>
    <button class="btn btn-sm btn-success">Success</button>
    
    <h6>Small Outline Buttons</h6>
    <button class="btn btn-sm btn-primary-outline">Primary</button>
    <button class="btn btn-sm btn-secondary-outline">Secondary</button>
    <button class="btn btn-sm btn-warning-outline">Warning</button>
    <button class="btn btn-sm btn-danger-outline">Danger</button>
    <button class="btn btn-sm btn-success-outline">Success</button>
    
    <!--Links-->
    
    <h6>Default Link</h6>
    <a href="javascript://" class="btn">Default</a>
    
    <h6>Primary Links</h6>
    <a href="javascript://" class="btn btn-primary">Primary</a>
    <a href="javascript://" class="btn btn-secondary">Secondary</a>
    <a href="javascript://" class="btn btn-warning">Warning</a>
    <a href="javascript://" class="btn btn-danger">Danger</a>
    <a href="javascript://" class="btn btn-success">Success</a>
    
    <h6>Old Outline Links</h6>
    <a href="javascript://" class="btn btn-primary-outline">Primary</a>
    <a href="javascript://" class="btn btn-secondary-outline">Secondary</a>
    <a href="javascript://" class="btn btn-warning-outline">Warning</a>
    <a href="javascript://" class="btn btn-danger-outline">Danger</a>
    <a href="javascript://" class="btn btn-success-outline">Success</a>
    
    <h6>New Outline Links</h6>
    <a href="javascript://" class="btn btn-outline-primary">Primary</a>
    <a href="javascript://" class="btn btn-outline-secondary">Secondary</a>
    <a href="javascript://" class="btn btn-outline-warning">Warning</a>
    <a href="javascript://" class="btn btn-outline-danger">Danger</a>
    <a href="javascript://" class="btn btn-outline-success">Success</a>
    
    <h6>Flat Links</h6>
    <a href="javascript://" class="btn btn-link">Link</a>
    <a href="javascript://" class="btn btn-link btn-sm">
      <cds-icon shape="user"></cds-icon>
      Link
      <cds-icon shape="home"></cds-icon>
    </a>
    
    <h6>Flat Buttons</h6>
    <button href="javascript://" class="btn btn-link">Flat</button>
    <button href="javascript://" class="btn btn-link btn-sm">
      <cds-icon shape="user"></cds-icon>
      Flat
      <cds-icon shape="home"></cds-icon>
    </button>
    
    <h6>Inverse Links</h6>
    <div style="background: #313131; padding: 24px">
      <a href="javascript://" class="btn btn-inverse">Inverse</a>
    </div>
    
    <h6>Block Links</h6>
    <a href="javascript://" class="btn btn-block">Block</a>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Button/Buttons All',
  component: ClrButton,
  argTypes: {
    // inputs
    class: { control: { disable: true } },
    clrInMenu: { control: { disable: true }, table: { disable: true } },
    // outputs
    click: { control: { disable: true } },
    // methods
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
  },
  args: {},
};

const variants: Parameters[] = [];

setupStorybook([], defaultStory, defaultParameters, variants);
