/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, AnimationEvent, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostBinding, HostListener, Input, Renderer2 } from '@angular/core';

import { DomAdapter } from '../../dom-adapter/dom-adapter';

@Component({
  selector: 'clr-expandable-animation',
  template: `<ng-content></ng-content>`,
  styles: [
    `
      :host {
        display: block;
        overflow: hidden;
      }
    `,
  ],
  animations: [
    trigger('expandAnimation', [
      transition('true <=> false', [
        style({ height: '{{startHeight}}px' }),
        animate('0.2s ease-in-out', style({ height: '*' })),
      ]),
    ]),
  ],
  providers: [DomAdapter],
})
export class ClrExpandableAnimation {
  @Input() clrExpandTrigger = false;

  startHeight = 0;

  constructor(private element: ElementRef, private domAdapter: DomAdapter, private renderer: Renderer2) {}

  @HostBinding('@expandAnimation')
  get expandAnimation() {
    return { value: this.clrExpandTrigger, params: { startHeight: this.startHeight } };
  }

  @HostListener('@expandAnimation.start', ['$event'])
  animationStart(event: AnimationEvent) {
    if (event.fromState !== 'void') {
      this.renderer.setStyle(this.element.nativeElement, 'overflow', 'hidden');
    }
  }
  @HostListener('@expandAnimation.done', ['$event'])
  animationDone(event: AnimationEvent) {
    if (event.fromState !== 'void') {
      this.renderer.removeStyle(this.element.nativeElement, 'overflow');

      // A "safe" auto-update of the height ensuring basic OOTB user experience .
      // Prone to small jumps in initial animation height if data was changed in the meantime, window was resized, etc.
      // For optimal behavior call manually updateStartHeight() from the parent component before initiating the update.
      this.updateStartHeight();
    }
  }

  updateStartHeight() {
    this.startHeight = this.domAdapter.computedHeight(this.element.nativeElement) || 0;
  }
}
