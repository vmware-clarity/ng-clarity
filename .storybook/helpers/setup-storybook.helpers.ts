/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Parameters } from '@storybook/addons';
import { moduleMetadata, storiesOf, Story } from '@storybook/angular';
import { NgLetModule } from 'ng-let';

export function setupStorybook(
  ngModules: Type<any> | Type<any>[],
  defaultStory: Story,
  defaultParameters: Parameters,
  variants: Parameters[]
) {
  const storyApi = storiesOf(defaultParameters.title, module)
    .addParameters(defaultParameters)
    .addDecorator(
      moduleMetadata({
        imports: [
          CommonModule,
          BrowserAnimationsModule,
          ReactiveFormsModule,
          NgLetModule,
          ...(Array.isArray(ngModules) ? ngModules : [ngModules]),
        ],
      })
    );

  storyApi.add('Default', defaultStory, defaultParameters);

  storyApi.add('Variants', variants.length ? combineStories(defaultStory, variants) : defaultStory, {
    a11y: { disable: true },
    actions: { disable: true },
    controls: { disable: true },
    previewTabs: { 'storybook/docs/panel': { hidden: true } },
    chromatic: { disableSnapshot: false },
  });
}

function combineStories(defaultStory: Story, variants: Parameters[]): Story {
  return (args, context) => ({
    template: variants
      .map(variant => {
        const containers = Object.entries(variant).map(([key, value]) => `<ng-container ${ngLet({ key, value })}>`);
        const prefix = containers.join('');
        const suffix = containers.map(() => '</ng-container>').join('');

        const story = defaultStory({ ...args, ...variant }, context);
        const template = story.template;

        return `${prefix}${template}${suffix}`;
      })
      .join('<br />'),
    props: { ...args },
  });
}

function ngLet({ key, value }: { key: string; value: any }) {
  return `*ngLet="${typeof value === 'string' ? `'${value}'` : JSON.stringify(value)}; let ${key}"`;
}
