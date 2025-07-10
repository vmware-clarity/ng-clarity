/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIconModule } from '@clr/angular';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

@Component({
  selector: 'storybook-icon-size',
  template: `
    <h5>XS</h5>
    <cds-icon
      shape="home"
      size="xs"
      role="img"
      aria-label="This is an example of an icon using a pre-defined extra small size"
    ></cds-icon>
    <h5>SM</h5>
    <cds-icon
      shape="home"
      size="sm"
      role="img"
      aria-label="This is an example of an icon using a pre-defined small size"
    ></cds-icon>
    <h5>MD</h5>
    <cds-icon
      shape="home"
      size="md"
      role="img"
      aria-label="This is an example of an icon using a pre-defined medium size"
    ></cds-icon>
    <h5>LG</h5>
    <cds-icon
      shape="home"
      size="lg"
      role="img"
      aria-label="This is an example of an icon using a pre-defined large size"
    ></cds-icon>
    <h5>XL</h5>
    <cds-icon
      shape="home"
      size="xl"
      role="img"
      aria-label="This is an example of an icon using a pre-defined extra large size"
    ></cds-icon>
    <h5>XXL</h5>
    <cds-icon
      shape="home"
      size="xxl"
      role="img"
      aria-label="This is an example of an icon using a pre-defined extra extra large size"
    ></cds-icon>
    <h5>3XL</h5>
    <cds-icon
      shape="home"
      size="3xl"
      role="img"
      aria-label="This is an example of an icon using a pre-defined extra extra large size"
    ></cds-icon>
    <h5>4XL</h5>
    <cds-icon
      shape="home"
      size="4xl"
      role="img"
      aria-label="This is an example of an icon using a pre-defined extra extra large size"
    ></cds-icon>
  `,
  styles: [
    `
      h5 {
        margin-top: 0;
      }
    `,
  ],
  standalone: true,
  imports: [ClrIconModule],
})
export class IconSizeStorybookComponent {}

export default {
  title: 'Layout/Spacing',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  component: IconSizeStorybookComponent,
  argTypes: {},
  args: {},
};

export const CDS_Icon: StoryObj = {};
