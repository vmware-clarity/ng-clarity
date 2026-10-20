/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { MockInstance } from 'vitest';

import { Closable, ModalStackService } from './modal-stack.service';

const PLATFORM_BROWSER_ID = 'browser';

describe('ModalStackService', () => {
  let modalStackService: ModalStackService;
  let addEventListenerSpy: MockInstance<HTMLElement['addEventListener']>;

  beforeEach(() => {
    modalStackService = new ModalStackService(PLATFORM_BROWSER_ID);
    addEventListenerSpy = vi.spyOn(document.body, 'addEventListener');
  });

  afterEach(() => {
    addEventListenerSpy.mock.calls.forEach(([type, listener, options]) => {
      document.body.removeEventListener(type, listener, options);
    });
  });

  it('should close the open modal when the escape key is pressed', () => {
    const modal: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modalCloseSpy = vi.spyOn(modal, 'close');
    const removeEventListenerSpy = vi.spyOn(document.body, 'removeEventListener');

    modalStackService.trackModalOpen(modal);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modalCloseSpy).toHaveBeenCalled();

    // ensure the keyup event listener is removed
    const removedKeyUpListeners = removeEventListenerSpy.mock.calls
      .filter(([type]) => type === 'keyup')
      .map(([, listener]) => listener);
    expect(removedKeyUpListeners).toContain(addEventListenerSpy.mock.calls[0][1]);
  });

  it('should close only the top modal when the escape key is pressed', () => {
    const modal1: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modal2: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modal1CloseSpy = vi.spyOn(modal1, 'close');
    const modal2CloseSpy = vi.spyOn(modal2, 'close');
    const removeEventListenerSpy = vi.spyOn(document.body, 'removeEventListener');

    modalStackService.trackModalOpen(modal1);
    modalStackService.trackModalOpen(modal2);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modal2CloseSpy).toHaveBeenCalled();
    expect(modal1CloseSpy).not.toHaveBeenCalled();

    // ensure the keyup event listener is not removed (there is still an open modal)
    // Other fixtures can have listeners too; this stack must retain its own listener.
    const removedKeyUpListeners = removeEventListenerSpy.mock.calls
      .filter(([type]) => type === 'keyup')
      .map(([, listener]) => listener);
    expect(removedKeyUpListeners).not.toContain(addEventListenerSpy.mock.calls[0][1]);
  });

  it('should close two open modals when the escape key is pressed twice', () => {
    const modal1: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modal2: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modal1CloseSpy = vi.spyOn(modal1, 'close');
    const modal2CloseSpy = vi.spyOn(modal2, 'close');
    const removeEventListenerSpy = vi.spyOn(document.body, 'removeEventListener');

    modalStackService.trackModalOpen(modal1);
    modalStackService.trackModalOpen(modal2);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modal2CloseSpy).toHaveBeenCalled();
    expect(modal1CloseSpy).toHaveBeenCalled();

    // ensure the keyup event listener is removed
    const removedKeyUpListeners = removeEventListenerSpy.mock.calls
      .filter(([type]) => type === 'keyup')
      .map(([, listener]) => listener);
    expect(removedKeyUpListeners).toContain(addEventListenerSpy.mock.calls[0][1]);
  });
});
