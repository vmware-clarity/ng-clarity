/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { AppfxDatagridFiltersModule } from '../datagrid-filters.module';

@Component({
  selector: 'appfx-filter-form-host-component',
  imports: [AppfxDatagridFiltersModule],
  template: `
    <appfx-filter-form [valid]="isFormValid" (cancel)="onCancelButtonClick()" (apply)="onApplyButtonClick()">
      <div></div>
    </appfx-filter-form>
  `,
  standalone: true,
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
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, FilterFormHostComponent],
      declarations: [],
      providers: [DatagridFiltersStrings],
    });
    this.fixture = TestBed.createComponent(FilterFormHostComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });
  it('is properly initialized', function (this: ThisTest) {
    const formActionButtons: HTMLInputElement[] = this.fixture.debugElement.nativeElement.querySelectorAll('button');
    expect(formActionButtons).toBeTruthy();
    expect(formActionButtons.length).toEqual(2);
    expect(formActionButtons[0].innerText).toEqual('APPLY');
    expect(formActionButtons[1].innerText).toEqual('CANCEL');
    expect(formActionButtons[0].disabled).toBeTruthy();
  });
  it('emits cancel event on cancel button click', function (this: ThisTest) {
    spyOn(this.component, 'onCancelButtonClick');
    const formActionButtons: HTMLInputElement[] = this.fixture.debugElement.nativeElement.querySelectorAll('button');
    formActionButtons[1].click();
    this.fixture.detectChanges();
    expect(this.component.onCancelButtonClick).toHaveBeenCalledTimes(1);
  });
  it('emits apply event on apply button click ', function (this: ThisTest) {
    spyOn(this.component, 'onApplyButtonClick');
    const formActionButtons: HTMLInputElement[] = this.fixture.debugElement.nativeElement.querySelectorAll('button');
    formActionButtons[0].click();
    this.fixture.detectChanges();
    expect(this.component.onApplyButtonClick).toHaveBeenCalledTimes(0);

    this.component.isFormValid = true;
    this.fixture.detectChanges();
    formActionButtons[0].click();
    this.fixture.detectChanges();
    expect(this.component.onApplyButtonClick).toHaveBeenCalledTimes(1);
  });
});
