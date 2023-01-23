/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, HostListener, Inject, Injector, Input, OnInit, Optional } from '@angular/core';

import { assertNever } from '../../utils/assert/assert.helpers';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { AbstractPopover } from '../common/abstract-popover';
import { Point } from '../common/popover';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';

const POSITIONS = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'] as const;
type Position = typeof POSITIONS[number];

const SIZES = ['xs', 'sm', 'md', 'lg'];

const defaultPosition = 'right';
const defaultSize = 'sm';

@Component({
  selector: 'clr-tooltip-content',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.tooltip-content]': 'true',
    '[style.opacity]': '1',
    '[attr.role]': '"tooltip"',
    '[id]': 'id',
  },
})
export class ClrTooltipContent extends AbstractPopover implements OnInit {
  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef,
    private tooltipIdService: TooltipIdService,
    private tooltipMouseService: TooltipMouseService
  ) {
    super(injector, parentHost);

    if (!parentHost) {
      throw new Error('clr-tooltip-content should only be used inside of a clr-tooltip');
    }

    // Set the default id in case consumer does not supply a custom id.
    this.id = uniqueIdFactory();
  }

  get id(): string {
    return this._id;
  }

  @Input()
  set id(value: string) {
    const id = value || '';

    this._id = id;
    this.tooltipIdService.updateId(id);
  }
  private _id: string;

  private _position: string;

  get position() {
    return this._position;
  }

  @Input('clrPosition')
  set position(value: string) {
    const oldPosition = this._position;
    const newPosition = POSITIONS.includes(value as any) ? (value as Position) : defaultPosition;

    this._position = newPosition;
    this.updateCssClass({ oldClass: `tooltip-${oldPosition}`, newClass: `tooltip-${newPosition}` });

    // set the popover values based on direction
    switch (newPosition) {
      case 'top-right':
        this.anchorPoint = Point.TOP_CENTER;
        this.popoverPoint = Point.LEFT_BOTTOM;
        break;
      case 'top-left':
        this.anchorPoint = Point.TOP_CENTER;
        this.popoverPoint = Point.RIGHT_BOTTOM;
        break;
      case 'bottom-right':
        this.anchorPoint = Point.BOTTOM_CENTER;
        this.popoverPoint = Point.LEFT_TOP;
        break;
      case 'bottom-left':
        this.anchorPoint = Point.BOTTOM_CENTER;
        this.popoverPoint = Point.RIGHT_TOP;
        break;
      case 'right':
        this.anchorPoint = Point.RIGHT_CENTER;
        this.popoverPoint = Point.LEFT_TOP;
        break;
      case 'left':
        this.anchorPoint = Point.LEFT_CENTER;
        this.popoverPoint = Point.RIGHT_TOP;
        break;
      default:
        assertNever(newPosition);
    }
  }

  private _size: string;

  get size() {
    return this._size;
  }

  @Input('clrSize')
  set size(value: string) {
    const oldSize = this._size;
    const newSize = SIZES.includes(value) ? value : defaultSize;

    this._size = newSize;
    this.updateCssClass({ oldClass: `tooltip-${oldSize}`, newClass: `tooltip-${newSize}` });
  }

  ngOnInit() {
    this.size = this.size || defaultSize;
    this.position = this.position || defaultPosition;
  }

  @HostListener('mouseenter')
  private onMouseEnter() {
    this.tooltipMouseService.onMouseEnterContent();
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.tooltipMouseService.onMouseLeaveContent();
  }

  private updateCssClass({ oldClass, newClass }: { oldClass: string; newClass: string }) {
    this.renderer.removeClass(this.el.nativeElement, oldClass);
    this.renderer.addClass(this.el.nativeElement, newClass);
  }
}
