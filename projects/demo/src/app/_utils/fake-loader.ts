/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, inject, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { ClrLoading, ClrLoadingState } from '@clr/angular';

const LATENCY = 2000;

@Directive({
  selector: '[clrFakeLoader]',
  standalone: false,
})
export class FakeLoader implements OnInit {
  @Input('clrFakeLoader') fake: boolean;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor(
    private template: TemplateRef<any>,
    private container: ViewContainerRef,
    private loading: ClrLoading
  ) {}

  ngOnInit() {
    if (this.fake) {
      this.loading.loadingState = ClrLoadingState.LOADING;
      setTimeout(() => {
        this.load();
        this.loading.loadingState = ClrLoadingState.DEFAULT;
        this.changeDetectorRef.markForCheck();
      }, LATENCY);
    } else {
      this.load();
    }
  }

  private load() {
    this.container.createEmbeddedView(this.template);
  }
}
