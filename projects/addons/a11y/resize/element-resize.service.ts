/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// TODO: tganchev: better solution needed.
// eslint-disable-next-line @typescript-eslint/naming-convention
declare let ResizeObserver: any;

/**
 * Abstracts the ResizeObserver to limit its API.
 */
@Injectable({ providedIn: 'root' })
export class ElementResizeService {
  getResizeObservable(element: Element): Observable<void> {
    return new Observable<void>(subscriber => {
      const observer = new ResizeObserver(() => subscriber.next());
      observer.observe(element);
      return () => {
        observer.unobserve(element);
      };
    });
  }
}
