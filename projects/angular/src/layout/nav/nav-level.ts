/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  Input,
  OnInit,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { filter } from 'rxjs/operators';

import { ResponsiveNavigationService } from './providers/responsive-navigation.service';
import { ResponsiveNavCodes } from './responsive-nav-codes';
import { Subscription } from 'rxjs';
import { LARGE_BREAKPOINT } from '../../utils/breakpoints/breakpoints';
import { FocusTrap, FocusTrapElement } from '../../utils/focus-trap/focus-trap';
import { commonStringsDefault } from '../../utils';
import '@cds/core/internal-components/close-button/register.js';

const createCdsCloseButton = (document: Document, ariaLabel: string) => {
  const cdsCloseButton = document.createElement('cds-internal-close-button');
  cdsCloseButton.setAttribute('icon-size', '32');
  console.log(ariaLabel);
  cdsCloseButton.setAttribute('aria-label', ariaLabel);
  cdsCloseButton.setAttribute('aria-hidden', 'true');
  cdsCloseButton.setAttribute('type', 'button');
  /**
   * The button is hidden by default based on our Desktop-first approach.
   */
  cdsCloseButton.setAttribute('hidden', 'true');
  cdsCloseButton.className = 'clr-nav-close';
  return cdsCloseButton;
};

@Directive({ selector: '[clr-nav-level]' })
export class ClrNavLevel extends FocusTrap implements OnInit {
  @Input('clr-nav-level') _level: number;
  @Input('closeAriaLabel')
  closeButtonAriaLabel: string;

  private _subscription: Subscription;

  private _isOpen = false;

  constructor(
    @Inject(PLATFORM_ID) platformId: any,
    private responsiveNavService: ResponsiveNavigationService,
    private elementRef: ElementRef<FocusTrapElement>,
    renderer: Renderer2,
    injector: Injector
  ) {
    super(renderer, injector, platformId, elementRef.nativeElement);

    if (isPlatformBrowser(platformId)) {
      this._document = injector.get(DOCUMENT);
    }

    this._subscription = responsiveNavService.navControl
      .pipe(
        filter(x => x.navLevel === this.level),
        filter(
          ({ controlCode }) =>
            (controlCode === ResponsiveNavCodes.NAV_OPEN && !this.isOpen) ||
            (controlCode === ResponsiveNavCodes.NAV_CLOSE && this.isOpen)
        )
      )
      .subscribe(({ controlCode }) => {
        if (controlCode === ResponsiveNavCodes.NAV_OPEN) {
          this.open();
          return;
        }

        this.close();
      });

    this._subscription.add(
      responsiveNavService.navControl
        .pipe(filter(({ controlCode }) => controlCode === ResponsiveNavCodes.NAV_CLOSE_ALL))
        .subscribe(() => this.close())
    );
  }

  ngOnInit() {
    if (!this.closeButtonAriaLabel) {
      this.closeButtonAriaLabel =
        this._level === ResponsiveNavCodes.NAV_LEVEL_1
          ? commonStringsDefault.responsiveNavToggleClose
          : commonStringsDefault.responsiveNavOverflowClose;
    }

    if (this.level !== ResponsiveNavCodes.NAV_LEVEL_1 && this.level !== ResponsiveNavCodes.NAV_LEVEL_2) {
      console.error('Nav Level can only be 1 or 2');
      return;
    }
    this.responsiveNavService.registerNav(this.level);
    this.addNavClass(this.level);
  }

  ngAfterViewInit() {
    const closeButton = createCdsCloseButton(this._document, this.closeButtonAriaLabel);
    this.renderer.listen(closeButton, 'click', this.close.bind(this));
    this.renderer.insertBefore(this.elementRef.nativeElement, closeButton, this.elementRef.nativeElement.firstChild); // Adding the button at the top of the nav

    if (this._document.body.clientWidth < LARGE_BREAKPOINT) {
      /**
       * Close if the document body is smaller than the large breakpoint for example:
       * - Refreshing the page
       * - Browser window size is changed when opening the applicaiton
       * - Browser zoom is turned on and zoomed to a size that makes the document smaller than the large breakpoint
       */
      this.close();
    }
  }

  addNavClass(level: number) {
    const navHostClassList = this.elementRef.nativeElement.classList;
    if (level === ResponsiveNavCodes.NAV_LEVEL_1) {
      navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_1);
    } else if (level === ResponsiveNavCodes.NAV_LEVEL_2) {
      navHostClassList.add(ResponsiveNavCodes.NAV_CLASS_LEVEL_2);
    }
  }

  get level(): number {
    return this._level;
  }

  // getter to access the responsive navigation codes from the template
  get responsiveNavCodes(): ResponsiveNavCodes {
    return ResponsiveNavCodes;
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const target = event.target as Window;

    if (target.innerWidth < LARGE_BREAKPOINT && this.isOpen) {
      this.close();
      return;
    }

    this.showNavigation();
  }

  open(): void {
    this._isOpen = true;
    this.showNavigation();
    this.enableFocusTrap();
    this.showCloseButton();
    this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_OPEN, this.level);
  }

  close(): void {
    this._isOpen = false;
    this.hideNavigation();
    this.removeFocusTrap();
    this.hideCloseButton();
    this.responsiveNavService.sendControlMessage(ResponsiveNavCodes.NAV_CLOSE, this.level);
  }

  // TODO: Figure out whats the best way to do this. Possible methods
  // 1. HostListener (current solution)
  // 2. Directives on the .nav-link class. We discussed on moving away from class selectors but I forget the reason
  // why
  @HostListener('click', ['$event.target'])
  onMouseClick(target: any) {
    let current: any = target; // Get the element in the DOM on which the mouse was clicked
    const navHost: any = this.elementRef.nativeElement; // Get the current nav native HTML element

    // Start checking if current and navHost are equal.
    // If not traverse to the parentNode and check again.
    while (current) {
      if (current === navHost) {
        return;
      } else if (current.classList.contains('nav-link')) {
        this.close();
        return;
      }
      current = current.parentNode;
    }
  }

  protected hideNavigation() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
    this.renderer.setAttribute(this.elementRef.nativeElement, 'hidden', 'true');
  }

  protected showNavigation() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'false');
    this.renderer.removeAttribute(this.elementRef.nativeElement, 'hidden');
  }

  protected hideCloseButton() {
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-hidden', 'true');
    this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden', 'true');
  }

  protected showCloseButton() {
    this.renderer.setAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'aria-hidden', 'false');
    this.renderer.removeAttribute(this.elementRef.nativeElement.querySelector('.clr-nav-close'), 'hidden');
  }

  ngOnDestroy() {
    this.responsiveNavService.unregisterNav(this.level);
    this._subscription.unsubscribe();
  }
}
