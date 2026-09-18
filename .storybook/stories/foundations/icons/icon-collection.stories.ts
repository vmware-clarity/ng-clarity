/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

import { IconCollectionStorybookComponent } from './icon.storybook.component';

/**
 * Each story differed only in the collection name baked into its template, so the name is the one arg and
 * `collectionTemplate` still produces the same markup each story rendered before.
 */
type IconCollectionArgs = {
  collectionName: string;
};

function collectionTemplate(collectionName: string) {
  return `
    <storybook-icon-collection [collectionName]="'${collectionName}'"></storybook-icon-collection>
  `;
}

const meta: Meta<IconCollectionArgs> = {
  title: 'Foundations/Icons/Icon Collection',
  decorators: [
    moduleMetadata({
      imports: [IconCollectionStorybookComponent, ...CommonModules, ClrIcon],
    }),
  ],
  render: args => ({ template: collectionTemplate(args.collectionName) }),
};

export default meta;

type Story = StoryObj<IconCollectionArgs>;

export const Core: Story = {
  args: { collectionName: 'core' },
};

export const Essential: Story = {
  args: { collectionName: 'essential' },
};

export const Chart: Story = {
  args: { collectionName: 'chart' },
};

export const Commerce: Story = {
  args: { collectionName: 'commerce' },
};

export const Media: Story = {
  args: { collectionName: 'media' },
};

export const Mini: Story = {
  args: { collectionName: 'mini' },
};

export const Social: Story = {
  args: { collectionName: 'social' },
};

export const Technology: Story = {
  args: { collectionName: 'technology' },
};

export const TextEdit: Story = {
  args: { collectionName: 'text-edit' },
};

export const Travel: Story = {
  args: { collectionName: 'travel' },
};
