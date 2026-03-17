/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrAlertModule,
  ClrDropdownModule,
  ClrIcon,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  exclamationCircleIcon,
  pinIcon,
} from '@clr/angular';

import { DropdownAngularCloseItemFalseDemo } from './dropdown-angular-close-item-false';
import { DropdownAngularContextMenuDemo } from './dropdown-angular-context-menu';
import { DropdownAngularPositioningDemo } from './dropdown-angular-positioning';
import { DropdownStaticButtonLinkToggleDemo } from './dropdown-static-buttonlink-toggle';
import { DropdownStaticDefaultDemo } from './dropdown-static-default';
import { DropdownStaticIconToggleDemo } from './dropdown-static-icon-toggle';
import { DropdownStaticPositioningDemo } from './dropdown-static-positioning';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-dropdowns-demo',
  templateUrl: './dropdown.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrDropdownModule,
    ClrIcon,
    ClrPopoverContent,
    ThemedImageComponent,
    DropdownAngularPositioningDemo,
    DropdownAngularCloseItemFalseDemo,
    DropdownAngularContextMenuDemo,
    DropdownStaticDefaultDemo,
    DropdownStaticPositioningDemo,
    DropdownStaticIconToggleDemo,
    DropdownStaticButtonLinkToggleDemo,
    StyleDocsComponent,
    ClrAlertModule,
    NestingTableComponent,
  ],
})
export class DropdownsDemo extends ClarityDocComponent {
  newLayout = true;
  readonly canNestComponents = 'Spinner';
  readonly cannotNestComponents =
    'Alert, Accordion, Button, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Dropdown, File Picker, Header, Input, Label, Login Page, Modal, Password, Radio Button, Range Input, Select, Side Panel, Signpost, Stack View, Stepper, Tabs, Textarea, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';
  readonly conditionalNesting: ComponentList[] = [
    { component: 'Icon, Label', description: 'Yes, non-clickable.' },
    { component: 'Badge, Progress Bar', description: 'Maybe, check your design team for assistance.' },
    {
      component: 'Table, List',
      description:
        'It is not advised, an accessibility assessment will be required. Check your design team for assistance.',
    },
  ];

  constructor() {
    super('dropdown');
    ClarityIcons.addIcons(pinIcon, exclamationCircleIcon);
  }
}
