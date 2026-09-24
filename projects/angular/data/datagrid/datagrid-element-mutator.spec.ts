/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClrContextEngineService,
  ClrElementMutationResult,
  ClrMutationEngineService,
  ClrPageContext,
  provideClrMutationPolicy,
} from '@clr/angular/ai';
import { CLR_ELEMENT_MUTATOR_PROPERTY, ClrComponentContext } from '@clr/angular/utils';

import { ClrDatagridModule } from './datagrid.module';

interface Server {
  id: number;
  name: string;
  state: string;
  locked?: boolean;
}

function servers(): Server[] {
  return [
    { id: 1, name: 'esx-01', state: 'Running' },
    { id: 2, name: 'esx-02', state: 'Running' },
    { id: 3, name: 'esx-03', state: 'Stopped' },
    { id: 4, name: 'esx-04', state: 'Stopped' },
  ];
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>State</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item" [clrDgSelectable]="!item.locked">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.state }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class MultiHost {
  items = servers().slice(0, 3);
  selected: Server[] = [];
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'single'">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item" [clrDgSelectable]="!item.locked">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class SingleHost {
  items = servers().slice(0, 3);
  selected: Server[] = [];
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'" [clrDgItemsIdentityFn]="byId">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>State</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.state }}</clr-dg-cell>
      </clr-dg-row>
      <clr-dg-footer>
        <clr-dg-pagination [clrDgPageSize]="2"></clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  standalone: false,
})
class PagedHost {
  items = servers();
  selected: Server[] = [];
  byId = (item: Server) => item.id;
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="mode">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class ToggleHost {
  items = servers().slice(0, 2);
  selected: Server[] = [];
  mode: 'none' | 'multi' = 'none';
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Note</clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items; let i = index" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell><input [formControl]="notes[i]" [attr.aria-label]="'Note for ' + item.name" /></clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class InputHost {
  items = servers().slice(0, 2);
  notes = [new FormControl(''), new FormControl('')];
  selected: Server[] = [];
}

@Component({
  template: `
    <div data-clr-context-redact>
      <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
        <clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
          <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        </clr-dg-row>
      </clr-datagrid>
    </div>
  `,
  standalone: false,
})
class RedactedHost {
  items = servers().slice(0, 2);
  selected: Server[] = [this.items[1]];
}

@Component({
  template: `
    <clr-datagrid [(clrDgSelected)]="selected" [clrDgSelectionType]="'multi'">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>
        <ng-container *clrDgHideableColumn="{ hidden: hideState }">State</ng-container>
      </clr-dg-column>
      <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item">
        <clr-dg-cell>{{ item.name }}</clr-dg-cell>
        <clr-dg-cell>{{ item.state }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
})
class HiddenColumnHost {
  hideState = true;
  // "esx-02" is one row's name and, while the state column shows, the other row's state.
  items: Server[] = [
    { id: 1, name: 'esx-01', state: 'esx-02' },
    { id: 2, name: 'esx-02', state: 'Running' },
  ];
  selected: Server[] = [];
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

function gridOf(snapshot: ClrPageContext): ClrComponentContext {
  const grid = findNode(snapshot.components, node => node.element === 'clr-datagrid');
  if (!grid) {
    throw new Error(`no datagrid in ${JSON.stringify(snapshot.components)}`);
  }
  return grid;
}

function names(selected: Server[]): string[] {
  return selected.map(server => server.name);
}

describe('ClrDatagrid element mutator', () => {
  let fixture: ComponentFixture<unknown>;
  let contextEngine: ClrContextEngineService;
  let engine: ClrMutationEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, NoopAnimationsModule, ReactiveFormsModule],
      declarations: [MultiHost, SingleHost, PagedHost, ToggleHost, InputHost, RedactedHost, HiddenColumnHost],
      providers: [provideClrMutationPolicy({ classify: () => 'reversible' })],
    });
  });

  afterEach(() => fixture?.destroy());

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function create<C>(component: Type<C>): Promise<C> {
    fixture = TestBed.createComponent(component);
    await settle();
    contextEngine = TestBed.inject(ClrContextEngineService);
    engine = TestBed.inject(ClrMutationEngineService);
    return fixture.componentInstance as C;
  }

  function grid(): ClrComponentContext {
    return gridOf(contextEngine.getSnapshot());
  }

  async function write(ref: string, value: unknown, description = ''): Promise<ClrElementMutationResult> {
    const report = await engine.apply([{ operation: 'setValue', ref, description, value }]);
    await settle();
    return report.results[0] as ClrElementMutationResult;
  }

  async function select(value: unknown): Promise<ClrElementMutationResult> {
    return write(String(grid().ref), value);
  }

  describe('row matching', () => {
    it('refuses a value that fits more than one row, and leaves the selection as it was', async () => {
      const host = await create(MultiHost);
      host.selected = [host.items[2]];
      await settle();

      const result = await select('Running');

      expect(result.applied).toBeFalse();
      expect(result.refused).toBe('invalid');
      expect(result.detail).toContain('"Running" fits 2 rows');
      expect(result.detail).toContain('"esx-01 | Running"');
      expect(result.detail).toContain('"esx-02 | Running"');
      expect(names(host.selected)).toEqual(['esx-03']);
      expect(grid().state?.['selection']).toEqual(['esx-03 | Stopped']);
    });

    it('applies none of a write when one of the rows it names is ambiguous', async () => {
      const host = await create(MultiHost);

      const result = await select(['esx-03', 'Running']);

      expect(result.refused).toBe('invalid');
      expect(host.selected).toEqual([]);
    });

    it('takes a value that fits one row by more of its content', async () => {
      const host = await create(MultiHost);

      const result = await select('esx-02 | Running');

      expect(result.applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-02']);
    });

    it('does not match a row by a cell in a hidden column', async () => {
      const host = await create(HiddenColumnHost);
      expect(grid().state?.['rows']).toEqual(['esx-01', 'esx-02']);

      // Only the hidden state cell says "Running": it is not there to be matched.
      const hidden = await select('Running');
      expect(hidden.refused).toBe('invalid');
      expect(hidden.detail).toContain('No such row');
      expect(host.selected).toEqual([]);

      // "esx-02" is a name shown, and a state hidden: only the row it names is selected.
      const result = await select('esx-02');
      expect(result.applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-02']);
    });

    it('matches a row by a column once it is shown again', async () => {
      const host = await create(HiddenColumnHost);
      host.hideState = false;
      await settle();
      expect(grid().state?.['rows']).toEqual(['esx-01 | esx-02', 'esx-02 | Running']);

      expect((await select('esx-02')).detail).toContain('fits 2 rows');
      expect((await select('Running')).applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-02']);
    });
  });

  describe('locked rows', () => {
    it('keeps a locked row selected when a new selection leaves it out', async () => {
      const host = await create(MultiHost);
      host.items[0].locked = true;
      host.selected = [host.items[0], host.items[1]];
      await settle();

      const result = await select(['esx-03']);

      expect(result.applied).toBeTrue();
      expect(result.value).toEqual(['esx-01 | Running', 'esx-03 | Stopped']);
      expect(names(host.selected)).toEqual(['esx-01', 'esx-03']);
    });

    it('takes back the value a write returned, naming a locked row that is already selected', async () => {
      const host = await create(MultiHost);
      host.items[0].locked = true;
      host.selected = [host.items[0]];
      await settle();
      const first = await select(['esx-03']);

      const again = await select(first.value);

      expect(again.applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-01', 'esx-03']);
    });

    it('keeps a locked row selected when the selection is cleared', async () => {
      const host = await create(MultiHost);
      host.items[0].locked = true;
      host.selected = [host.items[0], host.items[1]];
      await settle();

      const report = await engine.apply([{ operation: 'clear', ref: String(grid().ref), description: '' }]);
      await settle();

      expect(report.results[0].applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-01']);
    });

    it('refuses to select a locked row', async () => {
      const host = await create(MultiHost);
      host.items[2].locked = true;
      await settle();

      const result = await select(['esx-01', 'esx-03']);

      expect(result.refused).toBe('invalid');
      expect(result.detail).toContain('"esx-03 | Stopped" is locked');
      expect(host.selected).toEqual([]);
    });

    it('refuses to replace a locked single selection', async () => {
      const host = await create(SingleHost);
      host.items[0].locked = true;
      host.selected = [host.items[0]];
      await settle();
      expect(grid().state?.['selection']).toEqual(['esx-01']);

      const replaced = await select('esx-02');
      expect(replaced.refused).toBe('invalid');
      expect(replaced.detail).toBe('The selected row is locked and cannot be deselected.');
      expect(names(host.selected)).toEqual(['esx-01']);

      const cleared = await select(null);
      expect(cleared.refused).toBe('invalid');
      expect(names(host.selected)).toEqual(['esx-01']);
      expect(grid().state?.['selection']).toEqual(['esx-01']);
    });

    it('replaces a single selection that is not locked', async () => {
      const host = await create(SingleHost);
      host.selected = [host.items[0]];
      await settle();

      const result = await select('esx-02');

      expect(result.applied).toBeTrue();
      expect(result.value).toBe('esx-02');
      expect(names(host.selected)).toEqual(['esx-02']);
    });
  });

  describe('pages', () => {
    it('keeps rows selected on other pages, compared by identity rather than reference', async () => {
      const host = await create(PagedHost);
      // Copies, as a server-driven grid would hold: only the identity function ties them to the rows.
      host.selected = [{ ...host.items[2] }, { ...host.items[0] }];
      await settle();
      expect(fixture.nativeElement.querySelectorAll('clr-dg-row').length).toBe(2);
      expect(grid().state?.['selection']).toEqual(['esx-01 | Running']);

      const result = await select(['esx-02']);

      expect(result.applied).toBeTrue();
      expect(result.value).toEqual(['esx-02 | Running']);
      // esx-03 is on page two and stays; esx-01 is on this page and was left out, so it goes.
      expect(host.selected.map(server => server.id)).toEqual([3, 2]);
    });

    it('keeps rows selected on other pages when this page is cleared', async () => {
      const host = await create(PagedHost);
      host.selected = [host.items[0], host.items[3]];
      await settle();

      const result = await select([]);

      expect(result.applied).toBeTrue();
      expect(host.selected.map(server => server.id)).toEqual([4]);
    });
  });

  describe('publishing', () => {
    it('publishes no mutator, and so no ref, while the grid offers no selection', async () => {
      const host = await create(ToggleHost);
      const element: HTMLElement = fixture.nativeElement.querySelector('clr-datagrid');

      expect(CLR_ELEMENT_MUTATOR_PROPERTY in element).toBeFalse();
      expect(grid().ref).toBeUndefined();
      expect(grid().state?.['selectionMode']).toBeUndefined();

      host.mode = 'multi';
      await settle();

      expect(CLR_ELEMENT_MUTATOR_PROPERTY in element).toBeTrue();
      const ref = grid().ref;
      expect(ref).toBeDefined();
      expect(grid().state?.['selectionMode']).toBe('multi');
      expect((await write(String(ref), 'esx-02')).applied).toBeTrue();
      expect(names(host.selected)).toEqual(['esx-02']);
    });

    it('withdraws the mutator when the grid stops offering selection', async () => {
      const host = await create(ToggleHost);
      host.mode = 'multi';
      await settle();
      const ref = String(grid().ref);

      host.mode = 'none';
      await settle();

      expect(CLR_ELEMENT_MUTATOR_PROPERTY in fixture.nativeElement.querySelector('clr-datagrid')).toBeFalse();
      expect(grid().ref).toBeUndefined();
      expect((await write(ref, 'esx-01')).applied).toBeFalse();
      expect(host.selected).toEqual([]);
    });

    it('stops publishing the mutator once the datagrid is destroyed', async () => {
      await create(MultiHost);
      const element: HTMLElement = fixture.nativeElement.querySelector('clr-datagrid');
      expect(CLR_ELEMENT_MUTATOR_PROPERTY in element).toBeTrue();

      fixture.destroy();

      expect(CLR_ELEMENT_MUTATOR_PROPERTY in element).toBeFalse();
    });
  });

  describe('contents', () => {
    // Pending: the walk summarises a grid and does not descend into it (walk.ts, `terminal`
    // for a summarised role), so a control in a cell never reaches the snapshot and gets no
    // ref, although ClrElementMutator.ownsContents says a datagrid's cells are the application's.
    it('gives an input in a cell a ref of its own, and writes it', async () => {
      const host = await create(InputHost);
      const page = contextEngine.getSnapshot();
      const input = findNode(page.components, node => node.label === 'Note for esx-02' && !!node.ref);

      expect(input?.ref).toBeDefined();
      expect(input?.ref).not.toBe(gridOf(page).ref);

      const result = await write(String(input?.ref), 'rebooted', 'Note for esx-02');

      expect(result.applied).toBeTrue();
      expect(host.notes[1].value).toBe('rebooted');
      expect(host.notes[0].value).toBe('');
      expect(host.selected).toEqual([]);
    });
  });

  describe('redaction', () => {
    it('publishes neither the rows nor the selection of a grid in a redacted region', async () => {
      await create(RedactedHost);
      const page = contextEngine.getSnapshot();
      const redacted = gridOf(page);

      expect(redacted.state?.['redacted']).toBeTrue();
      expect(redacted.state?.['rows']).toBeUndefined();
      expect(redacted.state?.['selection']).toBeUndefined();
      expect(redacted.ref).toBeUndefined();
      expect(JSON.stringify(page.components)).not.toContain('esx-0');
    });
  });
});
