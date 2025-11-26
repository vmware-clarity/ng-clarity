/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * These helpers are local to Datagrid at the moment, but I wrote them generic enough to move them globally
 * when we have the time. This will be very helpful in future refactors due to Angular upgrades, or simply
 * just to avoid leaks since destroying fixtures is automatic with this.
 */

import { DatagridWillyWonka } from './chocolate/datagrid-willy-wonka';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { MockDisplayModeService } from './providers/display-mode.mock';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { DatagridRowRenderer } from './render/row-renderer';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { DomAdapter } from '../../utils/dom-adapter/dom-adapter';

// Reusable list of providers used in a number of tests
export const DATAGRID_SPEC_PROVIDERS = [
  { provide: DisplayModeService, useClass: MockDisplayModeService },
  Selection,
  Sort,
  FiltersProvider,
  DatagridWillyWonka,
  DomAdapter,
  IfExpandService,
  DatagridIfExpandService,
  Page,
  ColumnsService,
  Items,
  DatagridRenderOrganizer,
  RowActionService,
  ExpandableRowsCount,
  StateDebouncer,
  StateProvider,
  TableSizeService,
  DetailService,
  DatagridRowRenderer,
  KeyNavigationGridController,
];
