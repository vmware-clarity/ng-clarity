/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { moduleMetadata, storiesOf } from '@storybook/angular';
import { StoryName, Parameters, StoryFn } from '@storybook/addons';
import { NgLetModule } from 'ng-let';
import { NgModuleMetadata, StoryFnAngularReturnType } from '@storybook/angular/dist/ts3.9/client/preview/types';
import { CommonModule } from '@angular/common';

export interface StoryWrapper {
  storyName: StoryName;
  storyFn: StoryFn<StoryFnAngularReturnType>;
  parameters?: Parameters;
}

export function setupStorybook(
  name: string,
  defaultParameters: Parameters,
  stories: { [key: string]: StoryWrapper[] },
  metadata: Partial<NgModuleMetadata> = {}
) {
  Object.keys(stories).forEach(key => {
    const kind = key ? `${name}/${key}` : name;
    const storyApi = storiesOf(kind, module)
      .addParameters(defaultParameters)
      .addDecorator(
        moduleMetadata({
          imports: [NgLetModule, CommonModule, ...(metadata.imports || [])],
          declarations: metadata.declarations || [],
          providers: metadata.providers || [],
        })
      );
    stories[key].forEach(story => storyApi.add(story.storyName, story.storyFn, story.parameters));

    if (kind === name) {
      const allStories = flattenArray(Object.keys(stories).map(key => stories[key]));

      storyApi.add('All', combineStories(allStories), {
        a11y: { disable: true },
        actions: { disable: true },
        controls: { disable: true },
        previewTabs: { 'storybook/docs/panel': { hidden: true } },
      });
    }
  });
}

function combineStories(stories: StoryWrapper[]) {
  return args => ({
    template: stories
      .map(story => {
        const args = story.parameters?.args || {};
        const containers = Object.keys(args).map(
          key => `<ng-container *ngLet="${typeof args[key] === 'string' ? `'${args[key]}'` : args[key]}; let ${key}">`
        );
        const prefix = containers.join('');
        const suffix = containers.map(() => '</ng-container>').join('');
        return `${prefix}${story.storyFn({} as any, {} as any).template}${suffix}`;
      })
      .join('<br>'),
    props: { ...args },
  });
}

function flattenArray<T>(arr: T[][]): T[] {
  return [].concat(...arr);
}
