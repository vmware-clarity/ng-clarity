/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClarityIcons, homeIcon, sunIcon, worldIcon } from '@clr/angular';

import { ComboboxAsyncDemo } from './combobox-async.demo';
import { ComboboxEditableMultiDemo } from './combobox-editable-multi.demo';
import { ComboboxEditableDemo } from './combobox-editable.demo';
import { ComboboxGroupingDemo } from './combobox-grouping.demo';
import { ComboboxIdentityFnDemo } from './combobox-identity-fn.demo';
import { ComboboxMultiIdentityFnDemo } from './combobox-multi-identity-fn.demo';
import { ComboboxMultiDemo } from './combobox-multi.demo';
import { ComboboxSelectAllDemo } from './combobox-select-all.demo';
import { ComboboxSingleDemo } from './combobox-single.demo';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsComponent, LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { formsPatternLink } from '../pattern-links';

@Component({
  templateUrl: './combobox.demo.html',
  styleUrl: './combobox.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    LinkCardsComponent,
    ThemedImageComponent,
    ComboboxSingleDemo,
    ComboboxMultiDemo,
    ComboboxAsyncDemo,
    ComboboxGroupingDemo,
    ComboboxIdentityFnDemo,
    ComboboxMultiIdentityFnDemo,
    ComboboxSelectAllDemo,
    ComboboxEditableDemo,
    ComboboxEditableMultiDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class ComboboxDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Header, Input, Label, Login Page, Modal, Password, Progress Bar, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable.' },
    { component: 'Badge, Card', description: 'Maybe, non-clickable, check your design team for assistance' },
    { component: 'List, Table', description: 'Maybe, check your design team for assistance' },
  ];
  readonly patternLinks: LinkCardsLink[] = [formsPatternLink];

  constructor() {
    super('combobox');
    ClarityIcons.addIcons(homeIcon, worldIcon, sunIcon);
  }
}
