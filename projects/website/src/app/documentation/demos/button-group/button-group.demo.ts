/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  checkIcon,
  ClarityIcons,
  ClrButtonGroupModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  downloadIcon,
  folderIcon,
  homeIcon,
  refreshIcon,
  userIcon,
} from '@clr/angular';

import { ButtonGroupAngularBasicStructureDemo } from './angular-basic-structure';
import { ButtonGroupAngularDirectionsDemo } from './angular-directions';
import { ButtonGroupBasicStructureDemo } from './basic-structure';
import { ButtonGroupCheckboxDemo } from './checkbox';
import { ButtonGroupIconsDemo } from './icons';
import { MixedButtonGroupDemo } from './mixed';
import { ButtonGroupRadioDemo } from './radio';
import { ButtonGroupTypes } from './types';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

const ACCESSIBILITY_EXAMPLE = `
<div class="btn-group btn-primary btn-icon">
  <button class="btn" aria-label="Check">
    <clr-icon shape="check"></clr-icon>
  </button>
  <button class="btn" aria-label="home">
    <clr-icon shape="home"></clr-icon>
  </button>
  <button class="btn" aria-label="user">
    <clr-icon shape="user"></clr-icon>
  </button>
</div>
`;

@Component({
  selector: 'clr-button-group-demo',
  templateUrl: './button-group.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    RouterLink,
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrButtonGroupModule,
    DoDontComponent,
    ClrIcon,
    ClrIconModule,
    ClrCommonFormsModule,
    ButtonGroupAngularBasicStructureDemo,
    ButtonGroupAngularDirectionsDemo,
    ButtonGroupBasicStructureDemo,
    ButtonGroupTypes,
    MixedButtonGroupDemo,
    ButtonGroupIconsDemo,
    ButtonGroupCheckboxDemo,
    ButtonGroupRadioDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
})
export class ButtonGroupDemo extends ClarityDocComponent {
  accessibilityExample = ACCESSIBILITY_EXAMPLE;
  readonly canNestComponents = 'Button';
  readonly cannotNestComponents =
    'Alert, Badge, Button Group, Card, Checkbox, Combobox, Datagrid, Datalist, Date Picker, Dropdown, File Picker, Icon Button, Input, Header, Label, List, Modal, Password, Progress Bar, Radio, Range Input, Select, Signpost, Spinner, Table, Tabs, Textarea, Timeline, Toggle Switch, Tooltip, Timeline, Tree View, Vertical Nav, Wizard';

  constructor() {
    super('button-group');

    ClarityIcons.addIcons(checkIcon, homeIcon, userIcon, refreshIcon, downloadIcon, folderIcon);
  }
}
