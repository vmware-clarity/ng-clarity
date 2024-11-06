/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { MOCK_DOM_ADAPTER_PROVIDER, MockDomAdapter } from '../../../utils/dom-adapter/dom-adapter.mock';
import { ClrDatagrid } from '../datagrid';
import { ClrDatagridColumnSeparator } from '../datagrid-column-separator';
import { DatagridColumnChanges } from '../enums/column-changes.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { TestContext } from '../helpers.spec';
import { ColumnState } from '../interfaces/column-state.interface';
import { ColumnResizerService } from '../providers/column-resizer.service';
import { ColumnsService } from '../providers/columns.service';
import { DetailService } from '../providers/detail.service';
import { FiltersProvider } from '../providers/filters';
import { Page } from '../providers/page';
import { Sort } from '../providers/sort';
import { StateDebouncer } from '../providers/state-debouncer.provider';
import { TableSizeService } from '../providers/table-size.service';
import { HIDDEN_COLUMN_CLASS, STRICT_WIDTH_CLASS } from './constants';
import { DatagridHeaderRenderer } from './header-renderer';
import { DatagridRenderOrganizer } from './render-organizer';
import { MOCK_ORGANIZER_PROVIDER, MockDatagridRenderOrganizer } from './render-organizer.mock';

@Component({
  template: `<clr-dg-column>Hello world</clr-dg-column>`,
})
class SimpleTest {}

@Component({
  template: `
    <div class="container" style="width: 1100px;">
      <clr-datagrid>
        <clr-dg-column>First</clr-dg-column>
        <clr-dg-column [style.min-width.px]="120">Second</clr-dg-column>
        <clr-dg-column [style.width.px]="column3WidthStrict" (clrDgColumnResize)="newWidth = $event">
          Three
        </clr-dg-column>
        <clr-dg-column>Four</clr-dg-column>

        <clr-dg-row *clrDgItems="let item of items">
          <clr-dg-cell>{{ item }}</clr-dg-cell>
          <clr-dg-cell [style.min-width.px]="120">{{ item * 2 }}</clr-dg-cell>
          <clr-dg-cell>{{ item * 3 }}</clr-dg-cell>
          <clr-dg-cell>{{ item * 4 }}</clr-dg-cell>
        </clr-dg-row>
        <clr-dg-footer>{{ items.length }} items</clr-dg-footer>
      </clr-datagrid>
    </div>
  `,
})
class HeaderResizeTestComponent {
  items = [1, 2, 3];
  column3WidthStrict = 200;
  newWidth: number;
}

