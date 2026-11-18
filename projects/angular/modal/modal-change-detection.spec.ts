/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrModal } from './modal';
import { ClrModalConfigurationService } from './modal-configuration.service';
import { ClrModalModule } from './modal.module';
import { ClrSidePanel } from './side-panel';
import { ClrSidePanelModule } from './side-panel.module';

// ClrModal and ClrSidePanel are OnPush. These specs check that every way of changing them still renders:
// - under an OnPush host driven by signals, with automatic change detection (zoneless);
// - under an Eager host with plain fields, where only the host is checked after each change, as a Zone app's tick does.
// The exhaustive checkNoChanges of the test providers fails any check that leaves a stale binding behind.

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="open" [clrModalSkipAnimation]="true">
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
    <clr-side-panel [(clrSidePanelOpen)]="panelOpen" [clrSidePanelSkipAnimation]="true">
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
  readonly panelOpen = signal(false);
  readonly title = signal('Title');
  readonly text = signal('First');
  readonly late = signal(false);
}

@Component({
  template: `
    <clr-modal [(clrModalOpen)]="open" [clrModalSkipAnimation]="true">
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
    <clr-side-panel [(clrSidePanelOpen)]="panelOpen" [clrSidePanelSkipAnimation]="true">
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
  panelOpen = false;
  text = 'First';
}

function query<T extends Element = HTMLElement>(fixture: ComponentFixture<unknown>, selector: string): T | null {
  return fixture.nativeElement.querySelector(selector);
}

function dialog(fixture: ComponentFixture<unknown>, host: 'clr-modal' | 'clr-side-panel' = 'clr-modal') {
  return query(fixture, `${host} .modal-dialog`);
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

  it('renders direct writes to the modal inputs while open', async () => {
    host.open.set(true);
    await fixture.whenStable();

    host.modal.size = 'lg';
    host.modal.labelledBy = 'custom-title';
    host.modal.closeButtonAriaLabel = 'Dismiss';
    host.modal.staticBackdrop = false;
    await fixture.whenStable();
    expect(dialog(fixture).classList).toContain('modal-lg');
    expect(dialog(fixture).getAttribute('aria-labelledby')).toBe('custom-title');
    expect(query(fixture, 'clr-modal .close').getAttribute('aria-label')).toBe('Dismiss');
    expect(query(fixture, 'clr-modal .modal-backdrop').classList).not.toContain('static');

    host.modal.closable = false;
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .close')).toBeNull();

    host.modal._open = false;
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
  });

  it('renders a change of the shared modal configuration while open', async () => {
    const configuration = TestBed.inject(ClrModalConfigurationService);
    host.open.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .modal-backdrop')).not.toBeNull();

    configuration.backdrop = false;
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .modal-backdrop')).toBeNull();

    configuration.backdrop = true;
    await fixture.whenStable();
    expect(query(fixture, 'clr-modal .modal-backdrop')).not.toBeNull();
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

  it('opens and closes from asynchronous signal changes', async () => {
    setTimeout(() => host.open.set(true));
    await new Promise(resolve => setTimeout(resolve));
    await fixture.whenStable();
    expect(dialog(fixture)).not.toBeNull();

    await Promise.resolve().then(() => host.modal.close());
    await fixture.whenStable();
    expect(dialog(fixture)).toBeNull();
  });

  it('renders the side panel open, pin and size changes made from code', async () => {
    host.panel.clrSidePanelPinnable = true;
    host.panel.open();
    await fixture.whenStable();
    expect(dialog(fixture, 'clr-side-panel')).not.toBeNull();
    expect(host.panelOpen()).toBe(true);
    expect(query(fixture, '.pinnable cds-icon').getAttribute('shape')).toBe('pin');

    host.panel.togglePinned();
    await fixture.whenStable();
    expect(query(fixture, '.pinnable cds-icon').getAttribute('shape')).toBe('unpin');

    host.panel.pinned = false;
    host.panel.size = 'lg';
    host.panel.closeButtonAriaLabel = 'Dismiss panel';
    await fixture.whenStable();
    expect(query(fixture, '.pinnable cds-icon').getAttribute('shape')).toBe('pin');
    expect(dialog(fixture, 'clr-side-panel').classList).toContain('modal-lg');
    expect(query(fixture, 'clr-side-panel .close').getAttribute('aria-label')).toBe('Dismiss panel');

    host.panel.closable = false;
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel .close')).toBeNull();

    host.panel.closable = true;
    await fixture.whenStable();
    host.panel.close();
    await fixture.whenStable();
    expect(dialog(fixture, 'clr-side-panel')).toBeNull();
    expect(host.panelOpen()).toBe(false);
  });

  it('renders the side panel position host class and projected content', async () => {
    host.panelOpen.set(true);
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel').classList).not.toContain('side-panel-bottom');

    host.panel.position = 'bottom';
    host.text.set('Second');
    await fixture.whenStable();
    expect(query(fixture, 'clr-side-panel').classList).toContain('side-panel-bottom');
    expect(query(fixture, '.panel-text').textContent).toBe('Second');
  });

  it('cleans up the scroll lock and pinned classes when destroyed while open', async () => {
    host.open.set(true);
    host.panel.pinned = true;
    host.panelOpen.set(true);
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

  it('opens and closes from a plain field and refreshes projected content', () => {
    host.open = true;
    tick();
    expect(dialog(fixture)).not.toBeNull();
    expect(query(fixture, '.text').textContent).toBe('First');

    host.text = 'Second';
    tick();
    expect(query(fixture, '.text').textContent).toBe('Second');

    host.open = false;
    tick();
    expect(dialog(fixture)).toBeNull();
  });

  it('renders open(), close() and direct input writes made from code', async () => {
    host.modal.open();
    tick();
    expect(dialog(fixture)).not.toBeNull();

    host.modal.size = 'sm';
    host.modal.closable = false;
    tick();
    expect(dialog(fixture).classList).toContain('modal-sm');
    expect(query(fixture, 'clr-modal .close')).toBeNull();

    host.modal.closable = true;
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

  it('renders side panel changes made from code', () => {
    host.panelOpen = true;
    host.panel.clrSidePanelPinnable = true;
    tick();
    expect(query(fixture, '.pinnable cds-icon').getAttribute('shape')).toBe('pin');

    host.panel.pinned = true;
    host.panel.position = 'bottom';
    host.text = 'Second';
    tick();
    expect(query(fixture, '.pinnable cds-icon').getAttribute('shape')).toBe('unpin');
    expect(query(fixture, 'clr-side-panel').classList).toContain('side-panel-bottom');
    expect(query(fixture, '.panel-text').textContent).toBe('Second');
  });
});
