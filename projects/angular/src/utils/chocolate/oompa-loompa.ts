/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentChecked, ChangeDetectorRef, Directive } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../destroy';
import { WillyWonka } from './willy-wonka';

@Directive()
export abstract class OompaLoompa implements AfterContentChecked {
  // FIXME: Request Injector once we move to Angular 4.2+, it'll allow easier refactors
  constructor(cdr: ChangeDetectorRef, willyWonka: WillyWonka, destroy$: ClrDestroyService) {
    willyWonka.chocolate.pipe(takeUntil(destroy$)).subscribe(() => {
      if (this.latestFlavor !== this.flavor) {
        willyWonka.disableChocolateCheck = true;
        cdr.detectChanges();
        willyWonka.disableChocolateCheck = false;
      }
    });
  }

  private latestFlavor: any;

  abstract get flavor(): any;

  ngAfterContentChecked() {
    this.latestFlavor = this.flavor;
  }
}
