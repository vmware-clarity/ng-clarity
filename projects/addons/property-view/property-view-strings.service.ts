/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

/**
 * User-visible strings used in the 'appfx-property-view' library.
 * Fields are read-only to avoid accidentally modifying the values and affecting all
 * components in the application.
 *
 * Strings are in English only. If you need to provide localized strings:
 * - extend this class
 * - override all fields with localized values
 * - provide instance in the module where you use PropertyViewModule
 *
 * ```
 * @NgModule({
 *    ...
 *    providers: [
 *       { provide: PropertyViewStrings, useClass: LocalizedPropertyViewStrings },
 *    ]
 * })
 * export class AppModule {}
 * ```
 */
@Injectable()
export class PropertyViewStrings {
  /**
   * Toggle button aria-label.
   */
  readonly toggle: string = 'Toggle {0} section';

  /**
   * Actions drop-down label.
   */
  readonly actions: string = 'Actions';

  /**
   * Aria label describing number of section items in a property view
   */
  readonly categoryListItemsAreaLabel: string = '{0} items grouped in {1} sections.';

  /**
   * Aria label describing number section items in a property view when one item
   */
  readonly categoryListItemAreaLabel: string = '{0} items grouped in 1 section.';
}
