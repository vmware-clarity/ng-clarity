/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ThemeBuilderComponent as ClrThemeBuilder, PRESETS } from '@clr/addons/theme-builder';

import { getFeatureFlags } from '../feature-flags';
import { CodeSnippetComponent } from '../shared/code-snippet/code-snippet.component';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrl: './theme-builder.component.scss',
  host: { '[class.content-container]': 'true' },
  imports: [ClrThemeBuilder, CodeSnippetComponent, CommonModule, SiteFooterComponent, SiteNavComponent],
})
export class ThemeBuilderComponent implements OnDestroy {
  presets = PRESETS;
  generatedCss = '';
  copied = false;

  protected readonly themeBuilderOnly = getFeatureFlags().themeBuilderOnly;

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    localStorage.setItem('theme', 'light');
  }

  ngOnDestroy(): void {
    if (this.copiedTimer) {
      clearTimeout(this.copiedTimer);
    }
  }

  writeGeneratedCss(css: string) {
    this.generatedCss = css;
  }

  async copyCSS(): Promise<void> {
    const css = this.generatedCss;

    // Target origin is unknown (the theme builder can be embedded by any host) and the
    // payload (generated CSS) isn't sensitive, so a wildcard target is intentional here.
    window.top.postMessage(css, '*');

    try {
      await navigator.clipboard.writeText(css);
      this.copied = true;
      if (this.copiedTimer) {
        clearTimeout(this.copiedTimer);
      }
      this.copiedTimer = setTimeout(() => (this.copied = false), 2000);
    } catch {
      // clipboard not available — silently ignore
    }
  }
}
