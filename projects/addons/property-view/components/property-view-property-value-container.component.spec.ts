/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, NgModule, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PropertyViewPropertyValueComponent } from '../property-view.model';
import { PropertyViewPropertyValueContainerComponent } from './property-view-property-value-container.component';

interface ThisTest {
  fixture: ComponentFixture<PropertyViewPropertyValueContainerComponent<any>>;
  component: PropertyViewPropertyValueContainerComponent<MockModel>;
}

describe('PropertyViewPropertyValueContainerComponent', function () {
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({
      imports: [CommonModule, TestModule],
      declarations: [PropertyViewPropertyValueContainerComponent],
    });
    this.fixture = TestBed.createComponent<PropertyViewPropertyValueContainerComponent<MockModel>>(
      PropertyViewPropertyValueContainerComponent
    );
    this.component = this.fixture.componentInstance;
    this.component.componentType = MockComponent;
    this.component.componentModel = {
      text: 'text',
    };
    this.fixture.detectChanges();
  });

  it('should be created', function (this: ThisTest) {
    expect(this.component).toBeDefined();
    expect(this.fixture.debugElement.query(By.directive(MockComponent))).toBeDefined();
    expect(this.fixture.debugElement.query(By.directive(MockComponent)).componentInstance.model).toEqual({
      text: 'text',
    });
  });

  it('on componentModel changes, should change model', function (this: ThisTest) {
    this.component.componentModel = { text: 'text2' };
    this.component.ngOnChanges({
      componentModel: new SimpleChange({ text: 'text' }, { text: 'text2' }, false),
    });
    expect(this.fixture.debugElement.query(By.directive(MockComponent)).componentInstance.model).toEqual({
      text: 'text2',
    });
  });

  it('on componentType changes, should recreate component', function (this: ThisTest) {
    this.component.componentType = Mock2Component;
    this.component.componentModel = { text: 'text2' };
    this.component.ngOnChanges({
      componentType: new SimpleChange(MockComponent, Mock2Component, false),
    });
    expect(this.fixture.debugElement.query(By.directive(Mock2Component)).componentInstance.model).toEqual({
      text: 'text2',
    });
  });

  it('on ngDestroy, clear view', function (this: ThisTest) {
    this.component.ngOnDestroy();
    expect(this.fixture.debugElement.query(By.directive(MockComponent))).toBeNull();
  });
});

interface MockModel {
  text: string;
}

@Component({
  selector: 'mock-first-component',
  standalone: false,
  template: `{{ model.text }}`,
})
class MockComponent implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}

@Component({
  selector: 'mock-second-component',
  standalone: false,
  template: `{{ model.text }}`,
})
class Mock2Component implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}

@NgModule({
  imports: [CommonModule],
  declarations: [Mock2Component, MockComponent],
  exports: [Mock2Component, MockComponent],
})
class TestModule {}
