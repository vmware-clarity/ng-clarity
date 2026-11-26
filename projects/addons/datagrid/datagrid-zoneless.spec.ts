/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { ClrLoading, ClrLoadingState } from '@clr/angular/utils';

import { ExportType } from './addons/export/export-type';
import { ExportStatus } from './addons/export/export.interface';
import { GridFooterModel } from './datagrid.component';
import { AppfxDatagridModule } from './datagrid.module';
import { ActionDefinition } from './shared/action/action-definition';
import { ColumnDefinition, ColumnRenderer } from './shared/column/column-definitions';

interface Vm {
  id: number;
  name: string;
}

/** OnPush, like the documented renderer example, which leaves the strategy to the Angular default. */
@Component({
  selector: 'name-renderer',
  template: `<span class="rendered">{{ text }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class NameRenderer implements ColumnRenderer<Vm>, OnInit {
  item: Vm;
  column: ColumnDefinition<Vm>;
  text = '';

  ngOnInit(): void {
    this.text = this.item.name;
  }

  onChange(item: Vm): void {
    this.item = item;
    this.text = item.name;
  }
}

/**
 * OnPush host that only changes signals. Nothing here calls `markForCheck()`, so every refresh comes from the
 * grid itself or from the signals.
 */
@Component({
  template: `
    <appfx-datagrid
      [gridItems]="items()"
      [columns]="columns()"
      [actionBarActions]="actions"
      [footerModel]="footerModel"
      [selectionType]="'multi'"
      [selectedItems]="selected()"
      trackByGridItemProperty="id"
      (exportDataEvent)="onExport($event)"
    ></appfx-datagrid>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushGridHost {
  readonly items = signal<Vm[]>([
    { id: 1, name: 'vm-1' },
    { id: 2, name: 'vm-2' },
  ]);
  readonly selected = signal<Vm[]>([]);
  readonly columns = signal<ColumnDefinition<Vm>[]>([
    { displayName: 'Name', field: 'name', uid: 'name' },
    { displayName: 'Renderer', field: 'name', uid: 'renderer', columnRenderer: NameRenderer },
    { displayName: 'Id', field: 'id', uid: 'id' },
  ]);
  readonly actions: ActionDefinition[] = [{ id: 'power-on', label: 'Power on', enabled: false }];
  readonly footerModel: GridFooterModel = { showFooter: true, enableCustomExport: true };
  exportStatus: ExportStatus | undefined;

  onExport(status: ExportStatus): void {
    // The app runs its own export and reports progress on the status object it was given.
    status.inProgress = true;
    this.exportStatus = status;
    setTimeout(() => (status.inProgress = false), 1000);
  }
}

describe('appfx-datagrid in an OnPush host (zoneless)', () => {
  let fixture: ComponentFixture<OnPushGridHost>;
  let host: OnPushGridHost;

  function cellTexts(columnIndex: number): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-dg-row')).map(row =>
      row.querySelectorAll('clr-dg-cell appfx-dg-cell-container')[columnIndex].textContent.trim()
    );
  }

  function headerTexts(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-dg-column .datagrid-column-title')).map(
      title => title.textContent.trim()
    );
  }

  function actionButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('appfx-datagrid-action-bar [data-test-id="power-on"]');
  }

  function exportButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('appfx-dg-export [data-test-id="export-link"]');
  }

  function exportLoading(): boolean {
    const loading = fixture.debugElement
      .query(By.css('appfx-dg-export [data-test-id="export-link"]'))
      .injector.get(ClrLoading);
    return loading.loadingState === ClrLoadingState.LOADING;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppfxDatagridModule],
      declarations: [OnPushGridHost, NameRenderer],
    });
    fixture = TestBed.createComponent(OnPushGridHost);
    host = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('renders item fields and renderers', () => {
    expect(cellTexts(0)).toEqual(['vm-1', 'vm-2']);
    expect(cellTexts(1)).toEqual(['vm-1', 'vm-2']);
  });

  it('refreshes cells when the app changes items in place and hands over a new array', async () => {
    // A common Zone app pattern: update the item objects in place, then pass a new array.
    host.items()[0].name = 'vm-1 renamed';
    host.items.set([...host.items()]);
    await fixture.whenStable();

    expect(cellTexts(0)).toEqual(['vm-1 renamed', 'vm-2']);
  });

  it('refreshes an OnPush renderer with the values it gets from onChange', async () => {
    // Same row (tracked by id), new item object: the renderer only learns about it through onChange.
    host.items.set([{ id: 1, name: 'vm-1 updated' }, host.items()[1]]);
    await fixture.whenStable();

    expect(cellTexts(0)).toEqual(['vm-1 updated', 'vm-2']);
    expect(cellTexts(1)).toEqual(['vm-1 updated', 'vm-2']);
  });

  it('shows an action enabled in place once the grid refreshes', async () => {
    expect(actionButton().disabled).toBe(true);

    // Apps enable actions in place, for example when the selection changes.
    host.actions[0].enabled = true;
    host.items.set([...host.items()]);
    await fixture.whenStable();

    expect(actionButton().disabled).toBe(false);
  });

  it('stops the export loading state when the app finishes an async export', async () => {
    vi.useFakeTimers();
    exportButton().click();
    await fixture.whenStable();

    expect(host.exportStatus?.inProgress).toBe(true);
    expect(exportLoading()).toBe(true);

    // Nothing in the grid changes: only the status object the app was given.
    await vi.advanceTimersByTimeAsync(1000);
    await fixture.whenStable();

    expect(host.exportStatus?.inProgress).toBe(false);
    expect(exportLoading()).toBe(false);
  });

  it('hides and shows columns from the column toggle', async () => {
    fixture.nativeElement.querySelector('.column-toggle-action').click();
    await fixture.whenStable();

    const checkboxes = Array.from<HTMLInputElement>(document.querySelectorAll('.column-switch input[type=checkbox]'));
    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([true, true, true]);

    checkboxes[2].click();
    await fixture.whenStable();

    expect(headerTexts()).toEqual(['Name', 'Renderer']);
    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([true, true, false]);

    // Two columns are left, so the toggle keeps the last one from being hidden as well.
    checkboxes[1].click();
    await fixture.whenStable();

    expect(checkboxes[0].disabled).toBe(true);

    (document.querySelector('.column-switch .switch-header button') as HTMLButtonElement).click();
    await fixture.whenStable();

    expect(document.querySelector('.column-switch')).toBeNull();
    expect(fixture.nativeElement.querySelector('.column-toggle-action').getAttribute('aria-expanded')).toBe('false');
  });

  it('shows a column hidden in place while the column toggle is open', async () => {
    fixture.nativeElement.querySelector('.column-toggle-action').click();
    await fixture.whenStable();

    const checkboxes = Array.from<HTMLInputElement>(document.querySelectorAll('.column-switch input[type=checkbox]'));
    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([true, true, true]);

    // Apps change the column definition in place, then let the grid check (here through a new items array).
    host.columns()[2].hidden = true;
    host.items.set([...host.items()]);
    await fixture.whenStable();

    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([true, true, false]);
  });

  it('shows the export dropdown with counts and reports the chosen export type', async () => {
    host.selected.set([host.items()[0]]);
    await fixture.whenStable();

    exportButton().click();
    await fixture.whenStable();

    const items = Array.from<HTMLButtonElement>(document.querySelectorAll('.export-dropdown button[clrDropdownItem]'));
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('(2)');
    expect(items[1].textContent).toContain('(1)');

    items[1].click();
    await fixture.whenStable();

    expect(host.exportStatus?.exportType).toBe(ExportType.SELECTED_ONLY);
    expect(host.exportStatus?.inProgress).toBe(true);
    expect(exportLoading()).toBe(true);
  });

  it('updates the column toggle when the app hands over new columns', async () => {
    fixture.nativeElement.querySelector('.column-toggle-action').click();
    await fixture.whenStable();

    host.columns.set([...host.columns().slice(0, 2), { ...host.columns()[2], hidden: true }]);
    await fixture.whenStable();

    const checkboxes = Array.from<HTMLInputElement>(document.querySelectorAll('.column-switch input[type=checkbox]'));
    expect(checkboxes.map(checkbox => checkbox.checked)).toEqual([true, true, false]);
    expect(headerTexts()).toEqual(['Name', 'Renderer']);
  });
});

