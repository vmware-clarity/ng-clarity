/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'appfx-menu-action',
  standalone: false,
  template: '<ng-content></ng-content>',
})
export class MockAppfxMenuActionComponent {
  @Input() actionId: string;

  @Input() iconClass?: string;

  @Input() text?: string;

  @Input() shortcut?: string;

  @Input() enabled?: boolean = true;

  @Output() handle: EventEmitter<void> = new EventEmitter<void>(true);
}

@Component({
  selector: 'appfx-menu-action',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MockAppfxMenuActionStandaloneComponent extends MockAppfxMenuActionComponent {}
