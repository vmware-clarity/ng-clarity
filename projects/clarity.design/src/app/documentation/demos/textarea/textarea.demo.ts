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
const NgHelpers = require('raw-loader!./ng/helpers.html');
const UiBasic = require('raw-loader!./ui/basic.html');
const UiError = require('raw-loader!./ui/error.html');
const UiHelper = require('raw-loader!./ui/helper.html');
/* eslint-enable @typescript-eslint/no-var-requires */

const code = `
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrTextareaModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [FormsModule, ClrTextareaModule],
})
export class ExampleComponent {
  description = '';
}
`;

@Component({
  selector: 'clr-textarea-demo',
  templateUrl: './textarea.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class TextareaDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, List, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable' },
    { component: 'Badge', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  exampleOne = '';
  exampleTwo = null;
  exampleThree = '';
  description = '';

  uiBasic: any = UiBasic;
  uiHelper: any = UiHelper;
  uiError: any = UiError;

  ngBasic: any = NgBasic;
  ngBasicCode: any = code;

  ngHelpers: any = NgHelpers;
  ngHelperCode: any = code;

  constructor() {
    super('textarea');
  }
}
