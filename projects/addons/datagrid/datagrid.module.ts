/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { DragDropModule as CdkDragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule as CdkOverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, Optional, SkipSelf, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxA11yModule } from '@clr/addons/a11y';
import { AppfxDatagridFiltersModule } from '@clr/addons/datagrid-filters';
import {
  ClrCheckboxModule,
  ClrDatagridModule,
  ClrDropdownModule,
  ClrInputModule,
  ClrLoadingModule,
} from '@clr/angular';
import { ClarityIcons, ClrIcon, dragHandleIcon } from '@clr/angular';

import { DatagridActionBarDropdownRepositionDirective } from './addons/action-bar/datagrid-action-bar-dropdown-reposition.directive';
import { DatagridActionBarComponent } from './addons/action-bar/datagrid-action-bar.component';
import { DatagridColumnsOrderModule } from './addons/column-ordering/datagrid-columns-order.module';
import { DatagridColumnToggleComponent } from './addons/column-toggle/datagrid-column-toggle.component';
import { DatagridPageDirective } from './addons/datagrid-page/datagrid-page.directive';
import { CsvHelperService } from './addons/export/csv-helper.service';
import { ExportDatagridComponent } from './addons/export/export-datagrid.component';
import { ExportProviderService } from './addons/export/export-provider.service';
import { DatagridPersistSettingsDirective } from './addons/persist-settings/datagrid-persist-settings.directive';
import { DatagridContentNoWrapDirective } from './addons/user-preferences/datagrid-content-no-wrap.directive';
import { DatagridCellContainerComponent } from './datagrid-cell-container.component';
import { DatagridComponent } from './datagrid.component';
import { DatagridFilterContainerComponent } from './filters/datagrid-filter-container.component';
import { DatagridFilterComponent } from './filters/datagrid-filter.component';
import { DatagridStrings } from './i18n/datagrid-strings.service';
import { appfxDatagridErrorNotifiableToken, ErrorNotifiable } from './interfaces/tokens';
import { IsRowSelectablePipe } from './pipes/is-row-selectable.pipe';
import { DatagridPreserveSelectionDirective } from './preserve-selection/datagrid-preserve-selection.directive';

export function datagridStringsServiceFactory(existing: DatagridStrings): DatagridStrings {
  return existing || new DatagridStrings();
}

const exportedComponents: Array<Type<any>> = [DatagridComponent, DatagridActionBarComponent, DatagridFilterComponent];

const exportedDirectives: Array<Type<any>> = [
  DatagridPageDirective,
  DatagridPersistSettingsDirective,
  DatagridPreserveSelectionDirective,
  DatagridContentNoWrapDirective,
];

@NgModule({
  declarations: [
    ...exportedComponents,
    ...exportedDirectives,
    DatagridActionBarDropdownRepositionDirective,
    DatagridCellContainerComponent,
    DatagridColumnToggleComponent,
    DatagridFilterContainerComponent,
    ExportDatagridComponent,
    IsRowSelectablePipe,
  ],
  imports: [
    AppfxA11yModule,
    AppfxDatagridFiltersModule,
    CdkA11yModule,
    CdkDragDropModule,
    CdkOverlayModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrDropdownModule,
    ClrIcon,
    ClrInputModule,
    ClrLoadingModule,
    CommonModule,
    DatagridColumnsOrderModule,
    FormsModule,
  ],
  exports: [...exportedComponents, ...exportedDirectives],
  providers: [
    CsvHelperService,
    ExportProviderService,
    {
      // This pattern allows the importer of this module to specify its own DatagridStrings.
      provide: DatagridStrings,
      useFactory: datagridStringsServiceFactory,
      deps: [[new Optional(), new SkipSelf(), DatagridStrings]],
    },
  ],
})
export class AppfxDatagridModule {
  constructor() {
    ClarityIcons.addIcons(dragHandleIcon);
  }

  static forRoot(errorNotifiableService: Type<ErrorNotifiable>): ModuleWithProviders<AppfxDatagridModule> {
    return {
      ngModule: AppfxDatagridModule,
      providers: [{ provide: appfxDatagridErrorNotifiableToken, useClass: errorNotifiableService }],
    };
  }
}
