/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { computed } from '@angular/core';
import { ModalStackService } from '@clr/angular/modal';
import { expectActiveElementToBe } from '@clr/angular/testing';
import { Subscription } from 'rxjs';

import { DetailService } from './detail.service';

// Prevent ModalStackService from adding event handlers.
const PLATFORM_SERVER_ID = 'server';

export default function (): void {
  describe('DetailService provider', function () {
    let provider: DetailService;
    let subscription: Subscription;

    beforeEach(function () {
      provider = new DetailService(new ModalStackService(PLATFORM_SERVER_ID));
    });

    afterEach(() => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });

    it('should set the open and close the detail state', () => {
      provider.open('value');
      expect(provider.isOpen).toBeTrue();
      provider.close();
      expect(provider.isOpen).toBeFalse();
    });

    it('should capture the button and focus on close', () => {
      const button = document.createElement('button');
      spyOn(button, 'focus').and.callThrough();
      document.body.appendChild(button);
      provider.open('value', button);
      expect(provider.isOpen);
      provider.close();
      expectActiveElementToBe(button);
      expect(button.focus).toHaveBeenCalled();
      document.body.removeChild(button);
    });

    it('exposes a stageChange observable that responds to open and close', () => {
      let state: boolean;
      subscription = provider.stateChange.subscribe(updated => (state = updated));
      expect(state).toBeFalse();
      provider.open('one');
      expect(state).toBeTrue();
      provider.close();
      expect(state).toBeFalse();
      provider.open('two');
      expect(state).toBeTrue();
    });

    it('caches the latest opened detail data', () => {
      provider.open('one');
      expect(provider.state).toEqual('one');
      provider.close();
      provider.open('two');
      expect(provider.state).toEqual('two');
    });

    it('can detect if it is enabled', () => {
      expect(provider.enabled).toBeFalse();
      provider.enabled = true;
      expect(provider.enabled).toBeTrue();
    });

    it('exposes enabled as reactive (signal-backed) state', () => {
      const enabled = computed(() => provider.enabled);
      expect(enabled()).toBeFalse();
      provider.enabled = true;
      expect(enabled()).toBeTrue();
      provider.enabled = false;
      expect(enabled()).toBeFalse();
    });

    it('keeps a replacement pane enabled and open when an older pane is removed', () => {
      const removeOld = provider.register();
      const removeNew = provider.register();
      provider.open('replacement');
      removeOld();
      removeOld(); // Releasing the same registration twice must not remove the replacement.
      expect(provider.enabled).toBeTrue();
      expect(provider.isRowOpen('replacement')).toBeTrue();
      removeNew();
      expect(provider.enabled).toBeFalse();
      expect(provider.isOpen).toBeFalse();
      expect(provider.state).toBeUndefined();
    });

    it('returns focus and leaves the modal stack when the last open pane is removed', () => {
      const stack = new ModalStackService(PLATFORM_SERVER_ID);
      spyOn(stack, 'trackModalClose').and.callThrough();
      provider = new DetailService(stack);
      const remove = provider.register();
      const button = document.createElement('button');
      spyOn(button, 'focus');
      provider.open('value', button);
      remove();
      expect(button.focus).toHaveBeenCalled();
      expect(stack.trackModalClose).toHaveBeenCalledWith(provider);
      expect(provider.isOpen).toBeFalse();
      expect(provider.enabled).toBeFalse();
    });

    it('can detect if a row is open', () => {
      expect(provider.isRowOpen('one')).toBeFalse();
      expect(provider.isRowOpen('two')).toBeFalse();
      provider.open('one');
      expect(provider.isRowOpen('one')).toBeTrue();
      expect(provider.isRowOpen('two')).toBeFalse();
      provider.open('two');
      expect(provider.isRowOpen('one')).toBeFalse();
      expect(provider.isRowOpen('two')).toBeTrue();
    });

    it('toggles the open state', () => {
      // Open the detail
      provider.toggle('one');
      expect(provider.isOpen).toBeTrue();
      // Open a different row
      provider.toggle('two');
      expect(provider.isOpen).toBeTrue();
      // Toggle the currently open row
      provider.toggle('two');
      expect(provider.isOpen).toBeFalse();
    });
  });
}
