/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { ScrollingService } from './scrolling-service';

describe('ScrollingService', () => {
  let scrollingService: ScrollingService;
  let document: any;

  beforeEach(inject([DOCUMENT], (doc: any) => {
    document = doc;
    scrollingService = TestBed.runInInjectionContext(() => new ScrollingService(document));
  }));

  it('keeps another instance locked and ignores non-owner resumes', () => {
    const second = TestBed.runInInjectionContext(() => new ScrollingService(document));
    scrollingService.stopScrolling();
    second.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBeTrue();
    second.stopScrolling();
    scrollingService.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBeTrue();
    second.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBeFalse();
  });

  it('makes repeated stop and resume requests idempotent', () => {
    scrollingService.stopScrolling();
    scrollingService.stopScrolling();
    scrollingService.resumeScrolling();
    scrollingService.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBeFalse();
    scrollingService.stopScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBeTrue();
    scrollingService.resumeScrolling();
  });

  it('Toggles no-scrolling class on body', () => {
    expect(document.body.classList.contains('no-scrolling')).toBe(false);
    scrollingService.stopScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBe(true);
    scrollingService.resumeScrolling();
    expect(document.body.classList.contains('no-scrolling')).toBe(false);
  });
});
