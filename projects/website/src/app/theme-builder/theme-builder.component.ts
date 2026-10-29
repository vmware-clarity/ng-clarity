/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
  ThemeBuilderComponent as ClrThemeBuilder,
  Color,
  PRESETS,
  ThemeColors,
  ThemeCssValidation,
  ThemePreset,
  validateGeneratedCSS,
} from '@clr/addons/theme-builder';
import {
  ClarityIcons,
  ClrAlertModule,
  ClrInputModule,
  ClrModalModule,
  ClrTextareaModule,
  trashIcon,
} from '@clr/angular';
import { debounceTime, Subject } from 'rxjs';

import { getFeatureFlags } from '../feature-flags';
import { CodeSnippetComponent } from '../shared/code-snippet/code-snippet.component';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';
import { ThemeLockService } from '../shared/theme-toggle/theme-lock.service';

const CUSTOM_PRESETS_STORAGE_KEY = 'clr-theme-builder-custom-presets';
const IMPORT_VALIDATION_DEBOUNCE_MS = 400;

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
    ClrTextareaModule,
    ClrInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ThemeBuilderComponent implements OnDestroy {
  generatedCss = '';
  copied = false;

  saveModalOpen = false;
  presetName = '';

  importModalOpen = false;
  cssToImport = '';
  /** Result of validating `cssToImport`; `null` until it has been checked (or while it's empty). */
  importValidation: ThemeCssValidation | null = null;
  /** `true` while a `cssToImport` change is waiting for its debounced validation. */
  importValidationPending = false;

  clearPresetsModalOpen = false;

  /** `true` when the last attempt to save a preset couldn't write to `localStorage`. */
  saveStorageFailed = false;

  /** Presets saved in `localStorage`; reloaded only after a save or a clear. */
  savedPresets: ThemePreset[] = [];
  /** Built-in presets followed by `savedPresets`, as passed to the theme builder. */
  presets: ThemePreset[] = PRESETS;

  @ViewChild(ClrThemeBuilder) themeBuilder!: ClrThemeBuilder;

  protected readonly themeBuilderOnly = getFeatureFlags().themeBuilderOnly;

  private readonly themeLockService = inject(ThemeLockService);

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly cssToImportChanges = new Subject<string>();

  constructor(public cd: ChangeDetectorRef) {
    ClarityIcons.addIcons(trashIcon);
    this.themeLockService.lockLightTheme();
    this.refreshSavedPresets();

    this.cssToImportChanges
      .pipe(debounceTime(IMPORT_VALIDATION_DEBOUNCE_MS), takeUntilDestroyed())
      .subscribe(css => this.validateCssToImport(css));
  }

  /**
   * `true` when `presetName` belongs to one of the theme builder's own presets (Clarity Default
   * and the built-in ones), which can't be saved over.
   */
  get presetNameReserved(): boolean {
    return (this.themeBuilder?.presets ?? []).some(
      preset => !this.savedPresets.includes(preset) && isSameName(preset.name, this.presetName)
    );
  }

  /** `true` when saving `presetName` updates an existing saved preset. */
  get presetNameTaken(): boolean {
    return this.savedPresets.some(preset => isSameName(preset.name, this.presetName));
  }

  get importDisabled(): boolean {
    return !this.cssToImport.trim() || this.importValidationPending || !this.importValidation?.valid;
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
    this.presetName = '';
    this.saveStorageFailed = false;
    this.saveModalOpen = true;
  }

  confirmSavePreset(): void {
    const name = this.presetName.trim();
    if (!name || this.presetNameReserved) {
      return;
    }

    const preset: ThemePreset = {
      name: name,
      light: changedColors(this.themeBuilder.colorStruct.light),
      dark: changedColors(this.themeBuilder.colorStruct.dark),
    };
    const withoutExistingNamesake = this.savedPresets.filter(saved => !isSameName(saved.name, name));

    try {
      localStorage.setItem(CUSTOM_PRESETS_STORAGE_KEY, JSON.stringify([...withoutExistingNamesake, preset]));
    } catch {
      this.saveStorageFailed = true;
      return;
    }

    this.refreshSavedPresets();
    this.saveModalOpen = false;
  }

  openImportModal(): void {
    this.cssToImport = '';
    this.importValidation = null;
    this.importValidationPending = false;
    this.importModalOpen = true;
  }

  scheduleCssToImportValidation(css: string): void {
    this.importValidationPending = true;
    this.cssToImportChanges.next(css);
  }

  confirmImportCss(): void {
    if (this.importDisabled) {
      return;
    }

    if (!this.themeBuilder.importCSS(this.cssToImport)) {
      this.validateCssToImport(this.cssToImport);
      return;
    }

    this.importModalOpen = false;
  }

  openClearPresetsModal(): void {
    this.clearPresetsModalOpen = true;
  }

  clearCustomPresets(): void {
    try {
      localStorage.removeItem(CUSTOM_PRESETS_STORAGE_KEY);
    } catch {
      console.warn('Theme builder: could not clear saved presets, browser storage is blocked.');
    }

    this.refreshSavedPresets();
    this.clearPresetsModalOpen = false;
    this.cd.detectChanges();
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

  private validateCssToImport(css: string): void {
    this.importValidation = css.trim() ? validateGeneratedCSS(css) : null;
    this.importValidationPending = false;
  }

  /**
   * Reloads `savedPresets` from `localStorage` and rebuilds `presets`. Reloading (instead of
   * appending the saved preset) keeps the cached presets independent of the theme builder's
   * live `colorStruct`, which a newly saved preset references.
   */
  private refreshSavedPresets(): void {
    this.savedPresets = this.loadSavedPresets();
    this.presets = [...PRESETS, ...this.savedPresets];
  }

  /**
   * Reads the saved presets. Stored data that isn't JSON, or that `rehydratePreset` can't
   * walk, is cleared from `localStorage`.
   */
  private loadSavedPresets(): ThemePreset[] {
    let raw: string | null;

    try {
      raw = localStorage.getItem(CUSTOM_PRESETS_STORAGE_KEY);
    } catch {
      console.warn('Theme builder: browser storage is inaccessible, so saved presets are unavailable.');
      return [];
    }

    try {
      const parsed = raw ? (JSON.parse(raw) as ThemePreset[]) : [];

      return this.rehydratePreset(parsed);
    } catch {
      localStorage.removeItem(CUSTOM_PRESETS_STORAGE_KEY);
      return [];
    }
  }

  /**
   * Reattaches `Color.prototype` to every color in a preset loaded back from `localStorage`.
   * `JSON.parse` recovers `Color`'s own data properties (`name`, `originalColor`, and
   * `_color` when set) as plain objects, but not the class's prototype — so its
   * `.color`/`.hex` getters are missing until the prototype is restored. Only the `Color`
   * objects need this; `preset`/`light`/`dark` are plain data already, so it's mutated
   * in place rather than rebuilt.
   */
  private rehydratePreset(presets: ThemePreset[]): ThemePreset[] {
    for (const preset of presets) {
      for (const themeColors of [preset.light, preset.dark]) {
        for (const colors of Object.values(themeColors ?? {})) {
          colors.forEach((color: any) => Object.setPrototypeOf(color, Color.prototype));
        }
      }
    }

    return presets;
  }
}

/** Compares preset names ignoring case and surrounding whitespace. */
function isSameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Keeps only the colors that differ from their Clarity default, dropping groups left empty, so
 * a saved preset doesn't pin unchanged tokens to the defaults of the build it was saved with.
 */
function changedColors(themeColors: Record<string, Color[]>): ThemeColors {
  const changed: Record<string, Color[]> = {};

  for (const [key, colors] of Object.entries(themeColors)) {
    const edited = colors.filter(color => !color.isOriginalColor);

    if (edited.length) {
      changed[key] = edited;
    }
  }

  return changed;
}
