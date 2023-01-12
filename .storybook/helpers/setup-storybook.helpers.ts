/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Parameters } from '@storybook/addons';
import { moduleMetadata, storiesOf, Story } from '@storybook/angular';

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
          FormsModule,
          ReactiveFormsModule,
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
      .map((variant, variantIndex) => {
        const story = defaultStory({ ...args, ...variant }, context);

        return Object.entries(variant).reduce(
          (template, [key, value]) => wrapTemplate(template, { key, value, variantIndex }),
          story.template
        );
      })
      .join('<br />'),
    props: { ...args },
  });
}

function wrapTemplate(
  template: string,
  { key, value, variantIndex }: { key: string; value: any; variantIndex: number }
) {
  const templateName = `${key}Template${variantIndex}`;
  const expression = typeof value === 'string' ? `'${value}'` : JSON.stringify(value);

  return `
    <ng-container *ngIf="${expression}; then ${templateName}; else ${templateName}"></ng-container>

    <ng-template #${templateName} let-${key}>
      ${template}
    </ng-template>
  `;
}
