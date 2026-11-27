/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClarityIcons, ClrIcon, portraitIcon } from '@clr/angular';

type DensityType = '' | 'compact';

const densityLocalStorageKey = 'density';

@Component({
  selector: 'app-density-toggle',
  template: `
    <button
      class="btn btn-link nav-link toggle-density"
      [class.compact-density]="isCompact"
      [attr.aria-label]="'Density: ' + densityLabel"
      (click)="toggleDensity()"
    >
      <clr-icon class="density-toggle-icon" size="md" shape="portrait" [solid]="isCompact"></clr-icon>
      <span>{{ densityLabel }}</span>
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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ClrIcon],
})
export class DensityToggleComponent implements OnInit {
  protected density = getPreferredDensity();

  constructor() {
    ClarityIcons.addIcons(portraitIcon);
  }

  protected get isCompact() {
    return this.density === 'compact';
  }

  protected get densityLabel() {
    return this.isCompact ? 'Compact' : 'Regular';
  }

  ngOnInit() {
    this.setDensity(this.density);
  }

  protected toggleDensity() {
    this.setDensity(this.isCompact ? '' : 'compact');
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
