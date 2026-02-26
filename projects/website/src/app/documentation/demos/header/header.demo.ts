/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ClarityIcons,
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrNavigationModule,
  cogIcon,
  fileIcon,
  userIcon,
  vmBugIcon,
} from '@clr/angular';

import { HeaderColorsDemo } from './header-colors';
import { HeaderLinksDemo } from './header-links';
import { HeaderTypesDemo } from './header-types';
import { SubNavDemo } from './sub-nav';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

const EXAMPLE = `
<clr-main-container>
  <clr-header>
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <clr-icon shape="vm-bug"></clr-icon>
        <span class="title">Project Clarity</span>
      </a>
    </div>
    <div class="header-nav">
      <a href="javascript://" class="nav-link nav-text">Home</a>
      <a href="javascript://" class="nav-link nav-text">About</a>
      <a href="javascript://" class="nav-link nav-text">Services</a>
    </div>
    <div class="header-actions">
      <a href="javascript://" class="nav-link">
        <clr-icon shape="cog"></clr-icon>
      </a>
    </div>
  </clr-header>
  <nav class="subnav">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link active" href="javascript://" aria-current="page">Dashboard</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Management</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Cloud</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="javascript://">Tenants</a>
      </li>
    </ul>
  </nav>
  <div class="content-container">
    <div class="content-area"></div>
  </div>
</clr-main-container>
`;

@Component({
  selector: 'clr-header-demo',
  templateUrl: './header.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrIcon,
    ClrIconModule,
    RouterLink,
    DoDontComponent,
    ClrCommonFormsModule,
    ClrNavigationModule,
    StackblitzExampleComponent,
    HeaderLinksDemo,
    ClrAlertModule,
    HeaderTypesDemo,
    HeaderColorsDemo,
    SubNavDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class HeaderDemo extends ClarityDocComponent {
  example = EXAMPLE;

  readonly canNestComponents = 'Badge, Button, Dropdown, Input, Label, Select, Spinner, Toggle, Tooltip';
  readonly cannotNestComponents =
    'Accordion, Alert, Card, Datagrid, Datalist, Date Picker, File Picker, Header, List, Login Page, Modal, Password, Radio Button, Range Input, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Button Group', description: 'Yes, only in a horizontal orientation.' },
    {
      component: 'Checkbox, Combobox',
      description: 'Yes, some limitations apply, consult with your design team for guidance.',
    },
    { component: 'Progress Bar', description: 'Yes, only circular Progress Bar is permitted.' },
  ];

  constructor() {
    super('header');
    ClarityIcons.addIcons(fileIcon, vmBugIcon, cogIcon, userIcon);
  }
}
