/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { renderFixture } from '@clr/angular/utils/testing';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { AppfxDatagridFiltersModule } from '../datagrid-filters.module';

@Component({
  selector: 'appfx-filter-form-host-component',
  imports: [AppfxDatagridFiltersModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <appfx-filter-form [valid]="isFormValid" (cancel)="onCancelButtonClick()" (apply)="onApplyButtonClick()">
      <div></div>
    </appfx-filter-form>
  `,
})
class FilterFormHostComponent {
  isFormValid = false;
  onCancelButtonClick(): void {
    /* Empty method */
  }
  onApplyButtonClick(): void {
    /* Empty method */
  }
}

export interface ThisTest {
  fixture: ComponentFixture<FilterFormHostComponent>;
  component: FilterFormHostComponent;
}

describe('FilterFormComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterFormHostComponent],
      providers: [DatagridFiltersStrings],
    });
    testContext.fixture = TestBed.createComponent(FilterFormHostComponent);
    testContext.component = testContext.fixture.componentInstance;
    renderFixture(testContext.fixture);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });
  it('is properly initialized', () => {
    const formActionButtons: HTMLInputElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('button');
    expect(formActionButtons).toBeTruthy();
    expect(formActionButtons.length).toEqual(2);
    expect(formActionButtons[0].innerText).toEqual('APPLY');
    expect(formActionButtons[1].innerText).toEqual('CANCEL');
    expect(formActionButtons[0].disabled).toBeTruthy();
  });
  it('emits cancel event on cancel button click', () => {
    vi.spyOn(testContext.component, 'onCancelButtonClick').mockImplementation(() => undefined);
    const formActionButtons: HTMLInputElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('button');
    formActionButtons[1].click();
    renderFixture(testContext.fixture);
    expect(testContext.component.onCancelButtonClick).toHaveBeenCalledTimes(1);
  });
  it('emits apply event on apply button click ', () => {
    vi.spyOn(testContext.component, 'onApplyButtonClick').mockImplementation(() => undefined);
    const formActionButtons: HTMLInputElement[] =
      testContext.fixture.debugElement.nativeElement.querySelectorAll('button');
    formActionButtons[0].click();
    renderFixture(testContext.fixture);
    expect(testContext.component.onApplyButtonClick).toHaveBeenCalledTimes(0);

    testContext.component.isFormValid = true;
    renderFixture(testContext.fixture);
    formActionButtons[0].click();
    renderFixture(testContext.fixture);
    expect(testContext.component.onApplyButtonClick).toHaveBeenCalledTimes(1);
  });
});
