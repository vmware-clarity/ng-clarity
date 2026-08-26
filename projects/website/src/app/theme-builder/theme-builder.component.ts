/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeBuilderComponent as ClrThemeBuilder, PRESETS, ThemePreset } from '@clr/addons/theme-builder';
import { ClrAlertModule, ClrModalModule } from '@clr/angular';

import { getFeatureFlags } from '../feature-flags';
import { CodeSnippetComponent } from '../shared/code-snippet/code-snippet.component';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';
import { ThemeLockService } from '../shared/theme-toggle/theme-lock.service';

const CUSTOM_PRESETS_STORAGE_KEY = 'clr-theme-builder-custom-presets';

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrl: './theme-builder.component.scss',
  host: { '[class.content-container]': 'true' },
  imports: [
    ClrAlertModule,
    ClrModalModule,
    ClrThemeBuilder,
    CodeSnippetComponent,
    CommonModule,
    FormsModule,
    SiteFooterComponent,
    SiteNavComponent,
  ],
})
export class ThemeBuilderComponent implements OnDestroy {
  generatedCss = '';
  copied = false;

  saveModalOpen = false;
  presetNameInput = '';

  importModalOpen = false;
  cssToImportInput = '';

  @ViewChild(ClrThemeBuilder) themeBuilder!: ClrThemeBuilder;

  protected readonly themeBuilderOnly = getFeatureFlags().themeBuilderOnly;

  private readonly themeLockService = inject(ThemeLockService);

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(public cd: ChangeDetectorRef) {
    this.themeLockService.lockLightTheme();
  }

  get presets(): ThemePreset[] {
    return [...PRESETS, ...this.savedPresets];
  }

  get savedPresets(): ThemePreset[] {
    try {
      const raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ThemePreset[]) : [];
    } catch {
      return [];
    }
  }

  ngOnDestroy(): void {
    this.themeLockService.unlockTheme();

    if (this.copiedTimer) {
      clearTimeout(this.copiedTimer);
    }
  }

  writeGeneratedCss(css: string) {
    this.generatedCss = css;
    this.cd.detectChanges();
  }

  openSaveModal(): void {
    this.presetNameInput = '';
    this.saveModalOpen = true;
  }

  confirmSavePreset(): void {
    const name = this.presetNameInput.trim();
    if (!name) {
      return;
    }

    const preset: ThemePreset = {
      name: name,
      light: this.themeBuilder.colorStruct.light,
      dark: this.themeBuilder.colorStruct.dark,
    };
    const withoutExistingNamesake = this.savedPresets.filter(saved => saved.name !== name);

    localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify([...withoutExistingNamesake, preset]));

    this.saveModalOpen = false;
  }

  openImportModal(): void {
    this.cssToImportInput = '';
    this.importModalOpen = true;
  }

  confirmImportCss(): void {
    if (!this.cssToImportInput.trim()) {
      return;
    }

    this.themeBuilder.importCSS(this.cssToImportInput);
    this.importModalOpen = false;
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
