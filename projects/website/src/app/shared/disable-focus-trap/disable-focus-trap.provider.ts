/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FocusTrap, FocusTrapFactory } from '@angular/cdk/a11y';
import { Injectable, Provider } from '@angular/core';

class DisabledFocusTrap extends FocusTrap {
  override get enabled() {
    return false;
  }
  override set enabled(value: boolean) {
    // do nothing
  }

  override attachAnchors(): boolean {
    return false;
  }

  override focusInitialElementWhenReady(): Promise<boolean> {
    return Promise.resolve(false);
  }

  override focusFirstTabbableElementWhenReady(): Promise<boolean> {
    return Promise.resolve(false);
  }

  override focusLastTabbableElementWhenReady(): Promise<boolean> {
    return Promise.resolve(false);
  }
}

@Injectable()
class DisabledFocusTrapFactory extends FocusTrapFactory {
  override create(): FocusTrap {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new DisabledFocusTrap(null!, null!, null!, null!, null!);
  }
}

export const disableFocusTrapProvider: Provider = {
  provide: FocusTrapFactory,
  useClass: DisabledFocusTrapFactory,
};
