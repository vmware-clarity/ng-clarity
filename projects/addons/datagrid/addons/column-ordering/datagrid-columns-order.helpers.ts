/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagrid } from '@clr/angular';

import { ColumnDefinition } from '../../shared/column/column-definitions';

interface ClrDatagridPrivateMembers {
  keyNavigation: KeyNavigationController;
}

export interface KeyNavigationController {
  setActiveCell(activeCellElement: HTMLElement): void;
  focusElement(activeCellElement: HTMLElement): void;
}

export function getDatagridKeyNavigationController(datagrid: ClrDatagrid) {
  const datagridPrivateMembers = datagrid as unknown as ClrDatagridPrivateMembers;

  return datagridPrivateMembers.keyNavigation;
}

export function isEqualColumns(column: ColumnDefinition<any> | null, other: ColumnDefinition<any> | null): boolean {
  return (
    !!column &&
    !!other &&
    ((!!column.uid && column.uid === other.uid) || (!!column.displayName && column.displayName === other.displayName))
  );
}
