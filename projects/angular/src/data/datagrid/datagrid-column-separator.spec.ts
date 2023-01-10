/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DomAdapter } from '../../utils/dom-adapter/dom-adapter';
import { Keys } from '../../utils/enums/keys.enum';
import { ClrDatagridColumnSeparator } from './datagrid-column-separator';
import { ColumnResizerService } from './providers/column-resizer.service';
import { TableSizeService } from './providers/table-size.service';
import { MOCK_TABLE_SIZE_PROVIDER } from './providers/table-size.service.mock';
import { DatagridRenderOrganizer } from './render/render-organizer';

@Component({
  template: `<clr-dg-column-separator></clr-dg-column-separator>`,
  styles: [':host { position: position; width: 200px; height: 400px;}'],
  providers: [ColumnResizerService, MOCK_TABLE_SIZE_PROVIDER],
})
class TestComponent {}

export default function (): void {
  describe('ClrDatagridColumnSeparator component', function () {
    let fixture: ComponentFixture<any>;

    let columnSeparatorDebugElement: DebugElement;
    let columnSeparatorComponent: ClrDatagridColumnSeparator;
    let resizeTrackerEl: HTMLElement;
    let columnHandleEl: HTMLElement;
    let columnResizerService: ColumnResizerService;
    let tableSizeService: TableSizeService;

    beforeEach(function () {
      TestBed.configureTestingModule({
        declarations: [TestComponent, ClrDatagridColumnSeparator],
        providers: [DomAdapter, DatagridRenderOrganizer],
      });

      fixture = TestBed.createComponent(TestComponent);

      fixture.detectChanges();

      columnSeparatorDebugElement = fixture.debugElement.query(By.directive(ClrDatagridColumnSeparator));

      columnSeparatorComponent = columnSeparatorDebugElement.injector.get(ClrDatagridColumnSeparator);
      resizeTrackerEl = fixture.nativeElement.querySelector('.datagrid-column-resize-tracker');
      columnHandleEl = fixture.nativeElement.querySelector('.datagrid-column-handle');
      columnResizerService = columnSeparatorDebugElement.injector.get(ColumnResizerService);
      tableSizeService = columnSeparatorDebugElement.injector.get(TableSizeService);
    });

    afterEach(function () {
      fixture.destroy();
      const popoverContent = document.querySelectorAll('.clr-popover-content');
      popoverContent.forEach(content => document.body.removeChild(content));
    });

    it('has aria-label and aria-describedby attributes on its resize handle button', function () {
      expect(columnHandleEl.hasAttribute('aria-label')).toEqual(true);
      expect(columnHandleEl.hasAttribute('aria-describedby')).toEqual(true);
    });

    it('shows resize tracker when resizing starts', function () {
      columnSeparatorComponent.showTracker();
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
    });

    it('moves resize tracker during resizing', function () {
      columnSeparatorComponent.showTracker();
      expect(resizeTrackerEl.style.transform).toBe('');
      columnSeparatorComponent.moveTracker(-50);
      expect(resizeTrackerEl.style.transform).toBe(`translateX(${columnResizerService.resizedBy}px)`);
    });

    it('hides resize tracker when resizing ends', function () {
      columnSeparatorComponent.showTracker();
      columnSeparatorComponent.moveTracker(-50);
      columnSeparatorComponent.hideTracker();
      expect(resizeTrackerEl.style.display).toBe('none');
      expect(resizeTrackerEl.style.transform).toBe('translateX(0px)');
    });

    it('redflags resize tracker if resizing exceeds max range', function () {
      columnSeparatorComponent.showTracker();
      columnResizerService.isWithinMaxResizeRange = false;
      columnSeparatorComponent.moveTracker(-123);
      expect(resizeTrackerEl.classList.contains('exceeded-max')).toBeTrue();
      columnResizerService.isWithinMaxResizeRange = true;
      columnSeparatorComponent.moveTracker(123);
      expect(resizeTrackerEl.classList.contains('exceeded-max')).toBeFalse();
    });

    it('shows resize tracker on first arrow right key down event', function () {
      expect(resizeTrackerEl.style.height).toBe('');
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
    });

    it('shows resize tracker on first arrow left key down event', function () {
      expect(resizeTrackerEl.style.height).toBe('');
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
    });

    it('moves resize tracker on horizontal arrow key down events', function () {
      expect(resizeTrackerEl.style.transform).toBe('');
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
      expect(resizeTrackerEl.style.transform).toBe('translateX(-36px)');
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
      expect(resizeTrackerEl.style.transform).toBe('translateX(-12px)');
    });

    it('hides resize tracker on horizontal arrow key up events', function () {
      expect(resizeTrackerEl.style.height).toBe('');
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowRight }));
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
      columnHandleEl.dispatchEvent(new KeyboardEvent('keyup', { key: Keys.ArrowRight }));
      expect(resizeTrackerEl.style.display).toBe('none');
      expect(resizeTrackerEl.style.transform).toBe('translateX(0px)');
    });

    it('focuses column handle after arrow key up events', function () {
      expect(document.activeElement).not.toBe(columnHandleEl);
      columnHandleEl.dispatchEvent(new KeyboardEvent('keydown', { key: Keys.ArrowLeft }));
      expect(resizeTrackerEl.style.height).toBe(tableSizeService.getColumnDragHeight());
      columnHandleEl.dispatchEvent(new KeyboardEvent('keyup', { key: Keys.ArrowRight }));
      expect(document.activeElement).toBe(columnHandleEl);
    });
  });
}
