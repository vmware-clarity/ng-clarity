/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrLabels } from './labels';

describe('TagComponent', () => {
  let component: ClrLabels;
  let fixture: ComponentFixture<ClrLabels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClrLabels],
    }).compileComponents();

    fixture = TestBed.createComponent(ClrLabels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
