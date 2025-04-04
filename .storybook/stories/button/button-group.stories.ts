/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  CLR_MENU_POSITIONS,
  ClrButtonGroup,
  ClrButtonGroupModule,
  ClrLoadingModule,
  commonStringsDefault,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { BUTTON_STYLES, BUTTON_TYPES, getButtonClass } from '../../helpers/button-class.helper';
import { CommonModules } from '../../helpers/common';

export default {
  title: 'Button/Button Group',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrButtonGroupModule, ClrLoadingModule],
    }),
  ],
  component: ClrButtonGroup,
  argTypes: {
    // inputs
    clrMenuPosition: { control: 'radio', options: CLR_MENU_POSITIONS },
    // methods
    getMoveIndex: { control: { disable: true }, table: { disable: true } },
    initializeButtons: { control: { disable: true }, table: { disable: true } },
    rearrangeButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    inMenuIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    buttonCount: { control: { type: 'number', min: 1, max: 100 } },
    inMenuButtonCount: { control: { type: 'number', min: 1, max: 100 } },
    disabledButtonsPosition: { description: 'Enter JSON array (e.g. `[2,3]`)', control: { type: 'array' } },
    buttonStyle: { control: 'radio', options: BUTTON_STYLES },
    buttonType: { control: 'radio', options: BUTTON_TYPES },
    getButtonClass: { control: { disable: true }, table: { disable: true } },
    BUTTON_STYLES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    BUTTON_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    // inputs
    clrMenuPosition: 'bottom-left',
    loading: false,
    clrToggleButtonAriaLabel: commonStringsDefault.rowActions,
    // story helpers
    inMenuIndices: [true, false, false, true],
    createArray: n => new Array(n),
    content: 'Hello World!',
    buttonCount: 3,
    inMenuButtonCount: 3,
    disabledButtonsPosition: [],
    buttonType: 'primary',
    buttonStyle: 'outline',
    getButtonClass,
    BUTTON_STYLES,
    BUTTON_TYPES,
  },
};

const ButtonGroupTemplate: StoryFn = args => ({
  template: `
    <div style="margin-top: 200px; text-align: center">
      <clr-button-group
        [ngClass]="getButtonClass({buttonType, buttonStyle})"
        [clrMenuPosition]="clrMenuPosition"
        [clrToggleButtonAriaLabel]="clrToggleButtonAriaLabel"
      >
        <clr-button
          *ngFor="let _ of createArray(buttonCount); let i = index"
          [clrInMenu]="false"
          [clrLoading]="loading"
          [disabled]="disabledButtonsPosition.includes(i + 1)"
        >
          <cds-icon shape="home"></cds-icon>
          {{ content }} {{ i + 1 }}
        </clr-button>
        <clr-button *ngFor="let _ of createArray(inMenuButtonCount); let i = index" [clrInMenu]="true">
          {{ content }} {{ buttonCount + i + 1 }} {{ i % 2 ? 'and a half' : '' }}
        </clr-button>
      </clr-button-group>
    </div>
  `,
  props: args,
});

const ButtonGroupShowcaseTemplate: StoryFn = args => ({
  template: `
    <div *ngFor="let buttonStyle of BUTTON_STYLES" style="margin-top: 20px; text-align: center">
      <div *ngFor="let buttonType of BUTTON_TYPES" style="margin-top: 10px">
        <clr-button-group
          [ngClass]="getButtonClass({ buttonType, buttonStyle })"
          [clrMenuPosition]="clrMenuPosition"
          [clrToggleButtonAriaLabel]="clrToggleButtonAriaLabel"
        >
          <clr-button
            *ngFor="let _ of createArray(buttonCount); let i = index"
            [clrInMenu]="false"
            [clrLoading]="loading"
            [disabled]="disabledButtonsPosition.includes(i + 1)"
          >
            <cds-icon shape="home"></cds-icon>
            {{ content }} {{ i + 1 }}
          </clr-button>
          <clr-button *ngFor="let _ of createArray(inMenuButtonCount); let i = index" [clrInMenu]="true">
            {{ content }} {{ buttonCount + i + 1 }}
          </clr-button>
        </clr-button-group>
      </div>
    </div>
  `,
  props: args,
});

export const ButtonGroup: StoryObj = {
  render: ButtonGroupTemplate,
};

export const ButtonGroupShowcase: StoryObj = {
  render: ButtonGroupShowcaseTemplate,
};

export const ButtonGroupLoading: StoryObj = {
  render: ButtonGroupTemplate,

  args: {
    inMenuButtonCount: 0,
    loading: true,
  },
};

export const DisabledButtons: StoryObj = {
  render: ButtonGroupTemplate,

  args: {
    disabledButtonsPosition: [1, 2],
  },
};

export const ButtonGroupOverflow: StoryObj = {
  render: ButtonGroupTemplate,
  args: {
    clrMenuPosition: 'top-left',
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.dropdown-toggle') as HTMLElement).click();
  },
};
