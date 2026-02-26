/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  bookmarkIcon,
  checkIcon,
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrLoadingButtonModule,
  ClrLoadingModule,
  ClrModalModule,
  cogIcon,
  downloadIcon,
  envelopeIcon,
  errorStandardIcon,
  folderIcon,
  pinIcon,
  timesIcon,
  warningStandardIcon,
} from '@clr/angular';

import { ButtonLoadingDemo } from './button-loading';
import { ButtonSizesDemo } from './button-sizes';
import { ButtonStatesDemo } from './button-states';
import { IconButtonsDemo } from './icon-buttons';
import { InverseButtonDemo } from './inverse-button';
import { RealButtonDemo } from './real-button';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ComponentList, NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-buttons-demo',
  templateUrl: './buttons.demo.html',
  styleUrl: './buttons.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    DoDontComponent,
    ClrModalModule,
    ClrIcon,
    ClrIconModule,
    ClrLoadingButtonModule,
    ClrLoadingModule,
    RealButtonDemo,
    ButtonStatesDemo,
    ButtonSizesDemo,
    InverseButtonDemo,
    IconButtonsDemo,
    ButtonLoadingDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
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
