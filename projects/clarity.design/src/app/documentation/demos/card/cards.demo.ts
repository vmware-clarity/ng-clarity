/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-cards-demo',
  templateUrl: './cards.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
})
export class CardsDemo extends ClarityDocComponent {
  readonly canNestComponents =
    'Accordion, Alert, Badge, Button, Button Group, Checkbox, Combobox, Datalist, Date Picker, Dropdown, File Picker, Icon Button, Input, Label, List, Password, Radio, Range Input, Progress Bar, Select, Signpost, Spinner, Table, Textarea, Timeline, Toggle Switch, Tooltip';
  readonly cannotNestComponents =
    'Card, Datagrid, Header, Modal, Side Panel, Stack View, Stepper, Tabs, Tree View, Vertical Nav, Wizard';

  constructor() {
    super('card');
  }
}
