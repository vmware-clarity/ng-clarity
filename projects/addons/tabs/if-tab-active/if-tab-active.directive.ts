/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  EventEmitter,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  Self,
} from '@angular/core';
import { ClrTab } from '@clr/angular/layout/tabs';
import { Subscription } from 'rxjs';

/**
 * Detects when an active tab changes and emits a notification.
 * Optionally applies a CSS class to the active tab link element.
 *
 * Note: this directive peers into Clarity tab internals and requires maintenance
 * if Clarity changes its internal structure.
 */
@Directive({
  selector: '[appfxIfTabActive]',
  standalone: false,
})
export class IfTabActiveDirective implements OnInit, OnDestroy {
  @Output() appfxIfTabActiveChange: EventEmitter<boolean> = new EventEmitter();

  @Input() activeClass: string;

  private subscription: Subscription;

  constructor(
    @Host() @Self() public tab: ClrTab,
    private renderer: Renderer2
  ) {}

  /** Programmatically activate the tab when set to true. */
  @Input()
  set activateTab(value: boolean) {
    if (value && this.tab.ifActiveService.current !== this.tab.id) {
      this.tab.ifActiveService.current = this.tab.id;
    }
  }

  ngOnInit() {
    this.subscription = this.tab.ifActiveService.currentChange.subscribe(() => {
      if (this.activeClass) {
        try {
          if (this.tab.active) {
            this.renderer.addClass(this.getTabLinkElement().nativeElement, this.activeClass);
          } else {
            this.renderer.removeClass(this.getTabLinkElement().nativeElement, this.activeClass);
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          console.error('Clarity library unable to provide `elementRef` on tabLink');
        }
      }
      this.appfxIfTabActiveChange.emit(this.tab.active);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /** Accesses the underlying tab link element via Clarity internals. */
  private getTabLinkElement(): ElementRef {
    return this.tab.tabLink['el'];
  }
}
