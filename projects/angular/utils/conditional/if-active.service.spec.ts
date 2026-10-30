/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';

import { IfActiveService } from './if-active.service';

export default function (): void {
  describe('IfActiveService provider', function () {
    let ifActiveService: IfActiveService;

    beforeEach(function () {
      ifActiveService = new IfActiveService();
    });

    describe('Typescript API', function () {
      it('provides an observable for changes', function () {
        let nbChanges = 0;
        let currentChange: number;

        // Subscribe first
        ifActiveService.currentChange.subscribe((change: number) => {
          nbChanges++;
          currentChange = change;
        });

        // Initial state expectations
        expect(ifActiveService).toBeDefined();
        expect(nbChanges).toEqual(0);
        expect(currentChange).not.toBeDefined();

        // First change
        ifActiveService.current = 10;
        expect(nbChanges).toEqual(1);
        expect(currentChange).toEqual(10);

        // Second change
        ifActiveService.current = 11;
        expect(nbChanges).toEqual(2);
        expect(currentChange).toEqual(11);
      });

      it('exposes current as reactive (signal-backed) state', function () {
        const isFiveActive = computed(() => ifActiveService.current === 5);
        expect(isFiveActive()).toBe(false);
        ifActiveService.current = 5;
        expect(isFiveActive()).toBe(true);
        ifActiveService.current = 6;
        expect(isFiveActive()).toBe(false);
      });

      it('emits synchronously, once per change, with the getter already updated', function () {
        const seen: number[] = [];
        ifActiveService.currentChange.subscribe(value => {
          expect(ifActiveService.current).toBe(value);
          seen.push(value);
        });
        ifActiveService.current = 1;
        expect(seen).toEqual([1]);
        ifActiveService.current = 1;
        expect(seen).toEqual([1]);
        ifActiveService.current = 2;
        expect(seen).toEqual([1, 2]);
      });

      it('tracks the current active value in the service', function () {
        expect(ifActiveService.current).not.toBeDefined();
        ifActiveService.current = 5;
        expect(ifActiveService.current).toEqual(5);
      });
    });
  });
}
