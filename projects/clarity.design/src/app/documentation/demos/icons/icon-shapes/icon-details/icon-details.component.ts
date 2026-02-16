/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnInit } from '@angular/core';

import { getIconVariants, IconVariant } from './icon-variants.helpers';
import { IconGroupsFormOptions } from '../icon-groups/icon-groups.component';
import { Icon } from '../icon-groups/icon-inventory';

@Component({
  selector: 'app-icon-details',
  templateUrl: 'icon-details.component.html',
  styleUrl: './icon-details.component.scss',
  standalone: false,
})
export class IconDetailsComponent implements OnInit {
  @Input() icon: Icon | undefined;
  @Input() formOptions: IconGroupsFormOptions | undefined;

  iconVariants: IconVariant[] | undefined;
  selectedIconVariant: IconVariant | undefined;

  get hasIconVariants() {
    return this.iconVariants && this.iconVariants.length > 1;
  }

  ngOnInit() {
    if (this.icon && this.formOptions) {
      this.iconVariants = getIconVariants(this.icon);
      this.selectedIconVariant = getInitiallySelectedIconVariant(this.iconVariants, this.formOptions);
    }
  }

  downloadSelectedIcon() {
    // This should never happen, but we need to make TypeScript happy.
    if (!this.icon || !this.selectedIconVariant) {
      return;
    }

    const filename = getIconFileName(this.icon.name, this.selectedIconVariant);
    const svg = getSelectedIconVariantSvg();

    downloadTextFile(`${filename}.svg`, svg);
  }
}

function getInitiallySelectedIconVariant(iconVariants: IconVariant[], formOptions: IconGroupsFormOptions) {
  return findExactMatch() || findSolidMatch() || iconVariants[0];

  function findExactMatch() {
    return iconVariants.find(
      iconVariant => iconVariant.solid === formOptions.solid && iconVariant.badge === formOptions.badge
    );
  }

  function findSolidMatch() {
    return iconVariants.find(iconVariant => iconVariant.solid === formOptions.solid);
  }
}

function getIconFileName(iconName: string, iconVariant: IconVariant) {
  let filename = iconName;

  filename += iconVariant?.solid ? '-solid' : '-outline';

  if (iconVariant?.badge?.includes('triangle')) {
    filename += '-alerted';
  } else if (iconVariant?.badge) {
    filename += '-badged';
  }

  return filename;
}

function getSelectedIconVariantSvg() {
  const iconElement = document.querySelector('button.icon-detail-card__variant--selected cds-icon');

  // This should never happen, but we need to make TypeScript happy.
  if (!iconElement || !iconElement.shadowRoot) {
    return '';
  }

  const divElement = document.createElement('div');
  divElement.innerHTML = iconElement.shadowRoot.innerHTML;

  const svgElement = divElement.querySelector('svg');

  // This should never happen, but we need to make TypeScript happy.
  if (!svgElement) {
    return '';
  }

  svgElement.setAttribute('width', '36');
  svgElement.setAttribute('height', '36');
  svgElement.removeAttribute('aria-hidden');

  return svgElement.outerHTML;
}

function downloadTextFile(filename: string, contents: string) {
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(contents)}`);
  linkElement.setAttribute('download', filename);
  linkElement.style.display = 'none';

  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
