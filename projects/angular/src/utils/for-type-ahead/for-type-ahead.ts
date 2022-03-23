/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, Input } from '@angular/core';
import { ForTypeAheadProvider } from './for-type-ahead.service';

// The purpose of this directive is to provide the text content of its host element
// or text content that's passed to its input.

// This directive must stay optional. So do not embed this directive in a component module by default.
// If users need to use this directive, they should import its module on their side.

@Directive({
  providers: [ForTypeAheadProvider],
  selector: '[clrForTypeAhead]',
})
export class ClrForTypeAhead {
  constructor(private el: ElementRef, private forTypeAheadProvider: ForTypeAheadProvider) {}

  private trimAndLowerCase(value: string) {
    return value.toLocaleLowerCase().trim();
  }

  private _content: string;

  get content() {
    return this._content;
  }

  @Input('clrForTypeAhead') set content(value: string) {
    if (value) {
      this._content = this.trimAndLowerCase(value);
      this.forTypeAheadProvider.textContent = this._content;
    } else {
      this._content = this.trimAndLowerCase(this.el.nativeElement.textContent);
      this.forTypeAheadProvider.textContent = this._content;
    }
  }
}
