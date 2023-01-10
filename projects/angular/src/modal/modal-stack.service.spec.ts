/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Closable, ModalStackService } from './modal-stack.service';

const PLATFORM_BROWSER_ID = 'browser';

describe('ModalStackService', () => {
  let modalStackService: ModalStackService;

  beforeEach(() => {
    modalStackService = new ModalStackService(PLATFORM_BROWSER_ID);
  });

  it('should close the open modal when the escape key is pressed', () => {
    const modal: Closable = {
      close() {
        modalStackService.trackModalClose(this);
      },
    };

    const modalCloseSpy = spyOn(modal, 'close').and.callThrough();
    const removeEventListenerSpy = spyOn(document.body, 'removeEventListener').and.callThrough();

    modalStackService.trackModalOpen(modal);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modalCloseSpy).toHaveBeenCalled();

    // ensure the keyup event listener is removed
    expect(removeEventListenerSpy).toHaveBeenCalled();
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

    const modal1CloseSpy = spyOn(modal1, 'close').and.callThrough();
    const modal2CloseSpy = spyOn(modal2, 'close').and.callThrough();
    const removeEventListenerSpy = spyOn(document.body, 'removeEventListener').and.callThrough();

    modalStackService.trackModalOpen(modal1);
    modalStackService.trackModalOpen(modal2);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modal2CloseSpy).toHaveBeenCalled();
    expect(modal1CloseSpy).not.toHaveBeenCalled();

    // ensure the keyup event listener is not removed (there is still an open modal)
    expect(removeEventListenerSpy).not.toHaveBeenCalled();
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

    const modal1CloseSpy = spyOn(modal1, 'close').and.callThrough();
    const modal2CloseSpy = spyOn(modal2, 'close').and.callThrough();
    const removeEventListenerSpy = spyOn(document.body, 'removeEventListener').and.callThrough();

    modalStackService.trackModalOpen(modal1);
    modalStackService.trackModalOpen(modal2);
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));
    document.body.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape' }));

    expect(modal2CloseSpy).toHaveBeenCalled();
    expect(modal1CloseSpy).toHaveBeenCalled();

    // ensure the keyup event listener is removed
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
