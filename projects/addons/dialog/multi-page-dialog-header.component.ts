/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'appfx-dialog-header',
  standalone: false,
  template: `<ng-content></ng-content>`,
})
/**
 * A multi page dialog's header component.
 * It can be used for adding custom components (for example: a toggle button or alerts).
 */
export class DialogHeaderComponent {}
