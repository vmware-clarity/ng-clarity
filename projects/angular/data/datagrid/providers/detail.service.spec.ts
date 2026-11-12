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
    expect(provider.isOpen).toBe(true);
    provider.close();
    expect(provider.isOpen).toBe(false);
  });

  it('should capture the button and focus on close', () => {
    const button = document.createElement('button');
    vi.spyOn(button, 'focus');
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
    expect(state).toBe(false);
    provider.open('one');
    expect(state).toBe(true);
    provider.close();
    expect(state).toBe(false);
    provider.open('two');
    expect(state).toBe(true);
  });

  it('caches the latest opened detail data', () => {
    provider.open('one');
    expect(provider.state).toEqual('one');
    provider.close();
    provider.open('two');
    expect(provider.state).toEqual('two');
  });

  it('can detect if it is enabled', () => {
    expect(provider.enabled).toBe(false);
    provider.enabled = true;
    expect(provider.enabled).toBe(true);
  });

  it('exposes enabled as reactive (signal-backed) state', () => {
    const enabled = computed(() => provider.enabled);
    expect(enabled()).toBe(false);
    provider.enabled = true;
    expect(enabled()).toBe(true);
    provider.enabled = false;
    expect(enabled()).toBe(false);
  });

  it('keeps a replacement pane enabled and open when an older pane is removed', () => {
    const removeOld = provider.register();
    const removeNew = provider.register();
    provider.open('replacement');
    removeOld();
    removeOld(); // Releasing the same registration twice must not remove the replacement.
    expect(provider.enabled).toBe(true);
    expect(provider.isRowOpen('replacement')).toBe(true);
    removeNew();
    expect(provider.enabled).toBe(false);
    expect(provider.isOpen).toBe(false);
    expect(provider.state).toBeUndefined();
  });

  it('returns focus and leaves the modal stack when the last open pane is removed', () => {
    const stack = new ModalStackService(PLATFORM_SERVER_ID);
    vi.spyOn(stack, 'trackModalClose');
    provider = new DetailService(stack);
    const remove = provider.register();
    const button = document.createElement('button');
    vi.spyOn(button, 'focus').mockImplementation(() => undefined);
    provider.open('value', button);
    remove();
    expect(button.focus).toHaveBeenCalled();
    expect(stack.trackModalClose).toHaveBeenCalledWith(provider);
    expect(provider.isOpen).toBe(false);
    expect(provider.enabled).toBe(false);
  });

  it('can detect if a row is open', () => {
    expect(provider.isRowOpen('one')).toBe(false);
    expect(provider.isRowOpen('two')).toBe(false);
    provider.open('one');
    expect(provider.isRowOpen('one')).toBe(true);
    expect(provider.isRowOpen('two')).toBe(false);
    provider.open('two');
    expect(provider.isRowOpen('one')).toBe(false);
    expect(provider.isRowOpen('two')).toBe(true);
  });

  it('toggles the open state', () => {
    // Open the detail
    provider.toggle('one');
    expect(provider.isOpen).toBe(true);
    // Open a different row
    provider.toggle('two');
    expect(provider.isOpen).toBe(true);
    // Toggle the currently open row
    provider.toggle('two');
    expect(provider.isOpen).toBe(false);
  });
});
