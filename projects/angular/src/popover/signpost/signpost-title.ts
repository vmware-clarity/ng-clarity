/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-signpost-title',
  template: `<ng-content></ng-content>`,
  host: { '[class.clr-Signpost-title]': 'true' },
})
export class ClrSignpostTitle {}
