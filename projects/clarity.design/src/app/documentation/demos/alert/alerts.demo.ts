/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlert, FOCUS_ON_VIEW_INIT } from '@clr/angular';

import { disableFocusTrapProvider } from '../../../shared/disable-focus-trap/disable-focus-trap.provider';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ComponentList } from '../../../shared/nesting-table/nesting-table.component';
import { ClarityDocComponent } from '../clarity-doc';
import { notificationsPatternLink } from '../pattern-links';

@Component({
  selector: 'clr-alerts-demo',
  templateUrl: './alerts.demo.html',
  styleUrl: './alerts.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  providers: [disableFocusTrapProvider, { provide: FOCUS_ON_VIEW_INIT, useValue: false }],
  standalone: false,
})
export class AlertsDemo extends ClarityDocComponent {
  readonly canNestComponents =
    'Badge, Button, Button Group, Icon Button, Label, List, Progress Bar, Spinner, Toggle Switch';
  readonly cannotNestComponents =
    'Accordion, Alert, Card, Datagrid, Header, Modal, Side Panel, Signpost, Stack View, Stepper, Tab, Table, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Dropdown', description: 'Yes, limit to links.' },
    {
      component:
        'Checkbox, Combobox, Datalist, Date Picker, Dropdown, File Picker, Password, Radio, Range Input, Select, Textarea',
      description:
        'Maybe, while nesting these components may not cause accessibility issues, it could lead to improper use. Please consult your design team for guidance.',
    },
  ];
  readonly patternLinks: LinkCardsLink[] = [notificationsPatternLink];

  constructor() {
    super('alert');
  }

  protected preventAlertClose(alert: ClrAlert) {
    alert.closed = false;
  }
}
