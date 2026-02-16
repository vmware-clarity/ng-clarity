/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  bookmarkIcon,
  checkIcon,
  ClarityIcons,
  cogIcon,
  downloadIcon,
  envelopeIcon,
  errorStandardIcon,
  folderIcon,
  pinIcon,
  timesIcon,
  warningStandardIcon,
} from '@cds/core/icon';

import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-buttons-demo',
  templateUrl: './buttons.demo.html',
  styleUrl: './buttons.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class ButtonsDemo extends ClarityDocComponent {
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Accordion, Alert, Button, Button Group, Card, Checkbox, Combobox, Datalist, Date Picker, Dropdown, File Picker, Header, Icon Button, Input, List, Modal, Password, Progress Bar, Radio, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Tabs, Table, Textarea, Timeline, Toggle, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Badge', description: 'Yes, use the badge only as a numeric indicator within a button.' },
    {
      component: 'Tooltip',
      description:
        'Yes, tooltips are suitable for static buttons, but not recommended for link buttons. If used with link buttons, the developer will be responsible for any necessary modifications.',
    },
  ];

  constructor() {
    super('button');
    ClarityIcons.addIcons(
      pinIcon,
      bookmarkIcon,
      checkIcon,
      downloadIcon,
      envelopeIcon,
      folderIcon,
      cogIcon,
      timesIcon,
      warningStandardIcon,
      errorStandardIcon
    );
  }
}
