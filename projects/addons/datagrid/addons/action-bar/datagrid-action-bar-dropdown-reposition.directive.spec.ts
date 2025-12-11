/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DatagridActionBarDropdownRepositionDirective } from './datagrid-action-bar-dropdown-reposition.directive';

@Component({
  selector: 'test-dropdown-reposition',
  standalone: false,
  template: ` <div dropdownMenuReposition></div>`,
})
class TestDropdownRepositionComponent {}

describe('DatagridActionBarDropdownRepositionDirective', () => {
  let fixture: ComponentFixture<TestDropdownRepositionComponent>;
  let directiveElement: DebugElement;
  let directiveInstance: DatagridActionBarDropdownRepositionDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestDropdownRepositionComponent, DatagridActionBarDropdownRepositionDirective],
    });

    fixture = TestBed.createComponent(TestDropdownRepositionComponent);
    directiveElement = fixture.debugElement.query(By.directive(DatagridActionBarDropdownRepositionDirective));
    directiveInstance = directiveElement.injector.get(DatagridActionBarDropdownRepositionDirective);
  });

  it('should set translateX property to a minimum value', () => {
    const originalTransform = 'translateX(-50px) translateY(5px)';
    const expectedTransform = 'translateX(10px) translateY(5px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });

  it('should not change translateX property if it is already at the minimum value', () => {
    const originalTransform = 'translateX(10px) translateY(2px)';
    const expectedTransform = 'translateX(10px) translateY(2px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });

  it('should not change translateX property if it is already greater than the minimum value', () => {
    const originalTransform = 'translateX(100px) translateY(3px)';
    const expectedTransform = 'translateX(100px) translateY(3px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });

  it('should handle translateY property in the transform style', () => {
    const originalTransform = 'translateX(-50px) translateY(45px)';
    const expectedTransform = 'translateX(10px) translateY(45px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });

  it('should handle multiple transform properties in the transform style', () => {
    const originalTransform = 'translateX(-50px) translateY(50px) rotate(45deg)';
    const expectedTransform = 'translateX(10px) translateY(50px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });

  it('should handle transform properties with different units', () => {
    const originalTransform = 'translateX(-50%) translateY(50px)';
    const expectedTransform = 'translateX(10px) translateY(50px)';

    directiveElement.nativeElement.style.transform = originalTransform;
    directiveInstance.ngAfterViewInit();

    expect(directiveElement.nativeElement.style.transform).toEqual(expectedTransform);
  });
});
