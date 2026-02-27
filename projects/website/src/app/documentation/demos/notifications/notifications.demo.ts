/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrAlertModule } from '@clr/angular';

import { NotificationsDemoModule } from './notifications.demo.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { UseDontUseComponent } from '../../../shared/use-dont-use/use-dont-use.component';
import { ClarityDocComponent } from '../clarity-doc';

@Component({
  templateUrl: './notifications.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  styleUrl: './notifications.demo.scss',
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrAlertModule,
    ThemedImageComponent,
    RouterLink,
    UseDontUseComponent,
    NotificationsDemoModule,
  ],
})
export class NotificationsDemo extends ClarityDocComponent {
  constructor() {
    super('notifications');
  }
}
