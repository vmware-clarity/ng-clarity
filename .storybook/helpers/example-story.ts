/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Example } from '@clr/examples';
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';

/**
 * Stories generated from projects/examples (see scripts/generate-examples.js) render the shared example components
 * as they are, so they have no controls or actions. The title stays in each stories file, where Storybook reads it.
 */
export const exampleStoriesDecorators: Meta['decorators'] = [moduleMetadata({ imports: [NgComponentOutlet] })];

export const exampleStoriesParameters: Meta['parameters'] = {
  actions: { disable: true },
  controls: { disable: true },
};

export function exampleStory(example: Example): StoryObj {
  return {
    render: () => ({
      props: { component: example.component },
      template: '<ng-container *ngComponentOutlet="component"></ng-container>',
    }),
  };
}
