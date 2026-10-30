/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

@Component({
  selector: 'test-zoneless-scheduler',
  template: '{{ value() }}',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ZonelessSchedulerHost {
  readonly value = signal('before');
}

describe('Library zoneless test environment', () => {
  it('runs without Zone and renders a signal notification without forced change detection', async () => {
    expect('Zone' in globalThis).toBe(false);
    const fixture = TestBed.createComponent(ZonelessSchedulerHost);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toBe('before');

    fixture.componentInstance.value.set('after');
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toBe('after');
  });
});
