/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';

import { ClrDatagridTreeToggleButton } from './datagrid-tree-toggle-button';
import { DatagridTreeNode } from './providers/tree-node.model';
import { DatagridTreeService } from './providers/tree.service';

@Component({
  template: `
    <div role="gridcell" (click)="cellClicks = cellClicks + 1">
      @if (shown) {
        <button [clrDgTreeToggleButton]="node" labelIds="name"></button>
      }
    </div>
    <span id="name">vm0</span>
    <input aria-label="Elsewhere" />
  `,
  standalone: false,
})
class TestComponent {
  node = new DatagridTreeNode({}, null, 1);
  shown = true;
  cellClicks = 0;
}

export default function (): void {
  describe('ClrDatagridTreeToggleButton', function () {
    let fixture: ComponentFixture<TestComponent>;
    let tree: jasmine.SpyObj<DatagridTreeService<unknown>>;

    const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const cell = () => fixture.nativeElement.querySelector('[role=gridcell]') as HTMLElement;
    const name = () =>
      button()
        .getAttribute('aria-labelledby')
        .split(' ')
        .map(id => document.getElementById(id).textContent.trim())
        .join(' ');

    function setup(animations: boolean) {
      tree = jasmine.createSpyObj('DatagridTreeService', ['setExpanded']);
      TestBed.configureTestingModule({
        imports: [ClrIcon, ClrSpinnerModule, animations ? [NoopAnimationsModule] : []],
        declarations: [ClrDatagridTreeToggleButton, TestComponent],
        providers: [{ provide: DatagridTreeService, useValue: tree }],
      });
      fixture = TestBed.createComponent(TestComponent);
      document.body.appendChild(fixture.nativeElement);
      fixture.detectChanges();
    }

    beforeEach(function () {
      setup(false);
    });

    afterEach(function () {
      fixture.nativeElement.remove();
    });

    it('is a button out of the tab order, named by its action and then the row', function () {
      expect(button().type).toBe('button');
      expect(button().tabIndex).toBe(-1);
      expect(name()).toBe('Expand vm0');
      expect(button().getAttribute('aria-expanded')).toBe('false');

      fixture.componentInstance.node.expanded = true;
      fixture.detectChanges();
      expect(name()).toBe('Collapse vm0');
      expect(button().getAttribute('aria-expanded')).toBe('true');
    });

    it('expands and collapses its row on click, without the click reaching the row', function () {
      const node = fixture.componentInstance.node;
      button().click();
      expect(tree.setExpanded).toHaveBeenCalledWith(node, true);

      node.expanded = true;
      button().click();
      expect(tree.setExpanded).toHaveBeenCalledWith(node, false);
      expect(fixture.componentInstance.cellClicks).toBe(0);
    });

    it('shows a spinner instead of the icon while the children of its expanded row load', function () {
      const node = fixture.componentInstance.node;
      node.request = {};
      fixture.detectChanges();
      expect(button().querySelector('clr-spinner')).toBeNull();

      node.expanded = true;
      fixture.detectChanges();
      expect(button().querySelector('clr-spinner')).not.toBeNull();
      expect(button().querySelector('cds-icon')).toBeNull();

      node.request = null;
      fixture.detectChanges();
      expect(button().querySelector('clr-spinner')).toBeNull();
      expect(button().querySelector('cds-icon')).not.toBeNull();
    });

    // The animations renderer takes the button out of the page after it is destroyed, the default one
    // before.
    for (const animations of [false, true]) {
      describe(animations ? 'with the animations renderer' : 'with the default renderer', function () {
        beforeEach(function () {
          TestBed.resetTestingModule();
          fixture.nativeElement.remove();
          setup(animations);
        });

        it('gives the focus to its cell when it goes away with the focus', function () {
          button().focus();
          fixture.componentInstance.shown = false;
          fixture.detectChanges();
          expect(document.activeElement).toBe(cell());
          expect(cell().getAttribute('tabindex')).toBe('-1');
        });

        it('leaves the focus where the user moved it before it went away', function () {
          const elsewhere = fixture.nativeElement.querySelector('input') as HTMLInputElement;
          button().focus();
          elsewhere.focus();
          fixture.componentInstance.shown = false;
          fixture.detectChanges();
          expect(document.activeElement).toBe(elsewhere);
          expect(cell().hasAttribute('tabindex')).toBe(false);
        });
      });
    }
  });
}
