/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TitleCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ClarityIcons, ClrDropdownModule, ClrIcon, landscapeIcon } from '@clr/angular';

type DensityType = '' | 'regular' | 'compact';

const densityLocalStorageKey = 'density';

@Component({
  selector: 'app-density-toggle',
  template: `
    <clr-dropdown>
      <button
        class="btn btn-link nav-link"
        (mouseenter)="themeIconInverse = false"
        (mouseleave)="themeIconInverse = true"
        clrDropdownTrigger
      >
        <clr-icon
          class="density-toggle-icon"
          size="sm"
          shape="landscape"
          direction="left"
          [inverse]="themeIconInverse"
          [solid]="themeIconInverse"
        ></clr-icon>
        {{ !!density === false ? 'Default' : (density | titlecase) }}
        <clr-icon shape="angle" size="sm" direction="down"></clr-icon>
      </button>
      <clr-dropdown-menu clrPosition="bottom-left" *clrIfOpen>
        @for (option of densityOptions; track option) {
          <div (click)="setTheme(option)" clrDropdownItem>
            {{ !!option === false ? 'Default' : (option | titlecase) }}
          </div>
        }
      </clr-dropdown-menu>
    </clr-dropdown>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        position: relative;
      }
      .dropdown {
        height: 100%;
      }
      button.btn-link {
        &,
        &:hover {
          cds-icon.density-toggle-icon {
            color: var(--clr-header-font-color);
          }
        }
      }
    `,
  ],
  imports: [ClrIcon, ClrDropdownModule, TitleCasePipe],
})
export class DensityToggleComponent implements OnInit {
  protected density = getPreferredDensity();
  protected themeIconInverse = true;
  protected densityOptions: DensityType[] = ['', 'regular', 'compact'];

  constructor() {
    ClarityIcons.addIcons(landscapeIcon);
  }

  ngOnInit() {
    this.setTheme(this.density);
  }

  protected setTheme(density: DensityType) {
    this.density = density;

    document.body.setAttribute('clr-density', density);
    setPreferredTheme(this.density);
  }
}

function getPreferredDensity(): DensityType {
  const storedTheme = localStorage.getItem(densityLocalStorageKey) as DensityType;

  return storedTheme || '';
}

function setPreferredTheme(density: DensityType) {
  return localStorage.setItem(densityLocalStorageKey, density);
}
