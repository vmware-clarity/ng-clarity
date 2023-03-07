/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, TrackByFunction, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridModule } from './datagrid.module';
import { FiltersProvider } from './providers/filters';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';

export default function (): void {
  describe('DatagridItemsTrackby directive', function () {
    beforeEach(function () {
      /*
       * Since the DatagridItems element is a template that isn't rendered in the DOM,
       * we can't use our usual shortcut, we need to rely on @ViewChild
       */
      TestBed.configureTestingModule({
        imports: [ClrDatagridModule],
        declarations: [FullTest],
        providers: [Items, FiltersProvider, Sort, Page, StateDebouncer],
      });
      this.fixture = TestBed.createComponent(FullTest);
      this.fixture.detectChanges();
      this.testComponent = this.fixture.componentInstance;
      this.itemsProvider = TestBed.get(Items);
    });

    afterEach(function () {
      this.fixture.destroy();
    });

    it('receives an input for the trackBy option', function () {
      expect(this.itemsProvider.iteratorTrackBy).toBeUndefined();
      this.testComponent.trackBy = (index: number) => index;
      this.fixture.detectChanges();
      expect(this.itemsProvider.iteratorTrackBy).toBe(this.testComponent.trackBy);
    });
  });
}

@Component({
  template: `<div *ngFor="let n of numbers; trackBy: trackBy">{{ n }}</div>`,
})
class FullTest {
  @ViewChild(ClrDatagridItems) datagridItems: ClrDatagridItems<number>;

  numbers = [1, 2, 3, 4, 5];

  trackBy: TrackByFunction<number>;
}
