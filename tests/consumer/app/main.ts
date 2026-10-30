/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppfxPropertyViewModule, PropertyViewBuilder } from '@clr/addons/property-view';
import { ClarityModule } from '@clr/angular';

import { OverlayAcceptance } from './overlay-acceptance';
import { RuntimeAcceptance } from './runtime-acceptance';

@Component({
  selector: 'consumer-app',
  imports: [ClarityModule, FormsModule, AppfxPropertyViewModule, OverlayAcceptance, RuntimeAcceptance],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Built package consumer</h1>
    <p data-testid="mode">{{ mode }}</p>
    <clr-tabs>
      <clr-tab>
        <button clrTabLink>Overview</button>
        <clr-tab-content *clrIfActive>Overview content</clr-tab-content>
      </clr-tab>
      <clr-tab>
        <button clrTabLink>Details</button>
        <clr-tab-content *clrIfActive>Details content</clr-tab-content>
      </clr-tab>
    </clr-tabs>
    <clr-accordion>
      <clr-accordion-panel>
        <clr-accordion-title>Consumer accordion</clr-accordion-title>
        <clr-accordion-content *clrIfExpanded>Expanded consumer content</clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>
    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items()" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer>{{ items().length }} records</clr-dg-footer>
    </clr-datagrid>
    <button class="btn" (click)="loadItem()">Load another item</button>
    <form clrForm>
      <clr-input-container>
        <label>Consumer name</label>
        <input clrInput name="name" [(ngModel)]="name" required />
        <clr-control-error>Name is required</clr-control-error>
      </clr-input-container>
      <clr-checkbox-container>
        <clr-checkbox-wrapper>
          <input clrCheckbox type="checkbox" name="enabled" [(ngModel)]="enabled" />
          <label>Enable consumer</label>
        </clr-checkbox-wrapper>
      </clr-checkbox-container>
    </form>
    <p data-testid="form-value">{{ name }} / {{ enabled }}</p>
    <button class="btn" (click)="modalOpen = true">Open consumer modal</button>
    <clr-modal [(clrModalOpen)]="modalOpen">
      <h2 class="modal-title">Consumer modal</h2>
      <div class="modal-body">Built library modal content</div>
      <div class="modal-footer"><button class="btn" (click)="modalOpen = false">Close consumer modal</button></div>
    </clr-modal>
    <clr-dropdown>
      <button class="btn" clrDropdownTrigger>Consumer actions</button>
      <clr-dropdown-menu *clrIfOpen>
        <button clrDropdownItem (click)="action = 'Selected'">Choose action</button>
      </clr-dropdown-menu>
    </clr-dropdown>
    <p data-testid="action">{{ action }}</p>
    <appfx-property-view [data]="properties"></appfx-property-view>
    <overlay-acceptance />
    <runtime-acceptance />
  `,
})
class ConsumerApp {
  readonly mode = new URLSearchParams(location.search).get('mode') === 'zone' ? 'zone' : 'zoneless';
  readonly items = signal([{ name: 'Beta' }, { name: 'Alpha' }]);
  readonly properties = this.createProperties();
  name = '';
  enabled = false;
  modalOpen = false;
  action = 'Not selected';

  loadItem() {
    setTimeout(() => this.items.update(items => [...items, { name: 'Gamma' }]), 25);
  }

  private createProperties() {
    const builder = new PropertyViewBuilder();
    builder
      .category('consumer')
      .title('Consumer properties')
      .section('package')
      .title('Package details')
      .property('Status', 'Ready');
    return builder.build();
  }
}

async function main() {
  const useZone = new URLSearchParams(location.search).get('mode') === 'zone';
  await bootstrapApplication(ConsumerApp, {
    providers: [useZone ? provideZoneChangeDetection() : provideZonelessChangeDetection()],
  });
}

main().catch(error => console.error(error));
