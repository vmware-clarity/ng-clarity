/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { firstValueFrom } from 'rxjs';

import { ElementResizeService } from './element-resize.service';
import { errorLike } from '../../../test-matchers';

describe('ElementResizeService', () => {
  const service = new ElementResizeService();

  it('#getResizeObservable() returns a new observable object', () => {
    const element = document.createElement('div');
    const resizeObservable = service.getResizeObservable(element);

    expect(resizeObservable).toBeDefined();
    expect(resizeObservable.subscribe).toBeDefined();
  });

  it('#getResizeObservable() returns an observable that reacts to element resizing', async () => {
    const element = document.createElement('div');
    element.style.width = '100px';
    document.body.append(element);
    let resizeCount = 0;
    const subscription = service.getResizeObservable(element).subscribe(() => resizeCount++);
    try {
      await vi.waitFor(() => expect(resizeCount).toBe(1));
      element.style.width = '200px';
      await vi.waitFor(() => expect(resizeCount).toBe(2));
    } finally {
      subscription.unsubscribe();
      element.remove();
    }
  });

  it('#getResizeObservable() handles invalid element gracefully', async () => {
    const observer = new ResizeObserver(() => {});
    let nativeMessage: string | undefined;
    try {
      observer.observe(undefined as any);
    } catch (error) {
      nativeMessage = (error as Error).message;
    } finally {
      observer.disconnect();
    }
    expect(nativeMessage).toBeDefined();
    await expect(firstValueFrom(service.getResizeObservable(undefined as any))).rejects.toThrowError(
      errorLike(nativeMessage)
    );
  });
});
