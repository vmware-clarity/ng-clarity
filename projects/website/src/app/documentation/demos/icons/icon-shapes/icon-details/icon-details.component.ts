/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { JsonPipe, NgClass } from '@angular/common';
import { Component, input, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ClrIcon, ClrIconModule } from '@clr/angular';

import { IconAliasesPipe } from './icon-aliases.pipe';
import { IconAriaLabelPipe } from './icon-aria-label.pipe';
import { IconCodePipe } from './icon-code.pipe';
import { getIconVariants, IconVariant } from './icon-variants.helpers';
import { CodeSnippetComponent } from '../../../../../shared/code-snippet/code-snippet.component';
import { IconGroupsFormOptions } from '../icon-groups/icon-groups.component';
import { Icon } from '../icon-groups/icon-inventory';

@Component({
  selector: 'app-icon-details',
  templateUrl: 'icon-details.component.html',
  styleUrl: './icon-details.component.scss',
  imports: [
    CodeSnippetComponent,
    NgClass,
    ClrIcon,
    ClrIconModule,
    RouterLink,
    JsonPipe,
    IconAliasesPipe,
    IconAriaLabelPipe,
    IconCodePipe,
  ],
})
export class IconDetailsComponent implements OnInit {
  @Input() icon: Icon | undefined;
  readonly formOptions = input<IconGroupsFormOptions | undefined>(undefined);

  iconVariants: IconVariant[] | undefined;
  selectedIconVariant: IconVariant | undefined;

  get hasIconVariants() {
    return this.iconVariants && this.iconVariants.length > 1;
  }

  ngOnInit() {
    const formOptions = this.formOptions();
    if (this.icon && formOptions) {
      this.iconVariants = getIconVariants(this.icon);
      this.selectedIconVariant = getInitiallySelectedIconVariant(this.iconVariants, formOptions);
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
