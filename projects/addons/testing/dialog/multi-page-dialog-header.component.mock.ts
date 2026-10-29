/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'appfx-dialog-header',
  standalone: false,
  template: `<ng-content></ng-content>`,
})
export class MockAppfxDialogHeaderComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'appfx-dialog-header',
  standalone: true,
  template: `<ng-content></ng-content>`,
})
export class MockAppfxDialogHeaderStandaloneComponent extends MockAppfxDialogHeaderComponent {}
