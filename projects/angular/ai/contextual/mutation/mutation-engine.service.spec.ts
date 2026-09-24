/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ClrDatagridModule } from '@clr/angular/data/datagrid';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrComboboxModule } from '@clr/angular/forms/combobox';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrDatepickerModule } from '@clr/angular/forms/datepicker';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrPasswordModule } from '@clr/angular/forms/password';
import { ClrRadioModule } from '@clr/angular/forms/radio';
import { ClrSelectModule } from '@clr/angular/forms/select';
import { ClrComponentContext } from '@clr/angular/utils';

import { ClrMutationEngineService } from './mutation-engine.service';
import {
  ClrElementMutationResult,
  ClrMutationConsequence,
  ClrMutationPolicy,
  ClrMutationTarget,
  ClrNavigationMutationResult,
  provideClrMutationPolicy,
} from './mutation.interface';
import { ClrPageContext } from '../interfaces/context.interface';
import { ClrContextEngineService } from '../providers/contextual-engine.service';

interface Item {
  id: number;
  label: string;
}
const ITEMS: Item[] = [
  { id: 1, label: 'One' },
  { id: 2, label: 'Two' },
];

@Component({
  template: `
    <form [formGroup]="form">
      <clr-input-container>
        <label>Name</label>
        <input clrInput formControlName="name" required />
        <clr-control-error>Name is required</clr-control-error>
      </clr-input-container>
      <clr-input-container>
        <label>Amount</label>
        <input clrInput type="number" formControlName="amount" />
      </clr-input-container>
      <clr-checkbox-container>
        <clr-checkbox-wrapper>
          <input type="checkbox" clrCheckbox formControlName="agree" />
          <label>Agree</label>
        </clr-checkbox-wrapper>
      </clr-checkbox-container>
      <clr-radio-container>
        <label>Size</label>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="size" value="s" />
          <label>Small</label>
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <input type="radio" clrRadio formControlName="size" value="l" />
          <label>Large</label>
        </clr-radio-wrapper>
      </clr-radio-container>
      <clr-select-container>
        <label>Item</label>
        <select clrSelect formControlName="item">
          @for (item of items; track item.id) {
            <option [ngValue]="item">{{ item.label }}</option>
          }
        </select>
      </clr-select-container>
      <clr-combobox-container>
        <label>Cluster</label>
        <clr-combobox formControlName="cluster">
          <clr-options>
            <clr-option clrValue="alpha">Alpha cluster</clr-option>
            <clr-option clrValue="beta">Beta cluster</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-combobox-container>
        <label>Tags</label>
        <clr-combobox formControlName="tags" clrMulti="true">
          <clr-options>
            <clr-option clrValue="red">Red</clr-option>
            <clr-option clrValue="green">Green</clr-option>
            <clr-option clrValue="blue">Blue</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-date-container>
        <label>When</label>
        <input type="date" clrDate formControlName="when" />
      </clr-date-container>
      <clr-password-container>
        <label>Secret</label>
        <input clrPassword formControlName="secret" />
      </clr-password-container>
      <clr-input-container>
        <label>Frozen</label>
        <input clrInput formControlName="frozen" [attr.disabled]="frozenDisabled ? '' : null" />
      </clr-input-container>
    </form>
    @if (showTemplate) {
      <input
        clrInput
        [(ngModel)]="tplName"
        (ngModelChange)="changes = changes + 1"
        name="tplName"
        aria-label="Nickname"
      />
    }
    <input type="text" aria-label="Loose" />
    <div [hidden]="hideGhost"><input clrInput [formControl]="ghost" aria-label="Ghost" /></div>

    <clr-datagrid [(clrDgSelected)]="selectedHosts" [clrDgSelectionType]="'multi'">
      <clr-dg-column>Host</clr-dg-column>
      <clr-dg-column>State</clr-dg-column>
      <clr-dg-row *clrDgItems="let host of hosts" [clrDgItem]="host">
        <clr-dg-cell>{{ host.name }}</clr-dg-cell>
        <clr-dg-cell>{{ host.state }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
    <clr-datagrid [(clrDgSelected)]="singleSelection" [clrDgSelectionType]="'single'">
      <clr-dg-column>Host</clr-dg-column>
      <clr-dg-row *clrDgItems="let host of hosts" [clrDgItem]="host">
        <clr-dg-cell>{{ host.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class Host {
  items = ITEMS;
  hosts = [
    { name: 'esx-01', state: 'Running' },
    { name: 'esx-02', state: 'Stopped' },
  ];
  selectedHosts: { name: string; state: string }[] = [];
  singleSelection: { name: string; state: string }[] = [];
  form = new FormGroup({
    name: new FormControl<string | null>('seed', Validators.required),
    amount: new FormControl<number | null>(null),
    agree: new FormControl<boolean>(false),
    size: new FormControl<string | null>(null),
    item: new FormControl<Item | null>(null),
    cluster: new FormControl<string | null>(null),
    tags: new FormControl<string[]>([]),
    when: new FormControl<string | null>(null),
    secret: new FormControl<string | null>(''),
    frozen: new FormControl<string | null>(''),
  });
  ghost = new FormControl<string | null>('');
  tplName = '';
  changes = 0;
  showTemplate = true;
  frozenDisabled = false;
  hideGhost = false;
}

function findNode(
  nodes: ClrComponentContext[],
  match: (node: ClrComponentContext) => boolean
): ClrComponentContext | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    const inside = findNode(node.children ?? [], match);
    if (inside) {
      return inside;
    }
  }
  return null;
}

/** The node matching, or a failure naming what was looked for — never `null` to guard against. */
function nodeOf(
  snapshot: ClrPageContext,
  match: (node: ClrComponentContext) => boolean,
  what: string
): ClrComponentContext {
  const node = findNode(snapshot.components, match);
  if (!node) {
    throw new Error(`no ${what} in ${JSON.stringify(snapshot.components)}`);
  }
  return node;
}

function refOf(snapshot: ClrPageContext, label: string, type?: string): string {
  const node = findNode(
    snapshot.components,
    node => !!node.ref && node.label === label && (!type || node.type === type)
  );
  if (!node?.ref) {
    throw new Error(`no ref for "${label}" in ${JSON.stringify(snapshot.components)}`);
  }
  return node.ref;
}

function allRefs(nodes: ClrComponentContext[]): string[] {
  return nodes.flatMap(node => [...(node.ref ? [node.ref] : []), ...allRefs(node.children ?? [])]);
}

const IMPORTS = [
  NoopAnimationsModule,
  ReactiveFormsModule,
  FormsModule,
  ClrCommonFormsModule,
  ClrInputModule,
  ClrCheckboxModule,
  ClrRadioModule,
  ClrSelectModule,
  ClrComboboxModule,
  ClrDatepickerModule,
  ClrPasswordModule,
  ClrDatagridModule,
];

describe('ClrMutationEngineService', () => {
  describe('without a policy', () => {
    let fixture: ComponentFixture<Host>;

    beforeEach(async () => {
      TestBed.configureTestingModule({ imports: IMPORTS, declarations: [Host] });
      fixture = TestBed.createComponent(Host);
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    it('hands out no refs and refuses everything as unclassified', async () => {
      const snapshot = TestBed.inject(ClrContextEngineService).getSnapshot();
      expect(allRefs(snapshot.components)).toEqual([]);

      const report = await TestBed.inject(ClrMutationEngineService).apply([
        { operation: 'setValue', ref: 'e1', description: 'Name', value: 'x' },
        { operation: 'navigate', path: '/' },
      ]);

      expect(report.results.map(result => result.refused)).toEqual(['unclassified', 'unclassified']);
      expect(report.results.every(result => !result.applied)).toBeTrue();
    });
  });

  describe('with a policy', () => {
    let fixture: ComponentFixture<Host>;
    let host: Host;
    let contextEngine: ClrContextEngineService;
    let engine: ClrMutationEngineService;
    let classify: jasmine.Spy<(target: ClrMutationTarget) => ClrMutationConsequence>;
    let confirm: jasmine.Spy<(target: ClrMutationTarget) => boolean | Promise<boolean>>;

    beforeEach(async () => {
      classify = jasmine.createSpy('classify').and.returnValue('reversible');
      confirm = jasmine.createSpy('confirm').and.returnValue(true);
      const policy: ClrMutationPolicy = { classify: target => classify(target), confirm: target => confirm(target) };
      TestBed.configureTestingModule({
        imports: IMPORTS,
        declarations: [Host],
        providers: [provideClrMutationPolicy(policy)],
      });
      fixture = TestBed.createComponent(Host);
      host = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
      contextEngine = TestBed.inject(ClrContextEngineService);
      engine = TestBed.inject(ClrMutationEngineService);
    });

    afterEach(() => fixture.destroy());

    async function settle() {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    }

    function snapshot(): ClrPageContext {
      return contextEngine.getSnapshot();
    }

    async function set(ref: string, description: string, value: unknown): Promise<ClrElementMutationResult> {
      const report = await engine.apply([{ operation: 'setValue', ref, description, value }]);
      await settle();
      return report.results[0] as ClrElementMutationResult;
    }

    describe('refs', () => {
      it('are given to form controls and to what publishes a mutator, and to nothing else', () => {
        const page = snapshot();
        const withRefs = (label: string) => !!findNode(page.components, node => node.label === label && !!node.ref);

        expect(withRefs('Name')).toBeTrue();
        expect(withRefs('Agree')).toBeTrue();
        expect(withRefs('Size')).toBeTrue();
        expect(withRefs('Cluster')).toBeTrue();
        expect(withRefs('Loose')).toBeTrue();
        expect(findNode(page.components, node => node.element === 'clr-datagrid')?.ref).toBeDefined();
        expect(findNode(page.components, node => node.type === 'columnheader')?.ref).toBeUndefined();
        expect(findNode(page.components, node => node.type === 'button')?.ref).toBeUndefined();
        // The combobox speaks for the input it renders: one ref, on the node carrying its options.
        const comboboxes = [] as ClrComponentContext[];
        const collect = (nodes: ClrComponentContext[]) =>
          nodes.forEach(node => {
            if (node.label === 'Cluster') {
              comboboxes.push(node);
            }
            collect(node.children ?? []);
          });
        collect(page.components);
        expect(comboboxes.filter(node => node.ref).length).toBe(1);
        expect(comboboxes.find(node => node.ref)?.state?.['options']).toEqual(['Alpha cluster', 'Beta cluster']);
      });

      it('are never given to a redacted control', () => {
        const page = snapshot();
        const secret = nodeOf(page, node => node.label === 'Secret', 'secret');

        expect(secret.state?.['redacted']).toBeTrue();
        expect(secret.ref).toBeUndefined();
      });

      it('are stable from one snapshot to the next', () => {
        const first = refOf(snapshot(), 'Name');
        expect(refOf(snapshot(), 'Name')).toBe(first);
      });

      it('are not handed to the global accessor', () => {
        contextEngine.enableGlobalAccess('clrMutationSpecAccessor');
        try {
          const served = (window as unknown as Record<string, () => ClrPageContext>)['clrMutationSpecAccessor']();
          expect(allRefs(served.components)).toEqual([]);
        } finally {
          contextEngine.disableGlobalAccess();
        }
      });
    });

    describe('setValue', () => {
      it('writes text through the form control, marks it touched and reads back validity', async () => {
        const ref = refOf(snapshot(), 'Name');
        const result = await set(ref, 'Name', 'Ada');

        expect(result).toEqual(
          jasmine.objectContaining({
            operation: 'setValue',
            ref,
            applied: true,
            value: 'Ada',
            previous: 'seed',
            status: 'VALID',
          })
        );
        expect(result.errors).toBeUndefined();
        expect(host.form.value.name).toBe('Ada');
        expect(host.form.controls.name.dirty).toBeTrue();
        expect(host.form.controls.name.touched).toBeTrue();
      });

      it('reports a validation failure as a result, and Clarity shows it', async () => {
        const ref = refOf(snapshot(), 'Name');
        const result = await set(ref, 'Name', '');

        expect(result.applied).toBeTrue();
        expect(result.status).toBe('INVALID');
        expect(result.errors).toEqual({ required: true });
        const input = fixture.nativeElement.querySelector('input[formcontrolname="name"]') as HTMLInputElement;
        expect(input.getAttribute('aria-invalid')).toBe('true');
        expect(fixture.nativeElement.querySelector('clr-control-error')?.textContent).toContain('Name is required');
      });

      it('takes a number for a number input and refuses anything else', async () => {
        const ref = refOf(snapshot(), 'Amount');
        expect((await set(ref, 'Amount', '42')).value).toBe(42);
        expect(host.form.value.amount).toBe(42);

        const refused = await set(ref, 'Amount', 'lots');
        expect(refused.applied).toBeFalse();
        expect(refused.refused).toBe('invalid');
        expect(host.form.value.amount).toBe(42);
      });

      it('takes a boolean for a checkbox', async () => {
        const ref = refOf(snapshot(), 'Agree');
        const result = await set(ref, 'Agree', true);

        expect(result.value).toBeTrue();
        expect(result.previous).toBeFalse();
        expect(host.form.value.agree).toBeTrue();
        expect((await set(ref, 'Agree', 'maybe')).refused).toBe('invalid');
      });

      it('chooses a radio in a group by its label', async () => {
        const ref = refOf(snapshot(), 'Size');
        const result = await set(ref, 'Size', 'Large');

        expect(result.applied).toBeTrue();
        expect(result.value).toBe('Large');
        expect(result.previous).toBeNull();
        expect(host.form.value.size).toBe('l');
        expect(host.form.controls.size.touched).toBeTrue();

        const refused = await set(ref, 'Size', 'Huge');
        expect(refused.refused).toBe('invalid');
        expect(refused.detail).toContain('"Small", "Large"');
      });

      it('chooses a select option by label and hands the form the bound object', async () => {
        const ref = refOf(snapshot(), 'Item');
        const result = await set(ref, 'Item', 'Two');

        expect(result.value).toBe('Two');
        expect(host.form.value.item).toBe(ITEMS[1]);
        expect(host.form.controls.item.dirty).toBeTrue();

        const refused = await set(ref, 'Item', 'Three');
        expect(refused.refused).toBe('invalid');
        expect(refused.detail).toContain('"One", "Two"');
      });

      it('chooses a combobox option by label through the component', async () => {
        const ref = refOf(snapshot(), 'Cluster');
        const result = await set(ref, 'Cluster', 'Beta cluster');

        expect(result.value).toBe('Beta cluster');
        expect(result.previous).toBeNull();
        expect(host.form.value.cluster).toBe('beta');
        expect(host.form.controls.cluster.touched).toBeTrue();
      });

      it('refuses a combobox label no option has, naming the options', async () => {
        const ref = refOf(snapshot(), 'Cluster');
        const result = await set(ref, 'Cluster', 'Gamma cluster');

        expect(result.refused).toBe('invalid');
        expect(result.detail).toContain('"Alpha cluster", "Beta cluster"');
        expect(host.form.value.cluster).toBeNull();
      });

      it('selects several combobox options for a multi-select', async () => {
        const ref = refOf(snapshot(), 'Tags');
        const result = await set(ref, 'Tags', ['Red', 'blue']);

        expect(result.value).toEqual(['Red', 'Blue']);
        expect(host.form.value.tags).toEqual(['red', 'blue']);
      });

      it('gives a date input a date in the form its control holds', async () => {
        const ref = refOf(snapshot(), 'When');
        const result = await set(ref, 'When', '2026-03-06');

        const input = fixture.nativeElement.querySelector('input[formcontrolname="when"]') as HTMLInputElement;
        expect(result.applied).toBeTrue();
        expect(typeof host.form.value.when).toBe('string');
        expect(host.form.value.when).toContain('2026');
        expect(input.value).toBe(host.form.value.when ?? '');

        const asDate = await set(ref, 'When', new Date(2026, 4, 7));
        expect(asDate.value).toBe(host.form.value.when);
        expect(host.form.value.when).toContain('2026');

        expect((await set(ref, 'When', 'someday')).refused).toBe('invalid');
      });

      it('writes a template-driven control and fires ngModelChange once', async () => {
        const ref = refOf(snapshot(), 'Nickname');
        const result = await set(ref, 'Nickname', 'Grace');

        expect(result.applied).toBeTrue();
        expect(host.tplName).toBe('Grace');
        expect(host.changes).toBe(1);
      });

      it('selects datagrid rows by their content', async () => {
        const page = snapshot();
        const grid = nodeOf(
          page,
          node => node.element === 'clr-datagrid' && node.state?.['selectionMode'] === 'multi',
          'multi grid'
        );
        expect(grid.state?.['rows']).toEqual(['esx-01 | Running', 'esx-02 | Stopped']);

        const result = await set(String(grid.ref), '', ['esx-02', 'esx-01 | Running']);

        expect(result.applied).toBeTrue();
        expect(result.value).toEqual(['esx-01 | Running', 'esx-02 | Stopped']);
        expect(host.selectedHosts.map(selected => selected.name)).toEqual(['esx-02', 'esx-01']);

        const refused = await set(String(grid.ref), '', 'esx-09');
        expect(refused.refused).toBe('invalid');
        expect(refused.detail).toContain('"esx-01 | Running"');
      });

      it('selects one datagrid row where one is all the grid takes', async () => {
        const page = snapshot();
        const grid = nodeOf(
          page,
          node => node.element === 'clr-datagrid' && node.state?.['selectionMode'] === 'single',
          'single grid'
        );

        const result = await set(String(grid.ref), '', 'esx-02');
        expect(result.value).toBe('esx-02');
        expect(host.singleSelection.map(selected => selected.name)).toEqual(['esx-02']);

        expect((await set(String(grid.ref), '', ['esx-01', 'esx-02'])).refused).toBe('invalid');
      });
    });

    describe('clear', () => {
      it('empties a text control and a combobox', async () => {
        host.form.patchValue({ name: 'Ada', cluster: 'alpha', tags: ['red'] });
        await settle();
        const page = snapshot();

        const report = await engine.apply([
          { operation: 'clear', ref: refOf(page, 'Name'), description: 'Name' },
          { operation: 'clear', ref: refOf(page, 'Cluster'), description: 'Cluster' },
          { operation: 'clear', ref: refOf(page, 'Tags'), description: 'Tags' },
        ]);

        expect(report.results.map(result => result.applied)).toEqual([true, true, true]);
        expect(report.results.map(result => result.operation)).toEqual(['clear', 'clear', 'clear']);
        expect(host.form.value.name).toBe('');
        expect(host.form.value.cluster).toBeNull();
        expect(host.form.value.tags).toEqual([]);
        expect((report.results[0] as ClrElementMutationResult).status).toBe('INVALID');
      });

      it('deselects every datagrid row', async () => {
        host.selectedHosts = [...host.hosts];
        await settle();
        const page = snapshot();
        const grid = nodeOf(
          page,
          node => node.element === 'clr-datagrid' && node.state?.['selectionMode'] === 'multi',
          'multi grid'
        );
        expect(grid.state?.['selection']).toEqual(['esx-01 | Running', 'esx-02 | Stopped']);

        const report = await engine.apply([{ operation: 'clear', ref: String(grid.ref), description: '' }]);

        expect(report.results[0].applied).toBeTrue();
        expect(host.selectedHosts).toEqual([]);
      });
    });

    describe('refusals', () => {
      it('refuses a ref that is not in the latest snapshot', async () => {
        const ref = refOf(snapshot(), 'Nickname');
        host.showTemplate = false;
        await settle();

        const gone = await set(ref, 'Nickname', 'x');
        expect(gone.refused).toBe('stale');
        expect((await set('e999', 'Anything', 'x')).refused).toBe('stale');
      });

      it('refuses a description that does not match the node', async () => {
        const ref = refOf(snapshot(), 'Name');
        const result = await set(ref, 'Email address', 'x');

        expect(result.refused).toBe('mismatch');
        expect(result.detail).toContain('"Name"');
        expect(host.form.value.name).toBe('seed');
      });

      it('accepts a description that names the node loosely', async () => {
        const ref = refOf(snapshot(), 'Name');
        expect((await set(ref, 'the name field', 'Ada')).applied).toBeTrue();
        expect((await set(ref, '  NAME ', 'Bob')).applied).toBeTrue();
      });

      it('refuses a control without an Angular form binding', async () => {
        const result = await set(refOf(snapshot(), 'Loose'), 'Loose', 'x');

        expect(result.refused).toBe('unbound');
        expect(result.detail).toContain('formControlName');
      });

      it('refuses a control that became disabled or hidden since the snapshot', async () => {
        const page = snapshot();
        const frozen = refOf(page, 'Frozen');
        const ghost = refOf(page, 'Ghost');
        host.frozenDisabled = true;
        host.hideGhost = true;
        await settle();

        expect((await set(ghost, 'Ghost', 'x')).refused).toBe('hidden');
        expect((await set(frozen, 'Frozen', 'x')).refused).toBe('disabled');
        // A ref names its element for as long as it is on the page; it is refused for what
        // is true of the element now, not for which snapshot came last.
        expect((await set(ghost, 'Ghost', 'x')).refused).toBe('hidden');
        expect(host.form.value.frozen).toBe('');
        expect(host.ghost.value).toBe('');
      });

      it('refuses an operation it does not know', async () => {
        const report = await engine.apply([{ operation: 'submit' } as never]);
        expect(report.results[0].refused).toBe('unsupported');
      });
    });

    describe('policy', () => {
      it('gives the policy the resolved target', async () => {
        const ref = refOf(snapshot(), 'Cluster');
        await set(ref, 'Cluster', 'Alpha cluster');

        expect(classify).toHaveBeenCalledWith(
          jasmine.objectContaining({
            operation: 'setValue',
            ref,
            label: 'Cluster',
            type: 'combobox',
            value: 'Alpha cluster',
            modelValue: 'alpha',
          })
        );
      });

      it('refuses what the policy forbids', async () => {
        classify.and.returnValue('forbidden');
        const result = await set(refOf(snapshot(), 'Name'), 'Name', 'x');

        expect(result.refused).toBe('forbidden');
        expect(host.form.value.name).toBe('seed');
      });

      it('asks before a consequential operation and honours the answer', async () => {
        classify.and.returnValue('consequential');
        const ref = refOf(snapshot(), 'Name');

        confirm.and.returnValue(Promise.resolve(false));
        expect((await set(ref, 'Name', 'x')).refused).toBe('declined');
        expect(host.form.value.name).toBe('seed');

        confirm.and.returnValue(true);
        expect((await set(ref, 'Name', 'Ada')).applied).toBeTrue();
        expect(confirm).toHaveBeenCalledWith(jasmine.objectContaining({ ref, value: 'Ada' }));
      });

      it('treats a policy that throws as forbidding', async () => {
        classify.and.throwError('boom');
        expect((await set(refOf(snapshot(), 'Name'), 'Name', 'x')).refused).toBe('forbidden');
      });
    });

    describe('plan', () => {
      it('says what would happen without doing it', () => {
        classify.and.callFake(target => (target.label === 'Agree' ? 'consequential' : 'reversible'));
        const page = snapshot();

        const plan = engine.plan([
          { operation: 'setValue', ref: refOf(page, 'Name'), description: 'Name', value: 'Ada' },
          { operation: 'setValue', ref: refOf(page, 'Agree'), description: 'Agree', value: true },
          { operation: 'setValue', ref: refOf(page, 'Cluster'), description: 'Cluster', value: 'Nope' },
        ]);

        expect(plan[0].consequence).toBe('reversible');
        expect(plan[0].target?.value).toBe('Ada');
        expect(plan[1].consequence).toBe('consequential');
        expect(plan[2].refused).toBe('invalid');
        expect(host.form.value.name).toBe('seed');
        expect(host.form.value.agree).toBeFalse();
      });
    });

    describe('report', () => {
      it('carries a fresh snapshot with refs and the change from the one before', async () => {
        const page = snapshot();
        const ref = refOf(page, 'Name');

        const report = await engine.apply([{ operation: 'setValue', ref, description: 'Name', value: 'Ada' }]);

        expect('previous' in report.changes).toBeFalse();
        expect('current' in report.changes).toBeFalse();
        const changed = report.changes.changed.find(change => change.after.ref === ref);
        expect(changed?.after.state?.['value']).toBe('Ada');
        expect(refOf(report.snapshot, 'Name')).toBe(ref);
      });
    });
  });

  describe('navigate', () => {
    @Component({ template: 'routed', standalone: true })
    class Routed {}

    let harness: RouterTestingHarness;
    let engine: ClrMutationEngineService;
    let router: Router;
    let classify: jasmine.Spy<(target: ClrMutationTarget) => ClrMutationConsequence>;

    beforeEach(async () => {
      classify = jasmine.createSpy('classify').and.returnValue('reversible');
      TestBed.configureTestingModule({
        providers: [
          provideClrMutationPolicy({ classify: target => classify(target) }),
          provideRouter([
            { path: '', component: Routed },
            { path: 'hosts', component: Routed },
            { path: 'clusters/:id', component: Routed },
            { path: 'billing', loadChildren: () => Promise.resolve([{ path: '', component: Routed }]) },
            { path: 'legacy', component: Routed, canActivate: [() => TestBed.inject(Router).parseUrl('/hosts')] },
            { path: 'admin', component: Routed, canActivate: [() => false] },
            { path: '**', redirectTo: '' },
          ]),
        ],
      });
      harness = await RouterTestingHarness.create('/');
      engine = TestBed.inject(ClrMutationEngineService);
      router = TestBed.inject(Router);
    });

    async function navigate(path: string, params?: Record<string, string>, queryParams?: Record<string, string>) {
      const report = await engine.apply([{ operation: 'navigate', path, params, queryParams }]);
      await harness.fixture.whenStable();
      return report.results[0] as ClrNavigationMutationResult;
    }

    it('navigates to a listed route with its parameters filled in', async () => {
      const result = await navigate('clusters/:id', { id: '42' }, { tab: 'hosts' });

      expect(result).toEqual(
        jasmine.objectContaining({
          operation: 'navigate',
          path: 'clusters/:id',
          applied: true,
          outcome: 'navigated',
          url: '/clusters/42?tab=hosts',
        })
      );
      expect(router.url).toBe('/clusters/42?tab=hosts');
      expect(classify).toHaveBeenCalledWith(
        jasmine.objectContaining({ operation: 'navigate', path: 'clusters/:id', url: '/clusters/42?tab=hosts' })
      );
    });

    it('refuses a path the snapshot did not list, and a route missing a parameter', async () => {
      expect(await navigate('/clusters/42')).toEqual(jasmine.objectContaining({ applied: false, refused: 'noRoute' }));
      expect(await navigate('nowhere')).toEqual(jasmine.objectContaining({ applied: false, refused: 'noRoute' }));
      const missing = await navigate('clusters/:id');
      expect(missing.refused).toBe('invalid');
      expect(missing.detail).toContain('"id"');
      expect(router.url).toBe('/');
    });

    it('fills a parameter as one literal segment, whatever it contains', async () => {
      const result = await navigate('clusters/:id', { id: 'a/b ?c' });

      expect(result.outcome).toBe('navigated');
      expect(result.url).toBe('/clusters/a%2Fb%20%3Fc');
      expect(router.routerState.snapshot.root.firstChild?.params).toEqual({ id: 'a/b ?c' });
    });

    it('refuses a parameter that would step up the path', async () => {
      const result = await navigate('clusters/:id', { id: '..' });

      expect(result.refused).toBe('invalid');
      expect(router.url).toBe('/');
    });

    it('navigates to a route whose module has not loaded yet', async () => {
      const result = await navigate('billing');

      expect(result).toEqual(jasmine.objectContaining({ applied: true, outcome: 'navigated', url: '/billing' }));
    });

    it('reports where a guard redirect actually went', async () => {
      const result = await navigate('legacy');

      expect(result.outcome).toBe('redirected');
      expect(result.url).toBe('/hosts');
      expect(result.applied).toBeTrue();
    });

    it('reports a guard that refused', async () => {
      const result = await navigate('admin');

      expect(result).toEqual(jasmine.objectContaining({ applied: false, outcome: 'rejected', url: '/' }));
    });

    it('reports staying put', async () => {
      expect((await navigate('/')).outcome).toBe('unchanged');
    });

    it('is subject to the policy like any other operation', async () => {
      classify.and.returnValue('forbidden');
      expect((await navigate('hosts')).refused).toBe('forbidden');
      expect(router.url).toBe('/');
    });
  });
});
