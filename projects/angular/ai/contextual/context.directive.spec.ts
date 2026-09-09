/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrContextualModule } from './contextual.module';
import { ClrContextRegistryService } from './providers/context-registry.service';

@Component({
  template: `
    @if (show) {
      <section clrContext="User management" clrContextType="section" [clrContextState]="state"></section>
    }
    <div [clrContext]="emptyLabel"></div>
  `,
  standalone: false,
})
class TestComponent {
  show = true;
  state: Record<string, unknown> | null = { cluster: 'alpha' };
  emptyLabel = '';
}

describe('ClrContext directive', () => {
  let fixture: ComponentFixture<TestComponent>;
  let registry: ClrContextRegistryService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrContextualModule], declarations: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    registry = TestBed.inject(ClrContextRegistryService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('contributes its label, type and state to snapshots', () => {
    const contexts = registry.collect();

    expect(contexts).toEqual([{ type: 'section', label: 'User management', state: { cluster: 'alpha' } }]);
  });

  it('reads its inputs at snapshot time', () => {
    fixture.componentInstance.state = { cluster: 'omega' };
    fixture.detectChanges();

    expect(registry.collect()[0].state).toEqual({ cluster: 'omega' });
  });

  it('contributes nothing while it has no label and no state', () => {
    fixture.componentInstance.show = false;
    fixture.detectChanges();

    expect(registry.collect()).toEqual([]);
  });

  it('unregisters when the annotated element is destroyed', () => {
    fixture.componentInstance.show = false;
    fixture.detectChanges();
    fixture.componentInstance.emptyLabel = 'still here';
    fixture.detectChanges();

    expect(registry.collect()).toEqual([{ type: 'region', label: 'still here' }]);
  });
});

describe('ClrContext directive, announcing its changes', () => {
  let fixture: ComponentFixture<TestComponent>;
  let registry: ClrContextRegistryService;
  let changes: number;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrContextualModule], declarations: [TestComponent] });
    registry = TestBed.inject(ClrContextRegistryService);
    changes = 0;
    registry.changes.subscribe(() => changes++);
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('announces a state object replaced by the application', () => {
    const before = changes;
    fixture.componentInstance.state = { cluster: 'omega' };
    fixture.detectChanges();

    expect(changes).toBe(before + 1);
  });

  it('announces a state object edited in place, which no input setter sees', () => {
    const before = changes;
    (fixture.componentInstance.state as Record<string, unknown>).cluster = 'omega';
    fixture.detectChanges();

    expect(changes).toBe(before + 1);
    expect(registry.collect()[0].state).toEqual({ cluster: 'omega' });
  });

  it('stays quiet while nothing changed', () => {
    const before = changes;
    fixture.detectChanges();
    fixture.detectChanges();

    expect(changes).toBe(before);
  });
});
