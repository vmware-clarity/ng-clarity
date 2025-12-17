/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridStringFilterInterface } from '@clr/angular';

export class CaseInsensitiveContainsStringFilter implements ClrDatagridStringFilterInterface<any> {
  constructor(private fieldName: string) {}

  accepts(item: any, search: string): boolean {
    const currentItem: string = '' + item[this.fieldName];
    return currentItem === search || currentItem.toLowerCase().indexOf(search) >= 0;
  }
}
