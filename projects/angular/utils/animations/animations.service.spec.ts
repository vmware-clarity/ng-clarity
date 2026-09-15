/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { delay } from '@clr/angular/testing';

import { ClrAnimationsService } from './animations.service';

describe('ClrAnimationsService', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('div');
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  describe('with animations disabled (TestBed default)', () => {
    it('is disabled', () => {
      expect(TestBed.inject(ClrAnimationsService).disabled).toBeTrue();
    });

    it('resolves right away even though an animation is running', async () => {
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
      await expectAsync(TestBed.inject(ClrAnimationsService).whenComplete(element)).toBeResolved();
    });
  });

  describe('with animations disabled (TestBed default)', () => {
    it('whenCompleteAfterRender resolves without waiting for a render', async () => {
      await expectAsync(
        TestBed.inject(ClrAnimationsService).whenCompleteAfterRender(() => element, TestBed.inject(Injector))
      ).toBeResolved();
    });
  });

  describe('with animations enabled', () => {
    let service: ClrAnimationsService;

    beforeEach(() => {
      TestBed.configureTestingModule({ animationsEnabled: true });
      service = TestBed.inject(ClrAnimationsService);
    });

    it('whenCompleteAfterRender waits for the next render, then for the animations', async () => {
      let complete = false;
      service.whenCompleteAfterRender(() => element, TestBed.inject(Injector)).then(() => (complete = true));
      expect(complete).toBeFalse();

      TestBed.tick();
      expect(complete).toBeFalse(); // rendered, the animations are awaited asynchronously
      await delay();
      expect(complete).toBeTrue();
    });

    it('trackInitialRender reports the render as done once it happened', async () => {
      const initialRender = service.trackInitialRender(TestBed.inject(Injector));
      expect(initialRender.done).toBeFalse();

      TestBed.tick();
      expect(initialRender.done).toBeTrue();
    });

    it('is enabled', () => {
      expect(service.disabled).toBeFalse();
    });

    it('resolves right away when nothing is animating', async () => {
      await expectAsync(service.whenComplete(element)).toBeResolved();
    });

    it('waits for the running animations to finish', async () => {
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 30 });
      let complete = false;
      service.whenComplete(element).then(() => (complete = true));

      await delay();
      expect(complete).toBeFalse();
      await delay(100);
      expect(complete).toBeTrue();
    });

    it('resolves when a running animation is cancelled', async () => {
      const animation = element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000 });
      const complete = service.whenComplete(element);
      animation.cancel();
      await expectAsync(complete).toBeResolved();
    });

    it('ignores infinite animations', async () => {
      element.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1000, iterations: Infinity });
      await expectAsync(service.whenComplete(element)).toBeResolved();
    });
  });
});
