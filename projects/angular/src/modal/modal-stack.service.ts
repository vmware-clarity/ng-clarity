/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { Keys } from '../utils/enums/keys.enum';
import { normalizeKey } from '../utils/focus/key-focus/util';

export interface Closable {
  close(): void;
}

@Injectable({ providedIn: 'root' })
export class ModalStackService {
  private readonly modalStack: Closable[] = [];
  private readonly keyUpEventListener = this.onKeyUp.bind(this);

  constructor(@Inject(PLATFORM_ID) private readonly platformId: unknown) {}

  trackModalOpen(openedModal: Closable) {
    if (this.modalStack.includes(openedModal) === false) {
      this.modalStack.unshift(openedModal);
    }

    if (isPlatformBrowser(this.platformId)) {
      document.body.addEventListener('keyup', this.keyUpEventListener);
    }
  }

  trackModalClose(closedModal: Closable) {
    const closedModalIndex = this.modalStack.indexOf(closedModal);

    if (closedModalIndex > -1) {
      this.modalStack.splice(closedModalIndex, 1);
    }

    if (this.modalStack.length === 0 && isPlatformBrowser(this.platformId)) {
      document.body.removeEventListener('keyup', this.keyUpEventListener);
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    if (this.modalStack.length && normalizeKey(event.key) === Keys.Escape) {
      this.modalStack[0].close();
    }
  }
}
