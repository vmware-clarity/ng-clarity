/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * @description
 *
 * Developers should explicitly add this service to providers; it then can be injected
 * into a constructor and used as a notifier for the `takeUntil` operator. This eliminates
 * the need for boilerplates with subscriptions, and we don't need to implement the `OnDestroy`
 * interface and teardown subscriptions there.
 *
 * This can be used as follows:
 * ```ts
 * @Component({
 *   selector: 'my-component',
 *   templateUrl: 'my-component.html',
 *   providers: [ClrDestroyService],
 * })
 * export class MyComponent implements OnInit {
 *   constructor(private source: MySourceService, private destroy$: ClrDestroyService) {}
 *
 *   ngOnInit() {
 *     this.source.changes.pipe(takeUntil(this.destroy$)).subscribe(change => this.handle(change));
 *   }
 * }
 * ```
 */
@Injectable()
export class ClrDestroyService extends Subject<void> implements OnDestroy {
  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
