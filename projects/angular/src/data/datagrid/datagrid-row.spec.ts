/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationBuilder } from '@angular/animations';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoadingListener } from '../../utils/loading/loading-listener';
import { ClrDatagrid } from './datagrid';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridModule } from './datagrid.module';
import { DatagridDisplayMode } from './enums/display-mode.enum';
import { SelectionType } from './enums/selection-type';
import { DATAGRID_SPEC_PROVIDERS, TestContext } from './helpers.spec';
import { MockDisplayModeService } from './providers/display-mode.mock';
import { DisplayModeService } from './providers/display-mode.service';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { ClrDatagridItemsTrackByFunction, Items } from './providers/items';
import { Selection } from './providers/selection';
import { DatagridRenderOrganizer } from './render/render-organizer';

type Item = { id: number };

export default function (): void {
  describe('ClrDatagridRow component', function () {
    describe('View', function () {
      // Until we can properly type "this"
      let context: TestContext<ClrDatagridRow<Item>, FullTest>;
      let renderer: DatagridRenderOrganizer;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, FullTest, DATAGRID_SPEC_PROVIDERS);
        renderer = context.getClarityProvider(DatagridRenderOrganizer);
        context.detectChanges();
        renderer.resize();
      });

      it('initialzes in display mode', function () {
        expect(context.clarityDirective.displayCells).toBe(true);
      });

      it('adds the .datagrid-row class to the host', function () {
        expect(context.clarityElement.classList.contains('datagrid-row')).toBeTruthy();
      });

      it("receives an input for the row's modal", function () {
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        expect(context.clarityDirective.item).toBe(context.testComponent.item);
      });

      it('displays an empty cell when one of the rows is expandable', function () {
        expect(context.clarityElement.querySelector('.datagrid-fixed-column')).toBeNull();
        context.getClarityProvider(ExpandableRowsCount).register();
        context.detectChanges();
        expect(context.clarityElement.querySelector('.datagrid-fixed-column')).not.toBeNull();
      });

      it('adds a11y roles to the row', function () {
        expect(context.clarityElement.attributes.role.value).toEqual('rowgroup');
        const rowId = context.clarityDirective.id;
        expect(context.clarityElement.attributes['aria-owns'].value).toEqual(rowId);
        const rowContent = context.clarityElement.querySelector('.datagrid-row-master');
        expect(rowContent.attributes.id.value).toEqual(rowId);
      });
    });

    describe('Projection', function () {
      let context: TestContext<ClrDatagridRow, FullTest>;
      let displayMode: MockDisplayModeService;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, ProjectionTest, DATAGRID_SPEC_PROVIDERS);
        displayMode = context.getClarityProvider(DisplayModeService) as MockDisplayModeService;
      });

      it('responds when display mode is CALCULATE and DISPLAY', function () {
        displayMode.updateView(DatagridDisplayMode.CALCULATE);
        expect(context.clarityDirective.displayCells).toBe(false);
        displayMode.updateView(DatagridDisplayMode.DISPLAY);
        expect(context.clarityDirective.displayCells).toBe(true);
      });

      it('provides a wrapped view for the content', function () {
        expect(context.clarityDirective._view).toBeDefined();
      });
    });

    describe('Conditional selection', function () {
      let context: TestContext<ClrDatagridRow, SelectableRow>;
      let selectionProvider: Selection;
      let checkbox: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, SelectableRow, DATAGRID_SPEC_PROVIDERS);
        selectionProvider = TestBed.get(Selection);
        TestBed.get(Items).all = [{ id: 1 }, { id: 2 }];
      });

      it('should toggle when clrDgSelectable is false for type SelectionType.Multi', () => {
        selectionProvider.selectionType = SelectionType.Multi;
        context.detectChanges();
        context.testComponent.clrDgSelectable = false;
        context.detectChanges();
        checkbox = context.clarityElement.querySelector("input[type='checkbox']");

        expect(checkbox.getAttribute('disabled')).toBeDefined();
        expect(checkbox.getAttribute('aria-disabled')).toBe('true');

        context.clarityDirective.toggle();
        expect(context.clarityDirective.selected).toBe(true);
      });

      it('should be able to toggle selection through API when clrDgSelectable is false', () => {
        selectionProvider.selectionType = SelectionType.Multi;
        context.clarityDirective.toggle(true);
        context.testComponent.clrDgSelectable = false;
        context.detectChanges();
        context.clarityDirective.toggle();
        expect(context.clarityDirective.selected).toBe(false);
      });
    });

    describe('Conditional selection switch order or arguments', function () {
      let context: TestContext<ClrDatagridRow, SelectableRowOrder>;
      let selectionProvider: Selection;
      let checkbox: HTMLElement;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, SelectableRowOrder, DATAGRID_SPEC_PROVIDERS);
        selectionProvider = TestBed.get(Selection);
        TestBed.get(Items).all = [{ id: 1 }, { id: 2 }];
      });

      it('renders correctly if item is set after clrDgSelectable', fakeAsync(function () {
        selectionProvider.selectionType = SelectionType.Multi;
        const tempItem = context.testComponent.item;
        context.testComponent.item = undefined;
        context.detectChanges();
        context.testComponent.clrDgSelectable = false;
        context.testComponent.item = tempItem;
        context.detectChanges();
        checkbox = context.clarityElement.querySelector("input[type='checkbox']");

        expect(checkbox.getAttribute('disabled')).toBeDefined();
        expect(checkbox.getAttribute('aria-disabled')).toBe('true');
      }));

      it('should provide a selection input aria-labels', fakeAsync(function () {
        // Test multi select rows
        selectionProvider.selectionType = SelectionType.Multi;
        context.detectChanges();
        const checkboxLabel = context.clarityElement.querySelector('label');
        expect(checkboxLabel.textContent).toBeString('uniq aria-label');
        // Test single select row
        selectionProvider.selectionType = SelectionType.Single;
        context.detectChanges();
        const radioLabel = context.clarityElement.querySelector('label');
        expect(radioLabel.textContent).toBeString('uniq aria-label');
      }));

      it('should toggle when clrDgSelectable is false for type SelectionType.Multi', () => {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.clrDgSelectable = false;
        context.detectChanges();
        checkbox = context.clarityElement.querySelector("input[type='checkbox']");

        expect(checkbox.getAttribute('disabled')).toBeDefined();
        expect(checkbox.getAttribute('aria-disabled')).toBe('true');

        context.clarityDirective.toggle();
        expect(context.clarityDirective.selected).toBe(true);
      });

      it('should be able to toggle selection through API when clrDgSelectable is false', () => {
        selectionProvider.selectionType = SelectionType.Multi;
        context.clarityDirective.toggle(true);
        context.testComponent.clrDgSelectable = false;
        context.detectChanges();
        context.clarityDirective.toggle();
        expect(context.clarityDirective.selected).toBe(false);
      });
    });

    describe('Conditional Selection with *ngFor', () => {
      let fixture: ComponentFixture<NgForDatagridWithTrackBy>;
      let nativeElement: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrDatagridModule],
          declarations: [NgForDatagridWithTrackBy],
          providers: [AnimationBuilder],
        });

        fixture = TestBed.createComponent(NgForDatagridWithTrackBy);
        nativeElement = fixture.nativeElement;
      });

      it('does disable the selection checkbox when clrDgSelectable is false', () => {
        fixture.componentInstance.clrDgSelectable = false;
        fixture.detectChanges();

        const checkboxElement: HTMLInputElement = nativeElement.querySelector("input[type='checkbox']");

        expect(checkboxElement.getAttribute('disabled')).toBeDefined();
      });
    });

    describe('Selection', function () {
      // Until we can properly type "this"
      let context: TestContext<ClrDatagridRow, FullTest>;
      let selectionProvider: Selection;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, FullTest, DATAGRID_SPEC_PROVIDERS);
        selectionProvider = TestBed.get(Selection);
        TestBed.get(Items).all = [{ id: 1 }, { id: 2 }];
      });

      it("doesn't display a checkbox unless selection type is multi", function () {
        selectionProvider.selectionType = SelectionType.None;
        context.detectChanges();
        expect(context.clarityElement.querySelector("input[type='checkbox']")).toBeNull();

        selectionProvider.selectionType = SelectionType.Single;
        context.detectChanges();
        expect(context.clarityElement.querySelector("input[type='checkbox']")).toBeNull();
      });

      it("doesn't display a radio button unless selection type is single", function () {
        selectionProvider.selectionType = SelectionType.None;
        context.detectChanges();
        expect(context.clarityElement.querySelector("input[type='radio']")).toBeNull();

        selectionProvider.selectionType = SelectionType.Multi;
        context.detectChanges();
        expect(context.clarityElement.querySelector("input[type='radio']")).toBeNull();
      });

      it('sets the id on the checkbox when selection type is multi', function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.detectChanges();
        const label = context.clarityElement.querySelector('label');
        expect(context.clarityElement.querySelector("input[type='checkbox']").getAttribute('id')).toEqual(
          label.getAttribute('for')
        );
      });

      it('sets the id on the radio button when selection type is single', function () {
        selectionProvider.selectionType = SelectionType.Single;
        context.detectChanges();
        const label = context.clarityElement.querySelector('label');
        expect(context.clarityElement.querySelector("input[type='radio']").getAttribute('id')).toEqual(
          label.getAttribute('for')
        );
      });

      it('selects the model when the checkbox is clicked', function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const checkbox = context.clarityElement.querySelector("input[type='checkbox']");
        expect(selectionProvider.current).toEqual([]);
        checkbox.click();
        context.detectChanges();
        expect(selectionProvider.current).toEqual([context.testComponent.item]);
        checkbox.click();
        context.detectChanges();
        expect(selectionProvider.current).toEqual([]);
      });

      it('selects the model when the radio button is clicked', function () {
        selectionProvider.selectionType = SelectionType.Single;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const radio = context.clarityElement.querySelector("input[type='radio']");
        expect(selectionProvider.currentSingle).toBeUndefined();
        radio.click();
        context.detectChanges();
        expect(selectionProvider.currentSingle).toEqual(context.testComponent.item);
      });

      it('adds the .datagrid-selected class to the host when the row is selected', function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        context.clarityDirective.selected = true;
        context.detectChanges();
        expect(context.clarityElement.classList.contains('datagrid-selected')).toBeTruthy();
      });

      it('offers two-way binding on the selected state of the row', fakeAsync(function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.item = { id: 1 };
        flushAndAssertSelected(false);
        // Input
        context.testComponent.selected = true;
        flushAndAssertSelected(true);
        // Output
        context.clarityElement.querySelector("input[type='checkbox']").click();
        flushAndAssertSelected(false);
      }));

      it("supports selected rows even if the datagrid isn't selectable", fakeAsync(function () {
        selectionProvider.selectionType = SelectionType.None;
        expect(context.testComponent.item).toBeUndefined();
        expect(context.clarityDirective.selected).toBe(false);
        context.testComponent.selected = true;
        context.detectChanges();
        expect(context.clarityDirective.selected).toBe(true);
        context.testComponent.selected = false;
        context.detectChanges();
        expect(context.clarityDirective.selected).toBe(false);
      }));

      it('selects the model on click only when `rowSelectionMode` is enabled (Single selection)', function () {
        selectionProvider.selectionType = SelectionType.Single;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const row = context.clarityElement;
        expect(row.children).toBeDefined();

        expect(row.classList.contains('datagrid-row-clickable')).toBeFalse();
        row.children[0].click();
        context.detectChanges();
        expect(selectionProvider.currentSingle).toBeUndefined();

        // Enabling the rowSelectionMode
        selectionProvider.rowSelectionMode = true;
        context.detectChanges();
        row.children[0].click();
        context.detectChanges();
        expect(selectionProvider.currentSingle).toEqual(context.testComponent.item);
      });

      it('selects the model on click only when `rowSelectionMode` is enabled (Multi selection)', function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const row = context.clarityElement;
        expect(row.children).toBeDefined();
        expect(selectionProvider.current).toEqual([]);
        expect(row.classList.contains('datagrid-row-clickable')).toBeFalse();
        row.children[0].click();
        context.detectChanges();
        expect(selectionProvider.current).toEqual([]);

        // Enabling the rowSelectionMode
        selectionProvider.rowSelectionMode = true;
        context.detectChanges();
        row.children[0].click();
        context.detectChanges();
        expect(selectionProvider.current).toEqual([context.testComponent.item]);

        row.children[0].click();
        context.detectChanges();
        expect(selectionProvider.current).toEqual([]);
      });

      it('verifies a label is not nested within a label when `rowSelectionMode` is enabled', function () {
        selectionProvider.selectionType = SelectionType.Single;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const row = context.clarityElement;
        selectionProvider.rowSelectionMode = true;
        expect(row.querySelector('label label')).toBeNull();
      });

      it('verifies a label is not nested within a label when `rowSelectionMode` is enabled (multi-select)', function () {
        selectionProvider.selectionType = SelectionType.Multi;
        context.testComponent.item = { id: 1 };
        context.detectChanges();
        const row = context.clarityElement;
        selectionProvider.rowSelectionMode = true;
        expect(row.querySelector('label label')).toBeNull();
      });

      function flushAndAssertSelected(selected: boolean) {
        context.detectChanges();
        // ngModel is asynchronous, we need an extra change detection
        tick();
        context.detectChanges();
        expect(context.testComponent.selected).toBe(selected);
        expect(context.clarityDirective.selected).toBe(selected);
      }
    });

    describe('Expand/Collapse', function () {
      // Until we can properly type "this"
      let context: TestContext<ClrDatagridRow<Item>, ExpandTest>;
      let expand: DatagridIfExpandService;

      beforeEach(function () {
        context = this.create(ClrDatagridRow, ExpandTest, DATAGRID_SPEC_PROVIDERS);
        context.detectChanges();
        expand = context.getClarityProvider(DatagridIfExpandService);
      });

      it('registers a LoadingListener', function () {
        expect(context.getClarityProvider(LoadingListener)).toBeTruthy();
      });

      it('displays a clickable caret when the row is expandable', function () {
        expect(context.clarityElement.querySelector('button cds-icon[shape^=angle]')).not.toBeNull();
      });

      it('displays a spinner instead of the caret when the details are loading', function () {
        expect(context.clarityElement.querySelector('.spinner')).toBeNull();
        expand.loading = true;
        context.detectChanges();
        expect(context.clarityElement.querySelector('.spinner')).not.toBeNull();
      });

      it('contains expandable element', function () {
        expect(context.clarityElement.children[0].classList.contains('clr-expandable-animation')).toBeTrue();
      });

      it('button must not contain aria-controls with template when not expanded', function () {
        const button = context.clarityElement.querySelector('.datagrid-expandable-caret-button');
        expect(button.getAttribute('aria-controls')).toBeNull();
      });

      it('button must contain aria-controls when expanded', function () {
        const button: HTMLButtonElement = context.clarityElement.querySelector('.datagrid-expandable-caret-button');
        expect(button.getAttribute('aria-controls')).toBeNull();

        button.dispatchEvent(new MouseEvent('click', { buttons: 1, bubbles: true }));
        context.detectChanges();

        expect(button.getAttribute('aria-controls')).not.toBeNull();
      });

      it("doesn't display the details when collapsed", function () {
        expect(context.clarityElement.textContent).toMatch('Hello world');
        expect(context.clarityElement.textContent).not.toMatch('Detail');
        expand.setReplace(true);
        context.detectChanges();
        expect(context.clarityElement.textContent).toMatch('Hello world');
        expect(context.clarityElement.textContent).not.toMatch('Detail');
      });

      it("doesn't display the details when collapsed and replacing cells", function () {
        expect(context.clarityElement.textContent).not.toMatch('Detail');
        expand.setReplace(true);
        context.detectChanges();
        expect(context.clarityElement.textContent).not.toMatch('Detail');
      });

      it('displays both the row and the details when expanded and not replacing', fakeAsync(function () {
        expand.expanded = true;
        tick();
        context.detectChanges();
        expect(context.clarityElement.textContent).toMatch('Detail');
      }));

      it('displays only the details when expanded and replacing', fakeAsync(function () {
        expand.setReplace(true);
        expand.expanded = true;
        tick();
        context.detectChanges();
        const cellStyle = context.clarityElement.querySelector('.datagrid-scrolling-cells > .datagrid-cell');
        const details = context.clarityElement.querySelector('.datagrid-row-detail');
        expect(window.getComputedStyle(cellStyle).display).toBe('none');
        expect(window.getComputedStyle(details).display).toBe('flex');
        expect(details.textContent).toMatch('Detail');
      }));

      it("doesn't display the details while loading", fakeAsync(function () {
        expand.expanded = true;
        expand.loading = true;
        context.detectChanges();
        tick(100);
        expect(context.clarityElement.textContent.trim()).not.toMatch('Detail');
      }));

      it('expands and collapses when the caret is clicked', fakeAsync(function () {
        const caret = context.clarityElement.querySelector('.datagrid-expandable-caret button');
        caret.click();
        flushAnimations();
        expect(expand.expanded).toBe(true);
        caret.click();
        flushAnimations();
        expect(expand.expanded).toBe(false);
      }));

      it('expands and collapses change the aria-label text aria-expanded', fakeAsync(function () {
        const caret = context.clarityElement.querySelector('.datagrid-expandable-caret button');
        caret.click();
        flushAnimations();
        expect(caret.getAttribute('aria-label')).toBe(context.testComponent.clrDgDetailCloseLabel);
        expect(caret.getAttribute('aria-expanded')).toBe('true');
        caret.click();
        flushAnimations();
        expect(caret.getAttribute('aria-label')).toBe(context.testComponent.clrDgDetailOpenLabel);
        expect(caret.getAttribute('aria-expanded')).toBe('false');
      }));

      it('offers 2-way binding on the expanded state of the row', fakeAsync(function () {
        context.testComponent.expanded = true;
        flushAnimations();
        expect(context.clarityDirective.expanded).toBe(true);
        context.clarityElement.querySelector('.datagrid-expandable-caret button').click();
        flushAnimations();
        expect(context.testComponent.expanded).toBe(false);
      }));

      it('adds the correct class when replaced and expanded', fakeAsync(function () {
        expect(context.clarityElement.classList.contains('datagrid-row-replaced')).toBeFalsy();
        context.testComponent.expanded = true;
        expand.setReplace(true);
        flushAnimations();
        expect(context.clarityElement.classList.contains('datagrid-row-replaced')).toBeTruthy();
      }));

      it('adds the correct class when collapsed', fakeAsync(function () {
        // covers both collapsed+replaced and collapsed+not_replaced
        expect(context.clarityElement.classList.contains('datagrid-row-replaced')).toBeFalsy();
      }));

      it('adds the correct class when not replaced and expanded', fakeAsync(function () {
        expect(context.clarityElement.classList.contains('datagrid-row-replaced')).toBeFalsy();
        context.testComponent.expanded = true;
        flushAnimations();
        expect(context.clarityElement.classList.contains('datagrid-row-replaced')).toBeFalsy();
      }));

      it("adds 'is-replaced' class to the replacement cell container when cells are replaced", fakeAsync(function () {
        const beforeReplaced = context.clarityElement.querySelector('.is-replaced');
        expect(beforeReplaced).toBeNull();
        context.testComponent.expanded = true;
        expand.setReplace(true);
        flushAnimations();
        const afterReplaced = context.clarityElement.querySelector('.is-replaced');
        expect(afterReplaced.classList.contains('is-replaced')).toBeTruthy();
      }));

      it('retains its own cells when row detail gets toggled', fakeAsync(function () {
        expect(context.clarityElement.querySelectorAll('clr-dg-cell').length).toBe(1);
        context.testComponent.removeRowDetail = true;
        context.detectChanges();
        expect(context.clarityElement.querySelectorAll('clr-dg-cell').length).toBe(1);
        context.testComponent.removeRowDetail = false;
        context.detectChanges();
        expect(context.clarityElement.querySelectorAll('clr-dg-cell').length).toBe(1);
      }));

      function flushAnimations() {
        context.detectChanges();
        tick();
        context.detectChanges();
      }
    });

    describe('Details', function () {
      let context: TestContext<ClrDatagrid<Item>, DatagridWithDisabledOrHiddenDetails>;

      beforeEach(function () {
        context = this.create(ClrDatagrid, DatagridWithDisabledOrHiddenDetails, DATAGRID_SPEC_PROVIDERS);
        context.detectChanges();
      });

      it('displays a clickable double caret when the row have details', function () {
        expect(context.clarityElement.querySelectorAll('button.datagrid-detail-caret-button').length).toBe(
          context.testComponent.items.length
        );
      });

      it('Detail button must contain aria-controls', function () {
        const button = context.clarityElement.querySelector('button.datagrid-detail-caret-button');
        expect(button).not.toBeNull();
        expect(button.getAttribute('aria-controls')).not.toBeNull();
      });

      it('display the details when pre selected', fakeAsync(function () {
        context.testComponent.preState = context.testComponent.items[0];
        tick();
        context.detectChanges();

        const button = context.clarityElement.querySelector('button.datagrid-detail-caret-button');
        const detailBody = document.querySelector('div.clr-dg-detail-body-wrapper') as HTMLElement;

        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=left]')).not.toBeNull();
        expect(detailBody.innerText).toBe('' + context.testComponent.preState.id);
        expect(context.clarityElement.querySelector('clr-dg-detail')).not.toBeNull();
      }));

      it('open and close the details', fakeAsync(function () {
        const button = context.clarityElement.querySelector('button.datagrid-detail-caret-button');
        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=right]')).not.toBeNull();

        button.click();
        tick();
        context.detectChanges();

        const detailBody = document.querySelector('div.clr-dg-detail-body-wrapper') as HTMLElement;
        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=left]')).not.toBeNull();
        expect(detailBody.innerText).toBe('' + context.testComponent.items[0].id);
        expect(context.clarityElement.querySelector('clr-dg-detail')).not.toBeNull();

        button.click();
        tick();
        context.detectChanges();

        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=right]')).not.toBeNull();
        expect(context.clarityElement.querySelector('clr-dg-detail')).toBeNull();
      }));

      it('try open the disabled details', fakeAsync(function () {
        context.testComponent.disabledIndex = 0;
        tick();
        context.detectChanges();

        const button = context.clarityElement.querySelector('button.datagrid-detail-caret-button[disabled]');
        expect(button).not.toBeNull();
        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=right]')).not.toBeNull();
        expect(context.clarityElement.querySelector('clr-dg-detail')).toBeNull();

        button.click();
        tick();
        context.detectChanges();

        expect(button).not.toBeNull();
        expect(button.querySelector('cds-icon[shape^=angle-double][direction^=right]')).not.toBeNull();
        expect(context.clarityElement.querySelector('clr-dg-detail')).toBeNull();
      }));

      it('check if detail button is hidden', fakeAsync(function () {
        context.testComponent.hiddenIndex = 0;
        tick();
        context.detectChanges();
        tick();
        context.detectChanges();

        const buttons = context.clarityElement.querySelectorAll('button.datagrid-detail-caret-button');
        expect(buttons.length).toBe(1);
      }));
    });
  });
}

