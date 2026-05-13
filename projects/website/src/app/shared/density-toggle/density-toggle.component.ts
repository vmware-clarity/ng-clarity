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
    <a
      href="javascript://"
      class="nav-link nav-text toggle-density"
      [class.toggle-density-compacted]="density === 'compact'"
      [attr.aria-label]="'toggle to ' + (density === 'compact' ? 'Compact' : 'Default') + ' density'"
      (click)="toggleDensity()"
      (mouseenter)="iconInverse = false"
      (mouseleave)="iconInverse = true"
    >
      <clr-icon
        class="density-toggle-icon"
        size="md"
        shape="landscape"
        direction="left"
        [solid]="solidDensityIcon"
      ></clr-icon>
      <span>Compact</span>
    </a>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        position: relative;
      }
      a.toggle-density {
        &.toggle-density-compacted {
          font-weight: var(--cds-alias-typography-font-weight-semibold);
        }
      }
    `,
  ],
  imports: [ClrIcon],
})
export class DensityToggleComponent implements OnInit {
  protected density = getPreferredDensity();
  protected iconInverse = true;

  constructor() {
    ClarityIcons.addIcons(landscapeIcon);
  }

  protected get solidDensityIcon() {
    const inCompactModeWithoutHover = this.density === 'compact' && !this.iconInverse;
    const notInCompactModeWithHover = this.density !== 'compact' && this.iconInverse;

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