@Component({
  template: `
    @if (shown()) {
      <appfx-datagrid [gridItems]="items" [columns]="columns"></appfx-datagrid>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushFilterHost {
  readonly shown = signal(true);
  readonly items: Vm[] = [
    { id: 1, name: 'alpha' },
    { id: 2, name: 'beta' },
  ];
  readonly columns: ColumnDefinition<Vm>[] = [
    { displayName: 'Name', field: 'name', uid: 'name', sortAndFilterByField: 'name' },
  ];
}

describe('appfx-datagrid string filter in an OnPush host (zoneless)', () => {
  let fixture: ComponentFixture<OnPushFilterHost>;

  function rowTexts(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-dg-row clr-dg-cell')).map(cell =>
      cell.textContent.trim()
    );
  }

  async function openFilter(): Promise<HTMLInputElement> {
    fixture.nativeElement.querySelector('.datagrid-filter-toggle').click();
    await fixture.whenStable();
    return document.querySelector('appfx-datagrid-filter input') as HTMLInputElement;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [AppfxDatagridModule],
      declarations: [OnPushFilterHost],
    });
    fixture = TestBed.createComponent(OnPushFilterHost);
    await fixture.whenStable();
  });

  it('filters rows as the user types and keeps the typed value', async () => {
    const input = await openFilter();
    input.value = 'bet';
    input.dispatchEvent(new KeyboardEvent('keyup'));
    await fixture.whenStable();

    expect(rowTexts()).toEqual(['beta']);
    expect(input.value).toBe('bet');
  });

  it('stops focusing the input once the grid is destroyed', async () => {
    vi.useFakeTimers();
    const input = await openFilter();
    await vi.advanceTimersByTimeAsync(0);
    const popoverService = fixture.debugElement.query(By.css('clr-dg-filter')).injector.get(ClrPopoverService);
    const focus = vi.spyOn(input, 'focus');

    fixture.componentInstance.shown.set(false);
    await fixture.whenStable();
    popoverService.open = false;
    popoverService.open = true;
    await vi.advanceTimersByTimeAsync(0);

    expect(focus).not.toHaveBeenCalled();
  });
});
