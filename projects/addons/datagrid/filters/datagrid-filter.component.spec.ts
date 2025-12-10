/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ClrInputModule, ClrPopoverToggleService } from '@clr/angular';
import { Observable, of } from 'rxjs';

import { DatagridFilterComponent } from './datagrid-filter.component';
import { CaseInsensitiveContainsStringFilter } from './string-filters';
import { DatagridStrings } from '../i18n/datagrid-strings.service';

class ClrPopoverToggleServiceMock {
  get openChange(): Observable<boolean> {
    return of(true);
  }
}

class CaseInsensitiveContainsStringFilterMock {
  accepts(): boolean {
    return true;
  }
}

function generateKeyUpEvent(value: string): KeyboardEvent {
  const event: KeyboardEvent = new KeyboardEvent('keyup', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'target', { value: { value } });
  return event;
}

describe('DatagridFilterComponent', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      imports: [ClrInputModule],
      declarations: [DatagridFilterComponent],
      providers: [
        { provide: DatagridStrings, useValue: {} },
        {
          provide: ClrPopoverToggleService,
          useClass: ClrPopoverToggleServiceMock,
        },
        {
          provide: CaseInsensitiveContainsStringFilter,
          useClass: CaseInsensitiveContainsStringFilterMock,
        },
      ],
    });
  });

  beforeEach(function (this: any) {
    this.fixture = TestBed.createComponent(DatagridFilterComponent);
    this.clrPopoverToggleService = TestBed.inject(ClrPopoverToggleService);
    this.caseInsensitiveContainsStringFilter = TestBed.inject(CaseInsensitiveContainsStringFilter);
  });

  it('should set the initial input value to be equal to the default filter value', function (this: any) {
    this.fixture.componentInstance.filterValue = 'hdd';
    this.fixture.detectChanges();

    expect(this.fixture.componentInstance.value).toEqual('hdd');
    expect(this.fixture.componentInstance.isActive()).toBeTruthy();
  });

  describe('should mark the filter as', function (this: any) {
    it('not active initially', function (this: any) {
      expect(this.fixture.componentInstance.isActive()).toBeFalsy();
    });

    it('active when the value is not empty', function (this: any) {
      this.fixture.componentInstance.value = 'name';

      expect(this.fixture.componentInstance.isActive()).toBeTruthy();
    });
  });

  describe('should filter and return', function (this: any) {
    it('true when provided with a valid property name ', function (this: any) {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      this.fixture.componentInstance.fieldName = 'propA';
      this.fixture.componentInstance.value = 'ABC';

      expect(this.fixture.componentInstance.accepts(item)).toBeTruthy();

      this.fixture.componentInstance.value = 'abc';

      expect(this.fixture.componentInstance.accepts(item)).toBeTruthy();

      this.fixture.componentInstance.value = 'abC';

      expect(this.fixture.componentInstance.accepts(item)).toBeTruthy();

      this.fixture.componentInstance.value = ' ABC ';

      expect(this.fixture.componentInstance.accepts(item)).toBeTruthy();
    });

    it('false when provided with an invalid property name', function (this: any) {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      this.fixture.componentInstance.fieldName = 'propA';
      this.fixture.componentInstance.value = 'abcd';

      expect(this.fixture.componentInstance.accepts(item)).toBeFalsy();

      this.fixture.componentInstance.value = ' ab c ';

      expect(this.fixture.componentInstance.accepts(item)).toBeFalsy();
    });
  });

  describe('when a string filter property is defined should filter and return', function (this: any) {
    it('true when provided with a valid filter property name', function (this: any) {
      const item = {
        propA: 'ABC',
      };

      this.fixture.componentInstance.stringFilterType = new CaseInsensitiveContainsStringFilter('propA');
      this.fixture.componentInstance.value = 'abc';

      spyOn(this.caseInsensitiveContainsStringFilter, 'accepts').and.returnValue(true);

      expect(this.fixture.componentInstance.accepts(item)).toBeTruthy();
    });

    it('false when provided with an invalid filter property name', function (this: any) {
      const item = {
        propA: 'ABC',
      };

      this.fixture.componentInstance.stringFilterType = new CaseInsensitiveContainsStringFilter('propA');
      this.fixture.componentInstance.value = 'abcd';

      spyOn(this.caseInsensitiveContainsStringFilter, 'accepts').and.returnValue(false);

      expect(this.fixture.componentInstance.accepts(item)).toBeFalsy();
    });
  });

  it('emits a keyup event when the value has changed', function (this: any) {
    const input: HTMLElement = this.fixture.nativeElement.querySelector('input');
    let changesFlag = false;

    spyOn(this.fixture.componentInstance.filterValueChange, 'emit').and.callThrough();

    this.fixture.componentInstance.changes.subscribe(() => (changesFlag = true));

    input.dispatchEvent(generateKeyUpEvent('abcd'));

    this.fixture.detectChanges();

    expect(changesFlag).toBe(true);
    expect(this.fixture.componentInstance.filterValueChange.emit).toHaveBeenCalledWith('abcd');
  });

  it('should focus the input field when the filter dropdown is opened', fakeAsync(function (this: any) {
    const input: HTMLElement = this.fixture.nativeElement.querySelector('input');

    spyOn(input, 'focus');
    spyOn(this.clrPopoverToggleService, 'openChange').and.returnValue(of(true));

    expect(input).toBeTruthy();

    this.fixture.componentInstance.ngAfterViewInit();
    this.fixture.detectChanges();

    tick();

    expect(input.focus).toHaveBeenCalled();
  }));
});
