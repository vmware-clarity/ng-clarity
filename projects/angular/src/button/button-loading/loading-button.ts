/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

import { ClrLoadingState } from '../../utils/loading/loading';
import { LoadingListener } from '../../utils/loading/loading-listener';

// minimum width to fit loading spinner
const MIN_BUTTON_WIDTH = 42;

@Component({
  selector: 'button[clrLoading]',
  template: `
    <span @parent [ngSwitch]="state">
      <ng-container *ngSwitchCase="buttonState.LOADING">
        <span @spinner class="spinner spinner-inline"></span>
      </ng-container>
      <ng-container *ngSwitchCase="buttonState.SUCCESS">
        <span
          @validated
          (@validated.done)="this.loadingStateChange(this.buttonState.DEFAULT)"
          class="spinner spinner-inline spinner-check"
        ></span>
      </ng-container>
      <span *ngSwitchCase="buttonState.DEFAULT" @defaultButton class="clr-loading-btn-content">
        <ng-content></ng-content>
      </span>
    </span>
  `,
  providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }],
  animations: [
    trigger('parent', [
      // Skip :enter animation on first render.
      // The button text/content should only be faded when transitioning to or from a non-default state.
      transition(':enter', []),
    ]),
    trigger('defaultButton', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
      // TODO: see if we can get leave animation to work before spinner's enter animation
      transition(':leave', [style({ opacity: 0 })]),
    ]),
    trigger('spinner', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms 100ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('validated', [
      transition(':enter', [
        animate(
          '600ms',
          keyframes([
            style({ transform: 'scale(0,0)', offset: 0 }),
            style({ opacity: 1, offset: 0.2 }),
            style({ transform: 'scale(1.2,1.2)', offset: 0.4 }),
            style({ transform: 'scale(.9,.9)', offset: 0.6 }),
            style({ transform: 'scale(1,1)', offset: 1 }),
          ])
        ),
      ]),
      transition(':leave', [style({ opacity: 1 }), animate('100ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  host: { '[attr.disabled]': "disabled? '' : null" },
})
export class ClrLoadingButton implements LoadingListener {
  @Input('disabled') disabled: boolean;

  @Output('clrLoadingChange') clrLoadingChange = new EventEmitter<ClrLoadingState>(false);

  buttonState = ClrLoadingState;
  state: ClrLoadingState = ClrLoadingState.DEFAULT;

  constructor(public el: ElementRef, private renderer: Renderer2) {}

  loadingStateChange(state: ClrLoadingState): void {
    if (state === this.state) {
      return;
    }
    this.state = state;

    switch (state) {
      case ClrLoadingState.DEFAULT:
        this.renderer.removeStyle(this.el.nativeElement, 'width');
        this.renderer.removeStyle(this.el.nativeElement, 'transform'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
        if (!this.disabled) {
          this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
        }
        break;
      case ClrLoadingState.LOADING:
        this.setExplicitButtonWidth();
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translatez(0)'); // for chromium render bug see issue https://github.com/vmware/clarity/issues/2700
        this.renderer.setAttribute(this.el.nativeElement, 'disabled', '');
        break;
      case ClrLoadingState.SUCCESS:
        this.setExplicitButtonWidth();
        break;
      case ClrLoadingState.ERROR:
        this.loadingStateChange(ClrLoadingState.DEFAULT);
        break;
      default:
        break;
    }
    this.clrLoadingChange.emit(state);
  }

  private setExplicitButtonWidth() {
    if (this.el.nativeElement && this.el.nativeElement.getBoundingClientRect) {
      const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
      const width = Math.max(MIN_BUTTON_WIDTH, boundingClientRect.width);
      this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
    }
  }
}
