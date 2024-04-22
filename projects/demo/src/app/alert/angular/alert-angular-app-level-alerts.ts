/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-alert-app-level-alerts-demo-angular',
  styleUrls: ['../alert.demo.scss'],
  templateUrl: './alert-angular-app-level-alerts.demo.html',
})
export class AlertAngularAppLevelAlertsDemo {
  alerts = [
    { text: 'Message 1', type: 'info', isAppLevel: false },
    { text: 'Message 2', type: 'danger', isAppLevel: false },
    { text: 'Message 3', type: 'warning', isAppLevel: false },
    { text: 'Message 4', type: 'success', isAppLevel: false },
  ];
}
