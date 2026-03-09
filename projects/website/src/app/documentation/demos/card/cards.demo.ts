/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardAlertDemo } from './card-alert';
import { CardClickableDemo } from './card-clickable';
import { CardDropdownDemo } from './card-dropdown';
import { CardGridDemo } from './card-grid';
import { CardImagesDemo } from './card-images';
import { CardLayoutDemo } from './card-layout';
import { CardListGroupDemo } from './card-list-group';
import { CardMasonryDemo } from './card-masonry';
import { CardMediaBlockDemo } from './card-media-block';
import { ListsInCardsDemo } from './lists-in-cards';
import { ProgressBarCardsDemo } from './progress-bar-cards';
import { ProgressBarInlineCardsDemo } from './progress-bar-inline-cards';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { NestingTableComponent } from '../../../shared/nesting-table/nesting-table.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  selector: 'clr-cards-demo',
  templateUrl: './cards.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    DoDontComponent,
    CardLayoutDemo,
    CardClickableDemo,
    CardImagesDemo,
    RouterLink,
    CardDropdownDemo,
    CardMediaBlockDemo,
    CardAlertDemo,
    ListsInCardsDemo,
    CardListGroupDemo,
    ProgressBarCardsDemo,
    ProgressBarInlineCardsDemo,
    CardGridDemo,
    CardMasonryDemo,
    StyleDocsComponent,
    NestingTableComponent,
  ],
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
