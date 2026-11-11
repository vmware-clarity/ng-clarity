/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { renderFixture } from '@clr/angular/utils/testing';
import { Observable, of } from 'rxjs';

import { DatagridFilterComponent } from './datagrid-filter.component';
import { CaseInsensitiveContainsStringFilter } from './string-filters';
import { useTestTimers } from '../../../test-timers';
import { DatagridStrings } from '../i18n/datagrid-strings.service';

class ClrPopoverServiceMock {
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
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrInputModule],
      declarations: [DatagridFilterComponent],
      providers: [
        { provide: DatagridStrings, useValue: {} },
        {
          provide: ClrPopoverService,
          useClass: ClrPopoverServiceMock,
        },
        {
          provide: CaseInsensitiveContainsStringFilter,
          useClass: CaseInsensitiveContainsStringFilterMock,
        },
      ],
    });
  });

  beforeEach(() => {
    testContext.fixture = TestBed.createComponent(DatagridFilterComponent);
    testContext.clrPopoverService = TestBed.inject(ClrPopoverService);
    testContext.caseInsensitiveContainsStringFilter = TestBed.inject(CaseInsensitiveContainsStringFilter);
  });

  it('should set the initial input value to be equal to the default filter value', () => {
    testContext.fixture.componentInstance.filterValue = 'hdd';
    renderFixture(testContext.fixture);

    expect(testContext.fixture.componentInstance.value).toEqual('hdd');
    expect(testContext.fixture.componentInstance.isActive()).toBeTruthy();
  });

  describe('should mark the filter as', () => {
    it('not active initially', () => {
      expect(testContext.fixture.componentInstance.isActive()).toBeFalsy();
    });

    it('active when the value is not empty', () => {
      testContext.fixture.componentInstance.value = 'name';

      expect(testContext.fixture.componentInstance.isActive()).toBeTruthy();
    });
  });

  describe('should filter and return', () => {
    it('true when provided with a valid property name ', () => {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      testContext.fixture.componentInstance.fieldName = 'propA';
      testContext.fixture.componentInstance.value = 'ABC';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeTruthy();

      testContext.fixture.componentInstance.value = 'abc';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeTruthy();

      testContext.fixture.componentInstance.value = 'abC';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeTruthy();

      testContext.fixture.componentInstance.value = ' ABC ';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeTruthy();
    });

    it('false when provided with an invalid property name', () => {
      const item = {
        propA: 'ABC',
        propB: 'DEF',
      };

      testContext.fixture.componentInstance.fieldName = 'propA';
      testContext.fixture.componentInstance.value = 'abcd';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeFalsy();

      testContext.fixture.componentInstance.value = ' ab c ';

      expect(testContext.fixture.componentInstance.accepts(item)).toBeFalsy();
    });
  });

  describe('when a string filter property is defined should filter and return', () => {
    it('true when provided with a valid filter property name', () => {
      const item = {
        propA: 'ABC',
      };

      testContext.fixture.componentInstance.stringFilterType = new CaseInsensitiveContainsStringFilter('propA');
      testContext.fixture.componentInstance.value = 'abc';

      vi.spyOn(testContext.caseInsensitiveContainsStringFilter, 'accepts').mockReturnValue(true);

      expect(testContext.fixture.componentInstance.accepts(item)).toBeTruthy();
    });

    it('false when provided with an invalid filter property name', () => {
      const item = {
        propA: 'ABC',
      };

      testContext.fixture.componentInstance.stringFilterType = new CaseInsensitiveContainsStringFilter('propA');
      testContext.fixture.componentInstance.value = 'abcd';

      vi.spyOn(testContext.caseInsensitiveContainsStringFilter, 'accepts').mockReturnValue(false);

      expect(testContext.fixture.componentInstance.accepts(item)).toBeFalsy();
    });
  });

  it('emits a keyup event when the value has changed', () => {
    const input: HTMLElement = testContext.fixture.nativeElement.querySelector('input');
    let changesFlag = false;

    vi.spyOn(testContext.fixture.componentInstance.filterValueChange, 'emit');

    testContext.fixture.componentInstance.changes.subscribe(() => (changesFlag = true));

    input.dispatchEvent(generateKeyUpEvent('abcd'));

    renderFixture(testContext.fixture);

    expect(changesFlag).toBe(true);
    expect(testContext.fixture.componentInstance.filterValueChange.emit).toHaveBeenCalledWith('abcd');
  });

  it('should focus the input field when the filter dropdown is opened', async () => {
    useTestTimers();
    const input: HTMLElement = testContext.fixture.nativeElement.querySelector('input');

    vi.spyOn(input, 'focus').mockImplementation(() => undefined);

    expect(input).toBeTruthy();

    testContext.fixture.componentInstance.ngAfterViewInit();
    renderFixture(testContext.fixture);

    await vi.advanceTimersByTimeAsync(0);

    expect(input.focus).toHaveBeenCalled();
  });
});
