/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, ElementRef, input, viewChild } from '@angular/core';
import { ClarityIcons, ClrIcon, eyeHideIcon } from '@clr/angular';

@Component({
  selector: 'app-animated-example',
  templateUrl: './animated-example.component.html',
  styleUrl: './animated-example.component.scss',
  imports: [CommonModule, ClrIcon],
})
export class AnimatedExampleComponent {
  readonly label = input<string | undefined>(undefined);
  readonly centerContent = input(true);
  readonly fullWidthContent = input(false);

  protected show = true;

  private readonly showButtonElementRef = viewChild<ElementRef<HTMLButtonElement>>('showButton');
  private readonly hideButtonElementRef = viewChild<ElementRef<HTMLButtonElement>>('hideButton');

  constructor() {
    ClarityIcons.addIcons(eyeHideIcon);
  }

  protected showExample() {
    this.show = true;

    setTimeout(() => {
      this.hideButtonElementRef()?.nativeElement.focus();
    });
  }

  protected hideExample() {
    this.show = false;

    setTimeout(() => {
      this.showButtonElementRef()?.nativeElement.focus();
    });
  }
}
