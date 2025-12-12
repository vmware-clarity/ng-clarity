/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementResizeService } from './element-resize.service';

describe('ElementResizeService', () => {
  const service = new ElementResizeService();

  it('#getResizeObservable() returns a new observable object', () => {
    const element = document.createElement('div');
    const resizeObservable = service.getResizeObservable(element);

    expect(resizeObservable).toBeDefined();
    expect(resizeObservable.subscribe).toBeDefined();
  });

  it('#getResizeObservable() returns an observable that reacts to element resizing', done => {
    const element = document.createElement('div');

    const resizeObservable = service.getResizeObservable(element);

    let resizeTriggered = false;

    resizeObservable.subscribe({
      next: () => {
        resizeTriggered = true;
      },
    });

    // Simulate an element resize event
    const triggerResizeEvent = () => {
      const resizeEvent = new Event('resize');
      element.dispatchEvent(resizeEvent);
    };

    // Use requestAnimationFrame twice to handle the resize event asynchronously
    // This helps to ensure the event is processed before making assertions
    requestAnimationFrame(() => {
      triggerResizeEvent(); // Simulate a resize event
      requestAnimationFrame(() => {
        expect(resizeTriggered).toBe(true);
        done();
      });
    });
  });

  it('#getResizeObservable() handles invalid element gracefully', done => {
    const resizeObservable = service.getResizeObservable(undefined as any);

    resizeObservable.subscribe({
      error: (err: unknown) => {
        expect(err).toEqual(
          new TypeError("Failed to execute 'observe' on 'ResizeObserver': parameter 1 is not of type 'Element'.")
        );
        done();
      },
    });
  });
});
