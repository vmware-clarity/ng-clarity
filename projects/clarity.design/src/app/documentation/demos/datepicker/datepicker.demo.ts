/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component } from '@angular/core';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

registerLocaleData(localeFr);

@Component({
  selector: 'clr-datepicker-demo',
  templateUrl: './datepicker.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class DatepickerDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, List, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Table, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable' },
    { component: 'Badge', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  expanded = true;

  constructor() {
    super('datepicker');
  }
}
