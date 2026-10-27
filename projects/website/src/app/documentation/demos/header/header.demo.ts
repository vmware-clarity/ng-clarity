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
  cogIcon,
  fileIcon,
  userIcon,
  vmBugIcon,
} from '@clr/angular';
import { HEADER_EXAMPLES } from '@clr/examples/header';

import { HeaderColorsDemo } from './header-colors';
import { HeaderLinksDemo } from './header-links';
import { HeaderTypesDemo } from './header-types';
import { SubNavDemo } from './sub-nav';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

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
    DocExampleComponent,
    HeaderLinksDemo,
    ClrAlertModule,
    HeaderTypesDemo,
    HeaderColorsDemo,
    SubNavDemo,
    StyleDocsComponent,
    NestingTableComponent,
    AiSkillComponent,
  ],
})
export class HeaderDemo extends ClarityDocComponent {
  readonly examples = HEADER_EXAMPLES;

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
