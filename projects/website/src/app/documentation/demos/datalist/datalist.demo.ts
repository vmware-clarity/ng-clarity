/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCommonFormsModule, ClrDatalistModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { DatalistBasicDemo } from './datalist-basic.demo';
import { DatalistReactiveValidationDemo } from './datalist-reactive-validation.demo';
import { DatalistTemplateValidationDemo } from './datalist-template-validation.demo';
import { DatalistDemoModule } from './datalist.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-datalist-demo',
  templateUrl: './datalist.demo.html',
  styleUrl: './datalist-demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    FormsModule,
    ClrCommonFormsModule,
    ClrDatalistModule,
    ThemedImageComponent,
    ClrIcon,
    ClrIconModule,
    LinkCardsComponent,
    RouterLink,
    DatalistBasicDemo,
    DatalistTemplateValidationDemo,
    DatalistReactiveValidationDemo,
    NestingTableComponent,
    DatalistDemoModule,
  ],
})
export class DatalistDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, List, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable' },
    { component: 'Badge', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  items: string[] = ['Cherry', 'Mango', 'Rose'];
  item = '';
  item2 = '';
  item3 = '';
  item4 = '';
  item5 = '';
  item6 = '';
  item7 = '';

  constructor() {
    super('datalist');
  }
}
