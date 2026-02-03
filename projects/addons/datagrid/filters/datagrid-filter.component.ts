/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClrDatagridFilterInterface, ClrDatagridStringFilterInterface, ClrPopoverToggleService } from '@clr/angular';
import { asyncScheduler, Subject } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { DatagridStrings } from '../i18n/datagrid-strings.service';

@Component({
  selector: 'appfx-datagrid-filter',
  standalone: false,
  template: `
    <clr-input-container class="mt-0">
      <input
        #input
        clrInput
        type="text"
        name="search"
        autocomplete="off"
        [value]="value"
        (keyup)="onKey($event)"
        [placeholder]="dgStrings.filterPlaceholder"
        [attr.aria-label]="dgStrings.filterPlaceholder"
      />
    </clr-input-container>
  `,
})
export class DatagridFilterComponent implements ClrDatagridFilterInterface<any>, OnInit, AfterViewInit {
  @Input() filterValue: any;
  @Input() stringFilterType?: ClrDatagridStringFilterInterface<any>;
  @Input() fieldName?: string;
  @Output() filterValueChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;

  value: string;
  changes = new Subject<any>();

  constructor(public dgStrings: DatagridStrings, private smartToggleService: ClrPopoverToggleService) {}

  ngOnInit() {
    this.value = this.filterValue || '';
  }

  ngAfterViewInit() {
    this.smartToggleService.openChange.pipe(observeOn(asyncScheduler)).subscribe(openChange => {
      if (openChange) {
        this.input.nativeElement.focus();
      }
    });
  }

  onKey(event: any) {
    this.value = event.target.value;

    this.changes.next(true);

    if (this.filterValue !== this.value) {
      this.filterValueChange.emit(this.value);
    }
  }

  isActive(): boolean {
    return !!this.value;
  }

  accepts(item: any): boolean {
    const lowerCaseTrimmedValue = this.value.toLowerCase().trim();
    let currentItemFieldValue: string;

    if (this.stringFilterType) {
      return this.stringFilterType.accepts(item, lowerCaseTrimmedValue);
    } else if (this.fieldName) {
      currentItemFieldValue = '' + item[this.fieldName];
      return currentItemFieldValue.toLowerCase().indexOf(lowerCaseTrimmedValue) >= 0;
    }

    return false;
  }
}
