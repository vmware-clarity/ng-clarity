/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrCheckboxModule, ClrCommonFormsModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { CheckboxesDemoModule } from './checkboxes.demo.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

const NgBasic = '';
const NgDisabled = '';
const NgHelpers = '';
const NgIndeterminate = '';
const NgInline = '';
const NgLabel = '';
const UiBasic = '';
const UiDisabled = '';
const UiError = '';
const UiFull = '';
const UiInline = '';

const AngularTs = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrCheckboxModule, FormsModule],
})
export class ExampleComponent {
  options = {
    option1: false,
    option2: true,
  };
}
`;

const IndeterminateTs = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrCheckboxModule, FormsModule],
})
export class ExampleComponent {
  indeterminateState = true;
  option = false;

  resetIndeterminateState() {
    this.indeterminateState = true;
    this.option = false;
  }
}
`;

@Component({
  templateUrl: './checkboxes.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  styleUrl: './checkboxes.demo.scss',
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrCheckboxModule,
    ClrCommonFormsModule,
    ThemedImageComponent,
    RouterLink,
    LinkCardsComponent,
    FormsModule,
    StackblitzExampleComponent,
    ClrIcon,
    ClrIconModule,
    StyleDocsComponent,
    NestingTableComponent,
    CheckboxesDemoModule,
  ],
})
export class CheckboxesDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, List, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable' },
    { component: 'Badge', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  uiBasic: any = UiBasic;
  uiFull: any = UiFull;
  uiError: any = UiError;
  uiInline: any = UiInline;
  uiDisabled: any = UiDisabled;

  ngBasic: any = NgBasic;
  ngLabel: any = NgLabel;
  ngHelpers: any = NgHelpers;
  ngInline: any = NgInline;
  ngDisabled: any = NgDisabled;
  ngIndeterminate: any = NgIndeterminate;

  angularTs = AngularTs;
  indeterminateTs = IndeterminateTs;

  disabledCheckbox = {
    newEmail: false,
    meetingReminder: true,
  };

  options = {
    option1: false,
    option2: true,
  };

  indeterminateState = true;

  constructor() {
    super('checkbox');
  }

  resetIndeterminateState() {
    this.indeterminateState = true;
  }
}
