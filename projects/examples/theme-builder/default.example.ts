/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PRESETS, ThemeBuilderComponent, ThemePreset } from '@clr/addons/theme-builder';

@Component({
  selector: 'clr-theme-builder-default-example',
  templateUrl: './default.example.html',
  imports: [ThemeBuilderComponent],
})
export class ThemeBuilderDefaultExample {
  readonly presets: ThemePreset[] = PRESETS;

  generatedCss = '';

  private readonly cd = inject(ChangeDetectorRef);

  onGeneratedCss(css: string): void {
    // The theme builder emits while its own view initializes, so refresh the output right away.
    this.generatedCss = css;
    this.cd.detectChanges();
  }
}
