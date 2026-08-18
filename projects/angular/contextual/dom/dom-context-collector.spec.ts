/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from '@clr/angular';

import { collectClrDomActions, collectClrDomContexts } from './dom-context-collector';
import { ClrComponentContext } from '../interfaces/context.interface';

@Component({
  template: `
    <clr-alert clrAlertType="danger" [clrAlertClosable]="false">
      <clr-alert-item>
        <span class="alert-text">{{ alertText }}</span>
      </clr-alert-item>
    </clr-alert>

    <clr-tabs>
      <clr-tab>
        <button clrTabLink>Details</button>
        <clr-tab-content *clrIfActive>Details content</clr-tab-content>
      </clr-tab>
      <clr-tab>
        <button clrTabLink>Settings</button>
        <clr-tab-content *clrIfActive>Settings content</clr-tab-content>
      </clr-tab>
    </clr-tabs>

    <clr-datagrid>
      <clr-dg-column [clrDgField]="'name'">Name</clr-dg-column>
      <clr-dg-column>Status</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.status }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
    </clr-datagrid>

    <form clrForm>
      <clr-input-container>
        <label>Username</label>
        <input clrInput required name="username" [(ngModel)]="username" />
      </clr-input-container>
    </form>

    <button type="button" class="btn btn-primary">Add user</button>
    <button type="button" class="btn" disabled>Retry sync</button>
    <a class="btn" href="/help">Help</a>

    <div hidden>
      <button type="button" class="btn">Hidden action</button>
    </div>

    <clr-modal [(clrModalOpen)]="modalOpen">
      <h3 class="modal-title">Confirm delete</h3>
      <div class="modal-body">Are you sure?</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger">Delete</button>
      </div>
    </clr-modal>
  `,
  standalone: false,
})
class TestComponent {
  alertText = 'Disk almost full';
  items = [
    { name: 'node-1', status: 'ok' },
    { name: 'node-2', status: 'down' },
  ];
  username = 'top-secret-value';
  modalOpen = false;
}

