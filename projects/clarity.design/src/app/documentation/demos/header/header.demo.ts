/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, cogIcon, fileIcon, userIcon, vmBugIcon } from '@cds/core/icon';

import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';

const EXAMPLE = `
<clr-main-container>
  <clr-header>
    <div class="branding">
      <a href="javascript://" class="nav-link">
        <cds-icon shape="vm-bug"></cds-icon>
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
        <cds-icon shape="cog"></cds-icon>
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
  standalone: false,
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
