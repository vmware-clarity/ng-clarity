/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';

import { CssVariablePipe } from '../pipes/css-variable.pipe';

@Component({
  selector: 'app-color-example-item',
  templateUrl: './color-example-item.component.html',
  styleUrl: './color-example-item.component.scss',
  imports: [CommonModule, CssVariablePipe],
})
export class ColorExampleItemComponent {
  @Input() text: string | undefined;
  @Input({ required: true }) token: string | undefined;
  readonly tokenType = input<'color' | 'shadow'>('color');
  @Input() number: number | undefined;
  @Input() borderColor: string = '';

  protected copied = false;

  constructor(private liveAnnouncer: LiveAnnouncer) {}

  protected async copyTokenToClipboard() {
    if (this.token) {
      await navigator.clipboard.writeText(this.token);
      await this.liveAnnouncer.announce(`copied ${this.text} ${this.tokenType()} token to clipboard`);

      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 1000);
    }
  }
}
