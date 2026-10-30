/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrModal } from './modal';
import { ModalStackService } from './modal-stack.service';
import { ClrSidePanelModule } from './side-panel.module';

@Component({
  template: `
    <button class="trigger">Open</button>
    @if (show()) {
      <clr-modal
        class="first"
        [clrModalOpen]="first()"
        (clrModalOpenChange)="first.set($event)"
        [clrModalSkipAnimation]="true"
      >
        <h2 class="modal-title">First</h2>
        <div class="modal-body"><button>Inside first</button></div>
      </clr-modal>
      <clr-modal
        class="second"
        [clrModalOpen]="second()"
        (clrModalOpenChange)="second.set($event)"
        [clrModalClosable]="closable()"
        [clrModalPreventClose]="prevent()"
        (clrModalAlternateClose)="alternate.push($event)"
        [clrModalStaticBackdrop]="false"
        [clrModalSkipAnimation]="true"
      >
        <h2 class="modal-title">Second</h2>
        <div class="modal-body"><button>Inside second</button></div>
      </clr-modal>
      <clr-side-panel
        [clrSidePanelOpen]="panel()"
        (clrSidePanelOpenChange)="panel.set($event)"
        [clrSidePanelSkipAnimation]="true"
      >
        <h2 class="side-panel-title">Panel</h2>
        <div class="side-panel-body"><button>Inside panel</button></div>
      </clr-side-panel>
      <clr-modal
        class="inline"
        [clrModalOpen]="inline()"
        [clrModalOverrideScrollService]="true"
        [clrModalSkipAnimation]="true"
      >
        <div class="modal-title">Inline</div>
      </clr-modal>
      <clr-modal class="imperative" [clrModalSkipAnimation]="true">
        <h2 class="modal-title">Imperative</h2>
        <div class="modal-body">Body</div>
      </clr-modal>
    }
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class ModalHost {
  readonly first = signal(false);
  readonly second = signal(false);
  readonly panel = signal(false);
  readonly inline = signal(false);
  readonly closable = signal(true);
  readonly prevent = signal(false);
  readonly show = signal(true);
  readonly alternate: boolean[] = [];
}

for (const zoneless of [false, true]) {
  describe(`Modal notifications (${zoneless ? 'zoneless' : 'zone-based'}, OnPush host)`, () => {
    let fixture: ComponentFixture<ModalHost>;
    let host: ModalHost;
    const escape = () => document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    const dialog = (selector: string) => fixture.nativeElement.querySelector(`${selector} .modal-dialog`);

    beforeEach(async () => {
      TestBed.configureTestingModule({
        declarations: [ModalHost],
        imports: [ClrSidePanelModule],
        providers: [
          zoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection(),
          provideCheckNoChangesConfig({ exhaustive: true }),
        ],
      });
      fixture = TestBed.createComponent(ModalHost);
      fixture.autoDetectChanges();
      host = fixture.componentInstance;
      await fixture.whenStable();
    });

    afterEach(() => fixture.destroy());

    it('closes on native Escape and returns focus after rendering', async () => {
      const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('.trigger');
      trigger.focus();
      host.first.set(true);
      await fixture.whenStable();
      expect(dialog('.first')).not.toBeNull();
      expect(document.body.classList.contains('no-scrolling')).toBeTrue();
      escape();
      await fixture.whenStable();
      expect(dialog('.first')).toBeNull();
      expect(host.first()).toBeFalse();
      expect(document.activeElement).toBe(trigger);
      expect(document.body.classList.contains('no-scrolling')).toBeFalse();
    });

    it('closes only the top overlay and keeps the remaining modal scroll lock', async () => {
      host.first.set(true);
      await fixture.whenStable();
      host.second.set(true);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(host.second()).toBeFalse();
      expect(dialog('.second')).toBeNull();
      expect(dialog('.first')).not.toBeNull();
      expect(document.body.classList.contains('no-scrolling')).toBeTrue();
      escape();
      await fixture.whenStable();
      expect(host.first()).toBeFalse();
      expect(document.body.classList.contains('no-scrolling')).toBeFalse();
    });

    it('registers an input-open side panel above a modal without releasing the modal scroll lock', async () => {
      host.first.set(true);
      await fixture.whenStable();
      host.panel.set(true);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(host.panel()).toBeFalse();
      expect(dialog('clr-side-panel')).toBeNull();
      expect(dialog('.first')).not.toBeNull();
      expect(document.body.classList.contains('no-scrolling')).toBeTrue();
    });

    it('preserves the stack bypass used by inline wizard modals', async () => {
      host.first.set(true);
      await fixture.whenStable();
      host.inline.set(true);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(host.first()).toBeFalse();
      expect(dialog('.inline')).not.toBeNull();
    });

    it('respects closability and alternate-close before closing the top modal', async () => {
      host.first.set(true);
      await fixture.whenStable();
      host.second.set(true);
      host.closable.set(false);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(host.first()).toBeTrue();
      expect(host.second()).toBeTrue();
      host.closable.set(true);
      host.prevent.set(true);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(host.alternate).toEqual([false]);
      expect(host.second()).toBeTrue();
    });

    it('supports repeated imperative opening and closing without an input binding', async () => {
      const modal = fixture.debugElement
        .queryAll(By.directive(ClrModal))
        .find(el => el.nativeElement.classList.contains('imperative')).componentInstance as ClrModal;
      const changes: boolean[] = [];
      modal._openChanged.subscribe(open => changes.push(open));
      for (let i = 0; i < 2; i++) {
        modal.open();
        modal.open();
        expect(changes[changes.length - 1]).toBeTrue();
        await fixture.whenStable();
        expect(dialog('.imperative')).not.toBeNull();
        expect(document.body.classList.contains('no-scrolling')).toBeTrue();
        modal.close();
        modal.close();
        await fixture.whenStable();
        expect(dialog('.imperative')).toBeNull();
        expect(document.body.classList.contains('no-scrolling')).toBeFalse();
      }
      expect(changes).toEqual([true, false, true, false]);
    });

    it('does not retain an overlay closed before its first render', async () => {
      const modal = fixture.debugElement
        .queryAll(By.directive(ClrModal))
        .find(el => el.nativeElement.classList.contains('imperative')).componentInstance as ClrModal;
      modal.open();
      modal.close();
      await fixture.whenStable();
      const close = spyOn(modal, 'close').and.callThrough();
      escape();
      await fixture.whenStable();
      expect(close).not.toHaveBeenCalled();
      expect(dialog('.imperative')).toBeNull();
      expect(document.body.classList.contains('no-scrolling')).toBeFalse();
    });

    it('releases stack registrations and scroll locks when destroyed while open', async () => {
      host.first.set(true);
      host.panel.set(true);
      await fixture.whenStable();
      const modals = fixture.debugElement.queryAll(By.directive(ClrModal)).map(el => el.componentInstance as ClrModal);
      const spies = modals.map(modal => spyOn(modal, 'close').and.callThrough());
      host.show.set(false);
      await fixture.whenStable();
      escape();
      await fixture.whenStable();
      expect(document.body.classList.contains('no-scrolling')).toBeFalse();
      spies.forEach(spy => expect(spy).not.toHaveBeenCalled());
    });
  });
}

describe('Modal stack server safety', () => {
  it('does not register document listeners on the server', () => {
    const add = spyOn(document.body, 'addEventListener');
    const remove = spyOn(document.body, 'removeEventListener');
    const stack = new ModalStackService('server');
    const modal = { close() {} };
    stack.trackModalOpen(modal);
    stack.trackModalClose(modal);
    expect(add).not.toHaveBeenCalled();
    expect(remove).not.toHaveBeenCalled();
  });
});
