/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ClarityIcons, ClrIcon, resizeIcon, shrinkIcon } from '@clr/angular';

type DensityType = '' | 'compact';

const densityLocalStorageKey = 'density';

@Component({
  selector: 'app-density-toggle',
  template: `
    <button
      class="btn btn-link nav-link nav-text toggle-density"
      [attr.aria-label]="'Density: ' + densityLabel"
      (click)="toggleDensity()"
    >
      <span class="density-toggle-frame" aria-hidden="true">
        <clr-icon class="density-toggle-icon" [shape]="isCompact ? 'shrink' : 'resize'"></clr-icon>
      </span>
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
        display: inline-flex;
        align-items: center;
        gap: var(--clr-base-gap-xs);
      }
      .density-toggle-frame {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        width: var(--clr-base-icon-size-m);
        height: var(--clr-base-icon-size-m);
        border: var(--clr-base-border-stroke) solid var(--clr-header-font-color);
        border-radius: var(--clr-base-border-radius-xs);
      }
      clr-icon.density-toggle-icon {
        width: 100%;
        height: 100%;
        color: var(--clr-header-font-color);
        /* resize and shrink point diagonally; rotating them makes the arrows vertical. */
        transform: rotate(-45deg);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ClrIcon],
})
export class DensityToggleComponent implements OnInit {
  protected density = getPreferredDensity();

  constructor() {
    ClarityIcons.addIcons(resizeIcon, shrinkIcon);
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
