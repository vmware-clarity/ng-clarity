/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ContentChild,
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
import { ClrSignpost } from '@clr/angular/src/popover/signpost';
import { Subscription } from 'rxjs';

import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Directive({
  selector: 'label',
  standalone: false,
})
export class ClrControlLabel implements OnInit, OnDestroy {
  @Input('id') idInput: string;
  @HostBinding('attr.id') idAttr: string;

  @Input('for') @HostBinding('attr.for') forAttr: string;

  @ContentChild(ClrSignpost, { read: ElementRef }) private signpost: ElementRef;
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

  ngOnInit() {
    // Prevent id attributes from being removed by the `undefined` host binding.
    // This happens when a `label` is used outside of a control container and other use cases.
    this.idAttr = this.idInput;

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

  /**
   * Allowing signposts inside labels to work without disabling default behavior. <label> is spreading a click event to its children so signposts get
   * automatically closed once clicked inside a <label>.
   * @param event
   */
  @HostListener('click', ['$event'])
  private onClick(event) {
    this.preventDefaultOnSignpostTarget(event);
  }

  private preventDefaultOnSignpostTarget(event) {
    if (this.signpost && this.signpost.nativeElement && this.signpost.nativeElement.contains(event.target)) {
      event.preventDefault();
    }
  }
}
