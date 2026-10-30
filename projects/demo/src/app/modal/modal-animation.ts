/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

@Component({
  selector: 'clr-modal-animation-demo',
  templateUrl: './modal-animation.demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ModalAnimationDemo implements OnInit {
  readonly animatedExampleIn = signal(false);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    // If you want interactivity, go to the Angular component demo. :-P
    const interval = setInterval(() => this.animatedExampleIn.update(visible => !visible), 2000);
    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}
