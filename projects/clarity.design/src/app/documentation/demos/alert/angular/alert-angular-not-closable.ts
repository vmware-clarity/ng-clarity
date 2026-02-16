/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<clr-alert [clrAlertClosable]="false">
  <clr-alert-item>
    <span class="alert-text">This alert cannot be dismissed.</span>
    <div class="alert-actions">
      <clr-dropdown>
        <button class="dropdown-toggle" clrDropdownTrigger>
          Actions
          <cds-icon shape="angle" direction="down"></cds-icon>
        </button>
        <clr-dropdown-menu clrPosition="bottom-right">
          <a href="..." class="dropdown-item" clrDropdownItem>Shutdown</a>
          <a href="..." class="dropdown-item" clrDropdownItem>Delete</a>
          <a href="..." class="dropdown-item" clrDropdownItem>Reboot</a>
        </clr-dropdown-menu>
      </clr-dropdown>
    </div>
  </clr-alert-item>
</clr-alert>
<clr-alert [clrAlertType]="'warning'">
  <clr-alert-item>
    <span class="alert-text">Try closing this alert.</span>
  </clr-alert-item>
</clr-alert>
`;

@Component({
  selector: 'clr-alert-not-closable-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-not-closable.demo.html',
  standalone: false,
})
export class AlertAngularNotClosableDemo {
  htmlExample = HTML_EXAMPLE;
}
