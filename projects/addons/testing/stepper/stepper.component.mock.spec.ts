/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { MockStepperComponent } from './stepper.component.mock';

describe('MockStepperComponent', () => {
  let fixture: ComponentFixture<MockStepperComponent>;
  let component: MockStepperComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockStepperComponent],
    });

    fixture = TestBed.createComponent(MockStepperComponent);
    component = fixture.componentInstance;
    renderFixture(fixture);
  });

  it('should create an instance of MockStepperComponent', () => {
    expect(component).toBeDefined();
  });
});
