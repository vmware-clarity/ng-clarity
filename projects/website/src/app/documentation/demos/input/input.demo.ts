/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrInputModule,
  ClrNumberInputModule,
} from '@clr/angular';

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
const NgNumbers = require('raw-loader!./ng/numbers.html');
const NgPrefixIcon = require('raw-loader!./ng/prefix-icon.html');
const NgPrefixSelect = require('raw-loader!./ng/prefix-select.html');
const NgPrefixSuffix = require('raw-loader!./ng/prefix.html');
const UiBasic = require('raw-loader!./ui/basic.html');
const UiError = require('raw-loader!./ui/error.html');
const UiFull = require('raw-loader!./ui/full.html');
const UiSuccess = require('raw-loader!./ui/success.html');

const code = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrFormsModule, ClrLayoutModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrFormsModule, ClrLayoutModule],
})
export class ExampleComponent {
  input = '';
}
`;

@Component({
  selector: 'clr-input-demo',
  templateUrl: './input.demo.html',
  styleUrl: './input.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    FormsModule,
    ClrInputModule,
    StackblitzExampleComponent,
    ClrAlertModule,
    ClrCommonFormsModule,
    ClrNumberInputModule,
    ClrIcon,
    ClrIconModule,
    ThemedImageComponent,
    LinkCardsComponent,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class InputDemo extends ClarityDocComponent {
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
  exampleThree = 0;
  exampleFour = '';

  uiBasic: any = UiBasic;
  uiFull: any = UiFull;
  uiError: any = UiError;
  uiSuccess: any = UiSuccess;

  ngBasic: any = NgBasic;
  ngBasicCode = code;
  ngLabel: any = NgLabel;
  ngLabelCode = code;
  ngPrefixSuffix: any = NgPrefixSuffix;
  ngPrefixIcon: any = NgPrefixIcon;
  ngPrefixSelect: any = NgPrefixSelect;
  ngPrefixSuffixCode = code;
  ngHelpers: any = NgHelpers;
  ngHelpersCode = code;
  ngNumbers: any = NgNumbers;
  ngNumbersCode = code;

  constructor() {
    super('input');
  }
}
