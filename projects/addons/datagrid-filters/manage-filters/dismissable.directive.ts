/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

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

  constructor(private renderer: Renderer2, private elRef: ElementRef) {}

  ngAfterViewInit() {
    const icon = this.renderer.createElement('cds-icon');
    icon.setAttribute('shape', 'window-close');
    icon.setAttribute('class', 'remove-filter');
    icon.setAttribute('role', 'button');
    icon.setAttribute('tabindex', '0');
    icon.setAttribute('aria-label', this.dismissAriaLabel);
    icon.style.margin = '1rem';
    this.renderer.setStyle(icon, 'margin-left', '0.5rem');
    this.renderer.setStyle(icon, 'margin-right', '0rem');
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
