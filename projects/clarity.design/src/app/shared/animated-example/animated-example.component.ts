/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ClarityIcons, eyeHideIcon } from '@cds/core/icon';
import { ClrIconModule } from '@clr/angular';

@Component({
  selector: 'app-animated-example',
  templateUrl: './animated-example.component.html',
  styleUrl: './animated-example.component.scss',
  imports: [CommonModule, ClrIconModule],
})
export class AnimatedExampleComponent {
  @Input() label: string | undefined;
  @Input() centerContent = true;
  @Input() fullWidthContent = false;

  protected show = true;

  @ViewChild('showButton') private readonly showButtonElementRef: ElementRef<HTMLButtonElement> | undefined;
  @ViewChild('hideButton') private readonly hideButtonElementRef: ElementRef<HTMLButtonElement> | undefined;

  constructor() {
    ClarityIcons.addIcons(eyeHideIcon);
  }

  protected showExample() {
    this.show = true;

    setTimeout(() => {
      this.hideButtonElementRef?.nativeElement.focus();
    });
  }

  protected hideExample() {
    this.show = false;

    setTimeout(() => {
      this.showButtonElementRef?.nativeElement.focus();
    });
  }
}
