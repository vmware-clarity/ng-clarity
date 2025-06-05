/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Params, Router } from '@angular/router';

export const cdsThemeAttribute = 'cds-theme';
export const clrDensityAttribute = 'clr-density';

@Component({
  selector: 'app-cds-theme-select',
  template: `
    <clr-select-container>
      <label>Cds Theme</label>
      <select #cdsThemeSelectElement clrSelect [value]="theme" (change)="applyTheme(cdsThemeSelectElement.value)">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </clr-select-container>
    <clr-select-container>
      <label>Clr Density</label>
      <select
        #clrDensitySelectElement
        clrSelect
        [value]="density"
        (change)="applyDensity(clrDensitySelectElement.value)"
      >
        <option value="">None</option>
        <option value="regular">Regular</option>
        <option value="compact">Compact</option>
      </select>
    </clr-select-container>
  `,
})
export class CdsThemeSelectComponent implements OnInit, OnDestroy {
  theme = 'light';
  density = '';

  constructor(private readonly router: Router) {}

  ngOnInit() {
    const queryParams = getQueryParams();
    this.applyTheme(queryParams[cdsThemeAttribute] || this.theme);
    this.applyDensity(queryParams[clrDensityAttribute] || this.density);
  }

  ngOnDestroy() {
    this.applyTheme(null);
    this.applyDensity('');
  }

  applyTheme(theme: string) {
    this.theme = theme || '';

    setAttributeInDom(theme, cdsThemeAttribute);
    this.setAttributeInQueryString(theme, cdsThemeAttribute);
  }

  applyDensity(density: string) {
    this.density = density || '';

    setAttributeInDom(density, clrDensityAttribute);
    this.setAttributeInQueryString(density, clrDensityAttribute);
  }

  private setAttributeInQueryString(value: string, attribute: string) {
    this.router.navigate([window.location.pathname.replace(/^\/demo/, '')], {
      queryParams: { ...getQueryParams(), [attribute]: value || null },
      replaceUrl: true,
    });
  }
}

export function getAttributeFromDom(attribute: string) {
  return document.body.getAttribute(attribute);
}

function setAttributeInDom(theme: string, attribute: string) {
  if (theme) {
    document.body.setAttribute(attribute, theme);
  } else {
    document.body.removeAttribute(attribute);
  }
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
