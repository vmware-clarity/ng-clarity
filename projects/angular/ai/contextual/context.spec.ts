/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { publishElementContext } from '@clr/angular/utils';

import { ClrContext } from './context';
import { ClrContextModule } from './contextual.module';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextService } from './providers/contextual-engine.service';

function nodes(components: ClrComponentContext[]): ClrComponentContext[] {
  return components.flatMap(node => [node, ...nodes(node.children ?? [])]);
}

/** The node labelled `label` in a snapshot read now, without waiting for asynchronous providers. */
function nodeLabelled(label: string, options?: ClrContextSnapshotOptions, untrusted = false) {
  const snapshot: ClrPageContext = TestBed.inject(ClrContextService)['read'](options, untrusted);
  return nodes(snapshot.components).find(node => node.label === label);
}

function labels(options?: ClrContextSnapshotOptions): string[] {
  const snapshot: ClrPageContext = TestBed.inject(ClrContextService)['read'](options, false);
  return nodes(snapshot.components).map(node => node.label ?? '');
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (show) {
      <section
        clrContext="User management"
        clrContextType="section"
        [clrContextState]="state"
        [clrContextPublicKeys]="publicKeys"
      ></section>
    }
    <div [clrContext]="emptyLabel"></div>
  `,
  standalone: false,
})
class TestComponent {
  show = true;
  state: Record<string, unknown> | null = { cluster: 'alpha' };
  publicKeys: string[] | null = null;
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

  it('describes the element it sits on with its label, type and state', () => {
    expect(nodeLabelled('User management')).toEqual(
      jasmine.objectContaining({ type: 'section', label: 'User management', state: { cluster: 'alpha' } })
    );
    expect(registry.collect()).toEqual([]);
  });

  it('shares with untrusted callers only the state keys it marks public', () => {
    fixture.componentInstance.state = { cluster: 'alpha', query: 's3cr3t' };
    fixture.detectChanges();
    expect(nodeLabelled('User management', undefined, true)?.state).toEqual({ withheld: true });

    fixture.componentInstance.publicKeys = ['cluster'];
    fixture.detectChanges();
    expect(nodeLabelled('User management', undefined, true)?.state).toEqual({ cluster: 'alpha', withheld: true });
    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'alpha', query: 's3cr3t' });
  });

  it('merges with what a component publishes on the same element, each source keeping its own public keys', () => {
    const section: Element = fixture.nativeElement.querySelector('section');
    const unpublish = publishElementContext(section, () => ({
      state: { total: 3, owner: 'ada' },
      publicKeys: ['total'],
    }));
    fixture.componentInstance.publicKeys = ['cluster'];
    fixture.detectChanges();

    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'alpha', total: 3, owner: 'ada' });
    expect(nodeLabelled('User management', undefined, true)?.state).toEqual({
      cluster: 'alpha',
      total: 3,
      withheld: true,
    });
    unpublish();
  });

  it('marks state withheld only when a private value had something in it', () => {
    fixture.componentInstance.state = { cluster: 'alpha', query: '', picks: [] };
    fixture.componentInstance.publicKeys = ['cluster'];
    fixture.detectChanges();
    expect(nodeLabelled('User management', undefined, true)?.state).toEqual({ cluster: 'alpha' });
  });

  it('reads its inputs at snapshot time', () => {
    fixture.componentInstance.state = { cluster: 'omega' };
    fixture.detectChanges();

    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
  });

  it('adds no node for an element while it says nothing', () => {
    expect(labels()).toEqual(['User management']);
  });

  it('leaves the element when it is destroyed, and a label given later shows', () => {
    const section = fixture.nativeElement.querySelector('section');
    fixture.componentInstance.show = false;
    fixture.componentInstance.emptyLabel = 'still here';
    fixture.detectChanges();

    expect('clrContextAnnotation' in section).toBeFalse();
    expect(labels()).toEqual(['still here']);
    expect(nodeLabelled('still here')?.type).toBe('group');
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
    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
  });

  it('hands out a copy of its state, so an in-place edit reads as a change between two snapshots', () => {
    const state = fixture.componentInstance.state as Record<string, unknown>;
    const earlier = nodeLabelled('User management')?.state;
    state.cluster = 'omega';
    fixture.detectChanges();

    expect(earlier).toEqual({ cluster: 'alpha' });
    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
    expect(nodeLabelled('User management')?.state).not.toBe(state);
  });

  it('neither throws nor contributes while its state cannot be serialised', () => {
    const circular: Record<string, unknown> = {};
    circular['self'] = circular;
    fixture.componentInstance.state = circular;

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(labels()).not.toContain('User management');
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
  changeDetection: ChangeDetectionStrategy.Eager,
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
    <div id="plain">
      <ng-container clrContext="Inside a container" [clrContextState]="{ open: true }"></ng-container>
    </div>
    <div data-clr-context-redact>
      <ng-container clrContext="Redacted container" [clrContextState]="{ card: '5500' }"></ng-container>
    </div>
  `,
  standalone: false,
})
class RegionsComponent {
  chat: Record<string, unknown> = { unread: 1 };
}

describe('ClrContext directive, following the element it annotates', () => {
  let fixture: ComponentFixture<RegionsComponent>;
  let engine: ClrContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrContextModule], declarations: [RegionsComponent] });
    fixture = TestBed.createComponent(RegionsComponent);
    fixture.detectChanges();
    engine = TestBed.inject(ClrContextService);
  });

  afterEach(() => fixture.destroy());

  it('withholds the state of an annotation inside a redacted region', async () => {
    const snapshot = await engine.snapshot();

    expect(nodeLabelled('Visible')?.state).toEqual({ step: 1 });
    expect(JSON.stringify(snapshot)).not.toContain('4111');
    expect(snapshot.regions).toEqual([]);
  });

  it('describes the element an annotation on an <ng-container> sits in', async () => {
    const plain = nodes((await engine.snapshot()).components).find(node => node.state?.['open'] === true);

    expect(plain?.label).toBe('Inside a container');
    expect(JSON.stringify(await engine.snapshot())).not.toContain('5500');
  });

  it('leaves out an annotation inside an ignored region', () => {
    expect(labels()).not.toContain('Chat');
  });

  it('leaves out an annotation outside the snapshot root', () => {
    expect(labels({ root: '#main' })).toContain('Visible');
    expect(labels({ root: '#main' })).not.toContain('Footer notes');
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

// A standalone component imports the directive class itself; no module is involved.
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<section clrContext="Standalone annotation" [clrContextState]="{ step: 2 }"></section>`,
  imports: [ClrContext],
})
class StandaloneHostComponent {}

describe('ClrContext directive, imported by a standalone component', () => {
  it('annotates the template without ClrContextModule', () => {
    TestBed.configureTestingModule({ imports: [StandaloneHostComponent] });
    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.detectChanges();

    expect(nodeLabelled('Standalone annotation')).toEqual(
      jasmine.objectContaining({ type: 'group', label: 'Standalone annotation', state: { step: 2 } })
    );
    fixture.destroy();
  });
});
