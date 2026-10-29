/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'appfx-property-view',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class MockPropertyViewComponent {
  @Input() data: any;
  @Input() config: any;
}

@Component({
  selector: 'appfx-property-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '',
})
export class MockPropertyViewStandaloneComponent extends MockPropertyViewComponent {}
