/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, HostBinding, Input, OnInit, Optional, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { ControlIdService } from './providers/control-id.service';
import { LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Directive({ selector: 'label', providers: [ClrDestroyService] })
export class ClrLabel implements OnInit {
  constructor(
    @Optional() private controlIdService: ControlIdService,
    @Optional() private layoutService: LayoutService,
    @Optional() private ngControlService: NgControlService,
    private renderer: Renderer2,
    private el: ElementRef<HTMLElement>,
    private destroy$: ClrDestroyService
  ) {}

  @HostBinding('attr.for')
  @Input('for')
  forAttr: string;

  private enableGrid = true;

  get labelText(): string {
    return this.el.nativeElement && this.el.nativeElement.textContent;
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
      this.controlIdService.idChange.pipe(takeUntil(this.destroy$)).subscribe(id => (this.forAttr = id));
    }
  }

  disableGrid() {
    this.enableGrid = false;
  }
}
