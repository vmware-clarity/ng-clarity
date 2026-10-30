/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { renderFixture } from '@clr/angular/utils/testing';

import { PropertyViewPropertyValueComponent } from '../property-view.model';
import { PropertyViewPropertyValueContainerComponent } from './property-view-property-value-container.component';

interface ThisTest {
  fixture: ComponentFixture<PropertyViewPropertyValueContainerComponent<any>>;
  component: PropertyViewPropertyValueContainerComponent<MockModel>;
}

describe('PropertyViewPropertyValueContainerComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, TestModule],
      declarations: [PropertyViewPropertyValueContainerComponent],
    });
    testContext.fixture = TestBed.createComponent<PropertyViewPropertyValueContainerComponent<MockModel>>(
      PropertyViewPropertyValueContainerComponent
    );
    testContext.component = testContext.fixture.componentInstance;
    testContext.fixture.componentRef.setInput('componentType', MockComponent);
    testContext.fixture.componentRef.setInput('componentModel', {
      text: 'text',
    });
    renderFixture(testContext.fixture);
  });

  it('should be created', () => {
    expect(testContext.component).toBeDefined();
    expect(testContext.fixture.debugElement.query(By.directive(MockComponent))).toBeDefined();
    expect(testContext.fixture.debugElement.query(By.directive(MockComponent)).componentInstance.model).toEqual({
      text: 'text',
    });
  });

  it('on componentModel changes, should change model', () => {
    testContext.fixture.componentRef.setInput('componentModel', { text: 'text2' });
    testContext.component.ngOnChanges({
      componentModel: new SimpleChange({ text: 'text' }, { text: 'text2' }, false),
    });
    expect(testContext.fixture.debugElement.query(By.directive(MockComponent)).componentInstance.model).toEqual({
      text: 'text2',
    });
  });

  it('on componentType changes, should recreate component', () => {
    testContext.fixture.componentRef.setInput('componentType', Mock2Component);
    testContext.fixture.componentRef.setInput('componentModel', { text: 'text2' });
    testContext.component.ngOnChanges({
      componentType: new SimpleChange(MockComponent, Mock2Component, false),
    });
    expect(testContext.fixture.debugElement.query(By.directive(Mock2Component)).componentInstance.model).toEqual({
      text: 'text2',
    });
  });

  it('on ngDestroy, clear view', () => {
    testContext.component.ngOnDestroy();
    expect(testContext.fixture.debugElement.query(By.directive(MockComponent))).toBeNull();
  });
});

interface MockModel {
  text: string;
}

@Component({
  selector: 'mock-first-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `{{ model.text }}`,
})
class MockComponent implements PropertyViewPropertyValueComponent<MockModel> {
  model: MockModel;
}

@Component({
  selector: 'mock-second-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
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
