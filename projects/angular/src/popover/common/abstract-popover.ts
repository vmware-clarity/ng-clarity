/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewChecked,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Injector,
  NgZone,
  OnDestroy,
  Renderer2,
  SkipSelf,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { PopoverOptions } from './interfaces/popover-options.interface';
import { Point, Popover } from './popover';
import { ClrPopoverService } from './providers/popover.service';
import { Keys } from '../../utils/enums/keys.enum';
import { normalizeKey } from '../../utils/focus/key-focus/util';

/**
 * Fallback to hide when *clrIfOpen is not being used
 */
const isOffScreenClassName = 'is-off-screen';

@Directive()
export abstract class AbstractPopover implements AfterViewChecked, OnDestroy {
  /*
   * Until https://github.com/angular/angular/issues/8785 is supported, we don't have any way to instantiate
   * a separate directive on the host. So let's do dirty but performant for now.
   */
  closeOnOutsideClick = false;

  protected el: ElementRef<HTMLElement>;
  protected popoverService: ClrPopoverService;
  protected renderer: Renderer2;
  protected ngZone: NgZone;
  protected ref: ChangeDetectorRef;
  protected anchorElem: any;
  protected anchorPoint: Point;
  protected popoverPoint: Point;
  protected popoverOptions: PopoverOptions = {};
  protected ignoredElement: any;

  private updateAnchor = false;
  private popoverInstance: Popover;
  private subscription: Subscription;
  private documentESCListener: VoidFunction | null = null;

  protected constructor(
    injector: Injector,
    @SkipSelf() protected parentHost: ElementRef<HTMLElement>
  ) {
    this.el = injector.get(ElementRef);
    this.popoverService = injector.get(ClrPopoverService);
    this.renderer = injector.get(Renderer2);
    this.ngZone = injector.get(NgZone);
    this.ref = injector.get(ChangeDetectorRef);
    // Default anchor is the parent host
    this.anchorElem = parentHost.nativeElement;

    this.popoverInstance = new Popover(this.el.nativeElement);
    this.subscription = this.popoverService.openChange.pipe(startWith(this.popoverService.open)).subscribe(open => {
      if (open) {
        this.anchor();
        this.attachESCListener();
        this.renderer.removeClass(this.el.nativeElement, isOffScreenClassName);
      } else {
        this.release();
        this.detachESCListener();
        this.renderer.addClass(this.el.nativeElement, isOffScreenClassName);
      }
    });
    if (this.popoverService.open) {
      this.anchor();
      this.attachESCListener();
    }
  }

  /*
   * Fallback to hide when *clrIfOpen is not being used
   */
  @HostBinding('class.is-off-screen')
  get isOffScreen() {
    return !this.popoverService.open;
  }

  ngAfterViewChecked() {
    if (this.updateAnchor) {
      this.updateAnchor = false;
      this.popoverInstance
        .anchor(this.anchorElem, this.anchorPoint, this.popoverPoint, this.popoverOptions)
        .subscribe(() => {
          // if a scroll event is detected, close the popover
          this.popoverService.open = false;
        });
      this.attachOutsideClickListener();
    }
  }

  ngOnDestroy() {
    this.release();
    this.detachESCListener();
    this.subscription.unsubscribe();
  }

  protected anchor() {
    this.updateAnchor = true;
  }

  protected release() {
    this.detachOutsideClickListener();
    this.popoverInstance.release();
  }

  private attachESCListener(): void {
    if (this.popoverOptions.ignoreGlobalESCListener) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.documentESCListener = this.renderer.listen('document', 'keydown', event => {
        if (event && event.key) {
          if (normalizeKey(event.key) === Keys.Escape) {
            this.ngZone.run(() => {
              this.popoverService.open = false;
              this.ref.markForCheck();
            });
          }
        }
      });
    });
  }

  private detachESCListener(): void {
    if (this.documentESCListener) {
      this.documentESCListener();
      this.documentESCListener = null;
    }
  }

  private closeOnOutsideClickCallback = event => {
    // The anchor element containing the click event origin means, the click wasn't triggered outside.
    if (event.target.shadowRoot) {
      const containsNode = event.composedPath().some((element: HTMLElement) => element === this.anchorElem);

      if (containsNode) {
        return;
      }
    } else if (this.anchorElem.contains(event.target)) {
      return;
    }
    this.popoverService.open = false;
  };

  private attachOutsideClickListener() {
    if (this.closeOnOutsideClick && this.popoverService.open) {
      if (document && document.addEventListener) {
        // To listen outside click, the listener should catch the event during the capturing phase.
        // We have to do this ugly document check as Renderer2.listen doesn't allow passive/useCapture listen.
        document.addEventListener('click', this.closeOnOutsideClickCallback, true);
      }
    }
  }

  private detachOutsideClickListener() {
    if (this.closeOnOutsideClick) {
      if (document && document.removeEventListener) {
        document.removeEventListener('click', this.closeOnOutsideClickCallback, true);
      }
    }
  }
}
