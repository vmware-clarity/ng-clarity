/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, InjectionToken, Injector, Type, ViewContainerRef } from '@angular/core';

import { EmptyAnchor } from './empty-anchor';

/**
 * HostWrapper must be called in OnInit to ensure that the Views are ready. If its called in a constructor the view is
 * still undefined.
 * TODO - make sure these comment annotations do not break ng-packgr.
 */
export class HostWrapper<W> implements Injector {
  private injector: Injector;

  constructor(containerType: Type<W>, vcr: ViewContainerRef, index = 0) {
    this.injector = vcr.injector;
    // If the host is already wrapped, we don't do anything
    if (!this.injector.get(containerType, null)) {
      const el = this.injector.get(ElementRef);

      // We need a new anchor, since we're projecting the current one.
      vcr.createComponent(EmptyAnchor);
      // Craft the element array based on what slot to use. Angular only uses the index to determine
      // which ng-content to project into, so if you have more than one ng-content you'll need to set
      // the index in the constructor appropriately
      const element = [];
      element[index] = [el.nativeElement];
      // We're assuming only one projection slot, but in more complex cases we might want to provide
      // a different array of projected elements.
      const containerRef = vcr.createComponent(containerType, {
        projectableNodes: element,
      });
      // We can now remove the useless anchor
      vcr.remove(0);

      // We keep the wrapper's injector to access the dependencies that weren't available before.
      this.injector = containerRef.injector;
    }
  }

  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
    return this.injector.get(token, notFoundValue);
  }
}
