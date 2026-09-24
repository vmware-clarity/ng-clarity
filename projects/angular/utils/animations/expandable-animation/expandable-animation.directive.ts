/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Optional,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { BaseExpandableAnimation } from './base-expandable-animation';
import { DomAdapter } from '../../dom-adapter/dom-adapter';

/** Never provided: stands for the `AnimationBuilder` the directive used to be injected with. */
const UNUSED_ANIMATION_BUILDER = new InjectionToken<unknown>('UNUSED_ANIMATION_BUILDER');

@Directive({
  selector: '[clrExpandableAnimation]',
  providers: [DomAdapter],
  host: {
    '[class.clr-expandable-animation]': 'true',
  },
  standalone: false,
})
export class ClrExpandableAnimationDirective extends BaseExpandableAnimation implements OnChanges {
  @Input('clrExpandableAnimation') expanded = false;

  /**
   * @param _builder Deprecated and ignored: the height is no longer animated with Angular animations. Kept so that
   * subclasses passing an `AnimationBuilder` still compile.
   */
  constructor(
    element: ElementRef<HTMLElement>,
    domAdapter: DomAdapter,
    renderer: Renderer2,
    @Optional() @Inject(UNUSED_ANIMATION_BUILDER) _builder?: unknown
  ) {
    super(element, domAdapter, renderer);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expanded'] && !changes['expanded'].firstChange) {
      this.scheduleAnimation();
    }
  }
}
