/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClarityIcons,
  ClarityModule,
  ClrTimelineStepState,
  cogIcon,
  homeIcon,
  moonIcon,
  pencilIcon,
  sunIcon,
  undoIcon,
  userIcon,
} from '@clr/angular';

import { getFeatureFlags } from '../feature-flags';
import { Color } from './utils/color';
import { generateCSS } from './utils/css-generator';
import { BACKGROUND_TOKENS, DEFAULT_OVERRIDES, PRESETS, SAMPLE_ROWS, TOKEN_KEYS } from './utils/presets';
import {
  CdsThemeStructure,
  ContrastResult,
  DataRow,
  HslColor,
  ThemeColor,
  ThemeColors,
  ThemePreset,
} from './utils/types';
import { contrastRatio, wcagScore } from './utils/wcag';
import { CodeSnippetComponent } from '../shared/code-snippet/code-snippet.component';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';

export type { DataRow, ThemeColors, ThemePreset };

@Component({
  selector: 'app-theme-builder',
  templateUrl: './theme-builder.component.html',
  styleUrl: './theme-builder.component.scss',
  host: { '[class.content-container]': 'true' },
  imports: [CommonModule, ClarityModule, FormsModule, CodeSnippetComponent, SiteFooterComponent, SiteNavComponent],
})
export class ThemeBuilderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('previewWrapper') previewWrapper!: ElementRef<HTMLElement>;
  @ViewChild('previewDarkWrapper') previewDarkWrapper!: ElementRef<HTMLElement>;

  presets = PRESETS;
  // Tracks which preset is active so CSS output can use token refs instead of hex values.
  // Set to null when the user manually edits any color.
  activePreset = PRESETS[0];

  activeTheme: 'light' | 'dark' = 'light';

  // Forces black text on the warning color for legibility — toggled via the "Warning text override" switch.
  warningTextOverrideEnabled = true;

  breadcrumbs = [
    { label: 'Framework', routerLink: '/framework' },
    { label: 'Angular', routerLink: '/framework/angular' },
    { label: 'Clarity', routerLink: '/framework/angular/clarity' },
  ];

  colorStruct: CdsThemeStructure = {
    light: {},
    dark: {},
  };

  backgrounds: CdsThemeStructure<Color> = {
    light: {},
    dark: {},
  };

  themeColors: ThemeColor[] = [];

  wizardOpen = false;
  rows = SAMPLE_ROWS;

  description: string;

  stepperForm = {
    account: { fullName: '' },
    confirm: { agree: false },
  };
  copied = false;

  readonly timelineStates = ClrTimelineStepState;
  protected readonly themeBuilderOnly = getFeatureFlags().themeBuilderOnly;

  private copiedTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    localStorage.setItem('theme', 'light');

    ClarityIcons.addIcons(sunIcon, moonIcon, undoIcon, pencilIcon, homeIcon, cogIcon, userIcon);
  }

  get isDarkTheme(): boolean {
    return this.activeTheme === 'dark';
  }

  get generatedCss(): string {
    return generateCSS(this.colorStruct).join('\n');
  }

  applyActiveTheme(theme: 'light' | 'dark') {
    this.activeTheme = theme;

    this.applyPreviewStyles();
    this.refreshThemeColors();
  }

  setCurrentColor(colorVariant: Color, hex: string, colorGroup: Color[] = []): void {
    if (Color.isHex(hex)) {
      colorVariant.color = Color.hexToHsl(hex);

      this.colorBuilder(colorVariant, colorGroup);

      this.applyPreviewStyles();
      this.refreshThemeColors();
      this.resetActivePreset();
    }
  }

  ngAfterViewInit(): void {
    this.buildColorStructure();

    this.applyPreviewStyles();
  }

  ngOnDestroy(): void {
    if (this.copiedTimer) {
      clearTimeout(this.copiedTimer);
    }
  }

  applyPreset(preset: ThemePreset): void {
    this.activePreset = preset;

    for (const theme of Object.keys(this.activePreset)) {
      if (theme === 'name') {
        continue;
      }

      this.resetAllThemeColors(theme);

      if (!this.activePreset[theme]) {
        continue;
      }

      for (const activePresetKey of Object.keys(this.activePreset[theme])) {
        const presetColor = this.activePreset[theme][activePresetKey];
        const activeColor = this.colorStruct[theme][activePresetKey].find(c => c.name === presetColor.name);

        activeColor.color = presetColor.color;

        this.colorBuilder(activeColor, this.colorStruct[theme][activePresetKey], theme === 'dark');
      }
    }

    this.applyPreviewStyles();
    this.refreshThemeColors();
  }

  resetAllThemeColors(theme: string) {
    for (const key of Object.keys(this.colorStruct[theme])) {
      const tokenGroup = this.colorStruct[theme][key];

      for (let i = 0; i < tokenGroup.length; i++) {
        tokenGroup[i].reset();
      }
    }
  }

  resetColor($event: Event, color: Color, colorGroup: Color[] = []) {
    $event.stopPropagation();
    color.reset();

    colorGroup?.forEach(color => {
      color.reset();
    });

    this.applyPreviewStyles();
    this.refreshThemeColors();
    this.resetActivePreset();
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

  applyPreviewStyles(): void {
    const el = this.previewWrapper?.nativeElement;
    if (!el) {
      return;
    }

    const colorGroups = this.colorStruct[this.activeTheme];

    for (let colorGroupKey in colorGroups) {
      const colorVariants = colorGroups[colorGroupKey];
      for (let i = 0; i < colorVariants.length; i++) {
        const color = colorVariants[i] as Color;

        el.style.setProperty(color.name, color.hsl);

        // warning text override — toggled via the "Warning text override" switch
        if (color.name === '--cds-alias-status-warning') {
          const override = '--cds-alias-typography-color-black';

          if (!this.warningTextOverrideEnabled || color.isOriginalColor) {
            el.style.removeProperty(override);
          } else {
            el.style.setProperty(override, 'var(--cds-alias-typography-color-100)');
          }
        }

        DEFAULT_OVERRIDES[color.name]?.forEach((override: string) => {
          // remove override if color isOriginalColor
          // another shorter variant is:
          // el.style.setProperty(override, color.isOriginalColor ? null : `var(${color.name})`);
          if (color.isOriginalColor) {
            el.style.removeProperty(override);
          } else {
            el.style.setProperty(override, `var(${color.name})`);
          }
        });
      }
    }
  }

  private getContrast(color: Color): ContrastResult {
    const backgrounds: ContrastResult['backgrounds'] = [];

    let minScore = 10;
    for (const bgName in this.backgrounds[this.activeTheme]) {
      const background = this.backgrounds[this.activeTheme][bgName];

      const score = contrastRatio(color.rgb, background.rgb);

      if (minScore > score) {
        minScore = score;
      }

      backgrounds.push({
        name: bgName,
        score,
        wcag: wcagScore(score),
      });
    }

    return {
      minContrast: { wcag: wcagScore(minScore), score: minScore },
      backgrounds,
    };
  }

  private refreshThemeColors(): void {
    const themeColors: ThemeColor[] = [];
    const colorGroups = this.colorStruct[this.activeTheme];

    for (const key of Object.keys(colorGroups)) {
      const colorGroup = colorGroups[key];
      const baseColor = colorGroup.find(c => c.label === 'Base');

      themeColors.push({
        key,
        base: baseColor,
        variants: colorGroup.filter(c => c.label !== 'Base'),
        contrast: this.getContrast(baseColor),
      });
    }

    this.themeColors = themeColors;
  }

  private resetActivePreset(): void {
    const themes = Object.values(this.colorStruct) as Record<string, Color[]>[];
    const allOriginal = themes.every(theme => {
      return Object.values(theme).every(colors => {
        return colors.every(color => color.isOriginalColor);
      });
    });

    this.activePreset = allOriginal ? PRESETS[0] : null;
  }

  private colorBuilder(colorVariant: Color, colorGroup: Color[], isDarkTheme = this.isDarkTheme) {
    if (TOKEN_KEYS.baseTokens.includes(colorVariant.name)) {
      const baseColorHSL = colorVariant.color;

      colorGroup.forEach(item => {
        if (item.name.endsWith('-tint')) {
          item.color = new HslColor(baseColorHSL.h, baseColorHSL.s, isDarkTheme ? 25 : 94);
        } else if (item.name.endsWith('-tint-dark')) {
          item.color = new HslColor(baseColorHSL.h, baseColorHSL.s, isDarkTheme ? 18 : 95);
        } else if (item.name.endsWith('-shade')) {
          item.color = Color.shiftL(baseColorHSL, isDarkTheme ? 7 : -7);
        } else if (item.name.endsWith('-dark')) {
          item.color = Color.shiftL(baseColorHSL, isDarkTheme ? 10 : -10);
        }
      });
    }
  }

  private buildColorStructure() {
    setTimeout(() => {
      const lightStyles = window.getComputedStyle(this.previewWrapper?.nativeElement);
      const darkStyles = window.getComputedStyle(this.previewDarkWrapper?.nativeElement);

      for (const key in TOKEN_KEYS) {
        if (key === 'baseTokens') {
          continue;
        }

        const tokenGroup = TOKEN_KEYS[key];
        this.colorStruct['light'][key] = [];
        this.colorStruct['dark'][key] = [];
        for (let i = 0; i < tokenGroup.length; i++) {
          this.colorStruct['light'][key].push(new Color(tokenGroup[i], lightStyles.getPropertyValue(tokenGroup[i])));
          this.colorStruct['dark'][key].push(new Color(tokenGroup[i], darkStyles.getPropertyValue(tokenGroup[i])));
        }
      }

      BACKGROUND_TOKENS.forEach(bg => {
        this.backgrounds['light'][bg.name] = new Color(bg.token, lightStyles.getPropertyValue(bg.token));
        this.backgrounds['dark'][bg.name] = new Color(bg.token, darkStyles.getPropertyValue(bg.token));
      });

      this.refreshThemeColors();
    }, 200);
  }
}
