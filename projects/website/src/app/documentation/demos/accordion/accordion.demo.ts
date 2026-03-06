/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAccordionModule, ClrDatagridModule, ClrIfExpanded } from '@clr/angular';

import { AngularAccordionDemo } from './angular-accordion.demo';
import { ApiAccordionDemo } from './api-accordion.demo';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-accordion-demo',
  templateUrl: './accordion.demo.html',
  styleUrl: './accordion.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrAccordionModule,
    ClrDatagridModule,
    ClrIfExpanded,
    ThemedImageComponent,
    AngularAccordionDemo,
    ApiAccordionDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class AccordionDemo extends ClarityDocComponent {
  readonly canNestComponents =
    'Alert, Badge, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Icon Button, Input, Label, List, Modal, Password, Progress Bar, Radio, Range Input, Select, Signpost, Spinner,  Table, Textarea, Timeline, Toggle Switch, Tooltip, Timeline, Tree View, Wizard';
  readonly cannotNestComponents = 'Header, Tabs, Vertical Nav';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Accordion', description: 'Yes, can be nested up to 2 levels.' },
    {
      component: 'Side Panel',
      description: 'Yes, when the side panel is pinned, keep the blade at the body level, not within the Accordion.',
    },
    { component: 'Stack View, Stepper', description: 'Yes, limited to 1 level.' },
  ];

  constructor() {
    super('accordion');
  }
}
