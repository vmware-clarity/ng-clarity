/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'appfx-menu',
  standalone: false,
  template: '<ng-content></ng-content>',
})
export class MockAppfxMenuComponent {
  @Input() declare text: string;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  @Output() closed: EventEmitter<void> = new EventEmitter<void>();
}

@Component({
  selector: 'appfx-menu',
  standalone: true,
  template: '<ng-content></ng-content>',
})
export class MockAppfxMenuStandaloneComponent extends MockAppfxMenuComponent {}
