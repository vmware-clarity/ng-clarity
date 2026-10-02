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

// The FocusTrap constructor signature differs between CDK versions, so it is not typed here.
const DisabledFocusTrapConstructor = DisabledFocusTrap as unknown as new (...args: unknown[]) => FocusTrap;

@Injectable()
class DisabledFocusTrapFactory extends FocusTrapFactory {
  override create(): FocusTrap {
    return new DisabledFocusTrapConstructor(null, null, null, null, null);
  }
}

export const disableFocusTrapProvider: Provider = {
  provide: FocusTrapFactory,
  useClass: DisabledFocusTrapFactory,
};