@Component({
  template: `
    <clr-dg-row>
      <clr-dg-cell>Hello world</clr-dg-cell>
    </clr-dg-row>
  `,
})
class ProjectionTest {}

@Component({
  template: `<clr-dg-row [clrDgItem]="item" [clrDgSelectable]="clrDgSelectable">None</clr-dg-row>`,
})
class SelectableRow {
  clrDgSelectable = true;
  item: Item = { id: 42 };
}

@Component({
  template: `
    <clr-dg-row [clrDgSelectable]="clrDgSelectable" [clrDgItem]="item" [clrDgRowSelectionLabel]="ariaLabel">
      None
    </clr-dg-row>
  `,
})
class SelectableRowOrder {
  clrDgSelectable = undefined;
  item: Item = { id: 42 };
  ariaLabel = 'uniq aria-label';
}

@Component({
  template: `<clr-dg-row [clrDgItem]="item" [(clrDgSelected)]="selected">Hello world</clr-dg-row>`,
})
class FullTest {
  item: Item;
  selected = false;
}

@Component({
  template: `
    <clr-dg-row
      [(clrDgExpanded)]="expanded"
      [clrDgDetailOpenLabel]="clrDgDetailOpenLabel"
      [clrDgDetailCloseLabel]="clrDgDetailCloseLabel"
    >
      <clr-dg-cell>Hello world</clr-dg-cell>
      <ng-container ngProjectAs="clr-dg-row-detail" *ngIf="!removeRowDetail">
        <clr-dg-row-detail *clrIfExpanded>Detail</clr-dg-row-detail>
      </ng-container>
    </clr-dg-row>
  `,
})
class ExpandTest {
  expanded = false;
  removeRowDetail = false;
  clrDgDetailOpenLabel = 'Open Me';
  clrDgDetailCloseLabel = 'Close Me';
}

