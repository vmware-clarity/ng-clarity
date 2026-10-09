/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  afterNextRender,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Injector,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ClrLoadingState, LoadingListener } from '@clr/angular/utils';

// minimum width to fit loading spinner
const MIN_BUTTON_WIDTH = 42;

@Component({
  selector: 'button[clrLoading]',
  template: `
    <span>
      @switch (state) {
        @case (buttonState.LOADING) {
          <span
            [animate.enter]="enterClass"
            animate.leave="clr-loading-btn-leave"
            class="spinner spinner-inline"
          ></span>
        }
        @case (buttonState.SUCCESS) {
          <span
            #validated
            animate.leave="clr-loading-btn-leave"
            class="spinner spinner-inline spinner-check clr-loading-btn-check"
            (animationend)="checkMarkDone()"
          ></span>
        }
        @case (buttonState.DEFAULT) {
          <span [animate.enter]="enterClass" class="clr-loading-btn-content">
            <ng-content></ng-content>
          </span>
        }
      }
    </span>
  `,
  providers: [{ provide: LoadingListener, useExisting: ClrLoadingButton }],
  host: { '[attr.disabled]': "disabled? '' : null" },
  standalone: false,
})
export class ClrLoadingButton implements LoadingListener {
  @Input('disabled') disabled: boolean;

  @Output('clrLoadingChange') clrLoadingChange = new EventEmitter<ClrLoadingState>(false);

  buttonState = ClrLoadingState;
  state: ClrLoadingState = ClrLoadingState.DEFAULT;

  /** Enter animation of the spinner and the button content: none on the first render. */
  protected enterClass = '';

  private readonly injector = inject(Injector);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    public el: ElementRef<HTMLButtonElement>,
    private renderer: Renderer2
  ) {
    afterNextRender(() => (this.enterClass = 'clr-loading-btn-enter'));
  }

  // The button goes back to its default state once the check mark animation (see `_buttons.clarity.scss`) is done,
  // or right away when it does not animate.
  @ViewChild('validated')
  protected set validatedIcon(icon: ElementRef<HTMLElement> | undefined) {
    if (icon) {
      afterNextRender(
        () => {
          if (!icon.nativeElement.getAnimations?.().length) {
            Promise.resolve().then(() => this.checkMarkDone());
          }
        },
        { injector: this.injector }
      );
    }
  }

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

  protected checkMarkDone() {
    if (this.state === ClrLoadingState.SUCCESS) {
      this.loadingStateChange(ClrLoadingState.DEFAULT);
      this.cdr.markForCheck();
    }
  }

  private setExplicitButtonWidth() {
    if (this.el.nativeElement && this.el.nativeElement.getBoundingClientRect) {
      const boundingClientRect = this.el.nativeElement.getBoundingClientRect();
      const width = Math.max(MIN_BUTTON_WIDTH, boundingClientRect.width);
      this.renderer.setStyle(this.el.nativeElement, 'width', `${width}px`);
    }
  }
}
