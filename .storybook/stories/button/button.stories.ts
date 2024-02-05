/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { action } from '@storybook/addon-actions';
import { moduleMetadata, Story } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { ClrButton } from '../../../projects/angular/src/button';

const BUTTON_TYPES = ['primary', 'success', 'warning', 'danger', 'neutral'];
const BUTTON_STYLES = ['outline', 'solid', 'flat'];

const buttonClassLoader = (buttonType, buttonStyle) => {
  const buttonClasses = {
    solid: `btn-${buttonType}`,
    outline: `btn-${buttonType}-outline`,
    flat: `btn-link-${buttonType}`,
  };
  return buttonClasses[buttonStyle];
};

export default {
  title: 'Button/Button',
  component: ClrButton,
  decorators: [
    moduleMetadata({
      imports: [...CommonModules],
    }),
  ],
  argTypes: {
    // inputs
    class: { control: { disable: true } },
    disabled: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    click: { control: { disable: true } },
    // methods
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
    buttonStyle: {
      defaultValue: 'outline',
      control: { type: 'radio', options: BUTTON_STYLES },
    },
    buttonType: {
      defaultValue: 'primary',
      control: { type: 'radio', options: BUTTON_TYPES },
    },
    buttonClassLoader: { control: { disable: true }, table: { disable: true } },
    BUTTON_STYLES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    BUTTON_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    // outputs
    click: action('click'),
    // story helpers
    content: 'Hello World!',
    buttonClassLoader,
    BUTTON_STYLES,
    BUTTON_TYPES,
  },
};

const ButtonTemplate: Story = args => ({
  template: `
      <button
        class="btn"
        [ngClass]="buttonClassLoader(buttonType, buttonStyle)"
        [disabled]="disabled"
        (click)="click($event)"
      >
        {{content}}
      </button>
  `,
  props: args,
});

const ButtonAllTemplate: Story = args => ({
  template: `
    <h6>Default Button</h6>
    <button class="btn">Default</button>

    <h6>Primary Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type">{{type}}</button>

    <h6>Old Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type + '-outline'">{{type}}</button>

    <h6>New Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-outline-' + type">{{type}}</button>

    <h6>Link Buttons</h6>
    <button class="btn btn-link">Default</button>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{type}}</button>

    <h6>Inverse Buttons</h6>
    <div style="background: #313131; padding: 24px">
      <button class="btn btn-inverse">Inverse</button>
    </div>

    <h6>Block Buttons</h6>
    <button href="javascript://" class="btn btn-block">
      <cds-icon shape="user"></cds-icon>
      Block Button
      <cds-icon shape="home"></cds-icon>
    </button>

    <h6>Small Primary Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type">{{type}}</button>

    <h6>Small Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type + '-outline'">{{type}}</button>

    <!--Links-->

    <h6>Default Link</h6>
    <a href="javascript://" class="btn">Default</a>

    <h6>Primary Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type">{{type}}</a>

    <h6>Old Outline Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type + '-outline'">{{type}}</a>


    <h6>New Outline Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-outline-' + type">{{type}}</a>

    <h6>Flat Links</h6>
    <a href="javascript://" class="btn btn-link">Default</a>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-link-' + type">{{type}}</a>
    <a href="javascript://" class="btn btn-link btn-sm">
      <cds-icon shape="user"></cds-icon>
      Link
      <cds-icon shape="home"></cds-icon>
    </a>

    <h6>Flat Buttons</h6>
    <button class="btn btn-link">Default</button>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{type}}</button>
    <button class="btn btn-link btn-sm">
      <cds-icon shape="user"></cds-icon>
      Flat
      <cds-icon shape="home"></cds-icon>
    </button>

    <h6>Inverse Links</h6>
    <div style="background: #313131; padding: 24px">
      <a href="javascript://" class="btn btn-inverse">Inverse</a>
    </div>

    <h6>Block Links</h6>
    <a href="javascript://" class="btn btn-block">Block</a>
  `,
  props: args,
});

export const Default: Story = ButtonTemplate.bind({});

export const Showcase: Story = ButtonAllTemplate.bind({});
Showcase.argTypes = {
  buttonStyle: { control: { disable: true }, table: { disable: true } },
  buttonType: { control: { disable: true }, table: { disable: true } },
  disabled: { control: { disable: true }, table: { disable: true } },
};
