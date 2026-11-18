/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal, Type, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subject } from 'rxjs';

import { ClrDatagridModule } from './datagrid.module';
import { ClrDatagridFilterInterface } from './interfaces/filter.interface';

/*
 * The datagrid components are OnPush. Everything they render of the datagrid's state has to reach them when the
 * application changes it from outside the datagrid, after they were checked.
 *
 * Every case runs with two hosts:
 * - an OnPush host whose state is in signals, as in an OnPush or zoneless application;
 * - an Eager host whose state is in plain fields and that is checked once after each change, which is what a
 *   Zone.js application does after a timer or a request.
 */

interface Item {
  name: string;
}

class NameFilter implements ClrDatagridFilterInterface<Item> {
  readonly changes = new Subject<void>();
  query = '';

  isActive() {
    return !!this.query;
  }

  accepts(item: Item) {
    return item.name.includes(this.query);
  }

  search(query: string) {
    this.query = query;
    this.changes.next();
  }
}

const ITEMS: Item[] = [{ name: 'a1' }, { name: 'b1' }, { name: 'a2' }];

/** Reads a field of the host: `name()` in the signal host, `name` in the plain one. */
type Read = (name: string) => string;

const gridTemplate = (read: Read) => `
  <clr-datagrid [clrDgLoading]="${read('loading')}" [(clrDgSelected)]="selected" clrDgSelectionType="multi">
    <clr-dg-column>
      Name
      <clr-dg-filter [clrDgFilter]="filter">Filter</clr-dg-filter>
    </clr-dg-column>
    <clr-dg-row *clrDgItems="let item of ${read('items')}" [clrDgItem]="item">
      <clr-dg-cell>{{ item.name }}</clr-dg-cell>
    </clr-dg-row>
    <ng-template [(clrIfDetail)]="detail" let-detail>
      <clr-dg-detail>
        @if (${read('detailHeader')}) {
          <clr-dg-detail-header>Header of {{ detail.name }}</clr-dg-detail-header>
        }
        <clr-dg-detail-body>Pane of {{ detail.name }}</clr-dg-detail-body>
      </clr-dg-detail>
    </ng-template>
    @if (${read('customPlaceholder')}) {
      <clr-dg-placeholder>Nothing found</clr-dg-placeholder>
    }
    <clr-dg-footer>
      <clr-dg-pagination [clrDgPageSize]="${read('pageSize')}" [(clrDgPage)]="page">
        @if (${read('pageSizes')}) {
          <clr-dg-page-size [clrPageSizeOptions]="[2, 5]">Per page</clr-dg-page-size>
        }
      </clr-dg-pagination>
    </clr-dg-footer>
  </clr-datagrid>
`;

interface Host {
  filter: NameFilter;
  set(name: keyof HostState, value: unknown): void;
  get<K extends keyof HostState>(name: K): HostState[K];
}

interface HostState {
  items: Item[];
  loading: boolean;
  selected: Item[];
  page: number;
  pageSize: number;
  pageSizes: boolean;
  detail: Item | null;
  detailHeader: boolean;
  customPlaceholder: boolean;
}

const initialState = (): HostState => ({
  items: ITEMS,
  loading: false,
  selected: [],
  page: 1,
  pageSize: 10,
  pageSizes: false,
  detail: null,
  detailHeader: false,
  customPlaceholder: false,
});

