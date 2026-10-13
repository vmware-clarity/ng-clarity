/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgComponentOutlet } from '@angular/common';
import { Example } from '@clr/examples';
import { Meta, moduleMetadata } from '@storybook/angular';

/**
 * Stories generated from projects/examples (see scripts/generate-examples.js) render the shared example components
 * as they are, so they have no args, controls or actions. Each story names its example in `parameters.example`.
 */
export type ExampleArgs = Record<string, never>;

export const exampleStoriesDecorators: Meta<ExampleArgs>['decorators'] = [
  moduleMetadata({ imports: [NgComponentOutlet] }),
];

export const exampleStoriesParameters: Meta<ExampleArgs>['parameters'] = {
  actions: { disable: true },
  controls: { disable: true },
};

export const renderExample: Meta<ExampleArgs>['render'] = (_args, { parameters }) => ({
  props: { component: (parameters['example'] as Example).component },
  template: '<ng-container *ngComponentOutlet="component"></ng-container>',
});
