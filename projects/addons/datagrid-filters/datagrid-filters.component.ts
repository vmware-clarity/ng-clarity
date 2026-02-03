/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { FilterMode } from './model/datagrid-filters.enums';
import { FilterablePropertyDefinition, PropertyFilter } from './model/datagrid-filters.interfaces';

const enterKey = 'Enter';
const searchTermDebounceTimeMs = 2000;

/**
 * Component provides the ability to choose from quick filter (search)
 * and advanced filter (composite filters).
 */

@Component({
  selector: 'appfx-datagrid-filters',
  standalone: false,
  templateUrl: 'datagrid-filters.component.html',
  styleUrls: ['datagrid-filters.component.scss', 'common-styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGridFiltersComponent implements OnDestroy, AfterViewInit {
  readonly quickMode: FilterMode = FilterMode.Quick;
  readonly advancedMode: FilterMode = FilterMode.Advanced;
  readonly advancedOnlyMode: FilterMode = FilterMode.AdvancedOnly;

  mode: FilterMode = FilterMode.Quick;
  selectedFilterMode: FilterMode = FilterMode.Quick;
  searchTerm: string;

  /**
   * Array of filterable properties
   */
  @Input() filterableProperties: FilterablePropertyDefinition[];

  /**
   * Event emitter to tell hosting view that search term, used for filtering
   * has changed.
   */
  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() propertyFiltersChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  private lastSearchTerm = '';
  // When the user is typing in the search input (filter)
  // the search term change event will be fired
  // on every 2 sec.
  private searchTermDebouncer: Subject<string> = new Subject<string>();
  private unsubscribeSubject: Subject<void> = new Subject<void>();
  private appliedFiltersCount = 0;

  constructor(public filterStrings: DatagridFiltersStrings) {}

  /**
   * Quick, Advanced or AdvancedOnly. Default Quick.
   */
  @Input()
  set filterMode(filterMode: FilterMode) {
    if (filterMode !== null && filterMode !== undefined) {
      this.mode = filterMode;
    }
  }

  ngAfterViewInit() {
    this.searchTermDebouncer
      .pipe(debounceTime(searchTermDebounceTimeMs), distinctUntilChanged(), takeUntil(this.unsubscribeSubject))
      .subscribe((search: string) => {
        this.doSearch(search);
      });
  }

  ngOnDestroy() {
    this.unsubscribeSubject.next();
    this.unsubscribeSubject.complete();
  }

  onFilterModeChange() {
    // Reset quick search data when switching to advanced mode
    if (this.selectedFilterMode === FilterMode.Advanced && !!this.searchTerm) {
      this.searchTerm = '';
      this.doSearch(this.searchTerm);
      // Clear debouncer last value
      this.searchTermDebouncer.next(this.searchTerm);
    }
    // Clear applied filters when switching to quick mode
    if (this.selectedFilterMode === FilterMode.Quick && this.appliedFiltersCount > 0) {
      this.appliedFiltersCount = 0;
      this.propertyFiltersChange.emit([]);
    }
  }

  onFilterCriteriaChange(propertyFilters: PropertyFilter[]) {
    this.appliedFiltersCount = propertyFilters.length;
    this.propertyFiltersChange.emit(propertyFilters);
  }

  onSearchInputKeyPress(event: KeyboardEvent): void {
    if (event.key === enterKey) {
      this.doSearch(this.searchTerm);
    }
  }

  onSearchTermChanged(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchTermDebouncer.next(this.searchTerm);
  }

  private doSearch(search: string) {
    search = search.trim();
    if (this.lastSearchTerm !== search) {
      this.lastSearchTerm = search;
      this.searchTermChange.emit(search);
    }
  }
}
