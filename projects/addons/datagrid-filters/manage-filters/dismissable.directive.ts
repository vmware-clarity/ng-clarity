/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  createComponent,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Injector,
  Input,
  Output,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { ClrIcon } from '@clr/angular/icon';

const enterKey = 'Enter';
const spaceKey = 'Space';

/**
 * Directive which renders a clickable "X" on the right side of a Clarity label badge.
 * A "close" event is emitted when the "X" is clicked.
 * The directive is needed in order to be able to remove filtering criteria,
 * which are displayed in Clarity label badges.
 */
@Directive({
  selector: '[dismissable]',
  standalone: false,
})
export class DismissableDirective implements AfterViewInit {
  @Input() dismissAriaLabel: string;
  @Output() dismiss = new EventEmitter();

  constructor(
    private renderer: Renderer2,
    private elRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private environmentInjector: EnvironmentInjector,
    private injector: Injector
  ) {}

  ngAfterViewInit() {
    // `cds-icon` is an Angular component (ClrIcon), so it has to be created through Angular
    // instead of as a plain DOM element, otherwise the icon SVG is never rendered.
    // Inserting the host view into the view container ties its lifecycle and change detection
    // to the host view; the rendered element is then moved inside the badge.
    const iconRef = createComponent(ClrIcon, {
      hostElement: this.renderer.createElement('cds-icon'),
      environmentInjector: this.environmentInjector,
      elementInjector: this.injector,
    });
    iconRef.setInput('shape', 'window-close');
    this.viewContainerRef.insert(iconRef.hostView);

    const icon: HTMLElement = iconRef.location.nativeElement;
    this.renderer.addClass(icon, 'remove-filter');
    this.renderer.setAttribute(icon, 'role', 'button');
    this.renderer.setAttribute(icon, 'tabindex', '0');
    this.renderer.setAttribute(icon, 'aria-label', this.dismissAriaLabel);
    this.renderer.setStyle(icon, 'margin-left', 'var(--clr-base-gap-s)');
    this.renderer.setStyle(icon, 'cursor', 'pointer');
    this.renderer.appendChild(this.elRef.nativeElement, icon);
    this.renderer.listen(icon, 'click', () => {
      this.dismiss.emit();
      return true;
    });
    this.renderer.listen(icon, 'keydown', (event: KeyboardEvent) => {
      if (event.key === enterKey || event.key === spaceKey) {
        this.dismiss.emit();
      }
      return true;
    });
  }
}
