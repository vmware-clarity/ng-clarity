/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAccordionModule } from '@clr/angular';
import { argsToTemplate, moduleMetadata, StoryObj } from '@storybook/angular';
import { RenderComponentStorybook } from 'helpers/render-component';
import { StandardAlertStorybookComponent } from 'stories/alert/standard-alert.storybook.component';
import { BadgeStoryBookComponent } from 'stories/badge/badge.storybook.component';
import { ButtonGroupStorybookComponent } from 'stories/button/button-group.storybook.component';
import { ButtonStorybookComponent } from 'stories/button/button.storybook.component';
import { CardStorybookComponent } from 'stories/card/card.storybook.component';
import { CheckboxToggleStorybookComponent } from 'stories/checkbox-toggle/checkbox-toggle.storybook.component';

import { CommonModules } from '../../helpers/common';
import { AccordionStorybookComponent } from './accordion.storybook.component';

const nestedComponents = [
  { type: AccordionStorybookComponent, options: { panelCount: 1 } },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1 } },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1, clrAlertLightweight: true } },
  { type: BadgeStoryBookComponent },
  { type: ButtonStorybookComponent },
  { type: ButtonGroupStorybookComponent },
  { type: CardStorybookComponent },
  { type: CheckboxToggleStorybookComponent, options: { containerLabel: 'Options', optionCount: 3 } },
];

export default {
  title: 'Accordion/Accordion/Nesting Components',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrAccordionModule, RenderComponentStorybook],
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
      <clr-accordion>
        <clr-accordion-panel [clrAccordionPanelOpen]="true">
          <clr-accordion-title>Short Title</clr-accordion-title>
          <clr-accordion-content>
            <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
          </clr-accordion-content>
        </clr-accordion-panel>
      </clr-accordion>
    `,
  }),
};

export const Default: StoryObj = {};
