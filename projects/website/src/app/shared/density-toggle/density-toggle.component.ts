/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { ClarityIcons, ClrIcon, landscapeIcon } from '@clr/angular';

type DensityType = '' | 'compact';

const densityLocalStorageKey = 'density';

@Component({
  selector: 'app-density-toggle',
  template: `
    <button
      class="btn btn-link nav-link nav-text toggle-density"
      [class.compact-density]="density === 'compact'"
      [attr.aria-checked]="density === 'compact'"
      (click)="toggleDensity()"
      (mouseenter)="densityIconInverse = true"
      (mouseleave)="densityIconInverse = false"
    >
      <clr-icon
        class="density-toggle-icon"
        size="md"
        shape="landscape"
        direction="left"
        [solid]="solidDensityIcon"
      ></clr-icon>
      <span>Compact</span>
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        position: relative;
      }
      button.toggle-density {
        &,
        &:hover {
          clr-icon.density-toggle-icon {
            color: var(--clr-header-font-color);
          }
        }

        &.compact-density {
          font-weight: var(--cds-alias-typography-font-weight-semibold);
        }
      }
    `,
  ],
  imports: [ClrIcon],
})
export class DensityToggleComponent implements OnInit {
  protected density = getPreferredDensity();
  protected densityIconInverse = true;

  constructor() {
    ClarityIcons.addIcons(landscapeIcon);
  }

  protected get solidDensityIcon() {
    const inCompactModeWithoutHover = this.density === 'compact' && !this.densityIconInverse;
    const notInCompactModeWithHover = this.density !== 'compact' && this.densityIconInverse;

    return inCompactModeWithoutHover || notInCompactModeWithHover;
  }

  ngOnInit() {
    this.setDensity(this.density);
  }

  protected toggleDensity() {
    this.setDensity(this.density === 'compact' ? '' : 'compact');
  }

  protected setDensity(density: DensityType) {
    this.density = density;

    document.body.setAttribute('clr-density', density);
    setPreferredDensity(this.density);
  }
}

function getPreferredDensity(): DensityType {
  const storedDensity = localStorage.getItem(densityLocalStorageKey) as DensityType;

  return storedDensity || '';
}

function setPreferredDensity(density: DensityType) {
  return localStorage.setItem(densityLocalStorageKey, density);
}
