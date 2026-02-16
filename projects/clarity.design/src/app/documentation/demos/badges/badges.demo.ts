/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-badges-demo',
  templateUrl: './badges.demo.html',
  styleUrl: './badge.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
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
