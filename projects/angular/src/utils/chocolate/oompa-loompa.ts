/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentChecked, ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { WillyWonka } from './willy-wonka';

@Directive()
export abstract class OompaLoompa implements AfterContentChecked, OnDestroy {
  private latestFlavor: any;
  private subscription: Subscription;

  // FIXME: Request Injector once we move to Angular 4.2+, it'll allow easier refactors
  protected constructor(cdr: ChangeDetectorRef, willyWonka: WillyWonka) {
    this.subscription = willyWonka.chocolate.subscribe(() => {
      if (this.latestFlavor !== this.flavor) {
        willyWonka.disableChocolateCheck = true;
        cdr.detectChanges();
        willyWonka.disableChocolateCheck = false;
      }
    });
  }

  abstract get flavor(): any;

  ngAfterContentChecked() {
    this.latestFlavor = this.flavor;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
