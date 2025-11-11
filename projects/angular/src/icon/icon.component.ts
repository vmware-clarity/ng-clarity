/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ClarityIcons } from './icon.service';
import { Directions, Orientations, StatusTypes } from './interfaces/icon.interfaces';
import { GlobalStateService } from './services/global.service';
import { IconHtmlPipe } from './utils/icon-html.pipe';
import { updateIconSizeStyle } from './utils/icon.classnames'; // You will need to port this utility
import { getIconBadgeSVG, getIconSVG } from './utils/icon.svg-helpers'; // You will need to port these utilities

@Component({
  selector: 'clr-icon, cds-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom, // MUST use ShadowDom for :host styles
  host: {
    // Binds inputs directly to host attributes, just like the Lit component
    '[attr.shape]': 'shape',
    '[attr.size]': 'size',
    '[attr.direction]': 'direction',
    '[attr.flip]': 'flip',
    '[attr.solid]': 'solid ? true : undefined',
    '[attr.status]': 'status',
    '[attr.inverse]': 'inverse ? true : undefined',
    '[attr.badge]': 'badge',
  },
  standalone: false,
  providers: [IconHtmlPipe],
})
export class ClrIcon implements OnInit, OnChanges, OnDestroy {
  @ViewChild('svgIcon') svgIconElement: HTMLElement;
  // --- Public Inputs ---
  @Input() shape = 'unknown';
  @Input() size: string;
  @Input() direction: Directions | string;
  @Input() flip: Orientations;
  @Input() solid: string | boolean = false;
  @Input() status: StatusTypes | string;
  @Input() inverse: string | boolean = false;
  @Input() badge: string | StatusTypes | 'inherit' | 'warning-triangle' | 'inherit-triangle' | true | false;

  // --- Internal State ---
  iconSVG: string; // The raw SVG <path> content
  isStringIcon = false; // Flag to render a <span> or <svg>

  private subscription: Subscription;
  private _priorShape = 'unknown';

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    this.updateIcon(); // Initial render

    // Subscribe to the icon registry for updates
    this.subscription = GlobalStateService.stateUpdates.subscribe(update => {
      if (update.key === 'iconRegistry' && ClarityIcons.registry[this.shape] && this._priorShape !== this.shape) {
        this._priorShape = this.shape;
        this.updateIcon();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Re-render if any inputs change
    if (changes.shape || changes.solid || changes.status || changes.inverse || changes.badge) {
      this.updateIcon();
    }

    // Update dynamic size style if 'size' changes
    if (changes.size) {
      // This utility function must be ported from your 'core' project
      updateIconSizeStyle(this.el.nativeElement, this.size);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  /**
   * Updates the iconSVG content based on the current component state.
   */
  private updateIcon() {
    const shapeTemplate = ClarityIcons.registry[this.shape] || ClarityIcons.registry['unknown'];
    if (typeof shapeTemplate === 'string') {
      // This is a legacy string icon, render in a span
      this.isStringIcon = true;
      this.iconSVG = shapeTemplate as string;
    } else {
      // This is a modern icon, build the SVG
      this.isStringIcon = false;

      // These two helper functions MUST be ported from your
      // 'core' project's 'icon.svg-helpers.js' file.
      // They take the component instance and return SVG strings.
      this.iconSVG = getIconSVG(this) + getIconBadgeSVG(this);
    }
  }
}
