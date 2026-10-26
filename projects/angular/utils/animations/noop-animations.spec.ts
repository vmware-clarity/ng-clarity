/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

import { noopAnimations } from './noop-animations';

describe('noopAnimations', () => {
  function check() {
    return TestBed.runInInjectionContext(() => noopAnimations());
  }

  it('is true when the application provides the noop animations', () => {
    TestBed.configureTestingModule({ providers: [provideNoopAnimations()] });

    expect(check()).toBeTrue();
  });

  it('is false when the application provides the browser animations', () => {
    TestBed.configureTestingModule({ providers: [provideAnimations()] });

    expect(check()).toBeFalse();
  });

  it('is false when the application provides no animations module', () => {
    expect(check()).toBeFalse();
  });
});
