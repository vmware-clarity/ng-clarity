/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { uniqueIdProvider, uniqueIdToken } from './id-generator';

@Component({
  selector: 'test-1',
  standalone: false,
  template: '',
  providers: [uniqueIdProvider],
})
class TestOneComponent {
  constructor(@Inject(uniqueIdToken) readonly uid: string) {}
}

@Component({
  selector: 'test-2',
  standalone: false,
  template: '',
  providers: [uniqueIdProvider],
})
class TestTwoComponent {
  constructor(@Inject(uniqueIdToken) readonly uid: string) {}
}

describe('id-generator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestOneComponent, TestTwoComponent],
    });
  });

  it('should generate different uids for different instances', () => {
    const fixture1 = TestBed.createComponent(TestOneComponent);
    const fixture2 = TestBed.createComponent(TestOneComponent);

    expect(fixture1.componentInstance.uid).not.toEqual(fixture2.componentInstance.uid);
  });

  it('should generate different uids for different components', () => {
    const fixture1 = TestBed.createComponent(TestOneComponent);
    const fixture2 = TestBed.createComponent(TestTwoComponent);

    expect(fixture1.componentInstance.uid).not.toEqual(fixture2.componentInstance.uid);
  });
});
