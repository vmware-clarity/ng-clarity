/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BadgeColorsDemo } from './badge-colors';
import { BadgeStatusesDemo } from './badge-statuses';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-badges-demo',
  templateUrl: './badges.demo.html',
  styleUrl: './badge.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    RouterLink,
    BadgeColorsDemo,
    BadgeStatusesDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class BadgesDemo extends ClarityDocComponent {
  expanded = true;

  readonly canNestComponents = 'Label';
  readonly cannotNestComponents =
    'Accordion, Alert, Badge, Button, Button Group, Card, Checkbox, Combobox, Datalist, Date Picker, Dropdown, File Picker, Header, Icon Button, Input, List, Modal, Password, Progress Bar, Radio, Range Input, Select, Side Panel, Signpost, Spinner, Stack View, Stepper, Tabs, Table, Textarea, Timeline, Toggle, Tooltip, Tree View, Vertical Nav, Wizard';

  constructor() {
    super('badge');
  }
}
