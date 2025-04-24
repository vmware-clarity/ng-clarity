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
  {
    type: AccordionStorybookComponent,
    options: { panelCount: 3, openIndices: [false, true, false], showDescriptions: true },
  },
  {
    type: AccordionStorybookComponent,
    options: { panelCount: 1, openIndices: [false], clrAccordionPanelDisabled: true },
  },
  {
    type: AccordionStorybookComponent,
    options: { panelCount: 1, openIndices: [true], clrAccordionPanelDisabled: true },
  },
  {
    type: AccordionStorybookComponent,
    options: { panelCount: 3, openIndices: [true, false, false] },
  },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1, componentDescription: `Standard Alerts` } },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1, showActions: true } },
  { type: StandardAlertStorybookComponent, options: { alertCount: 3, showActions: true } },
  {
    type: StandardAlertStorybookComponent,
    options: { alertCount: 1, clrAlertSizeSmall: true, componentDescription: `Standard Small Alerts` },
  },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1, clrAlertSizeSmall: true, showActions: true } },
  { type: StandardAlertStorybookComponent, options: { alertCount: 3, clrAlertSizeSmall: true, showActions: true } },
  {
    type: StandardAlertStorybookComponent,
    options: { alertCount: 1, clrAlertLightweight: true, componentDescription: `Lightweight Alerts` },
  },
  { type: StandardAlertStorybookComponent, options: { alertCount: 1, clrAlertLightweight: true, showActions: true } },
  { type: BadgeStoryBookComponent },
  { type: BadgeStoryBookComponent, options: { context: 'VM' } },
  { type: ButtonStorybookComponent, options: { buttonStyle: 'solid' } },
  { type: ButtonStorybookComponent, options: { buttonStyle: 'outline' } },
  { type: ButtonStorybookComponent, options: { buttonStyle: 'flat' } },

  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', loading: true, inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid' } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', buttonCount: 1 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline', inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline', loading: true, inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline' } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline', buttonCount: 1 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', loading: true, inMenuButtonCount: 0 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat' } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', buttonCount: 1 } },

  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', btnSmallSize: true, inMenuButtonCount: 0 } },
  {
    type: ButtonGroupStorybookComponent,
    options: { buttonStyle: 'solid', btnSmallSize: true, loading: true, inMenuButtonCount: 0 },
  },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', btnSmallSize: true } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'solid', btnSmallSize: true, buttonCount: 1 } },
  {
    type: ButtonGroupStorybookComponent,
    options: { buttonStyle: 'outline', btnSmallSize: true, inMenuButtonCount: 0 },
  },
  {
    type: ButtonGroupStorybookComponent,
    options: { buttonStyle: 'outline', btnSmallSize: true, loading: true, inMenuButtonCount: 0 },
  },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline', btnSmallSize: true } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'outline', btnSmallSize: true, buttonCount: 1 } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', btnSmallSize: true, inMenuButtonCount: 0 } },
  {
    type: ButtonGroupStorybookComponent,
    options: { buttonStyle: 'flat', btnSmallSize: true, loading: true, inMenuButtonCount: 0 },
  },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', btnSmallSize: true } },
  { type: ButtonGroupStorybookComponent, options: { buttonStyle: 'flat', btnSmallSize: true, buttonCount: 1 } },

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
          <clr-accordion-title>A11Y Rule: Short title</clr-accordion-title>
          <clr-accordion-content>
            A11Y Rules:
            <br />
            The Accordion header should include only a title and brief info (if needed). Clickable elements are not
            allowed.
            <br />
            Keep the Accordion Description short without any clickable elements or components.
            <br />
            Withing the Accordion Body you can nest components.
            <br />
            Accordions can be nested up to 2 levels
            <br />
            <br />
            <storybook-render-component ${argsToTemplate(args)}></storybook-render-component>
          </clr-accordion-content>
        </clr-accordion-panel>
      </clr-accordion>
    `,
  }),
};

export const Default: StoryObj = {};
