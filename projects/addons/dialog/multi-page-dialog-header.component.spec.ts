/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogHeaderComponent } from './multi-page-dialog-header.component';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<appfx-dialog-header><span class="status">{{ status() }}</span></appfx-dialog-header>',
})
class OnPushHostComponent {
  readonly status = signal('Draft');
}

describe('DialogHeaderComponent in an OnPush host', () => {
  let fixture: ComponentFixture<OnPushHostComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({ declarations: [DialogHeaderComponent, OnPushHostComponent] });
    fixture = TestBed.createComponent(OnPushHostComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders changes of the projected content', async () => {
    fixture.componentInstance.status.set('Saved');
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('appfx-dialog-header .status').textContent).toBe('Saved');
  });
});