export default function (): void {
  describe('DatagridHeaderRenderer directive', function () {
    let context: TestContext<DatagridHeaderRenderer, SimpleTest>;
    let domAdapter: MockDomAdapter;
    let organizer: MockDatagridRenderOrganizer;
    let columnsService: ColumnsService;
    let stateSub: BehaviorSubject<ColumnState>;

    beforeEach(function () {
      context = this.create(DatagridHeaderRenderer, SimpleTest, [
        MOCK_ORGANIZER_PROVIDER,
        MOCK_DOM_ADAPTER_PROVIDER,
        Sort,
        FiltersProvider,
        Page,
        StateDebouncer,
        TableSizeService,
        DetailService,
        ColumnsService,
      ]);
      domAdapter = context.getClarityProvider(DomAdapter) as MockDomAdapter;
      organizer = context.getClarityProvider(DatagridRenderOrganizer) as MockDatagridRenderOrganizer;
      columnsService = context.getClarityProvider(ColumnsService);
      context.clarityDirective.setColumnState(0);
      stateSub = columnsService.columns[0];
    });

    it('sets its state in columns service at given index', function () {
      expect(columnsService.columns.length).toBe(1);
      expect(stateSub).not.toBeUndefined();
    });

    it('computes the width of header based on its scrollWidth', function () {
      domAdapter._scrollWidth = 123;
      expect(context.clarityDirective.getColumnWidthState().width).toBe(123);
      expect(context.clarityDirective.getColumnWidthState().strictWidth).toBe(0);
    });

    it('can set the width of a column', function () {
      context.clarityDirective.setWidth({ changes: [DatagridColumnChanges.WIDTH], width: 123 });
      expect(context.clarityElement.style.width).toBe('123px');
    });

    it('resets the header to default width when notified', function () {
      context.clarityDirective.setWidth({ changes: [DatagridColumnChanges.WIDTH], width: 123 });
      expect(context.clarityElement.style.width).toBe('123px');
      organizer.updateRenderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
      expect(context.clarityElement.style.width).toBeFalsy();
    });

    it('uses the width declared by the user if there is one', function () {
      domAdapter._userDefinedWidth = 123;
      expect(context.clarityDirective.getColumnWidthState().strictWidth).toEqual(123);
      domAdapter._userDefinedWidth = 0;
      expect(context.clarityDirective.getColumnWidthState().strictWidth).toEqual(0);
    });

    it('does not remove the width defined by the user', function () {
      context.clarityElement.style.width = '123px';
      domAdapter._userDefinedWidth = 123;
      organizer.updateRenderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
      expect(context.clarityElement.style.width).toBe('123px');
    });

    it('does not set the width when the user declared a strict one', function () {
      domAdapter._scrollWidth = 123;
      context.clarityDirective.setWidth({ changes: [DatagridColumnChanges.WIDTH], width: 123, strictWidth: 24 });
      expect(context.clarityElement.classList).toContain(STRICT_WIDTH_CLASS);
      expect(context.clarityElement.style.width).toBeFalsy();

      context.clarityDirective.setWidth({ changes: [DatagridColumnChanges.WIDTH], width: 123, strictWidth: 0 });
      expect(context.clarityElement.style.width).toBe('123px');
      expect(context.clarityElement.classList).not.toContain(STRICT_WIDTH_CLASS);
    });

    it('sets proper hidden class for hidden cell', function () {
      context.clarityDirective.setHidden({ changes: [DatagridColumnChanges.HIDDEN], hidden: true });
      expect(context.clarityElement.classList).toContain(HIDDEN_COLUMN_CLASS);
      context.clarityDirective.setHidden({ changes: [DatagridColumnChanges.HIDDEN], hidden: false });
      expect(context.clarityElement.classList).not.toContain(HIDDEN_COLUMN_CLASS);
    });
  });

  describe('Datagrid Header Resize Rendering', function () {
    let context: TestContext<ClrDatagrid, HeaderResizeTestComponent>;
    let columnHeader1DebugElement: DebugElement;
    let columnHeader2DebugElement: DebugElement;
    let columnHeader3DebugElement: DebugElement;
    let columnHeader4DebugElement: DebugElement;
    let columnHeader1Element: HTMLElement;
    let columnHeader2Element: HTMLElement;
    let columnHeader3Element: HTMLElement;
    let columnHeader4Element: HTMLElement;
    let column1InitialWidth: number;
    let column2InitialWidth: number;
    let column3InitialWidth: number;
    let column4InitialWidth: number;
    let columnHeader1ResizerService: ColumnResizerService;
    let columnHeader2ResizerService: ColumnResizerService;
    let columnHeader3ResizerService: ColumnResizerService;
    let columnHeader4ResizerService: ColumnResizerService;
    let columnHeader1ColumnSeparatorDebugElement: DebugElement;
    let columnHeader3ColumnSeparatorDebugElement: DebugElement;
    const widthOf = (el: HTMLElement): number => {
      return Math.round(el.getBoundingClientRect().width);
    };
    const emulateResizeOnColumn = (moveX: number, columnSeparator: ClrDatagridColumnSeparator): void => {
      columnSeparator.showTracker();
      columnSeparator.moveTracker(moveX);
      columnSeparator.hideTracker();
    };

    beforeEach(fakeAsync(function () {
      context = this.create(ClrDatagrid, HeaderResizeTestComponent);

      context.detectChanges();
      tick();

      columnHeader1DebugElement = context.fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[0];
      columnHeader2DebugElement = context.fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[1];
      columnHeader3DebugElement = context.fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[2];
      columnHeader4DebugElement = context.fixture.debugElement.queryAll(By.directive(DatagridHeaderRenderer))[3];
      columnHeader1ResizerService = columnHeader1DebugElement.injector.get(ColumnResizerService);
      columnHeader2ResizerService = columnHeader2DebugElement.injector.get(ColumnResizerService);
      columnHeader3ResizerService = columnHeader3DebugElement.injector.get(ColumnResizerService);
      columnHeader4ResizerService = columnHeader4DebugElement.injector.get(ColumnResizerService);
      columnHeader1Element = columnHeader1DebugElement.nativeElement;
      columnHeader2Element = columnHeader2DebugElement.nativeElement;
      columnHeader3Element = columnHeader3DebugElement.nativeElement;
      columnHeader4Element = columnHeader4DebugElement.nativeElement;
      column1InitialWidth = widthOf(columnHeader1Element);
      column2InitialWidth = widthOf(columnHeader2Element);
      column3InitialWidth = widthOf(columnHeader3Element);
      column4InitialWidth = widthOf(columnHeader4Element);
      columnHeader1ColumnSeparatorDebugElement = context.fixture.debugElement.queryAll(
        By.directive(ClrDatagridColumnSeparator)
      )[0];
      columnHeader3ColumnSeparatorDebugElement = context.fixture.debugElement.queryAll(
        By.directive(ClrDatagridColumnSeparator)
      )[2];
    }));

    it('each header should have min-width', function () {
      expect(columnHeader1ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader2ResizerService.minColumnWidth).toBe(120);
      expect(columnHeader3ResizerService.minColumnWidth).toBe(96);
      expect(columnHeader4ResizerService.minColumnWidth).toBe(96);
    });

    it('columns initialized with strict width should have fixed width class', function () {
      expect(columnHeader1Element.classList.contains(STRICT_WIDTH_CLASS)).toBeFalse();
      expect(columnHeader2Element.classList.contains(STRICT_WIDTH_CLASS)).toBeFalse();
      expect(columnHeader3Element.classList.contains(STRICT_WIDTH_CLASS)).toBeTrue();
      expect(columnHeader4Element.classList.contains(STRICT_WIDTH_CLASS)).toBeFalse();
    });

    it("each header's initial width should be equal to or greater than its min-width", function () {
      expect(column1InitialWidth).toBeGreaterThan(columnHeader1ResizerService.minColumnWidth);
      expect(column2InitialWidth).toBeGreaterThan(columnHeader2ResizerService.minColumnWidth);
      expect(column3InitialWidth).toBeGreaterThan(columnHeader3ResizerService.minColumnWidth);
      expect(column4InitialWidth).toBeGreaterThan(columnHeader4ResizerService.minColumnWidth);
    });

    it('expands other flexible headers if header width shrinks', fakeAsync(function () {
      const resizeBy = -20;
      emulateResizeOnColumn(resizeBy, columnHeader1ColumnSeparatorDebugElement.componentInstance);

      context.detectChanges();
      tick();

      expect(widthOf(columnHeader1Element)).toBe(column1InitialWidth + resizeBy);
      expect(widthOf(columnHeader2Element)).toBeGreaterThan(column2InitialWidth);
      expect(widthOf(columnHeader3Element)).toBe(
        column3InitialWidth,
        `A strict width shouldn't change when other header's width changes`
      );
      expect(widthOf(columnHeader4Element)).toBeGreaterThan(column4InitialWidth);
    }));

    it('resized header should have fixed width class', function () {
      expect(columnHeader1Element.classList.contains(STRICT_WIDTH_CLASS)).toBeFalse();
      const resizeBy = -20;
      emulateResizeOnColumn(resizeBy, columnHeader1ColumnSeparatorDebugElement.componentInstance);
      expect(columnHeader1Element.classList.contains(STRICT_WIDTH_CLASS)).toBeTrue();
    });

    it('shrinks other flexible headers if header width expands', function () {
      const resizeBy = 20;
      emulateResizeOnColumn(resizeBy, columnHeader1ColumnSeparatorDebugElement.componentInstance);
      expect(widthOf(columnHeader1Element)).toBe(column1InitialWidth + resizeBy);
      expect(widthOf(columnHeader2Element)).toBeLessThan(column2InitialWidth);
      expect(widthOf(columnHeader3Element)).toBe(
        column3InitialWidth,
        `A strict width shouldn't change when other header's width changes`
      );
      expect(widthOf(columnHeader4Element)).toBeLessThan(column4InitialWidth);
    });

    it("shouldn't shrink flexible headers below their min-width if header width expands by large amount", fakeAsync(function () {
      const resizeBy = 1000;
      emulateResizeOnColumn(resizeBy, columnHeader1ColumnSeparatorDebugElement.componentInstance);

      context.detectChanges();
      tick();

      expect(widthOf(columnHeader1Element)).toBe(column1InitialWidth + resizeBy);
      expect(widthOf(columnHeader2Element)).toBe(120);
      expect(widthOf(columnHeader3Element)).toBe(
        200,
        `A strict width shouldn't change when other header's width changes`
      );
      expect(widthOf(columnHeader4Element)).toBe(96);
    }));

    it('gives header its min-width if a user tried to drag too much to left', function () {
      const resizeBy = -1000;
      emulateResizeOnColumn(resizeBy, columnHeader1ColumnSeparatorDebugElement.componentInstance);
      expect(widthOf(columnHeader1Element)).toBe(96);
    });

    it('emits new header width once resizing ends', fakeAsync(function () {
      expect(context.testComponent.newWidth).toBeUndefined();
      const resizeBy = 20;
      emulateResizeOnColumn(resizeBy, columnHeader3ColumnSeparatorDebugElement.componentInstance);

      context.detectChanges();
      tick();

      expect(context.testComponent.newWidth).toBe(column3InitialWidth + resizeBy);
    }));
  });
}
