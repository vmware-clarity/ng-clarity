/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrModal } from './modal';
import { ClrModalModule } from './modal.module';
import { ClrSidePanel } from './side-panel';
import { ClrSidePanelModule } from './side-panel.module';

// ClrModal and ClrSidePanel are OnPush. These specs check that bindings and the imperative methods still render:
// - under an OnPush host driven by signals, with automatic change detection (zoneless);
// - under an Eager host with plain fields, where only the host is checked after each change, as a Zone app's tick does.
// The exhaustive checkNoChanges of the test providers fails any check that leaves a stale binding behind.

@Component({
  template: `
    <clr-modal
      [(clrModalOpen)]="open"
      [clrModalSize]="size()"
      [clrModalClosable]="closable()"
      [clrModalLabelledById]="labelledBy()"
      [clrModalSkipAnimation]="true"
    >
      <h3 class="modal-title">{{ title() }}</h3>
      <div class="modal-body">
        <p class="text">{{ text() }}</p>
        @if (late()) {
          <p class="late">Late</p>
        }
      </div>
      @if (late()) {
        <div class="modal-footer"><button class="late-footer" (click)="open.set(false)">Done</button></div>
      }
    </clr-modal>
    <clr-modal [clrModalSkipAnimation]="true">
      <ng-template #clrInternalModalContentTemplate>
        <p class="raw-content">{{ text() }}</p>
      </ng-template>
    </clr-modal>
    <clr-side-panel
      [(clrSidePanelOpen)]="panelOpen"
      [clrSidePanelPinnable]="true"
      [clrSidePanelBackdrop]="backdrop()"
      [clrSidePanelPosition]="position()"
      [clrSidePanelSkipAnimation]="true"
    >
      <h3 class="side-panel-title">Panel</h3>
      <div class="side-panel-body">
        <p class="panel-text">{{ text() }}</p>
      </div>
    </clr-side-panel>
  `,
  imports: [ClrModalModule, ClrSidePanelModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class SignalHost {
  @ViewChild(ClrModal) modal: ClrModal;
  @ViewChild(ClrSidePanel) panel: ClrSidePanel;

  readonly open = signal(false);
  readonly size = signal('md');
  readonly closable = signal(true);
  readonly labelledBy = signal<string>(undefined);
  readonly panelOpen = signal(false);
  readonly backdrop = signal(true);
  readonly position = signal('right');
  readonly title = signal('Title');
  readonly text = signal('First');
  readonly late = signal(false);
}

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="open" [clrModalSize]="size" [clrModalSkipAnimation]="true">
      <h3 class="modal-title">Title</h3>
      <div class="modal-body">
        <p class="text">{{ text }}</p>
      </div>
    </clr-modal>
    <clr-modal [clrModalSkipAnimation]="true">
      <ng-template #clrInternalModalContentTemplate>
        <p class="raw-content">{{ text }}</p>
      </ng-template>
    </clr-modal>
    <clr-side-panel
      [(clrSidePanelOpen)]="panelOpen"
      [clrSidePanelPinnable]="true"
      [clrSidePanelPosition]="position"
      [clrSidePanelSkipAnimation]="true"
    >
      <h3 class="side-panel-title">Panel</h3>
      <div class="side-panel-body">
        <p class="panel-text">{{ text }}</p>
      </div>
    </clr-side-panel>
  `,
  imports: [ClrModalModule, ClrSidePanelModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
class ZoneAppHost {
  @ViewChild(ClrModal) modal: ClrModal;
  @ViewChild(ClrSidePanel) panel: ClrSidePanel;

  open = false;
  size = 'md';
  panelOpen = false;
  position = 'right';
  text = 'First';
}

function query<T extends Element = HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T | null {
  return fixture.nativeElement.querySelector(selector);
}

function dialog(fixture: ComponentFixture<unknown>, host: 'clr-modal' | 'clr-side-panel' = 'clr-modal') {
  return query(fixture, `${host} .modal-dialog`);
}

function pinShape(fixture: ComponentFixture<unknown>) {
  return query(fixture, '.pinnable cds-icon').getAttribute('shape');
}

function rawModal(fixture: ComponentFixture<unknown>): ClrModal {
  return fixture.debugElement.queryAll(el => el.componentInstance instanceof ClrModal)[1].componentInstance;
}

describe('Modal change detection: OnPush host driven by signals', () => {
  let fixture: ComponentFixture<SignalHost>;
  let host: SignalHost;

  beforeEach(async () => {
    fixture = TestBed.createComponent(SignalHost);
    fixture.autoDetectChanges();
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders open() and close() from code, with the host class and the open output', async () => {
    host.modal.open();
    await fixture.whenStable();
    expect(dialog(fixture)).not.toBeNull();
    expect(query(fixture, 'clr-modal').classList).toContain('open');
    expect(host.open()).toBe(true);

    host.modal.close();
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
    expect(query(fixture, 'clr-modal').classList).not.toContain('open');
    expect(host.open()).toBe(false);
  });

  it('renders input changes while open', async () => {
    host.open.set(true);
    await fixture.whenStable();

    host.size.set('lg');
    host.labelledBy.set('custom-title');
    await fixture.whenStable();
    expect(dialog(fixture).classList).toContain('modal-lg');
    expect(dialog(fixture).getAttribute('aria-labelledby')).toBe('custom-title');
    expect(query(fixture, 'clr-modal .close')).not.toBeNull();

    host.closable.set(false);
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .close')).toBeNull();
  });

  it('renders localized strings changed while open', async () => {
    host.open.set(true);
    host.panelOpen.set(true);
    await fixture.whenStable();

    TestBed.inject(ClrCommonStringsService).localize({
      modalContentStart: 'Start',
      sidePanelPin: 'Pin it',
    });
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .clr-sr-only').textContent).toBe('Start');
    expect(query(fixture, 'clr-side-panel .pinnable').getAttribute('aria-label')).toBe('Pin it');
  });

  it('refreshes projected content and content added after opening', async () => {
    host.open.set(true);
    await fixture.whenStable();
    expect(query(fixture, '.text').textContent).toBe('First');
    expect(query(fixture, '.late')).toBeNull();

    host.text.set('Second');
    host.title.set('New title');
    host.late.set(true);
    await fixture.whenStable();
    expect(query(fixture, '.text').textContent).toBe('Second');
    expect(query(fixture, 'clr-modal .modal-title').textContent).toBe('New title');
    expect(query(fixture, '.late')).not.toBeNull();

    query<HTMLButtonElement>(fixture, '.late-footer').click();
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
  });

  it('refreshes raw content templates (used by the wizard) from their declaring host', async () => {
    rawModal(fixture).open();
    await fixture.whenStable();
    expect(query(fixture, '.raw-content').textContent).toBe('First');

    host.text.set('Second');
    await fixture.whenStable();
    expect(query(fixture, '.raw-content').textContent).toBe('Second');
  });

  it('opens and closes from asynchronous changes', async () => {
    setTimeout(() => host.open.set(true));
    await new Promise(resolve => setTimeout(resolve));
    await fixture.whenStable();
    expect(dialog(fixture)).not.toBeNull();

    await Promise.resolve().then(() => host.modal.close());
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
  });

  it('renders the side panel open(), togglePinned() and close() from code', async () => {
    host.panel.open();
    await fixture.whenStable();
    expect(dialog(fixture, 'clr-side-panel')).not.toBeNull();
    expect(host.panelOpen()).toBe(true);
    expect(pinShape(fixture)).toBe('pin');

    host.panel.togglePinned();
    await fixture.whenStable();
    expect(pinShape(fixture)).toBe('unpin');

    host.panel.togglePinned();
    await fixture.whenStable();
    expect(pinShape(fixture)).toBe('pin');

    host.panel.close();
    await fixture.whenStable();
    expect(dialog(fixture, 'clr-side-panel')).toBeNull();
    expect(host.panelOpen()).toBe(false);
  });

  it('renders the backdrop and position that the side panel sets on the modal configuration', async () => {
    host.panelOpen.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel .modal-backdrop')).not.toBeNull();
    expect(query(fixture, 'clr-side-panel').classList).not.toContain('side-panel-bottom');

    host.backdrop.set(false);
    host.position.set('bottom');
    host.text.set('Second');
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel .modal-backdrop')).toBeNull();
    expect(query(fixture, 'clr-side-panel').classList).toContain('side-panel-bottom');
    expect(query(fixture, '.panel-text').textContent).toBe('Second');

    host.backdrop.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel .modal-backdrop')).not.toBeNull();
  });

  it('cleans up the scroll lock and pinned classes when destroyed while open', async () => {
    host.open.set(true);
    host.panelOpen.set(true);
    await fixture.whenStable();
    host.panel.togglePinned();
    await fixture.whenStable();
    expect(document.body.classList).toContain('no-scrolling');
    expect([...document.body.classList].some(name => name.startsWith('clr-side-panel-pinned-'))).toBe(true);

    fixture.destroy();
    expect(document.body.classList).not.toContain('no-scrolling');
    expect([...document.body.classList].some(name => name.startsWith('clr-side-panel-pinned-'))).toBe(false);
  });
});

describe('Modal change detection: Eager host with plain fields (Zone app)', () => {
  let fixture: ComponentFixture<ZoneAppHost>;
  let host: ZoneAppHost;

  // A Zone app checks its views right after every task: the Eager host and the OnPush views that something marked
  // for check. renderFixture() is that check. Plain field writes notify nothing, so each one is followed by a check.
  const tick = () => renderFixture(fixture);

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneAppHost);
    host = fixture.componentInstance;
    tick();
  });

  afterEach(() => fixture.destroy());

  it('opens and closes from a plain field and refreshes inputs and projected content', () => {
    host.open = true;
    tick();
    expect(dialog(fixture)).not.toBeNull();
    expect(query(fixture, '.text').textContent).toBe('First');

    host.text = 'Second';
    host.size = 'sm';
    tick();
    expect(query(fixture, '.text').textContent).toBe('Second');
    expect(dialog(fixture).classList).toContain('modal-sm');

    host.open = false;
    tick();
    expect(dialog(fixture)).toBeNull();
  });

  it('renders open() and close() called from code', async () => {
    host.modal.open();
    tick();
    expect(dialog(fixture)).not.toBeNull();
    expect(host.open).toBe(true);

    host.modal.close();
    tick();
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
    expect(host.open).toBe(false);
  });

  it('renders changes made in a timer callback', async () => {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        host.open = true;
        host.text = 'From a timer';
        tick();
        resolve();
      })
    );
    expect(query(fixture, '.text').textContent).toBe('From a timer');
  });

  it('refreshes raw content templates from their declaring host', () => {
    rawModal(fixture).open();
    tick();
    expect(query(fixture, '.raw-content').textContent).toBe('First');

    host.text = 'Second';
    tick();
    expect(query(fixture, '.raw-content').textContent).toBe('Second');
  });

  it('renders side panel togglePinned() and position changes', () => {
    host.panelOpen = true;
    tick();
    expect(pinShape(fixture)).toBe('pin');

    host.panel.togglePinned();
    host.position = 'bottom';
    host.text = 'Second';
    tick();
    expect(pinShape(fixture)).toBe('unpin');
    expect(query(fixture, 'clr-side-panel').classList).toContain('side-panel-bottom');
    expect(query(fixture, '.panel-text').textContent).toBe('Second');
  });
});
