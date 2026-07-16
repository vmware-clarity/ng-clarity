/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { AppfxMenuModule, MenuComponent } from '@clr/addons/menu';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

// ─── Wrapper ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'clr-menu-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxMenuModule],
  template: `
    <div
      class="menu-story-area"
      (contextmenu)="onContextMenu($event)"
      style="
        border: var(--cds-alias-object-border-width-200) dashed var(--cds-alias-object-border-color);
        padding: var(--clr-base-vertical-offset-2xl) var(--clr-base-horizontal-offset-2xl);
        min-height: 150px;
        text-align: center;
        cursor: context-menu;
        user-select: none;
      "
    >
      <p>Right-click anywhere in this area</p>
      <p *ngIf="lastAction" style="font-size: 0.8rem; color: var(--cds-alias-typography-secondary-color)">
        Last: {{ lastAction }}
      </p>
    </div>

    <appfx-menu #demoMenu>
      <appfx-menu-header [text]="headerText"></appfx-menu-header>
      <appfx-menu-action [text]="'Action 1'" (handle)="handleAction('Action 1')"></appfx-menu-action>
      <appfx-menu-action
        [text]="'Action 2'"
        [shortcut]="'Ctrl+A'"
        (handle)="handleAction('Action 2')"
      ></appfx-menu-action>
      <appfx-menu-separator></appfx-menu-separator>
      <appfx-menu [text]="'Submenu'">
        <appfx-menu-action [text]="'Nested Action 1'" (handle)="handleAction('Nested Action 1')"></appfx-menu-action>
        <appfx-menu-action [text]="'Nested Action 2'" (handle)="handleAction('Nested Action 2')"></appfx-menu-action>
      </appfx-menu>
      <appfx-menu-separator></appfx-menu-separator>
      <appfx-menu-action [text]="'Disabled Action'" [enabled]="false"></appfx-menu-action>
    </appfx-menu>

    <menu-outlet></menu-outlet>
  `,
})
class MenuStoryWrapperComponent {
  @ViewChild('demoMenu') demoMenu: MenuComponent;

  headerText = 'Context Menu';
  lastAction = '';

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.demoMenu.close(event);
    this.demoMenu.show(event, event.clientX, event.clientY);
  }

  handleAction(label: string) {
    this.lastAction = label;
  }
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Addons/Menu',
  component: MenuStoryWrapperComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxMenuModule, CommonModule, MenuStoryWrapperComponent],
    }),
  ],
  argTypes: {
    headerText: { control: 'text' },
  },
  args: {
    headerText: 'Context Menu',
  },
};

type Story = StoryObj<MenuStoryWrapperComponent>;

const template: StoryFn<MenuStoryWrapperComponent> = args => ({
  props: args,
  component: MenuStoryWrapperComponent,
});

export const Default: Story = {
  render: template,
};
