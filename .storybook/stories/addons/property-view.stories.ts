/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AppfxPropertyViewModule,
  PropertyViewBuilder,
  PropertyViewComponent,
  PropertyViewModel,
} from '@clr/addons/property-view';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

function buildVmData(): PropertyViewModel {
  const builder = new PropertyViewBuilder();
  builder
    .category('vm')
    .title('Virtual Machine')
    .section('general')
    .title('General')
    .property('Name', 'ubuntu-prod-01')
    .property('Power State', 'Powered On')
    .property('Guest OS', 'Ubuntu 22.04 LTS')
    .property('Memory', '16 GB')
    .property('CPU', '4 vCPU');
  return builder.build();
}

function buildMultiCategoryData(): PropertyViewModel {
  const builder = new PropertyViewBuilder();
  const hw = builder.category('hardware').title('Hardware');
  hw.section('cpu').title('CPU').property('Sockets', '2').property('Cores per socket', '4');
  hw.section('memory').title('Memory').property('Total', '32 GB').property('Reservation', '16 GB');
  builder
    .category('network')
    .title('Networking')
    .section('adapters')
    .title('Network Adapters')
    .property('Adapter 1', 'VMXNET3 — 10.0.0.42')
    .property('Adapter 2', 'VMXNET3 — 192.168.1.7');
  return builder.build();
}

export default {
  title: 'Addons/Property View',
  component: PropertyViewComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxPropertyViewModule],
    }),
  ],
  argTypes: {
    data: { control: { disable: true } },
  },
};

const PropertyViewTemplate: StoryFn = args => ({
  props: args,
  template: `
    <appfx-property-view [data]="data"></appfx-property-view>
  `,
});

export const SingleCategory: StoryObj = {
  render: PropertyViewTemplate,
  args: { data: buildVmData() },
};

export const MultipleCategories: StoryObj = {
  render: PropertyViewTemplate,
  args: { data: buildMultiCategoryData() },
};
