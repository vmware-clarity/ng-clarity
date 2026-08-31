/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, ChangeDetectorRef, Component, Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class DropdownDestroySubtreeCounter {
  created = 0;
  destroyed = 0;
  private nextId = 1;

  get live(): number {
    return this.created - this.destroyed;
  }

  register(): number {
    this.created++;
    return this.nextId++;
  }

  unregister() {
    this.destroyed++;
  }
}

@Component({
  selector: 'clr-dropdown-destroy-subtree-leaf-demo',
  template: `Leaf #{{ id }} mounted`,
  standalone: false,
})
export class DropdownDestroySubtreeLeafDemo implements OnDestroy {
  id = this.counter.register();
  private heartbeat = setInterval(() => {
    console.log(`[leaf #${this.id}] still alive — ngOnDestroy has NOT run`);
  }, 1000);

  constructor(private counter: DropdownDestroySubtreeCounter) {}

  ngOnDestroy() {
    clearInterval(this.heartbeat);
    this.counter.unregister();
    console.log(`[leaf #${this.id}] destroyed cleanly`);
  }
}

/*
 * Reproduction for https://github.com/vmware-clarity/ng-clarity/issues/2537 :
 * destroying a view that contains an open clr-dropdown popover used to skip the ngOnDestroy
 * of sibling views coming after the dropdown, because ClrIfOpen re-entrantly cleared its
 * container while Angular's destroy walk was still standing on it.
 */
@Component({
  selector: 'clr-dropdown-angular-destroy-subtree-demo',
  templateUrl: './dropdown-angular-destroy-subtree.demo.html',
  styleUrls: ['./dropdown.demo.scss'],
  providers: [DropdownDestroySubtreeCounter],
  standalone: false,
})
export class DropdownAngularDestroySubtreeDemo implements AfterViewInit {
  showSubtree = true;

  constructor(
    public counter: DropdownDestroySubtreeCounter,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * neutral while the leaf is expected to be live, success once it has been destroyed cleanly,
   * and danger if the subtree was destroyed but the leaf is still alive (a memory leak).
   */
  get alertType(): 'neutral' | 'success' | 'danger' {
    if (this.showSubtree) {
      return 'neutral';
    }
    return this.counter.live > 0 ? 'danger' : 'success';
  }

  get statusText(): string {
    if (this.showSubtree) {
      return 'leaf is live, not destroyed yet';
    }
    return this.counter.live > 0
      ? 'memory leak! the subtree was destroyed but the leaf is still alive'
      : 'leaf destroyed properly, no leak';
  }

  ngAfterViewInit() {
    // The initial mount has the same ordering hazard as destroySubtree()/reset() below: the
    // leaf created by the @if block registers with the counter after the alert's bindings for
    // that same first pass already read it. Settle it the same way.
    this.forceSync();
  }

  destroySubtree() {
    this.showSubtree = false;
    this.forceSync();
  }

  reset() {
    if (this.showSubtree) {
      // Already live: flipping straight back to true would be a same-tick no-op, since
      // Angular's change detector never gets a chance to tear down the existing view in between.
      // Force that teardown synchronously before remounting a fresh leaf.
      this.destroySubtree();
    }
    this.showSubtree = true;
    this.forceSync();
  }

  /**
   * The counters live in a shared service that the leaf mutates from its own constructor/
   * ngOnDestroy, while this component's `@if` block and the alert reading those counters are
   * checked in one top-to-bottom pass. A single detectChanges() would render the alert with
   * whatever the counter held *before* the leaf's create/destroy runs later in that same pass —
   * and by the time Angular's own automatic tick verifies nothing changed after checking, it
   * finds the (by-then-updated) counter disagrees, throwing NG0100 and leaving the DOM stuck on
   * that stale render. Setting markForCheck() first fixes this: the first acction lets the leaf's
   * create/destroy happen and mutate the counter; the second re-renders the alert with the settled
   * value, so nothing changes afterward and no verification mismatch occurs.
   */
  private forceSync() {
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
