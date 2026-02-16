/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

/* eslint-disable @typescript-eslint/no-var-requires */
const NgBasic = require('raw-loader!./ng/basic.html');
const NgDisabled = require('raw-loader!./ng/disabled.html');
const NgHelpers = require('raw-loader!./ng/helpers.html');
const NgInline = require('raw-loader!./ng/inline.html');
const NgLabel = require('raw-loader!./ng/label.html');
const UiBasic = require('raw-loader!./ui/basic.html');
const UiDisabled = require('raw-loader!./ui/disabled.html');
const UiError = require('raw-loader!./ui/error.html');
const UiFull = require('raw-loader!./ui/full.html');
const UiInline = require('raw-loader!./ui/inline.html');
/* eslint-enable @typescript-eslint/no-var-requires */

const AngularTs = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  // Load all components for demo purposes.
  // Don't do this in a real application. Load just the components you need so that your bundle is smaller.
  imports: [ClarityModule, FormsModule],
})
export class ExampleComponent {
  options = '';
}
`;

@Component({
  templateUrl: './radio.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class RadioDemo extends ClarityDocComponent {
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
  options = '';

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

  angularTs = AngularTs;

  constructor() {
    super('radio');
  }

  selectNothing() {
    return false;
  }
}
