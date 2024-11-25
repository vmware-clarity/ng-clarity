/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

import { CONTROL_STATE, IfControlStateService } from '../common/if-control-state/if-control-state.service';
import { WrappedFormControl } from '../common/wrapped-control';
import { ClrNumberPickerContainer } from './number-picker-container';

export const numberInput = (value: unknown) => {
  const isNumberValue = !isNaN(parseFloat(value as any)) && !isNaN(Number(value));
  return isNumberValue ? Number(value) : NaN;
};

@Component({
  selector: 'clr-number-picker',
  template: `
    <div class="clr-number-picker-wrapper">
      <input
        #inputElement
        [id]="inputId()"
        [attr.min]="min"
        [attr.max]="max"
        [attr.step]="step"
        [readonly]="readonly"
        [(ngModel)]="value"
        type="number"
        autocomplete="off"
        (focus)="onFocus()"
        (blur)="onBlur()"
        [attr.aria-invalid]="control?.invalid ? true : null"
        [disabled]="isDisabled ? true : null"
        [attr.placeholder]="placeholder"
      />
      <cds-icon class="clr-number-picker-step-down" shape="minus" size="sm" (click)="stepDown()"></cds-icon>
      <div class="clr-number-picker-separator"></div>
      <cds-icon class="clr-number-picker-step-up" shape="plus" size="sm" (click)="stepUp()"></cds-icon>
    </div>
  `,
  host: {
    '[class.clr-number-picker]': 'true',
    '[class.clr-focus]': 'focused',
    '[class.clr-number-picker-disabled]': 'isDisabled',
    '[attr.tabindex]': 'isDisabled ? -1 : 0',
  },
})
export class ClrNumberPicker extends WrappedFormControl<ClrNumberPickerContainer> implements ControlValueAccessor {
  invalid = false;
  focused = false;

  @Input() step = 1;
  @Input() placeholder = '';

  @Output() valueChange = new EventEmitter<number>();

  protected override index = 1;

  @ViewChild('inputElement', { static: true }) private inputElement!: ElementRef<HTMLInputElement>;

  private _min = null;
  private _max = null;
  private _readonly = false;
  private _disabled = false;
  private _value: number | null = null;

  constructor(
    vcr: ViewContainerRef,
    injector: Injector,
    @Self()
    @Optional()
    public control: NgControl,
    protected override renderer: Renderer2,
    protected override el: ElementRef<HTMLInputElement>,
    @Optional() private controlStateService: IfControlStateService
  ) {
    super(vcr, ClrNumberPickerContainer, injector, control, renderer, el);
    if (control) {
      control.valueAccessor = this;
    }
  }

  get isDisabled() {
    return this.disabled || this.control?.disabled;
  }

  @Input('min')
  get min(): number {
    return this._min;
  }
  set min(value: unknown) {
    this._min = numberInput(value);
  }

  @Input('max')
  get max(): number {
    return this._max;
  }
  set max(value: unknown) {
    this._max = numberInput(value);
  }

  @Input('disabled')
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean | string | null) {
    this._disabled = typeof value === 'boolean' ? value : value !== null && value !== 'false';
  }

  @Input('readonly')
  get readonly(): boolean {
    return this._readonly;
  }
  set readonly(value: boolean | string | null) {
    this._readonly = typeof value === 'boolean' ? value : value !== null && value !== 'false';
  }

  @Input('value')
  get value(): number {
    return this._value;
  }
  set value(value: number | null) {
    if (this._value !== value) {
      this.updateValue(value);
    }
  }

  // Override the id of WrappedFormControl, as we want to move it to the embedded input.
  // Otherwise the label/component connection does not work and screen readers do not read the label.
  override get id() {
    return this.controlIdService.id + '-number-picker';
  }
  override set id(id: string) {
    super.id = id;
  }

  ngAfterContentInit() {
    if (this.control && this.controlStateService) {
      this.subscriptions.push(
        this.controlStateService.statusChanges.subscribe(invalid => {
          this.invalid = this.control.control.touched && invalid === CONTROL_STATE.INVALID;
        })
      );
    }
  }

  ngAfterViewInit() {
    // The number input is the actual element we are wrapping
    // This assignment is needed by the wrapper, so it can set
    // the aria properties on the input element, not on the component.
    this.el = this.inputElement;
  }

  inputId(): string {
    return this.controlIdService.id;
  }

  writeValue(value: number | null): void {
    this._value = value;
    if (this.inputElement) {
      this.renderer.setProperty(this.inputElement.nativeElement, 'value', value);
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(): void {
    // do nothing
  }

  onFocus(): void {
    this.focused = true;
  }

  onBlur() {
    if (this.disabled || this.readonly) {
      return;
    }
    if (this.control) {
      this.onTouched();
      if (this.control.control.updateOn === 'change' && this.control.control?.errors?.required) {
        this.updateValue();
      }
      if (this.control.control.updateOn === 'blur') {
        this.control.control.updateValueAndValidity();
      }
    }
    this.focused = false;
  }

  stepUp(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    this.inputElement.nativeElement.stepUp();
    this.updateValue();
  }

  stepDown(): void {
    if (this.disabled || this.readonly) {
      return;
    }
    this.inputElement.nativeElement.stepDown();
    this.updateValue();
  }

  private onChange: (value: number | null) => void = () => {
    // This is a no-op function until a callback is registered via registerOnChange.
  };
  private onTouched: () => void = () => {
    // This is a no-op function until a callback is registered via registerOnChange.
  };

  private updateValue(value?: number): void {
    if (value === undefined && this.inputElement.nativeElement.value !== '') {
      value = Number(this.inputElement.nativeElement.value);
    }
    this._value = value;
    this.onChange(value); // Notify the form control
    this.valueChange.emit(value); // Emit custom value change event
  }
}
