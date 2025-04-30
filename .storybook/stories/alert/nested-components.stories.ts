/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { RenderComponentStorybook } from 'helpers/render-component';

import { CommonModules } from '../../helpers/common';
import { BadgeStoryBookComponent } from '../badge/badge.storybook.component';
import { LabelStoryBookComponent } from '../label/label.storybook.component';

const nestedComponents = [
  { type: BadgeStoryBookComponent, options: { modifierClasses: ['badge-info'], showLinkBadge: false } },
  { type: LabelStoryBookComponent, options: { modifierClasses: ['badge-info'], showLinkBadge: false } },
];

export default {
  title: 'Alert/Nesting Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClarityModule, RenderComponentStorybook],
    }),
  ],
  argTypes: {
    // story helpers
  },
  args: {
    // story helpers
    components: nestedComponents,
  },
  render: (args: RenderComponentStorybook) => ({
    props: {
      ...args,
    },
    template: `
      <ng-container *ngFor="let closable of [true, false]">
        <clr-alert [clrAlertClosable]="closable">
          <clr-alert-item>
            <span class="alert-text">
              This is alert.
              <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
            </span>
          </clr-alert-item>
        </clr-alert>
        <clr-alert [clrAlertClosable]="closable">
          <clr-alert-item>
            <span class="alert-text">
              Standard alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text,
              Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text,
              Standard Alert long text, Standard Alert long text, Standard Alert long text, Standard Alert long text
              <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
            </span>
          </clr-alert-item>
        </clr-alert>
      </ng-container>
      <clr-alert [clrAlertLightweight]="true" [clrAlertType]="'warning'">
        <clr-alert-item>
          <span class="alert-text">
            Lightweight warning alert text
            <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
          </span>
        </clr-alert-item>
      </clr-alert>
    `,
  }),
};

export const Default: StoryObj = {};
