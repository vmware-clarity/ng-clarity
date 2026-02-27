/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { arrowIcon, ClarityIcons, ClrIcon } from '@clr/angular';

import { ThemedImageComponent } from '../themed-image/themed-image.component';

export interface LinkCardsLink {
  routerLink: string;
  text: string;
  hexagonColor: 'status-info' | 'gray' | 'utility-tangerine' | 'sequential-blue';
  iconShape: string;
}

@Component({
  selector: 'app-link-cards',
  templateUrl: './link-cards.component.html',
  styleUrl: './link-cards.component.scss',
  imports: [RouterModule, ClrIcon, ThemedImageComponent],
})
export class LinkCardsComponent {
  @Input({ required: true }) links: LinkCardsLink[] | undefined;
  readonly linkColWidth = input(3);

  constructor() {
    ClarityIcons.addIcons(arrowIcon);
  }
}
