/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { delay } from '@clr/angular/testing';
import { Subject } from 'rxjs';

import { ClrDatagrid } from './datagrid';
import { ClrDatagridCell } from './datagrid-cell';
import { ClrDatagridModule } from './datagrid.module';
import { SelectionType } from './enums/selection-type';
import { Page } from './providers/page';

interface Folder {
  id: string;
  children?: number;
}

type LoaderKind = 'observable' | 'promise' | 'sync' | 'throw';

@Component({
  template: `
    <clr-datagrid
      [clrDgSelectionType]="selectionType"
      [(clrDgSelected)]="selected"
      [clrDgItemsIdentityFn]="identity"
      [clrLoadingMoreItems]="loadingMore"
    >
      <clr-dg-column [clrDgTreeToggle]="toggleOnName">Name</clr-dg-column>
      <clr-dg-column [clrDgPinned]="pinSize" [clrDgTreeToggle]="toggleOnSize">Size</clr-dg-column>
      <clr-dg-row
        *clrDgTreeItems="let folder of roots; getChildren: getChildren; cascadeSelection: cascade"
        [clrDgItem]="folder"
        [clrDgExpandable]="!!folder.children"
        [clrDgExpanded]="expanded[folder.id]"
        [clrDgSelectable]="!locked.includes(folder.id)"
        (clrDgExpandedChange)="expandedChanges.push({ id: folder.id, expanded: $event })"
      >
        <clr-dg-action-overflow>
          <button type="button" class="action-item">Rename</button>
        </clr-dg-action-overflow>
        <clr-dg-cell>{{ folder.id }}</clr-dg-cell>
        <clr-dg-cell>{{ folder.children || 0 }}</clr-dg-cell>
        <clr-dg-row-detail *clrIfExpanded>Never shown in a tree</clr-dg-row-detail>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class TreeTest {
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid<Folder>;

  selectionType = SelectionType.Multi;
  selected: Folder[] = [];
  roots: Folder[] = [{ id: 'a', children: 2 }, { id: 'b', children: 5 }, { id: 'c' }];
  requests: string[] = [];
  cascade = true;
  pinSize = false;
  toggleOnName = false;
  toggleOnSize = false;
  loader: LoaderKind = 'observable';
  expanded: Record<string, boolean> = {};
  locked: string[] = [];
  loadingMore = false;
  expandedChanges: { id: string; expanded: boolean }[] = [];
  // One result channel per parent, like separate requests to a server.
  private observables = new Map<string, Subject<Folder[] | null | undefined>>();
  private promises = new Map<string, (children: Folder[]) => void>();

  identity = (folder: Folder) => folder.id;
  getChildren = (folder: Folder) => {
    this.requests.push(folder.id);
    switch (this.loader) {
      case 'sync':
        return this.childrenOf(folder.id, folder.children);
      case 'throw':
        throw new Error('offline');
      case 'promise':
        return new Promise<Folder[]>(resolve => this.promises.set(folder.id, resolve));
      default: {
        const result = new Subject<Folder[] | null | undefined>();
        this.observables.set(folder.id, result);
        return result;
      }
    }
  };

  respond(parent: string, count: number, { now } = { now: true }) {
    const children = this.childrenOf(parent, count);
    if (this.loader === 'promise') {
      this.promises.get(parent)(children);
    } else if (now) {
      applyNow(() => this.observables.get(parent).next(children));
    } else {
      this.observables.get(parent).next(children);
    }
  }

  end(parent: string) {
    applyNow(() => this.observables.get(parent).complete());
  }

  fail(parent: string) {
    applyNow(() => this.observables.get(parent).error(new Error('offline')));
  }

  private childrenOf(parent: string, count: number): Folder[] {
    return Array.from({ length: count }, (_, i) => ({ id: `${parent}${i + 1}` }));
  }
}

/**
 * The datagrid applies the results of the loaders on the next frame; this applies them right away.
 */
function applyNow(emit: () => void) {
  const requestFrame = window.requestAnimationFrame;
  window.requestAnimationFrame = callback => {
    callback(performance.now());
    return 0;
  };
  try {
    emit();
  } finally {
    window.requestAnimationFrame = requestFrame;
  }
}

@Component({
  template: `
    <clr-datagrid [clrDgItemsIdentityFn]="identity" style="height: 20rem">
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-column>Actions</clr-dg-column>
      <ng-template
        ClrVirtualScroll
        let-folder
        [clrVirtualTreeOf]="roots"
        [clrVirtualTreeGetChildren]="getChildren"
        [clrVirtualRowsItemSize]="25"
      >
        <clr-dg-row [clrDgItem]="folder" [clrDgExpandable]="!!folder.children">
          <clr-dg-cell>{{ folder.id }}</clr-dg-cell>
          <clr-dg-cell>
            <button type="button" class="open">Open</button>
            <button type="button" class="share">Share</button>
          </clr-dg-cell>
        </clr-dg-row>
      </ng-template>
    </clr-datagrid>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class VirtualTreeTest {
  roots: Folder[] = [{ id: 'a', children: 2 }, { id: 'b' }];

  identity = (folder: Folder) => folder.id;
  getChildren = (folder: Folder) => Array.from({ length: folder.children }, (_, i) => ({ id: `${folder.id}${i + 1}` }));
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-column>Name</clr-dg-column>
      <clr-dg-row *ngFor="let folder of roots" [clrDgItem]="folder">
        <clr-dg-cell [attr.id]="'cell-' + folder.id">{{ folder.id }}</clr-dg-cell>
      </clr-dg-row>
    </clr-datagrid>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
})
class FlatTest {
  roots: Folder[] = [{ id: 'a' }, { id: 'b' }];
}

export default function (): void {
  describe('ClrDatagridTreeItems', function () {
    let fixture: ComponentFixture<TreeTest>;
    let context: TreeTest;
    let element: HTMLElement;

    // The rows themselves, whichever container the datagrid's render cycle has put them in at this point.
    function rows(): HTMLElement[] {
      return Array.from(element.querySelectorAll('clr-dg-row:not(.datagrid-row-loading)'));
    }

    // The visible text of the first cell, without the hidden label of the toggle.
    function rowNames() {
      return rows().map(row => row.querySelector<HTMLElement>('.datagrid-tree-cell-text').innerText.trim());
    }

    function masterRow(index: number) {
      return rows()[index].querySelector('[role=row]');
    }

    function toggleButton(index: number) {
      return rows()[index].querySelector<HTMLButtonElement>('.datagrid-tree-toggle');
    }

    function toggle(index: number) {
      toggleButton(index).click();
      fixture.detectChanges();
    }

    function press(index: number, key: string) {
      toggleButton(index).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
      fixture.detectChanges();
    }

    beforeEach(function () {
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule, NoopAnimationsModule],
        declarations: [TreeTest, VirtualTreeTest, FlatTest],
      });
      fixture = TestBed.createComponent(TreeTest);
      context = fixture.componentInstance;
      element = fixture.nativeElement;
      fixture.detectChanges();
    });

    afterEach(() => fixture.destroy());

    describe('View', function () {
      it('renders the roots as a treegrid with their level', function () {
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(element.querySelector('[role=treegrid]')).not.toBeNull();
        expect(masterRow(0).getAttribute('aria-level')).toBe('1');
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(masterRow(0).getAttribute('aria-setsize')).toBe('3');
      });

      it('puts the toggle in the indented first cell and leaves no room for expandable rows', function () {
        expect(element.querySelector('.datagrid-header .datagrid-expandable-caret')).toBeNull();
        rows().forEach(row => {
          expect(row.querySelector('.datagrid-row-master .datagrid-expandable-caret')).toBeNull();
        });
        expect(rows()[0].querySelector('.datagrid-tree-cell .datagrid-tree-toggle')).not.toBeNull();
      });

      // The cell of a column, wherever the column is on screen.
      function cellOf(row: number, text: RegExp) {
        return Array.from(rows()[row].querySelectorAll<HTMLElement>('clr-dg-cell')).find(cell =>
          text.test(cell.innerText.trim())
        );
      }

      it('keeps the toggle in its column when another column is pinned', async function () {
        context.pinSize = true;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(cellOf(0, /^a$/).querySelector('.datagrid-tree-toggle')).not.toBeNull();
        expect(cellOf(0, /^2$/).querySelector('.datagrid-tree-toggle')).toBeNull();
      });

      it('puts the toggle in the columns marked with clrDgTreeToggle', function () {
        context.toggleOnSize = true;
        fixture.detectChanges();
        expect(cellOf(0, /^a$/).querySelector('.datagrid-tree-toggle')).toBeNull();
        expect(cellOf(0, /^2$/).querySelector('.datagrid-tree-toggle')).not.toBeNull();
        expect(cellOf(0, /^2$/).classList).toContain('datagrid-tree-cell');

        context.toggleOnName = true;
        fixture.detectChanges();
        expect(rows()[0].querySelectorAll('.datagrid-tree-toggle').length).toBe(2);
      });

      it('counts the roots across pages once the total comes in', function () {
        fixture.debugElement.query(By.directive(ClrDatagrid)).injector.get(Page).totalItems = 23;
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-posinset')).toBe('1');
        expect(masterRow(0).getAttribute('aria-setsize')).toBe('23');
      });

      it('only offers the toggle on expandable rows', function () {
        expect(rows().map(row => !!row.querySelector('.datagrid-tree-toggle'))).toEqual([true, true, false]);
      });

      it('names the toggle with the action and the leading cell of its row', function () {
        const button = toggleButton(0);
        const [action, cell] = button.getAttribute('aria-labelledby').split(' ');
        expect(document.getElementById(action).textContent.trim()).toBe('Expand');
        expect(document.getElementById(cell)).toBe(rows()[0].querySelector<HTMLElement>('clr-dg-cell'));
      });

      it('names the toggle of another column after the leading cell too, a pinned one first', async function () {
        context.toggleOnSize = true;
        fixture.detectChanges();
        const labelCell = () => document.getElementById(toggleButton(0).getAttribute('aria-labelledby').split(' ')[1]);
        expect(labelCell()).toBe(cellOf(0, /^a$/));

        context.pinSize = true;
        fixture.detectChanges();
        await fixture.whenStable();
        expect(labelCell()).toBe(cellOf(0, /^2$/));
      });

      it('indents the content inside the cell, which keeps the padding of its header', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const content = (index: number) => rows()[index].querySelector<HTMLElement>('.datagrid-tree-cell-content');
        const indent = (index: number) => content(index).getBoundingClientRect().left;
        expect(indent(1) - indent(0)).toBeGreaterThan(0);
        expect(getComputedStyle(cellOf(0, /^a$/)).paddingLeft).toBe(getComputedStyle(cellOf(1, /^a1$/)).paddingLeft);
        // The toggle sits in the indentation, before the content.
        expect(toggleButton(0).getBoundingClientRect().right).toBeLessThanOrEqual(indent(0) + 0.5);
      });

      it('shows the rows of items loading at the end, which have no item', function () {
        // Without selection: with it, the rows that have no item fail on next too, in the lock of their checkbox.
        context.selectionType = SelectionType.None;
        context.loadingMore = true;
        expect(() => fixture.detectChanges()).not.toThrow();
        expect(element.querySelectorAll('.datagrid-row-loading').length).toBeGreaterThan(0);
        expect(rowNames()).toEqual(['a', 'b', 'c']);
      });

      it('leaves the cells of other datagrids alone', function () {
        const flat = TestBed.createComponent(FlatTest);
        flat.detectChanges();
        const cells = flat.debugElement.queryAll(By.directive(ClrDatagridCell));
        expect(cells.length).toBe(2);
        cells.forEach(cell => expect(cell.componentInstance._treeRow).toBeNull());
        expect(flat.nativeElement.querySelector('.datagrid-tree-cell')).toBeNull();
        expect(cells.map(cell => cell.nativeElement.id)).toEqual(['cell-a', 'cell-b']);
        flat.destroy();
      });
    });

    describe('Loading children', function () {
      it('fetches the children on expand and shows them below their parent', function () {
        toggle(0);
        expect(context.requests).toEqual(['a']);
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBe('true');
        // The toggle stays, with a spinner in place of its icon.
        expect(toggleButton(0).querySelector('.spinner')).not.toBeNull();
        expect(toggleButton(0).querySelector('cds-icon')).toBeNull();

        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        expect(toggleButton(0).querySelector('.spinner')).toBeNull();
        expect(toggleButton(0).querySelector('cds-icon')).not.toBeNull();
        expect(masterRow(1).getAttribute('aria-level')).toBe('2');
        expect(masterRow(1).getAttribute('aria-posinset')).toBe('1');
        expect(masterRow(1).getAttribute('aria-setsize')).toBe('2');
      });

      it('is no longer busy when the row is collapsed before its children come in', function () {
        toggle(0);
        expect(masterRow(0).getAttribute('aria-busy')).toBe('true');
        toggle(0);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
      });

      it('uses the first result of a loader only', function () {
        toggle(0);
        context.respond('a', 2);
        context.respond('a', 4);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      });

      it('accepts a Promise', async function () {
        context.loader = 'promise';
        toggle(0);
        context.respond('a', 1);
        await fixture.whenStable();
        // The result is applied on the next frame.
        await new Promise(resolve => requestAnimationFrame(resolve));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'b', 'c']);
      });

      it('accepts children returned directly', function () {
        context.loader = 'sync';
        toggle(0);
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
      });

      it('applies the results that come in together on the next frame, at once', async function () {
        context.datagrid.expandAllTreeRows();
        fixture.detectChanges();
        context.respond('a', 2, { now: false });
        context.respond('b', 1, { now: false });
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);

        await new Promise(resolve => requestAnimationFrame(resolve));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
      });

      it('closes the row again when the loader ends without children', function () {
        toggle(0);
        context.end('a');
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
      });

      it('closes the row again when loading fails, and reports it', function () {
        toggle(0);
        context.fail('a');
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(masterRow(0).getAttribute('aria-busy')).toBeNull();
        expect(context.expandedChanges).toEqual([
          { id: 'a', expanded: true },
          { id: 'a', expanded: false },
        ]);

        toggle(0);
        expect(context.requests).toEqual(['a', 'a']);
      });

      it('collapses without fetching again, and keeps the selection of hidden rows', async function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        context.datagrid.selection.setSelected({ id: 'a1' }, true);
        await fixture.whenStable();
        fixture.detectChanges();
        toggle(0);
        await fixture.whenStable();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(context.selected.map(f => f.id)).toEqual(['a1']);

        toggle(0);
        expect(context.requests.length).toBe(1);
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
      });

      it('keeps rows expanded when the roots are replaced', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        context.roots = context.roots.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.requests.length).toBe(1);
      });

      it('renders the roots pushed, removed or sorted in place', function () {
        context.roots.push({ id: 'd' });
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c', 'd']);

        context.roots.reverse();
        context.roots.splice(1, 1);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['d', 'b', 'a']);
      });

      it('treats a loader that throws like a failed request', function () {
        context.loader = 'throw';
        fixture.detectChanges();
        toggle(0);
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
        expect(context.expandedChanges.map(change => change.expanded)).toEqual([true, false]);
      });

      it('keeps the children of a row that goes away, e.g. to another page, for when it comes back', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();
        context.roots = page.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.requests).toEqual(['a']);
      });

      it('fetches the children of an open child again when it comes back from another page', function () {
        toggle(0);
        applyNow(() => context['observables'].get('a').next([{ id: 'a1', children: 1 }]));
        fixture.detectChanges();
        toggle(1); // a1, still loading when its page goes away
        expect(context.requests).toEqual(['a', 'a1']);

        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();
        context.roots = page;
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a1', 'a1']);
        context.respond('a1', 1);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a11', 'b', 'c']);
      });

      it('fetches the children of rows on other pages again after a reload of the whole tree', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();

        context.datagrid.reloadTreeChildren();
        context.roots = page;
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a']);
      });

      it('fetches the children of a row on another page again after a reload of that row', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const page = context.roots;
        context.roots = [{ id: 'd' }];
        fixture.detectChanges();

        context.datagrid.reloadTreeChildren(page[0]);
        context.roots = page;
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a']);
      });

      it('keeps the rows when the roots are replaced by copies', function () {
        const before = rows();
        context.roots = context.roots.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(rows()).toEqual(before);
      });

      it('drops the toggle of a row whose children are empty, also after the roots are replaced', function () {
        toggle(1);
        context.respond('b', 0);
        fixture.detectChanges();
        expect(toggleButton(1)).toBeNull();
        expect(masterRow(1).getAttribute('aria-expanded')).toBeNull();

        context.roots = context.roots.map(folder => ({ ...folder }));
        fixture.detectChanges();
        expect(toggleButton(1)).toBeNull();
      });

      it('gives the focus to the cell when the focused toggle goes away', function () {
        toggleButton(1).focus();
        toggle(1);
        context.respond('b', 0);
        fixture.detectChanges();
        expect(document.activeElement).toBe(rows()[1].querySelector('clr-dg-cell'));
      });

      it('fetches the children of one row again', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        context.datagrid.reloadTreeChildren(context.roots[0]);
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'a']);
        context.respond('a', 3);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'a3', 'b', 'c']);
      });

      it('drops a result that came in before its row was reloaded', async function () {
        toggle(0);
        context.respond('a', 2, { now: false });
        context.datagrid.reloadTreeChildren(context.roots[0]);
        fixture.detectChanges();
        await new Promise(resolve => requestAnimationFrame(resolve));
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(masterRow(0).getAttribute('aria-busy')).toBe('true');

        context.respond('a', 3);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'a3', 'b', 'c']);
      });

      it('fetches the open rows again, and the closed ones when they open', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        toggle(3); // b
        context.respond('b', 1);
        fixture.detectChanges();
        toggle(3); // b, closed again
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.requests).toEqual(['a', 'b']);

        context.datagrid.reloadTreeChildren();
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'b', 'a']);

        toggle(1); // b, now that a's children are not loaded yet
        expect(context.requests).toEqual(['a', 'b', 'a', 'b']);
      });
    });

    describe('Focus', function () {
      it('goes to the parent when the parent of the row that had it is reloaded', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const cell = rows()[1].querySelector<HTMLElement>('clr-dg-cell');
        context.datagrid.keyNavigation.setActiveCell(cell);
        cell.focus();

        context.datagrid.reloadTreeChildren(context.roots[0]);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(rows()[0].contains(document.activeElement)).toBeTrue();
      });

      it('keeps the tab stop of the grid in the rows when the row that had it is hidden', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        context.datagrid.keyNavigation.setActiveCell(rows()[1].querySelector<HTMLElement>('clr-dg-cell'));
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        outside.focus();

        toggle(0);
        expect(rows()[0].querySelector('[tabindex="0"]')).not.toBeNull();
        expect(document.activeElement).toBe(outside);
        outside.remove();
      });

      it('goes to the collapsed row when the row that had it is hidden', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const cell = rows()[1].querySelector<HTMLElement>('clr-dg-cell');
        cell.setAttribute('tabindex', '-1');
        cell.focus();

        context.expanded = { a: false };
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(document.activeElement).toBe(toggleButton(0));
      });
    });

    describe('Template API', function () {
      it('expands and collapses rows with clrDgExpanded, without reporting it back', function () {
        context.expanded = { a: true };
        fixture.detectChanges();
        expect(context.requests).toEqual(['a']);
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(context.datagrid.rows.first.expanded).toBe(true);

        context.expanded = { a: false };
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(context.expandedChanges).toEqual([]);
      });

      it('reports with clrDgExpandedChange the rows the user expands and collapses', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        toggle(0);
        expect(context.expandedChanges).toEqual([
          { id: 'a', expanded: true },
          { id: 'a', expanded: false },
        ]);
      });

      it('reports that a row clrDgExpanded opened closed again, as its children came back empty', function () {
        context.expanded = { a: true };
        fixture.detectChanges();
        context.respond('a', 0);
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-expanded')).toBeNull();
        expect(context.expandedChanges).toEqual([{ id: 'a', expanded: false }]);
      });

      it('expands a row that clrDgExpandable and clrDgExpanded turn on together', function () {
        context.roots[2].children = 1;
        context.expanded = { c: true };
        fixture.detectChanges();
        expect(context.requests).toEqual(['c']);
        expect(masterRow(2).getAttribute('aria-expanded')).toBe('true');
      });

      it('collapses a row when clrDgExpandable turns false', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();

        context.roots = [{ id: 'a' }, ...context.roots.slice(1)];
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(toggleButton(0)).toBeNull();
        expect(context.expandedChanges.at(-1)).toEqual({ id: 'a', expanded: false });
      });
    });

    describe('Expand and collapse all', function () {
      function expandAll() {
        context.datagrid.expandAllTreeRows();
        fixture.detectChanges();
      }

      function collapseAll() {
        context.datagrid.collapseAllTreeRows();
        fixture.detectChanges();
      }

      it('expands every row that can be expanded and fetches its children', function () {
        expandAll();
        expect(context.requests).toEqual(['a', 'b']);
        context.respond('a', 2);
        context.respond('b', 1);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'c']);
        expect(toggleButton(5)).toBeNull();
        // The new rows say they have no children before any is asked for.
        expect(context.requests).toEqual(['a', 'b']);
        expect(context.expandedChanges).toEqual([
          { id: 'a', expanded: true },
          { id: 'b', expanded: true },
        ]);
      });

      it('expands every level, without reporting the rows it opens as they load', function () {
        context.loader = 'sync';
        context.getChildren = (folder: Folder) => {
          context.requests.push(folder.id);
          return folder.id.length < 3 ? [{ id: `${folder.id}1`, children: 1 }] : [{ id: `${folder.id}1` }];
        };
        context.roots = [{ id: 'a', children: 1 }];
        fixture.detectChanges();

        expandAll();
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a11', 'a111']);
        expect(context.requests).toEqual(['a', 'a1', 'a11']);
        expect(context.expandedChanges).toEqual([{ id: 'a', expanded: true }]);
      });

      it('expands the rows that come in afterwards, until a row is collapsed', function () {
        expandAll();
        context.roots = [{ id: 'd', children: 1 }];
        fixture.detectChanges();
        expect(context.requests).toEqual(['a', 'b', 'd']);
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('true');

        toggle(0);
        context.roots = [{ id: 'e', children: 1 }];
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
      });

      it('collapses every row, also on other pages', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        const page = context.roots;
        context.roots = [{ id: 'd', children: 1 }];
        fixture.detectChanges();
        toggle(0);
        context.roots = page;
        fixture.detectChanges();
        context.expandedChanges = [];

        collapseAll();
        expect(rowNames()).toEqual(['a', 'b', 'c']);
        expect(context.expandedChanges).toEqual([{ id: 'a', expanded: false }]);
        context.roots = [{ id: 'd', children: 1 }];
        fixture.detectChanges();
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
      });

      it('collapses the rows under a collapsed row too', function () {
        context.loader = 'sync';
        context.getChildren = (folder: Folder) => [{ id: `${folder.id}1`, children: 1 }];
        context.roots = [{ id: 'a', children: 1 }];
        fixture.detectChanges();
        toggle(0);
        toggle(1);
        toggle(0);

        collapseAll();
        toggle(0);
        expect(rowNames()).toEqual(['a', 'a1']);
      });

      it('moves the focus out of the rows it hides', function () {
        expandAll();
        context.respond('a', 2);
        fixture.detectChanges();
        element.querySelectorAll('[tabindex="0"]').forEach(cell => cell.setAttribute('tabindex', '-1'));
        const childCell = rows()[1].querySelector<HTMLElement>('clr-dg-cell');
        childCell.setAttribute('tabindex', '0');
        childCell.focus();

        collapseAll();
        expect(rows()[0].contains(document.activeElement)).toBeTrue();
        expect(element.querySelector('[role=row][aria-level] [tabindex="0"]')).not.toBe(childCell);
      });
    });

    describe('Keyboard', function () {
      it('expands with Right and collapses with Left on the toggle', function () {
        press(0, 'ArrowRight');
        expect(context.requests).toEqual(['a']);
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);

        press(0, 'ArrowLeft');
        expect(rowNames()).toEqual(['a', 'b', 'c']);
      });

      it('does not mirror the keys in right-to-left, like the navigation between cells', function () {
        element.setAttribute('dir', 'rtl');
        press(0, 'ArrowRight');
        expect(context.requests).toEqual(['a']);
        press(0, 'ArrowLeft');
        expect(masterRow(0).getAttribute('aria-expanded')).toBe('false');
      });

      it('keeps the focus on the toggle when the children come in', function () {
        toggleButton(0).focus();
        press(0, 'ArrowRight');
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        expect(document.activeElement).toBe(toggleButton(0));
      });
    });

    describe('Selection', function () {
      it('gives child rows their own actions and selection', function () {
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        expect(rows()[1].querySelector('clr-dg-action-overflow')).not.toBeNull();
        expect(rows()[1].querySelector('input[type=checkbox]')).not.toBeNull();
      });

      it('selects only the row itself by default', async function () {
        context.cascade = undefined;
        fixture.detectChanges();
        toggle(0);
        context.respond('a', 2);
        fixture.detectChanges();
        await fixture.whenStable();
        rows()[0].querySelector<HTMLLabelElement>('.datagrid-select label').click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(context.datagrid.selection.current.map(folder => folder.id)).toEqual(['a']);
        expect(rows()[0].querySelector<HTMLInputElement>('.datagrid-select input').indeterminate).toBe(false);
      });

      describe('of descendants', function () {
        function checkbox(index: number) {
          return rows()[index].querySelector<HTMLInputElement>('.datagrid-select input');
        }

        function selectedIds() {
          return context.datagrid.selection.current.map(folder => folder.id).sort();
        }

        // Through the label, like a user: it is what covers the checkbox.
        async function click(index: number) {
          rows()[index].querySelector<HTMLLabelElement>('.datagrid-select label').click();
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
        }

        beforeEach(async function () {
          toggle(0);
          context.respond('a', 2);
          fixture.detectChanges();
          // Lets the checkboxes take their initial value before the tests click them.
          await fixture.whenStable();
          // a, a1, a2, b, c
        });

        it('selects and deselects a parent with its loaded descendants', async function () {
          await click(0);
          expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
          expect(context.selected.map(folder => folder.id).sort()).toEqual(['a', 'a1', 'a2']);

          await click(0);
          expect(selectedIds()).toEqual([]);
        });

        it('makes a parent indeterminate when only some children are selected', async function () {
          await click(1);
          expect(selectedIds()).toEqual(['a1']);
          expect(checkbox(0).indeterminate).toBe(true);
          expect(checkbox(0).checked).toBe(false);

          await click(2);
          expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
          expect(checkbox(0).indeterminate).toBe(false);
          expect(checkbox(0).checked).toBe(true);
        });

        it('deselects the parent when one of its children is deselected', async function () {
          await click(0);
          await click(2);
          expect(selectedIds()).toEqual(['a1']);
          expect(checkbox(0).indeterminate).toBe(true);
        });

        it('selects children that load after their parent was selected', async function () {
          await click(3); // b, not loaded yet
          toggle(3);
          context.respond('b', 2);
          fixture.detectChanges();
          await fixture.whenStable();
          // Lets the two-way [(clrDgSelected)] binding catch up, as the application would.
          fixture.detectChanges();
          expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'b2', 'c']);
          expect(selectedIds()).toEqual(['b', 'b1', 'b2']);
        });

        it('leaves out the children that load after their parent was selected but cannot be selected', async function () {
          context.locked = ['b2'];
          fixture.detectChanges();
          await click(3);
          toggle(3);
          context.respond('b', 2);
          fixture.detectChanges();
          await fixture.whenStable();
          fixture.detectChanges();
          expect(selectedIds()).toEqual(['b', 'b1']);
          expect(context.selected.map(folder => folder.id).sort()).toEqual(['b', 'b1']);
        });

        it('leaves out the children that cannot be selected when their parent is selected while they are hidden', async function () {
          context.locked = ['a2'];
          fixture.detectChanges();
          toggle(0);
          await fixture.whenStable();
          await click(0);
          expect(selectedIds()).toEqual(['a', 'a1']);

          toggle(0);
          await fixture.whenStable();
          fixture.detectChanges();
          expect(selectedIds()).toEqual(['a', 'a1']);
        });

        it('reloads a selected row whose open children load their own children right away', async function () {
          context.getChildren = (folder: Folder) =>
            folder.id === 'b' ? [{ id: 'b1', children: 1 }] : [{ id: `${folder.id}1` }];
          fixture.detectChanges();
          toggle(3); // b
          toggle(4); // b1
          await click(3);
          expect(selectedIds()).toEqual(['b', 'b1', 'b11']);

          context.datagrid.reloadTreeChildren(context.roots[1]);
          fixture.detectChanges();
          expect(rowNames()).toEqual(['a', 'a1', 'a2', 'b', 'b1', 'b11', 'c']);
          expect(selectedIds()).toEqual(['b', 'b1', 'b11']);
        });

        it('takes the loaded descendants of rows selected on their own when the mode changes', async function () {
          context.cascade = false;
          fixture.detectChanges();
          await click(0);
          expect(selectedIds()).toEqual(['a']);

          context.cascade = true;
          fixture.detectChanges();
          await fixture.whenStable();
          expect(selectedIds()).toEqual(['a', 'a1', 'a2']);
        });

        it('selects everything loaded from the header checkbox', async function () {
          element.querySelector<HTMLLabelElement>('.datagrid-header .datagrid-select label').click();
          fixture.detectChanges();
          await fixture.whenStable();
          expect(selectedIds()).toEqual(['a', 'a1', 'a2', 'b', 'c']);
        });
      });
    });

    describe('Virtual scroll', function () {
      let virtual: ComponentFixture<VirtualTreeTest>;
      let host: HTMLElement;

      // Renders the grid, after `setup` changed the inputs if given, and lets the virtual scroll render its rows.
      async function render(setup?: (test: VirtualTreeTest) => void) {
        virtual = TestBed.createComponent(VirtualTreeTest);
        host = virtual.nativeElement;
        setup?.(virtual.componentInstance);
        await settle();
      }

      async function settle() {
        virtual.detectChanges();
        await delay();
        virtual.detectChanges();
      }

      function virtualRows() {
        return Array.from(host.querySelectorAll<HTMLElement>('.datagrid-rows clr-dg-row'));
      }

      function names() {
        return virtualRows().map(row => row.querySelector<HTMLElement>('clr-dg-cell').innerText.trim());
      }

      function grid(): ClrDatagrid {
        return virtual.debugElement.query(By.directive(ClrDatagrid)).componentInstance;
      }

      // The first cell of the row that has the focus.
      function focusedName() {
        return document.activeElement.closest('clr-dg-row').querySelector('clr-dg-cell').textContent.trim();
      }

      afterEach(() => virtual?.destroy());

      it('renders the expanded tree as one list', async function () {
        await render();
        expect(names()).toEqual(['a', 'b']);
        expect(host.querySelector('[role=treegrid]').getAttribute('aria-rowcount')).toBe('2');

        host.querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        await settle();
        expect(names()).toEqual(['a', 'a1', 'a2', 'b']);
        expect(host.querySelector('[role=treegrid]').getAttribute('aria-rowcount')).toBe('4');
      });

      it('expands all rows, fetching the children of the rendered ones only', async function () {
        const requests: string[] = [];
        await render(test => {
          test.roots = Array.from({ length: 100 }, (_, i) => ({ id: `r${i}`, children: 1 }));
          test.getChildren = (folder: Folder) => {
            requests.push(folder.id);
            return [{ id: `${folder.id}-1` }];
          };
        });

        grid().expandAllTreeRows();
        await settle();
        expect(requests.length).toBeGreaterThan(0);
        expect(requests.length).toBeLessThan(100);
        expect(host.querySelector('.datagrid-rows [role=row][aria-level="2"]')).not.toBeNull();
      });

      it('keeps the rows expanded when it reuses them for other items', async function () {
        // Every other row can have children, so a reused row changes whether it can be expanded.
        await render(test => {
          test.roots = Array.from({ length: 100 }, (_, i) => ({ id: `r${i}`, children: i % 2 ? 0 : 1 }));
          test.getChildren = (folder: Folder) => [{ id: `${folder.id}-1` }];
        });
        grid().expandAllTreeRows();
        virtual.detectChanges();

        grid().virtualScroll.scrollToIndex(120);
        await delay(50);
        virtual.detectChanges();
        await delay(50);
        virtual.detectChanges();
        const expandable = Array.from(host.querySelectorAll('.datagrid-rows [role=row][aria-expanded]'));
        expect(expandable.length).toBeGreaterThan(0);
        expect(expandable.every(row => row.getAttribute('aria-expanded') === 'true')).toBeTrue();
      });

      it('keeps the focus on its item when rows are inserted above it', async function () {
        await render();
        const cell = virtualRows()[1].querySelector<HTMLElement>('clr-dg-cell');
        cell.setAttribute('tabindex', '-1');
        cell.focus();

        virtualRows()[0].querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        await settle();
        await delay();
        expect(focusedName()).toBe('b');
      });

      it('gives the focus back to the element of the cell that had it', async function () {
        await render();
        virtualRows()[1].querySelector<HTMLButtonElement>('.share').focus();

        virtualRows()[0].querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        await settle();
        await delay();
        expect(document.activeElement.classList).toContain('share');
        expect(focusedName()).toBe('b');
      });

      it('leaves the focus where the user moved it before the rows were rendered', async function () {
        await render();
        const outside = document.createElement('button');
        document.body.appendChild(outside);
        virtualRows()[1].querySelector<HTMLButtonElement>('.share').focus();

        host.querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        outside.focus();
        await settle();
        await delay();
        expect(document.activeElement).toBe(outside);
        outside.remove();
      });

      it('keeps the tab stop of the grid in the rows when the row that had it is hidden', async function () {
        await render();
        host.querySelector<HTMLButtonElement>('.datagrid-tree-toggle').click();
        await settle();
        grid().keyNavigation.setActiveCell(virtualRows()[1].querySelector<HTMLElement>('clr-dg-cell'));

        grid().collapseAllTreeRows();
        await settle();
        expect(names()).toEqual(['a', 'b']);
        expect(virtualRows()[0].querySelector('[tabindex="0"]')).not.toBeNull();
      });

      it('does not throw when the focused row goes away with its ancestors', async function () {
        await render();
        const cell = virtualRows()[1].querySelector<HTMLElement>('clr-dg-cell');
        cell.setAttribute('tabindex', '-1');
        cell.focus();

        virtual.componentInstance.roots = [{ id: 'a', children: 2 }];
        expect(() => virtual.detectChanges()).not.toThrow();
        await delay();
      });
    });
  });
}
