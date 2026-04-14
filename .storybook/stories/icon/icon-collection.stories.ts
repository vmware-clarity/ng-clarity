/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon } from '@clr/angular';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { IconCollectionStorybookComponent } from './icon.storybook.component';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Icon/Icon Collection',
  decorators: [
    moduleMetadata({
      imports: [IconCollectionStorybookComponent, ...CommonModules, ClrIcon],
    }),
  ],
};

function collectionTemplate(collectionName: string) {
  return `
    <storybook-icon-collection [collectionName]="'${collectionName}'"></storybook-icon-collection>
  `;
}

export const Core: StoryObj = {
  render: () => ({ template: collectionTemplate('core') }),
};

export const Essential: StoryObj = {
  render: () => ({ template: collectionTemplate('essential') }),
};

export const Chart: StoryObj = {
  render: () => ({ template: collectionTemplate('chart') }),
};

export const Commerce: StoryObj = {
  render: () => ({ template: collectionTemplate('commerce') }),
};

export const Media: StoryObj = {
  render: () => ({ template: collectionTemplate('media') }),
};

export const Mini: StoryObj = {
  render: () => ({ template: collectionTemplate('mini') }),
};

export const Social: StoryObj = {
  render: () => ({ template: collectionTemplate('social') }),
};

export const Technology: StoryObj = {
  render: () => ({ template: collectionTemplate('technology') }),
};

export const TextEdit: StoryObj = {
  render: () => ({ template: collectionTemplate('text-edit') }),
};

export const Travel: StoryObj = {
  render: () => ({ template: collectionTemplate('travel') }),
};