describe('DOM context collector', () => {
  let fixture: ComponentFixture<TestComponent>;
  let root: HTMLElement;

  function contextOfType(type: string): ClrComponentContext | undefined {
    return collectClrDomContexts(root).find(context => context.type === type);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, FormsModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('describes alerts with their severity', () => {
    expect(contextOfType('alert')).toEqual({
      type: 'alert',
      label: 'Disk almost full',
      state: { severity: 'danger' },
    });
  });

  it('describes tabs and which one is active', () => {
    expect(contextOfType('tabs')?.state).toEqual({ tabs: ['Details', 'Settings'], activeTab: 'Details' });
  });

  it('describes datagrids with columns, row counts and footer', () => {
    const datagrid = contextOfType('datagrid');

    expect(datagrid?.state?.columns).toEqual(['Name', 'Status']);
    expect(datagrid?.state?.visibleRows).toBe(2);
    expect(datagrid?.state?.selectedRows).toBe(0);
    expect(datagrid?.state?.footer).toContain('2 items');
  });

  it('describes form fields without ever collecting their values', () => {
    const form = contextOfType('form');

    expect(form?.children).toEqual([{ type: 'text', label: 'Username', state: { required: true } }]);
    expect(JSON.stringify(collectClrDomContexts(root))).not.toContain('top-secret-value');
  });

  it('does not describe closed modals', () => {
    expect(contextOfType('modal')).toBeUndefined();
  });

  it('describes open modals with their title and actions', () => {
    fixture.componentInstance.modalOpen = true;
    fixture.detectChanges();

    const modal = contextOfType('modal');

    expect(modal?.label).toBe('Confirm delete');
    expect(modal?.state).toEqual({ open: true });
    expect(modal?.actions).toContain(jasmine.objectContaining({ label: 'Delete', kind: 'button' }));
  });

  it('collects page-level actions but not hidden ones or modal footer actions', () => {
    fixture.componentInstance.modalOpen = true;
    fixture.detectChanges();

    const labels = collectClrDomActions(root).map(action => action.label);

    expect(labels).toContain('Add user');
    expect(labels).not.toContain('Hidden action');
    expect(labels).not.toContain('Delete');
  });

  it('reports disabled actions and link targets', () => {
    const actions = collectClrDomActions(root);

    expect(actions).toContain(jasmine.objectContaining({ label: 'Retry sync', kind: 'button', disabled: true }));
    expect(actions).toContain(jasmine.objectContaining({ label: 'Help', kind: 'link', href: '/help' }));
  });

  it('describes the sorted column once the user sorts the datagrid', () => {
    root.querySelector<HTMLButtonElement>('clr-dg-column button.datagrid-column-title')?.click();
    fixture.detectChanges();

    const state = contextOfType('datagrid')?.state;

    expect(state?.sortedBy).toBe('Name');
    expect(state?.sortOrder).toBe('ascending');
  });

  it('describes unknown Clarity elements generically by their accessible name', () => {
    const widget = document.createElement('clr-fake-widget');
    widget.setAttribute('aria-label', 'Fake widget');
    root.appendChild(widget);

    expect(contextOfType('fake-widget')).toEqual({ type: 'fake-widget', label: 'Fake widget' });
  });

  it('applies the component budget', () => {
    expect(collectClrDomContexts(root, { maxComponents: 1 }).length).toBe(1);
  });

  it('truncates long text to the configured budget', () => {
    fixture.componentInstance.alertText = 'critical '.repeat(50);
    fixture.detectChanges();

    const label = collectClrDomContexts(root, { maxTextLength: 20 }).find(context => context.type === 'alert')?.label;

    expect(label?.length).toBe(20);
    expect(label?.endsWith('…')).toBe(true);
  });
});

@Component({
  template: `
    <clr-vertical-nav>
      <a href="#/dashboard" clrVerticalNavLink class="active">Dashboard</a>
      <a href="#/settings" clrVerticalNavLink>Settings</a>
    </clr-vertical-nav>

    <clr-accordion>
      <clr-accordion-panel [clrAccordionPanelOpen]="true">
        <clr-accordion-title>General</clr-accordion-title>
        <clr-accordion-content *clrIfExpanded>General content</clr-accordion-content>
      </clr-accordion-panel>
      <clr-accordion-panel>
        <clr-accordion-title>Advanced</clr-accordion-title>
        <clr-accordion-content *clrIfExpanded>Advanced content</clr-accordion-content>
      </clr-accordion-panel>
    </clr-accordion>

    <clr-wizard [(clrWizardOpen)]="wizardOpen">
      <clr-wizard-title>Cluster setup</clr-wizard-title>
      <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
      <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
      <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
      <clr-wizard-button [type]="'finish'">Finish</clr-wizard-button>
      <clr-wizard-page>
        <ng-template clrPageTitle>Basics</ng-template>
        <p>Step 1</p>
      </clr-wizard-page>
      <clr-wizard-page>
        <ng-template clrPageTitle>Networking</ng-template>
        <p>Step 2</p>
      </clr-wizard-page>
    </clr-wizard>
  `,
  standalone: false,
})
class NavigationTestComponent {
  wizardOpen = false;
}

describe('DOM context collector - navigation components', () => {
  let fixture: ComponentFixture<NavigationTestComponent>;
  let root: HTMLElement;

  function contextOfType(type: string): ClrComponentContext | undefined {
    return collectClrDomContexts(root).find(context => context.type === type);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClarityModule, NoopAnimationsModule],
      declarations: [NavigationTestComponent],
    });
    fixture = TestBed.createComponent(NavigationTestComponent);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('describes vertical navigation with its links and the active one', () => {
    const navigation = contextOfType('navigation');

    expect(navigation?.state).toEqual({ activeLink: 'Dashboard' });
    expect(navigation?.actions).toEqual([
      { label: 'Dashboard', kind: 'link', href: '#/dashboard' },
      { label: 'Settings', kind: 'link', href: '#/settings' },
    ]);
  });

  it('describes accordions with each panel and its expanded state', () => {
    const accordion = contextOfType('accordion');

    expect(accordion?.children?.length).toBe(2);
    expect(accordion?.children?.[0]).toEqual(jasmine.objectContaining({ label: 'General', state: { expanded: true } }));
    expect(accordion?.children?.[1]).toEqual(
      jasmine.objectContaining({ label: 'Advanced', state: { expanded: false } })
    );
  });

  it('does not describe closed wizards', () => {
    expect(contextOfType('wizard')).toBeUndefined();
  });

  it('describes open wizards with their steps, current step and actions', () => {
    fixture.componentInstance.wizardOpen = true;
    fixture.detectChanges();

    const wizard = contextOfType('wizard');

    expect(wizard?.label).toBe('Cluster setup');
    expect(wizard?.state?.steps).toEqual(['Basics', 'Networking']);
    expect(wizard?.state?.currentStep).toBe('Basics');
    expect(wizard?.actions).toContain(jasmine.objectContaining({ label: 'Next', kind: 'button' }));
  });
});
