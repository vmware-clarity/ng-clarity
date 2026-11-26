/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
} from '@angular/core';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { Type } from '@clr/angular/emphasis/common';

export enum ClrLabelColors {
  None = '',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
  Success = 'success',
  Gray = 'gray',
  Blue = 'blue',
  LightBlue = 'light-blue',
  Orange = 'orange',
  Purple = 'purple',
}

@Component({
  selector: 'clr-label',
  template: `@if (textContent) {
      <span class="text">{{ textContent }}</span>
    }

    @if (badgeText) {
      <clr-badge>{{ badgeText }}</clr-badge>
    }

    <ng-content></ng-content>`,
  host: {
    class: 'label',
    '[class.clickable]': 'clickable',
    '[class.disabled]': 'disabled',
    '[attr.role]': "clickable ? 'button' : null",
    '[attr.tabindex]': 'clickable && !disabled ? 0 : null',
    '[attr.aria-disabled]': "clickable && disabled ? 'true' : null",
    '[class.solid]': 'isSolid',
    '[class]': 'colorClass',
  },
  imports: [ClrBadge],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClrLabel {
  // Programmatic writes (e.g. through a ViewChild) must still render under OnPush.
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private _color: ClrLabelColors | string = ClrLabelColors.None;
  private _badgeText: string = '';
  private _textContent: string = '';
  private _clickable: boolean = false;
  private _disabled: boolean = false;
  private _type: Type | string = Type.Outlined;

  constructor(private el: ElementRef<HTMLElement>) {
    // Capture phase, so it runs before the click handlers that the app binds on the same element.
    // No removeEventListener needed: the listener lives on the host element and only references this
    // instance, so both are garbage-collected together once Angular destroys the component.
    el.nativeElement.addEventListener('click', this.stopClickIfDisabled, true);
  }

  @Input('clrColor')
  get color(): ClrLabelColors | string {
    return this._color;
  }
  set color(value: ClrLabelColors | string) {
    this._color = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrBadgeText')
  get badgeText(): string {
    return this._badgeText;
  }
  set badgeText(value: string) {
    this._badgeText = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrText')
  get textContent(): string {
    return this._textContent;
  }
  set textContent(value: string) {
    this._textContent = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrClickable')
  get clickable(): boolean {
    return this._clickable;
  }
  set clickable(value: boolean) {
    this._clickable = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrDisabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this.changeDetectorRef.markForCheck();
  }
  @Input('clrType')
  get type(): Type | string {
    return this._type;
  }
  set type(value: Type | string) {
    this._type = value;
    this.changeDetectorRef.markForCheck();
  }
  get isSolid() {
    return this.type === Type.Solid;
  }

  get colorClass() {
    return this.color ? `label-${this.color}` : '';
  }

  private stopClickIfDisabled = ($event: MouseEvent) => {
    if (this.clickable && this.disabled) {
      $event.preventDefault();
      $event.stopImmediatePropagation();
    }
  };

  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  private onActivationKeydown($event: KeyboardEvent) {
    if (this.clickable && !this.disabled && $event.target === this.el.nativeElement) {
      $event.preventDefault(); // keep space from scrolling the page
      this.el.nativeElement.click();
    }
  }
}
