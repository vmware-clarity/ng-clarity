/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrContextModule } from './contextual.module';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextEngineService } from './providers/contextual-engine.service';

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
    TestBed.configureTestingModule({ imports: [ClrContextModule], declarations: [TestComponent] });
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
    TestBed.configureTestingModule({ imports: [ClrContextModule], declarations: [TestComponent] });
    registry = TestBed.inject(ClrContextRegistryService);
    changes = 0;
    registry.changes$.subscribe(() => changes++);
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

  it('hands out a copy of its state, so an in-place edit reads as a change between two snapshots', () => {
    const state = fixture.componentInstance.state as Record<string, unknown>;
    const earlier = registry.collect()[0].state;
    state.cluster = 'omega';
    fixture.detectChanges();

    expect(earlier).toEqual({ cluster: 'alpha' });
    expect(registry.collect()[0].state).toEqual({ cluster: 'omega' });
    expect(registry.collect()[0].state).not.toBe(state);
  });

  it('neither throws nor contributes while its state cannot be serialised', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    fixture.componentInstance.state = circular;

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(registry.collect()).toEqual([]);
    const before = changes;
    fixture.detectChanges();
    expect(changes).toBe(before);
  });

  it('stays quiet while nothing changed', () => {
    const before = changes;
    fixture.detectChanges();
    fixture.detectChanges();

    expect(changes).toBe(before);
  });
});

@Component({
  template: `
    <div id="main">
      <section clrContext="Visible" [clrContextState]="{ step: 1 }"></section>
      <section data-clr-context-redact>
        <div clrContext="Payment" [clrContextState]="{ card: '4111' }"></div>
      </section>
    </div>
    <aside data-clr-context-ignore>
      <div clrContext="Chat" [clrContextState]="chat"></div>
    </aside>
    <footer><div clrContext="Footer notes"></div></footer>
  `,
  standalone: false,
})
class RegionsComponent {
  chat: Record<string, unknown> = { unread: 1 };
}

describe('ClrContext directive, following the element it annotates', () => {
  let fixture: ComponentFixture<RegionsComponent>;
  let engine: ClrContextEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrContextModule], declarations: [RegionsComponent] });
    fixture = TestBed.createComponent(RegionsComponent);
    fixture.detectChanges();
    engine = TestBed.inject(ClrContextEngineService);
  });

  afterEach(() => fixture.destroy());

  it('reports an annotation inside a redacted region without its state', () => {
    const regions = engine.getSnapshot().regions;

    expect(regions).toContain(jasmine.objectContaining({ label: 'Visible', state: { step: 1 } }));
    expect(regions).toContain({ type: 'region', label: 'Payment', state: { redacted: true } });
    expect(JSON.stringify(regions)).not.toContain('4111');
  });

  it('leaves out an annotation inside an ignored region', () => {
    expect(engine.getSnapshot().regions.map(region => region.label)).not.toContain('Chat');
  });

  it('leaves out an annotation outside the snapshot root, and keeps one that contains it', () => {
    const labels = engine.getSnapshot({ rootSelector: '#main' }).regions.map(region => region.label);

    expect(labels).toContain('Visible');
    expect(labels).not.toContain('Footer notes');
  });

  it('does not announce changes to an annotation inside an ignored region', () => {
    const registry = TestBed.inject(ClrContextRegistryService);
    let changes = 0;
    registry.changes$.subscribe(() => changes++);

    fixture.componentInstance.chat = { unread: 2 };
    fixture.detectChanges();

    expect(changes).toBe(0);
  });
});
