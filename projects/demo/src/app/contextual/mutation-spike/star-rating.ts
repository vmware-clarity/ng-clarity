/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** An application's own control, the kind Clarity knows nothing about: a ControlValueAccessor holding a number. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'clr-spike-star-rating',
  standalone: true,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => SpikeStarRating), multi: true }],
  host: { role: 'radiogroup', 'aria-label': 'Rating' },
  template: `
    @for (star of stars; track star) {
      <button
        type="button"
        class="spike-star"
        role="radio"
        [attr.aria-checked]="star === value"
        [attr.aria-label]="star + ' stars'"
        [disabled]="disabled"
        (click)="choose(star)"
      >
        {{ star <= value ? '★' : '☆' }}
      </button>
    }
  `,
  styles: [
    '.spike-star { background: none; border: 0; font-size: 1.25rem; cursor: pointer; color: var(--cds-alias-status-warning, #c27b00); }',
  ],
})
export class SpikeStarRating implements ControlValueAccessor {
  readonly stars = [1, 2, 3, 4, 5];
  value = 0;
  disabled = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  writeValue(value: number): void {
    this.value = Number(value) || 0;
    this.changeDetectorRef.markForCheck();
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  choose(star: number): void {
    this.value = star;
    this.onChange(star);
    this.onTouched();
  }

  private onChange: (value: number) => void = () => undefined;
  private onTouched: () => void = () => undefined;
}
