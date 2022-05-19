/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

export const cdsThemeAttribute = 'cds-theme';

@Component({
  selector: 'app-cds-theme-select',
  template: `
    <clr-select-container>
      <label>Cds Theme</label>
      <select clrSelect [value]="theme" (change)="applyTheme($event.target.value)">
        <option value="">None</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </clr-select-container>
  `,
})
export class CdsThemeSelectComponent implements OnInit, OnDestroy {
  theme = '';

  constructor(private readonly router: Router) {}

  ngOnInit() {
    this.applyTheme(getCdsThemeFromQueryString());
  }

  ngOnDestroy() {
    this.applyTheme(null);
  }

  applyTheme(theme: string) {
    this.theme = theme || '';

    setThemeInDom(theme);
    this.setThemeInQueryString(theme);
  }

  private setThemeInQueryString(theme: string) {
    this.router.navigate([window.location.pathname.replace(/^\/demo/, '')], {
      queryParams: { ...getQueryParams(), [cdsThemeAttribute]: theme || null },
      replaceUrl: true,
    });
  }
}

export function getCdsThemeFromDom() {
  return document.body.getAttribute(cdsThemeAttribute);
}

function setThemeInDom(theme: string) {
  if (theme) {
    document.body.setAttribute(cdsThemeAttribute, theme);
  } else {
    document.body.removeAttribute(cdsThemeAttribute);
  }
}

function getCdsThemeFromQueryString() {
  return getQueryParams()[cdsThemeAttribute];
}

function getQueryParams() {
  // This code uses `window.location.search` instead of the Angular router because of this bug: https://github.com/angular/angular/issues/12157.
  const urlSearchParams = new URLSearchParams(window.location.search);

  const queryParams: Params = {};

  urlSearchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return queryParams;
}
