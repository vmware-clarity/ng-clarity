/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ClrAlertModule, ClrCommonFormsModule, ClrIcon, ClrIconModule, ClrSelectModule } from '@clr/angular';

import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

const NgBasic = require('raw-loader!./ng/basic.html');
const NgHelpers = require('raw-loader!./ng/helpers.html');
const NgLabel = require('raw-loader!./ng/label.html');
const UiBasic = require('raw-loader!./ui/basic.html');
const UiError = require('raw-loader!./ui/error.html');
const UiFull = require('raw-loader!./ui/full.html');

const ngCode = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrSelectModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrSelectModule],
})
export class ExampleComponent {
  selectedOption = '';
}
`;

@Component({
  templateUrl: './select.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    FormsModule,
    ClrSelectModule,
    StackblitzExampleComponent,
    ClrCommonFormsModule,
    ClrAlertModule,
    ClrIcon,
    ClrIconModule,
    ThemedImageComponent,
    LinkCardsComponent,
    RouterLink,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class SelectDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, List, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable' },
    { component: 'Badge', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  exampleOne = '';
  exampleTwo = '';
  exampleThree = '';
  options = 'Red';
  layoutVertical = 'Option one';
  layoutHorizontal = 'Option one';
  layoutCompact = 'Option one';
  layoutMultiple = '';

  uiBasic: any = UiBasic;
  uiFull: any = UiFull;
  uiError: any = UiError;

  ngBasic: any = NgBasic;
  ngBasicCode: string = ngCode;
  ngLabel: any = NgLabel;
  ngLabelCode: string = ngCode;
  ngHelpers: any = NgHelpers;
  ngHelpersCode: string = ngCode;

  constructor() {
    super('select');
  }
}
