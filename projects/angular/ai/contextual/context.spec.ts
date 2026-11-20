/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { publishElementContext } from '@clr/angular/utils';

import { ClrContext } from './context';
import { ClrContextModule } from './contextual.module';
import { hasAnnotation } from './dom/annotations';
import { ClrComponentContext, ClrContextSnapshotOptions, ClrPageContext } from './interfaces/context.interface';
import { ClrContextRegistryService } from './providers/context-registry.service';
import { ClrContextService } from './providers/contextual-engine.service';

function nodes(components: ClrComponentContext[]): ClrComponentContext[] {
  return components.flatMap(node => [node, ...nodes(node.children ?? [])]);
}

/** The node labelled `label` in a snapshot read now, without waiting for asynchronous providers. */
function nodeLabelled(label: string, options?: ClrContextSnapshotOptions) {
  const snapshot: ClrPageContext = TestBed.inject(ClrContextService)['read'](options);
  return nodes(snapshot.components).find(node => node.label === label);
}

function labels(options?: ClrContextSnapshotOptions): string[] {
  const snapshot: ClrPageContext = TestBed.inject(ClrContextService)['read'](options);
  return nodes(snapshot.components).map(node => node.label ?? '');
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (show()) {
      <section [clrContext]="userContext"></section>
    }
    <div [clrContext]="emptyContext"></div>
  `,
  standalone: false,
})
class TestComponent {
  readonly show = signal(true);
  readonly state = signal<Record<string, unknown> | null>({ cluster: 'alpha' });
  readonly emptyLabel = signal('');
  readonly userContext = () => ({ label: 'User management', type: 'section', state: this.state() ?? undefined });
  readonly emptyContext = () => ({ label: this.emptyLabel() });
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
      expect.objectContaining({ type: 'section', label: 'User management', state: { cluster: 'alpha' } })
    );
    expect(registry.collect()).toEqual([]);
  });

  it('merges with what a component publishes on the same element', () => {
    const section: Element = fixture.nativeElement.querySelector('section');
    const unpublish = publishElementContext(section, () => ({ state: { total: 3, owner: 'ada' } }));

    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'alpha', total: 3, owner: 'ada' });
    unpublish();
  });

  it('reads its binding at snapshot time', () => {
    fixture.componentInstance.state.set({ cluster: 'omega' });

    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
  });

  it('adds no node for an element while it says nothing', () => {
    expect(labels()).toEqual(['User management']);
  });

  it('leaves the element when it is destroyed, and a label given later shows', () => {
    const section = fixture.nativeElement.querySelector('section');
    fixture.componentInstance.show.set(false);
    fixture.componentInstance.emptyLabel.set('still here');
    fixture.detectChanges();

    expect(hasAnnotation(section)).toBe(false);
    expect(labels()).toEqual(['still here']);
    expect(nodeLabelled('still here')?.type).toBe('group');
  });
});

describe('ClrContext directive, reading its state', () => {
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ClrContextModule], declarations: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('reads a state object edited in place, which no input setter sees', () => {
    (fixture.componentInstance.state() as Record<string, unknown>).cluster = 'omega';

    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
  });

  it('hands out a copy of its state, so an in-place edit reads as a change between two snapshots', () => {
    const state = fixture.componentInstance.state() as Record<string, unknown>;
    const earlier = nodeLabelled('User management')?.state;
    state.cluster = 'omega';

    expect(earlier).toEqual({ cluster: 'alpha' });
    expect(nodeLabelled('User management')?.state).toEqual({ cluster: 'omega' });
    expect(nodeLabelled('User management')?.state).not.toBe(state);
  });

  it('neither throws nor loops while its state refers to itself', () => {
    const circular: Record<string, unknown> = { cluster: 'alpha' };
    circular['self'] = circular;
    fixture.componentInstance.state.set(circular);

    expect(() => fixture.detectChanges()).not.toThrow();
    expect(nodeLabelled('User management')?.state?.['cluster']).toBe('alpha');
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div id="main">
      <section [clrContext]="{ label: 'Visible', state: { step: 1 } }"></section>
      <section data-clr-context-redact>
        <div [clrContext]="{ label: 'Payment', state: { card: '4111' } }"></div>
      </section>
    </div>
    <aside data-clr-context-ignore>
      <div [clrContext]="{ label: 'Chat', state: chat() }"></div>
    </aside>
    <footer><div [clrContext]="{ label: 'Footer notes' }"></div></footer>
    <div id="plain">
      <ng-container [clrContext]="{ label: 'Inside a container', state: { open: true } }"></ng-container>
    </div>
    <div data-clr-context-redact>
      <ng-container [clrContext]="{ label: 'Redacted container', state: { card: '5500' } }"></ng-container>
    </div>
  `,
  standalone: false,
})
class RegionsComponent {
  readonly chat = signal<Record<string, unknown>>({ unread: 1 });
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
});

// A standalone component imports the directive class itself; no module is involved.
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<section [clrContext]="{ label: 'Standalone annotation', state: { step: 2 } }"></section>`,
  imports: [ClrContext],
})
class StandaloneHostComponent {}

describe('ClrContext directive, imported by a standalone component', () => {
  it('annotates the template without ClrContextModule', () => {
    TestBed.configureTestingModule({ imports: [StandaloneHostComponent] });
    const fixture = TestBed.createComponent(StandaloneHostComponent);
    fixture.detectChanges();

    expect(nodeLabelled('Standalone annotation')).toEqual(
      expect.objectContaining({ type: 'group', label: 'Standalone annotation', state: { step: 2 } })
    );
    fixture.destroy();
  });
});

const INVENTORY_CONTEXT = { label: 'Inventory', state: { owner: 'Infrastructure team' } };

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<section [clrContext]="inventory"></section>`,
  imports: [ClrContext],
})
class ConstantHostComponent {
  readonly inventory = INVENTORY_CONTEXT;
}

describe('ClrContext directive, kept out of the DOM', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('takes a constant from the component class and writes nothing to the element', () => {
    TestBed.configureTestingModule({ imports: [ConstantHostComponent] });
    const fixture = TestBed.createComponent(ConstantHostComponent);
    fixture.detectChanges();
    const section: HTMLElement = fixture.nativeElement.querySelector('section');

    expect(nodeLabelled('Inventory')?.state).toEqual({ owner: 'Infrastructure team' });
    expect(section.attributes.length).toBe(0);
    expect(Object.keys(section).filter(key => !key.startsWith('__ng'))).toEqual([]);
    fixture.destroy();
  });

  it('refuses static text, which would be readable in the DOM', () => {
    @Component({
      changeDetection: ChangeDetectionStrategy.Eager,
      template: `<section clrContext="Readable in the DOM"></section>`,
      imports: [ClrContext],
    })
    class StaticTextComponent {}

    TestBed.configureTestingModule({ imports: [StaticTextComponent] });
    const fixture = TestBed.createComponent(StaticTextComponent);

    expect(() => fixture.detectChanges()).toThrowError(/property binding/);
    expect(labels()).not.toContain('Readable in the DOM');
  });
});
