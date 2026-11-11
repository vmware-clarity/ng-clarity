/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

/** Loads the grid container-query add-on into the page, as an app would after clr-ui.css. */
@Component({
  selector: 'grid-container-queries-add-on',
  template: '<ng-content></ng-content>',
  styleUrl: '../../../../projects/ui/src/clr-ui-grid-container-queries.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class GridContainerQueriesAddOnComponent {}
