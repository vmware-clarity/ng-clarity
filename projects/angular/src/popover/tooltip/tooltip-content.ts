/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ElementRef,
  HostListener,
  Inject,
  Injector,
  Input,
  OnInit,
  Optional,
  Renderer2,
} from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';
import { ClrPopoverService } from '../common';
import { ClrCDKPopoverPositions } from '../common/enums/cdk-tooltip-position.enum';
import { POPOVER_HOST_ANCHOR } from '../common/popover-host-anchor.token';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';

const POSITIONS = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'] as const;
type Position = (typeof POSITIONS)[number];

const AvailablePopoverPositions = [
  ClrCDKPopoverPositions['bottom-left'],
  ClrCDKPopoverPositions['bottom-right'],
  ClrCDKPopoverPositions['left'],
  ClrCDKPopoverPositions['right'],
  ClrCDKPopoverPositions['top-left'],
  ClrCDKPopoverPositions['top-right'],
];
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
  standalone: false,
})
export class ClrTooltipContent implements OnInit {
  private _id: string;
  private _position: string;
  private _size: string;

  constructor(
    injector: Injector,
    @Optional()
    @Inject(POPOVER_HOST_ANCHOR)
    parentHost: ElementRef<HTMLElement>,
    private tooltipIdService: TooltipIdService,
    public el: ElementRef,
    private renderer: Renderer2,
    private popoverService: ClrPopoverService,
    private tooltipMouseService: TooltipMouseService
  ) {
    popoverService.contentRef = el;
    popoverService.availablePositions = AvailablePopoverPositions;
    popoverService.popoverPositions = ClrCDKPopoverPositions;
    popoverService.scrollToClose = true;
    popoverService.panelClass.push('clr-tooltip-container');

    if (!parentHost) {
      throw new Error('clr-tooltip-content should only be used inside of a clr-tooltip');
    }

    // Set the default id in case consumer does not supply a custom id.
    this.id = uniqueIdFactory();
  }

  @Input()
  get id(): string {
    return this._id;
  }
  set id(value: string) {
    const id = value || '';

    this._id = id;
    this.tooltipIdService.updateId(id);
  }

  @Input('clrPosition')
  get position() {
    return this._position;
  }
  set position(value: string) {
    const oldPosition = this._position;
    const newPosition = POSITIONS.includes(value as any) ? (value as Position) : defaultPosition;

    this._position = newPosition;
    console.log(this._position);
    this.updateCssClass({ oldClass: `tooltip-${oldPosition}`, newClass: `tooltip-${newPosition}` });

    this.popoverService.availablePositions = AvailablePopoverPositions;
    this.popoverService.popoverPositions = ClrCDKPopoverPositions;

    this.popoverService.position = this._position;
  }

  @Input('clrSize')
  get size() {
    return this._size;
  }
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
