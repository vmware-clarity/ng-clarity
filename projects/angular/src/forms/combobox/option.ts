/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';

import { ComboboxFocusHandler, OptionData as OptionProxy } from './providers/combobox-focus-handler.service';
import { OptionSelectionService } from './providers/option-selection.service';
import { ClrCommonStringsService } from '../../utils/i18n/common-strings.service';
import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';

@Component({
  selector: 'clr-option',
  template: `
    <ng-content></ng-content>
    @if (selected) {
      <span class="clr-sr-only">{{ commonStrings.keys.comboboxSelected }}</span>
    }
  `,
  host: {
    '[class.clr-combobox-option]': 'true',
    '[attr.role]': '"option"',
    // Do not remove. Or click-selection will not work.
    '[attr.tabindex]': '-1',
    '[attr.id]': 'optionId',
  },
  standalone: false,
})
export class ClrOption<T> implements OnInit {
  // A proxy with only the necessary data to be used for a11y and the focus handler service.
  optionProxy: OptionProxy<T> = new OptionProxy(null, null);

  private _id: string;
  private _value: T;

  constructor(
    public elRef: ElementRef<HTMLElement>,
    public commonStrings: ClrCommonStringsService,
    private focusHandler: ComboboxFocusHandler<T>,
    private optionSelectionService: OptionSelectionService<T>
  ) {
    this.optionProxy.el = elRef.nativeElement;
  }

  @Input('id')
  get optionId() {
    return this._id;
  }
  set optionId(id: string) {
    this._id = id;
    this.optionProxy.id = this._id;
  }

  @Input('clrValue')
  get value(): T {
    return this._value;
  }
  set value(value: T) {
    this._value = value;
    this.optionProxy.value = value;
  }

  @HostBinding('class.active')
  get selected() {
    return (
      this.optionSelectionService.selectionModel && this.optionSelectionService.selectionModel.containsItem(this.value)
    );
  }

  @HostBinding('class.clr-focus')
  get focusClass() {
    return this.focusHandler.pseudoFocus.containsItem(this.optionProxy);
  }

  ngOnInit() {
    if (!this._id) {
      this._id = 'clr-option-' + uniqueIdFactory();
      this.optionProxy.id = this._id;
    }
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    event.stopPropagation();
    if (this.optionSelectionService.multiselectable) {
      this.optionSelectionService.toggle(this.value);
    } else {
      this.optionSelectionService.select(this.value);
    }
    // As the popover stays open in multi-select mode now, we have to take focus back to the input
    // This way we achieve two things:
    // - do not lose focus
    // - we're still able to use onBlur for "outside-click" handling
    this.focusHandler.focusInput();
  }
}
