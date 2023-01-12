/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { ClrDatepickerModule } from './datepicker.module';

@Component({
  template: `
    <clr-date-container>
      <input type="date" clrDate min="2022-01-01" max="2022-12-31" [formControl]="formControl" />
    </clr-date-container>
  `,
})
class TestComponent {
  readonly formControl = new FormControl();
}

export default function () {
  describe('Date Input Validator', () => {
    let fixture: ComponentFixture<TestComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule, ClrDatepickerModule],
        declarations: [TestComponent],
      });

      fixture = TestBed.createComponent(TestComponent);
    });

    it('should not allow a date less than the min date', () => {
      fixture.componentInstance.formControl.setValue('12/31/2021');
      fixture.detectChanges();

      const expectedErrors = {
        min: { min: '1/1/2022', actual: '12/31/2021' },
      };

      expect(fixture.componentInstance.formControl.errors).toEqual(expectedErrors);
    });

    it('should allow a date equal to the min date', () => {
      fixture.componentInstance.formControl.setValue('1/1/2022');
      fixture.detectChanges();

      expect(fixture.componentInstance.formControl.errors).toBeNull();
    });

    it('should allow a date between the min and max dates', () => {
      fixture.componentInstance.formControl.setValue('6/1/2022');
      fixture.detectChanges();

      expect(fixture.componentInstance.formControl.errors).toBeNull();
    });

    it('should allow a date equal to the max date', () => {
      fixture.componentInstance.formControl.setValue('12/31/2022');
      fixture.detectChanges();

      expect(fixture.componentInstance.formControl.errors).toBeNull();
    });

    it('should not allow a date greater than the max date', () => {
      fixture.componentInstance.formControl.setValue('1/1/2023');
      fixture.detectChanges();

      const expectedErrors = {
        max: { max: '12/31/2022', actual: '1/1/2023' },
      };

      expect(fixture.componentInstance.formControl.errors).toEqual(expectedErrors);
    });
  });
}
