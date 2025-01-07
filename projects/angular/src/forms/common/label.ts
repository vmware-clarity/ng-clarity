/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Directive({
  selector: 'label',
})
export class ClrLabel implements OnInit, OnDestroy {
  @Input('id') idInput: string;
  @HostBinding('attr.id') idAttr: string;

  @Input('for') @HostBinding('attr.for') forAttr: string;

  private enableGrid = true;
  private subscriptions: Subscription[] = [];

  constructor(
    @Optional() private controlIdService: ControlIdService,
    @Optional() private layoutService: LayoutService,
    @Optional() private ngControlService: NgControlService,
    private renderer: Renderer2,
    private el: ElementRef<HTMLLabelElement>
  ) {}

  get labelText(): string {
    return this.el.nativeElement && this.el.nativeElement.textContent;
  }

  /**
   * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
   * automatically closed once clicked inside a <label>.
   * @param event
   */
  @HostListener('click', ['$event'])
  onClick(event) {
    if (event.target.hasAttribute('clrSignpostTrigger')) {
      event.preventDefault();
    }
  }

  ngOnInit() {
    // Only add the clr-control-label if it is inside a control container
    if (this.controlIdService || this.ngControlService) {
      this.renderer.addClass(this.el.nativeElement, 'clr-control-label');
    }
    // Only set the grid column classes if we are in the right context and if they aren't already set
    if (
      this.enableGrid &&
      this.layoutService &&
      !this.layoutService.isVertical() &&
      this.el.nativeElement &&
      this.el.nativeElement.className.indexOf('clr-col') < 0
    ) {
      this.renderer.addClass(this.el.nativeElement, 'clr-col-12');
      this.renderer.addClass(this.el.nativeElement, `clr-col-md-${this.layoutService.labelSize}`);
    }
    if (this.controlIdService && !this.forAttr) {
      this.subscriptions.push(
        this.controlIdService.idChange.subscribe(id => {
          this.forAttr = id;
          this.idAttr = this.idInput || `${id}-label`;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  disableGrid() {
    this.enableGrid = false;
  }
}
