/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const cdsThemeAttribute = 'cds-theme';

@Component({
  selector: 'app-cds-theme-select',
  template: `
    <clr-select-container>
      <label>Cds Theme</label>
      <select clrSelect (change)="applyTheme($event.target.value)">
        <option value="">None</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </clr-select-container>
  `,
})
export class CdsThemeSelectComponent {
  applyTheme(theme: string) {
    setThemeInDom(theme);
  }
}

function setThemeInDom(theme: string) {
  if (theme) {
    document.body.setAttribute(cdsThemeAttribute, theme);
  } else {
    document.body.removeAttribute(cdsThemeAttribute);
  }
}
