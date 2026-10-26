/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgModel } from '@angular/forms';

import { ClrAdvancedFiltersError } from './advanced-filters-error.directive';
import { ClrAdvancedFiltersModule } from '../advanced-filters.module';
import { ClrAdvancedFilterValidationError as Code } from '../enums/advanced-filter-validation-error.enum';

@Component({
  template: `<input name="value" [(ngModel)]="value" [clrAdvancedFiltersError]="code" />`,
  standalone: false,
})
class TestHost {
  @ViewChild(NgModel) model: NgModel;
  value = '';
  code: Code | null = Code.REQUIRED;
}

describe('ClrAdvancedFiltersError', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;

  async function settle(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    // The module only exports the public component; the test host also uses this internal part.
    TestBed.overrideModule(ClrAdvancedFiltersModule, { add: { exports: [ClrAdvancedFiltersError] } });
    TestBed.configureTestingModule({ imports: [ClrAdvancedFiltersModule, FormsModule], declarations: [TestHost] });
    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => fixture.destroy());

  it('reports the code as the validation error of the control', () => {
    expect(host.model.errors).toEqual({ [Code.REQUIRED]: true });
    expect(host.model.invalid).toBeTrue();
  });

  it('validates again when the code changes, whatever the value is', async () => {
    host.code = Code.INVALID_NUMBER;
    await settle();
    expect(host.model.errors).toEqual({ [Code.INVALID_NUMBER]: true });

    host.code = null;
    await settle();
    expect(host.model.errors).toBeNull();
    expect(host.model.valid).toBeTrue();
  });
});
