/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockAppfxWizardComponent } from './wizard.component.mock';

describe('MockAppfxWizardComponent', () => {
  let fixture: ComponentFixture<MockAppfxWizardComponent>;
  let component: MockAppfxWizardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MockAppfxWizardComponent],
    });

    fixture = TestBed.createComponent(MockAppfxWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of MockAppfxWizardComponent', () => {
    expect(component).toBeDefined();
  });
});
