/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  booleanAttribute,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClarityIcons } from './icon.service';
import { Directions, Orientations, StatusTypes } from './interfaces/icon.interfaces';
import { GlobalStateService } from './services/global.service';
import { IconHtmlPipe } from './utils/icon-html.pipe';
import { updateIconSizeStyle } from './utils/icon.classnames';
import { getIconBadgeSVG, getIconSVG } from './utils/icon.svg-helpers';

@Component({
  selector: 'clr-icon, cds-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.shape]': 'shape',
    '[attr.size]': 'size',
    '[attr.direction]': 'direction',
    '[attr.flip]': 'flip',
    '[attr.solid]': 'solid ? true : null',
    '[attr.status]': 'status',
    '[attr.inverse]': 'inverse ? true : null',
    '[attr.badge]': 'badge',
  },
  imports: [IconHtmlPipe],
  providers: [IconHtmlPipe],
})
export class ClrIcon implements OnInit, OnDestroy {
  iconSVG: string;
  isStringIcon = false;

  private _shape: string = 'unknown';
  private _size: string;
  private _direction: Directions | string;
  private _flip: Orientations;
  private _solid: boolean = false;
  private _status: StatusTypes | string;
  private _inverse: boolean = false;
  private _badge: string | StatusTypes | 'inherit' | 'warning-triangle' | 'inherit-triangle' | true | false;
  private subscription: Subscription;
  private _priorShape = 'unknown';

  constructor(
    public el: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef
  ) {}

  @Input()
  get shape() {
    return this._shape;
  }
  set shape(value) {
    if ((value || (value && value.length)) && this._shape !== value) {
      this._priorShape = this._shape;
      this._shape = value;
      this.updateIcon();
    }
  }
  @Input()
  get size() {
    return this._size;
  }
  set size(value) {
    if (value !== this._size) {
      this._size = value;
      this.updateIconSize(value);
    }
  }
  @Input()
  get direction() {
    return this._direction;
  }
  set direction(value) {
    if (value !== this._direction) {
      this._direction = value;
      this.updateIcon();
    }
  }
  @Input()
  get flip() {
    return this._flip;
  }
  set flip(value) {
    if (value !== this._flip) {
      this._flip = value;
      this.updateIcon();
    }
  }
  @Input({ transform: booleanAttribute })
  get solid() {
    return this._solid;
  }
  set solid(value: boolean) {
    if (value !== this._solid) {
      this._solid = value;
      this.updateIcon();
    }
  }
  @Input()
  get status() {
    return this._status;
  }
  set status(value) {
    if (value !== this._status) {
      this._status = value;
      this.updateIcon();
    }
  }
  @Input({ transform: booleanAttribute })
  get inverse() {
    return this._inverse;
  }
  set inverse(value: boolean) {
    if (value !== this._inverse) {
      this._inverse = value;
      this.updateIcon();
    }
  }
  @Input()
  get badge() {
    return this._badge;
  }
  set badge(value) {
    if (value !== this._badge) {
      this._badge = value;
      this.updateIcon();
    }
  }

  ngOnInit() {
    this.updateIcon(); // Initial render

    this.subscription = GlobalStateService.stateUpdates.subscribe(update => {
      if (update.key === 'iconRegistry' && ClarityIcons.registry[this.shape] && this._priorShape !== this.shape) {
        this._priorShape = this.shape;
        this.updateIcon();
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  updateIcon() {
    const shapeTemplate = ClarityIcons.registry[this.shape] || ClarityIcons.registry['unknown'];

    if (typeof shapeTemplate === 'string') {
      this.isStringIcon = true;
      this.iconSVG = shapeTemplate as string;
    } else {
      this.isStringIcon = false;
      this.iconSVG = getIconSVG(this) + getIconBadgeSVG(this);
    }
    this.cdr.markForCheck();
  }

  updateIconSize(value: string) {
    updateIconSizeStyle(this.el.nativeElement, value);
  }
}
