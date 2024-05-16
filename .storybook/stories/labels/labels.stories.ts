/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrLabels, ClrLabelsModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

const LABEL_COLOR_TYPES = ['', 'label-purple', 'label-blue', 'label-orange', 'label-light-blue'];

const LABEL_STATUS_TYPES = ['label-info', 'label-success', 'label-warning', 'label-danger'];

export default {
  title: 'Labels/Labels',
  component: ClrLabels,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLabelsModule],
    }),
  ],
  argTypes: {
    labelType: { control: 'radio', options: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES] },
    LABEL_COLOR_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    LABEL_STATUS_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    clrLabelsClosedChange: { control: { disable: true } },
  },
  args: {
    content: 'Hello World!',
    badgeContent: '',
    labelType: '',
    clickable: false,
    closeIcon: false,
    LABEL_COLOR_TYPES,
    LABEL_STATUS_TYPES,
    clrLabelsClosedChange: action('clrLabelsClosedChange'),
  },
};
const LabelsTemplate: StoryFn = args => ({
  template: `
    <clr-labels
      [content]="content"
      [badgeContent]="badgeContent"
      [labelType]="labelType"
      [clickable]="true"
      [closeIcon]="closeIcon"
    ></clr-labels>
  `,
  props: args,
});

const LabelsAllTemplate: StoryFn = args => ({
  template: `
    <h6>Default Label</h6>
    <div style="margin-top: 5px">
      <clr-labels
        [content]="content"
        [badgeContent]="badgeContent"
        [labelType]="labelType"
        [clickable]="clickable"
        [closeIcon]="closeIcon"
      ></clr-labels>
    </div>

    <h6>Color Options</h6>
    <div style="margin-top: 5px">
      <clr-labels
        *ngFor="let labelType of LABEL_TYPES"
        [content]="content"
        [badgeContent]="badgeContent"
        [labelType]="labelType"
        [clickable]="clickable"
        [closeIcon]="closeIcon"
      ></clr-labels>
    </div>
    <h6>Clickable Labels</h6>
    <div style="margin-top: 5px">
      <a href="...">
        <clr-labels
          *ngFor="let labelType of LABEL_COLOR_TYPES"
          [content]="content"
          [badgeContent]="badgeContent"
          [labelType]="labelType"
          [clickable]="true"
          [closeIcon]="closeIcon"
        ></clr-labels>
      </a>
    </div>
    <h6>Status Labels</h6>
    <div style="margin-top: 5px">
      <clr-labels
        *ngFor="let type of LABEL_STATUS_TYPES"
        [content]="content"
        [badgeContent]="badgeContent"
        [labelType]="type"
        [clickable]="clickable"
        [closeIcon]="closeIcon"
      ></clr-labels>
    </div>
    <h6>Labels with Badges</h6>
    <div style="margin-top: 5px">
      <clr-labels
        *ngFor="let labelType of LABEL_TYPES"
        [content]="content"
        [badgeContent]="1"
        [labelType]="labelType"
        [clickable]="clickable"
        [closeIcon]="closeIcon"
      ></clr-labels>
    </div>
    <h6>Labels with Close Icon</h6>
    <div style="margin-top: 5px">
      <clr-labels
        *ngFor="let labelType of LABEL_TYPES"
        [content]="content"
        [badgeContent]="badgeContent"
        [labelType]="labelType"
        [clickable]="true"
        [closeIcon]="true"
        (clrLabelsClosedChange)="clrLabelsClosedChange($event)"
      ></clr-labels>
    </div>
  `,
  props: args,
});

export const Labels: StoryObj = {
  render: LabelsTemplate,
};
export const Showcase: StoryObj = {
  render: LabelsAllTemplate,
  args: {
    ...LabelsTemplate.args,
    LABEL_TYPES: [...LABEL_COLOR_TYPES, ...LABEL_STATUS_TYPES],
  },
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
