/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/core';
import { inject } from '@angular/core/testing';

import { ScrollingService } from './scrolling-service';

describe('ScrollingService', () => {
  let scrollingService: ScrollingService;
  let document: any;

  beforeEach(inject([DOCUMENT], (doc: any) => {
    document = doc;
    scrollingService = new ScrollingService(document);
  }));

  it('Toggles no-scrolling class on body', () => {
    expect(document.body.classList.contains('no-scrolling')).toBe(false);
    scrollingService.stopScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBe(true);
    scrollingService.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBe(false);
  });
});