@Component({
  template: gridTemplate(name => `${name}()`),
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class SignalHost implements Host {
  readonly filter = new NameFilter();
  readonly items = signal(ITEMS);
  readonly loading = signal(false);
  readonly selected = signal<Item[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(10);
  readonly pageSizes = signal(false);
  readonly detail = signal<Item | null>(null);
  readonly detailHeader = signal(false);
  readonly customPlaceholder = signal(false);

  set(name: keyof HostState, value: unknown) {
    (this[name] as WritableSignal<unknown>).set(value);
  }

  get<K extends keyof HostState>(name: K): HostState[K] {
    return (this[name] as WritableSignal<HostState[K]>)();
  }
}

@Component({
  template: gridTemplate(name => name),
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class PlainHost implements Host {
  readonly filter = new NameFilter();
  state = initialState();

  // The template reads the state as plain fields.
  get items() {
    return this.state.items;
  }
  get loading() {
    return this.state.loading;
  }
  get selected() {
    return this.state.selected;
  }
  set selected(value: Item[]) {
    this.state.selected = value;
  }
  get page() {
    return this.state.page;
  }
  set page(value: number) {
    this.state.page = value;
  }
  get pageSize() {
    return this.state.pageSize;
  }
  get pageSizes() {
    return this.state.pageSizes;
  }
  get detail() {
    return this.state.detail;
  }
  set detail(value: Item | null) {
    this.state.detail = value;
  }
  get detailHeader() {
    return this.state.detailHeader;
  }
  get customPlaceholder() {
    return this.state.customPlaceholder;
  }

  set(name: keyof HostState, value: unknown) {
    (this.state as unknown as Record<string, unknown>)[name] = value;
  }

  get<K extends keyof HostState>(name: K): HostState[K] {
    return this.state[name];
  }
}

const hosts: [string, Type<Host>][] = [
  ['OnPush host with signals', SignalHost],
  ['Eager host with plain fields, checked like a Zone.js app', PlainHost],
];

hosts.forEach(([description, hostType]) => {
  describe(`ClrDatagrid OnPush (${description})`, () => {
    let fixture: ComponentFixture<Host>;
    let host: Host;

    /** The application changes its state after the datagrid was checked, e.g. when a request comes back. */
    async function change(update: () => void) {
      await Promise.resolve();
      update();
      if (hostType === PlainHost) {
        // Zone.js checks every Eager view after the task that changed the fields, as from a markForCheck() at the
        // root. The OnPush views of the datagrid are only checked if they were told of the change.
        fixture.changeDetectorRef.markForCheck();
      }
      await fixture.whenStable();
    }

    function query<E extends Element = HTMLElement>(selector: string): E | null {
      return fixture.nativeElement.querySelector(selector);
    }

    function queryAll(selector: string): HTMLElement[] {
      return Array.from(fixture.nativeElement.querySelectorAll(selector));
    }

    const rows = () => queryAll('.datagrid-rows .datagrid-row-master');
    const rowNames = () => rows().map(row => row.querySelector('clr-dg-cell').textContent.trim());
    const rowCheckboxes = () => queryAll('.datagrid-rows .datagrid-select input') as HTMLInputElement[];

    beforeEach(async () => {
      TestBed.configureTestingModule({ declarations: [hostType], imports: [ClrDatagridModule] });
      fixture = TestBed.createComponent(hostType);
      host = fixture.componentInstance;
      await fixture.whenStable();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('renders items that come in later, and the empty placeholder when there are none', async () => {
      expect(rows().length).toBe(3);
      expect(query('.datagrid-placeholder.datagrid-empty')).toBeNull();

      await change(() => host.set('items', []));
      expect(rows().length).toBe(0);
      expect(query('.datagrid-placeholder.datagrid-empty')).not.toBeNull();

      await change(() => host.set('items', [{ name: 'c1' }]));
      expect(rowNames()).toEqual(['c1']);
      expect(query('.datagrid-placeholder.datagrid-empty')).toBeNull();
    });

    it('shows the loading state', async () => {
      await change(() => {
        host.set('items', []);
        host.set('loading', true);
      });
      expect(query('.datagrid-spinner')).not.toBeNull();
      expect(query('.datagrid-placeholder.datagrid-empty')).toBeNull();

      await change(() => host.set('loading', false));
      expect(query('.datagrid-spinner')).toBeNull();
      expect(query('.datagrid-placeholder.datagrid-empty')).not.toBeNull();
    });

    it('shows a selection set by the application in the rows, the header and the footer', async () => {
      await change(() => host.set('selected', [ITEMS[1]]));
      expect(rowCheckboxes().map(checkbox => checkbox.checked)).toEqual([false, true, false]);
      expect(query('.datagrid-footer-select').textContent).toContain('1');
      expect(query<HTMLInputElement>('.datagrid-header .datagrid-select input').checked).toBe(false);

      await change(() => host.set('selected', [...ITEMS]));
      expect(rowCheckboxes().every(checkbox => checkbox.checked)).toBe(true);
      expect(query('.datagrid-footer-select').textContent).toContain('3');
      expect(query<HTMLInputElement>('.datagrid-header .datagrid-select input').checked).toBe(true);
    });

    it('moves to a page set by the application', async () => {
      await change(() => host.set('pageSize', 2));
      expect(rows().length).toBe(2);
      expect(query<HTMLInputElement>('.pagination-current').value).toBe('1');

      await change(() => host.set('page', 2));
      expect(rowNames()).toEqual(['a2']);
      expect(query<HTMLInputElement>('.pagination-current').value).toBe('2');
      expect(query<HTMLButtonElement>('.pagination-next').disabled).toBe(true);
    });

    it('shows a custom filter that changes from code as active, and filters the rows', async () => {
      await change(() => host.filter.search('a'));
      expect(query('.datagrid-filter-toggle').classList).toContain('datagrid-filtered');
      expect(rowNames()).toEqual(['a1', 'a2']);

      await change(() => host.filter.search(''));
      expect(query('.datagrid-filter-toggle').classList).not.toContain('datagrid-filtered');
      expect(rows().length).toBe(3);
    });

    it('opens and closes the detail pane from code', async () => {
      await change(() => host.set('detail', ITEMS[0]));
      expect(query('.datagrid-detail-pane-content').textContent).toContain('Pane of a1');
      expect(query('.datagrid').getAttribute('aria-hidden')).toBe('true');
      expect(query('.datagrid-detail-caret-button.is-open')).not.toBeNull();

      await change(() => host.set('detail', null));
      expect(query('.datagrid-detail-pane-content')).toBeNull();
      expect(query('.datagrid').hasAttribute('aria-hidden')).toBe(false);
      expect(query('.datagrid-detail-caret-button.is-open')).toBeNull();
    });

    it('shows strings localized after it was rendered', async () => {
      await change(() => host.set('pageSize', 2));
      await change(() => TestBed.inject(ClrCommonStringsService).localize({ selectAll: 'Alle', nextPage: 'Weiter' }));
      expect(query('.datagrid-header .datagrid-select input').getAttribute('aria-label')).toBe('Alle');
      expect(query('.pagination-next').getAttribute('aria-label')).toBe('Weiter');
    });

    describe('late children', () => {
      it('shows a custom placeholder added later instead of the default one', async () => {
        await change(() => {
          host.set('items', []);
          host.set('customPlaceholder', true);
        });
        expect(queryAll('clr-dg-placeholder').length).toBe(1);
        expect(query('clr-dg-placeholder').textContent).toContain('Nothing found');

        await change(() => host.set('customPlaceholder', false));
        expect(queryAll('clr-dg-placeholder').length).toBe(1);
        expect(query('clr-dg-placeholder').textContent).not.toContain('Nothing found');
      });

      it('shows a page size added later', async () => {
        expect(query('.pagination-size')).toBeNull();

        await change(() => host.set('pageSizes', true));
        expect(query('.pagination-size select')).not.toBeNull();
      });

      it('names the detail pane after a header added later', async () => {
        await change(() => host.set('detail', ITEMS[0]));
        expect(query('.datagrid-detail-pane-content').getAttribute('aria-labelledby')).toBe('');

        await change(() => host.set('detailHeader', true));
        const title = query('.datagrid-detail-header-title');
        expect(query('.datagrid-detail-pane-content').getAttribute('aria-labelledby')).toBe(title.id);
      });
    });

    it('is destroyed with the detail pane open and a filter active', async () => {
      await change(() => {
        host.filter.search('a');
        host.set('detail', ITEMS[0]);
      });
      expect(() => fixture.destroy()).not.toThrow();
      expect(host.filter.changes.observed).toBe(false);
    });
  });
});

describe('ClrDatagrid OnPush (Eager host with plain fields, checked like a Zone.js app)', () => {
  @Component({
    template: `
      <clr-datagrid [(clrDgSelected)]="selected" clrDgSelectionType="multi">
        <clr-dg-column>Name</clr-dg-column>
        <clr-dg-row *clrDgItems="let item of items" [clrDgItem]="item" [clrDgExpanded]="item === expanded">
          <clr-dg-cell>{{ item.name }}</clr-dg-cell>
          <clr-dg-row-detail *clrIfExpanded>Detail of {{ item.name }}</clr-dg-row-detail>
        </clr-dg-row>
        <clr-dg-footer />
      </clr-datagrid>
    `,
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false,
  })
  class InPlaceHost {
    items = [...ITEMS];
    selected: Item[] = [];
    expanded: Item | null = null;
  }

  let fixture: ComponentFixture<InPlaceHost>;

  /** Changes the plain fields of the host, then checks it as Zone.js does after a task. */
  async function change(update: (host: InPlaceHost) => void) {
    update(fixture.componentInstance);
    fixture.changeDetectorRef.markForCheck();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({ declarations: [InPlaceHost], imports: [ClrDatagridModule] });
    fixture = TestBed.createComponent(InPlaceHost);
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('shows items selected with clrDgSelected.push() and removed with splice()', async () => {
    const checked = () =>
      Array.from(fixture.nativeElement.querySelectorAll('.datagrid-rows .datagrid-select input')).map(
        (checkbox: HTMLInputElement) => checkbox.checked
      );

    await change(host => host.selected.push(ITEMS[2]));
    expect(checked()).toEqual([false, false, true]);
    expect(fixture.nativeElement.querySelector('.datagrid-footer-select').textContent).toContain('1');

    await change(host => host.selected.splice(0, 1));
    expect(checked()).toEqual([false, false, false]);
    expect(fixture.nativeElement.querySelector('.datagrid-footer-select')).toBeNull();
  });

  it('shows items pushed into the items array in place', async () => {
    await change(host => host.items.push({ name: 'c1' }));
    expect(fixture.nativeElement.querySelectorAll('.datagrid-rows .datagrid-row-master').length).toBe(4);
  });

  it('expands a row from code', async () => {
    await change(host => (host.expanded = ITEMS[1]));
    const carets = Array.from(fixture.nativeElement.querySelectorAll('.datagrid-expandable-caret-button'));
    expect(carets.map((caret: HTMLElement) => caret.getAttribute('aria-expanded'))).toEqual(['false', 'true', 'false']);
    expect(fixture.nativeElement.querySelector('clr-dg-row-detail').textContent).toContain('Detail of b1');
  });
});
