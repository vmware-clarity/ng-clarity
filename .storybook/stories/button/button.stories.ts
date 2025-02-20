/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrButton } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { BUTTON_STYLES, BUTTON_TYPES, getButtonClass } from '../../helpers/button-class.helper';
import { CommonModules } from '../../helpers/common';

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
    // outputs
    click: { control: { disable: true } },
    // methods
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
    buttonStyle: { control: 'radio', options: BUTTON_STYLES },
    buttonType: { control: 'radio', options: BUTTON_TYPES },
    getButtonClass: { control: { disable: true }, table: { disable: true } },
    BUTTON_STYLES: { control: { disable: true }, table: { disable: true }, type: 'array' },
    BUTTON_TYPES: { control: { disable: true }, table: { disable: true }, type: 'array' },
  },
  args: {
    // inputs
    disabled: false,
    // outputs
    click: action('click'),
    // story helpers
    content: 'Hello World!',
    iconShape: '',
    buttonType: 'primary',
    buttonStyle: 'outline',
    getButtonClass,
    BUTTON_STYLES,
    BUTTON_TYPES,
  },
};

const ButtonTemplate: StoryFn = args => ({
  template: `
    <button
      class="btn"
      [ngClass]="getButtonClass({ buttonType, buttonStyle })"
      [disabled]="disabled"
      (click)="click($event)"
    >
      <cds-icon *ngIf="iconShape" [attr.shape]="iconShape"></cds-icon>
      {{ content }}
    </button>
  `,
  props: args,
});

const ButtonAllTemplate: StoryFn = args => ({
  template: `
    <h6>Default Button</h6>
    <button class="btn">Default</button>

    <h6>Primary Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type">
      <cds-icon shape="user"></cds-icon>
      {{ type }}
    </button>

    <h6>Old Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-' + type + '-outline'">
      {{ type }}
      <cds-icon shape="home"></cds-icon>
    </button>

    <h6>New Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-outline-' + type">{{ type }}</button>

    <h6>Link Buttons</h6>
    <button class="btn btn-link">Default</button>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{ type }}</button>

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
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type">{{ type }}</button>

    <h6>Small Outline Buttons</h6>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-sm btn-' + type + '-outline'">
      <cds-icon shape="user"></cds-icon>
      {{ type }}
      <cds-icon shape="home"></cds-icon>
    </button>

    <!--Links-->

    <h6>Default Link</h6>
    <a href="javascript://" class="btn">Default</a>

    <h6>Primary Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type">{{ type }}</a>

    <h6>Old Outline Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-' + type + '-outline'">{{ type }}</a>

    <h6>New Outline Links</h6>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-outline-' + type">
      <cds-icon shape="user"></cds-icon>
      {{ type }}
      <cds-icon shape="home"></cds-icon>
    </a>

    <h6>Flat Links</h6>
    <a href="javascript://" class="btn btn-link">Default</a>
    <a *ngFor="let type of BUTTON_TYPES" href="javascript://" [class]="'btn btn-link-' + type">{{ type }}</a>
    <a href="javascript://" class="btn btn-link btn-sm">
      <cds-icon shape="user"></cds-icon>
      Link
      <cds-icon shape="home"></cds-icon>
    </a>

    <h6>Flat Buttons</h6>
    <button class="btn btn-link">Default</button>
    <button *ngFor="let type of BUTTON_TYPES" [class]="'btn btn-link-' + type">{{ type }}</button>
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

const ButtonLinkTemplate: StoryFn = args => ({
  template: `
    <a
      href="javascript://"
      class="btn"
      [ngClass]="getButtonClass({ buttonType, buttonStyle })"
      [disabled]="disabled"
      (click)="click($event)"
    >
      <cds-icon *ngIf="iconShape" [attr.shape]="iconShape"></cds-icon>
      {{ content }}
    </a>
  `,
  props: args,
});
export const Button: StoryObj = {
  render: ButtonTemplate,
};

export const Solid: StoryObj = {
  render: ButtonTemplate,
  args: {
    buttonStyle: 'solid',
  },
};
export const Outline: StoryObj = {
  render: ButtonTemplate,
  args: {
    buttonStyle: 'outline',
  },
};
export const Flat: StoryObj = {
  render: ButtonTemplate,
  args: {
    buttonStyle: 'flat',
  },
};
export const Link: StoryObj = {
  render: ButtonLinkTemplate,
  args: {
    buttonStyle: 'flat',
  },
};

export const Showcase: StoryObj = {
  render: ButtonAllTemplate,
  parameters: {
    actions: { disable: true },
    controls: { disable: true },
  },
};
