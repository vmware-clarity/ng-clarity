/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const exampleTs = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClrDatagridModule, ClrIcon } from '@clr/angular';
import { Inventory } from './inventory/inventory';
import { User } from './inventory/user';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  providers: [Inventory],
  imports: [CommonModule, ClrDatagridModule, ClrIcon],
})
export class ExampleComponent {
  users: User[];

  constructor(public inventory: Inventory) {
    this.inventory.size = 10;
    this.inventory.reset();
    this.users = this.inventory.all;
  }
}
`;

const exampleCss = `
@use '@cds/core/tokens/tokens.scss';

.color-square {
  display: inline-block;
  vertical-align: text-bottom;
  height: tokens.$cds-global-space-7;
  width: tokens.$cds-global-space-7;
  border: tokens.$cds-alias-object-border-width-100 solid tokens.$cds-global-color-construction-1000;
  border-radius: tokens.$cds-global-space-3;
}

.color-filter {
  display: block;
  width: tokens.$cds-global-space-15;
}

.color-selectable {
  cursor: pointer;
  margin: tokens.$cds-global-space-2;
  opacity: 0.2;

  &:hover,
  &.color-selected {
    opacity: 1;
  }
}

.footer-counters {
  display: inline-block;
  border-right: tokens.$cds-alias-object-border-color solid tokens.$cds-alias-object-border-width-100;
  padding: 0 tokens.$cds-global-space-5;
  margin: 0 tokens.$cds-global-space-5;
  font-weight: tokens.$cds-global-typography-font-weight-semibold;
}

.footer-button {
  min-width: tokens.$cds-global-space-8;
  margin: 0 0 0 tokens.$cds-global-space-5;
  padding: 0;
}
`;

/* eslint-disable @typescript-eslint/no-var-requires */
const additionalFiles = {
  'inventory/inventory.ts': '',
  'inventory/inventory-items.json': JSON.stringify(require('../inventory/inventory-items.json')),
  'inventory/pokemon.ts': '',
  'inventory/user.ts': '',
  'inventory/values.ts': '',
};
/* eslint-enable @typescript-eslint/no-var-requires */

export const CommonFiles = {
  additionalFiles,
  exampleCss,
  exampleTs,
};
