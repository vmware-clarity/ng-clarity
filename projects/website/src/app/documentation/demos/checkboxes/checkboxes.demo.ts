/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ClarityIcons,
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrIcon,
  errorStandardIcon,
  successStandardIcon,
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
import { SmallSelectionTreeDemo } from '../tree-view/small-selection-tree/small-selection-tree';

const NgBasic = require('raw-loader!./ng/basic.html');
const NgDisabled = require('raw-loader!./ng/disabled.html');
const NgHelpers = require('raw-loader!./ng/helpers.html');
const NgIndeterminate = require('raw-loader!./ng/indeterminate.html');
const NgInline = require('raw-loader!./ng/inline.html');
const NgLabel = require('raw-loader!./ng/label.html');
const UiBasic = require('raw-loader!./ui/basic.html');
const UiDisabled = require('raw-loader!./ui/disabled.html');
const UiError = require('raw-loader!./ui/error.html');
const UiFull = require('raw-loader!./ui/full.html');
const UiInline = require('raw-loader!./ui/inline.html');

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
    StyleDocsComponent,
    NestingTableComponent,
    SmallSelectionTreeDemo,
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

  @ViewChild('successCheckbox') successCheckbox: NgModel;
  successCheckboxModel = {
    newEmail: false,
    meetingReminder: true,
  };

  @ViewChild('errorCheckbox') errorCheckbox: NgModel;
  errorCheckboxModel = false;

  options = {
    option1: false,
    option2: true,
  };

  indeterminateState = true;

  constructor() {
    super('checkbox');
    ClarityIcons.addIcons(successStandardIcon, errorStandardIcon);
  }

  ngAfterViewInit() {
    this.errorCheckbox.control.markAsTouched();
    this.successCheckbox.control.markAsTouched();
  }

  resetIndeterminateState() {
    this.indeterminateState = true;
  }
}
