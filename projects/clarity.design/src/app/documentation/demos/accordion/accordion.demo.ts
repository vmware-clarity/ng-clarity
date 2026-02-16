/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-accordion-demo',
  templateUrl: './accordion.demo.html',
  styleUrl: './accordion.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
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