@Component({
  template: `
    <clr-datagrid [clrDgSelected]="[]" [clrDgItemsTrackBy]="trackBy">
      <clr-dg-row *ngFor="let item of items" [clrDgItem]="item" [clrDgSelectable]="clrDgSelectable"></clr-dg-row>
    </clr-datagrid>
  `,
})
class NgForDatagridWithTrackBy {
  clrDgSelectable = true;

  readonly items: Item[] = [{ id: 42 }];
  readonly trackBy: ClrDatagridItemsTrackByFunction<Item> = item => item.id;
}

@Component({
  template: `
    <clr-datagrid>
      <clr-dg-row
        *ngFor="let item of items; let i = index"
        [clrDgItem]="item"
        [clrDgDetailDisabled]="i === disabledIndex"
        [clrDgDetailHidden]="i === hiddenIndex"
      ></clr-dg-row>

      <ng-template [(clrIfDetail)]="preState" let-detail>
        <clr-dg-detail>
          <clr-dg-detail-header>Title</clr-dg-detail-header>
          <clr-dg-detail-body>{{ detail.id }}</clr-dg-detail-body>
        </clr-dg-detail>
      </ng-template>
    </clr-datagrid>
  `,
})
class DatagridWithDisabledOrHiddenDetails {
  disabledIndex = -1;
  hiddenIndex = -1;

  readonly items: Item[] = [];
  private _preState: Item = null;

  constructor(private cdr: ChangeDetectorRef) {
    this.items.push({ id: 42 });
    this.items.push({ id: 22 });
  }

  get preState(): Item {
    return this._preState;
  }

  set preState(value: Item) {
    this._preState = value;
    this.cdr.detectChanges();
  }
}
