/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'appfx-card-container',
  standalone: false,
  template: '',
})
export class MockAppfxCardContainerComponent {
  @Input() containerId: string;

  @Input() cards: unknown[] = [];

  @Input() persistenceStore?: unknown;

  @Input() showCardContainerSettings: boolean = true;

  @Input() dragDropEnabled: boolean = true;
}

@Component({
  selector: 'appfx-card-container',
  standalone: true,
  template: '',
})
export class MockAppfxCardContainerStandaloneComponent extends MockAppfxCardContainerComponent {}
