/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AnimationEvent, transition, trigger, useAnimation } from '@angular/animations';
import { Component, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';
import { defaultExpandAnimation } from '../constants';
import { BaseExpandableAnimation } from './base-expandable-animation';

@Component({
  selector: 'clr-expandable-animation',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  animations: [trigger('expandAnimation', [transition('true <=> false', [useAnimation(defaultExpandAnimation)])])],
  providers: [DomAdapter],
})
export class ClrExpandableAnimation extends BaseExpandableAnimation {
  @Input() clrExpandTrigger = false;

  constructor(element: ElementRef<HTMLElement>, domAdapter: DomAdapter, renderer: Renderer2) {
    super(element, domAdapter, renderer);
  }

  @HostBinding('@expandAnimation')
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
  }

  @HostListener('@expandAnimation.start', ['$event'])
  animationStart(event: AnimationEvent) {
    if (event.fromState !== 'void') {
      this.initAnimationEffects();
    }
  }
  @HostListener('@expandAnimation.done', ['$event'])
  animationDone(event: AnimationEvent) {
    if (event.fromState !== 'void') {
      this.cleanupAnimationEffects();
    }
  }
}
