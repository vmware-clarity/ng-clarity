/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrModal, ClrPopoverService, ClrSidePanelModule } from '@clr/angular';

@Component({
  selector: 'overlay-acceptance',
  imports: [ClarityModule, ClrSidePanelModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="overlay-acceptance">
      <h2>Overlay acceptance</h2>
      <button class="btn" data-testid="outside-focus">Outside overlays</button>
      @if (mounted()) {
        <clr-date-container>
          <label>Acceptance date</label>
          <input clrDate [ngModel]="date()" (ngModelChange)="date.set($event)" />
        </clr-date-container>
        <clr-dropdown #menu>
          <button class="btn" clrDropdownTrigger>Acceptance actions</button>
          <clr-dropdown-menu *clrIfOpen>
            <button clrDropdownItem>First action</button>
            <button clrDropdownItem>Second action</button>
          </clr-dropdown-menu>
        </clr-dropdown>
        <clr-signpost #signpost>
          <button class="btn" clrSignpostTrigger>Acceptance info</button>
          <clr-signpost-content *clrIfOpen>Acceptance signpost content</clr-signpost-content>
        </clr-signpost>
        <clr-combobox #combo [ngModel]="selection()" (ngModelChange)="selection.set($event)">
          <label>Acceptance choice</label>
          <clr-options>
            <clr-option [clrValue]="'First'">First choice</clr-option>
            <clr-option [clrValue]="'Second'">Second choice</clr-option>
          </clr-options>
        </clr-combobox>
        <clr-modal
          #acceptanceModal
          class="acceptance-modal"
          [clrModalOpen]="modal()"
          (clrModalOpenChange)="modal.set($event)"
        >
          <h2 class="modal-title">Acceptance modal</h2>
          <div class="modal-body"><button>Inside acceptance modal</button></div>
        </clr-modal>
        <clr-modal
          class="acceptance-second"
          [clrModalOpen]="second()"
          (clrModalOpenChange)="second.set($event)"
          [clrModalClosable]="closable()"
          [clrModalPreventClose]="prevent()"
          (clrModalAlternateClose)="alternate.update(increment)"
        >
          <h2 class="modal-title">Acceptance second modal</h2>
          <div class="modal-body"><button>Inside second modal</button></div>
        </clr-modal>
        <clr-side-panel [clrSidePanelOpen]="panel()" (clrSidePanelOpenChange)="panel.set($event)">
          <h2 class="side-panel-title">Acceptance panel</h2>
          <div class="side-panel-body"><button>Inside acceptance panel</button></div>
        </clr-side-panel>
      }
      <p data-testid="overlay-state" [attr.data-closable]="closable()" [attr.data-prevent-close]="prevent()">
        {{ modal() }} / {{ second() }} / {{ panel() }} / {{ alternate() }}
      </p>
    </section>
  `,
})
export class OverlayAcceptance {
  readonly mounted = signal(true);
  readonly date = signal('10/15/2026');
  readonly selection = signal<string>(null);
  readonly modal = signal(false);
  readonly second = signal(false);
  readonly panel = signal(false);
  readonly closable = signal(true);
  readonly prevent = signal(false);
  readonly alternate = signal(0);

  @ViewChild('acceptanceModal') private modalInstance: ClrModal;
  private retainedModal: ClrModal;

  @ViewChild('menu', { read: ClrPopoverService }) private menu: ClrPopoverService;
  @ViewChild('signpost', { read: ClrPopoverService }) private signpost: ClrPopoverService;
  @ViewChild('combo', { read: ClrPopoverService }) private combo: ClrPopoverService;

  constructor() {
    Object.assign(window, { overlayAcceptance: this });
  }

  readonly increment = (value: number) => value + 1;

  destroyRetainingModal() {
    this.retainedModal = this.modalInstance;
    this.mounted.set(false);
  }

  requestDestroyedModal() {
    this.retainedModal.open();
    this.retainedModal.close();
  }

  openPopover(kind: 'menu' | 'signpost' | 'combo') {
    this[kind].open = true;
  }

  closePopover(kind: 'menu' | 'signpost' | 'combo') {
    this[kind].open = false;
  }
}
