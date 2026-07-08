/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClarityIcons,
  ClarityModule,
  ClrTimelineStepState,
  cogIcon,
  homeIcon,
  pencilIcon,
  undoIcon,
  userIcon,
} from '@clr/angular';

import { getFeatureFlags } from '../feature-flags';
import { Color, hexToHsl, shiftL } from './utils/color';
import { generateCSS } from './utils/css-generator';
import { BACKGROUND_TOKENS, DEFAULT_OVERRIDES, PRESETS, SAMPLE_ROWS, TOKEN_KEYS } from './utils/presets';
import { CdsThemeStructure, DataRow, ThemeColors, ThemePreset } from './utils/types';
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
export class ThemeBuilderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('previewWrapper') previewWrapper!: ElementRef<HTMLElement>;
  @ViewChild('previewDarkWrapper') previewDarkWrapper!: ElementRef<HTMLElement>;

  presets = PRESETS;
  // Tracks which preset is active so CSS output can use token refs instead of hex values.
  // Set to null when the user manually edits any color.
  activePreset = PRESETS[0];

  activeTheme: 'light' | 'dark' = 'light';

  colorStruct: CdsThemeStructure = {
    light: {},
    dark: {},
  };

  backgrounds: CdsThemeStructure = {
    light: {},
    dark: {},
  };

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
    ClarityIcons.addIcons(undoIcon);
    ClarityIcons.addIcons(pencilIcon);
    ClarityIcons.addIcons(homeIcon);
    ClarityIcons.addIcons(cogIcon);
    ClarityIcons.addIcons(userIcon);
  }

  get isDarkTheme(): boolean {
    return this.activeTheme === 'dark';
  }

  get generatedCss(): string {
    const generatedCSS = generateCSS(this.colorStruct);

    if (generatedCSS.find(line => line === '\n/* NO changes */')) {
      this.activePreset = PRESETS[0];
    }

    return generatedCSS.join('\n');
  }

  get themeColors() {
    const result = [];

    if (this.colorStruct[this.activeTheme]) {
      const keys = Object.keys(this.colorStruct[this.activeTheme]);

      for (const key of keys) {
        const allColors: Color[] = this.colorStruct[this.activeTheme][key];
        result.push({
          key,
          base: allColors.find(c => c.label === 'Base'),
          variants: allColors.filter(c => c.label !== 'Base'),
        });
      }
    }

    return result;
  }

  applyActiveTheme(theme: 'light' | 'dark') {
    this.activeTheme = theme;

    this.applyPreviewStyles();
  }

  setCurrentColor(colorVariant: Color, hex: string, colorGroup: Color[] = []): void {
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      colorVariant.color = hexToHsl(hex);

      this.colorBuilder(colorVariant, colorGroup);

      this.applyPreviewStyles();

      this.activePreset = null;
    }
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    // document.querySelector('app-root')?.classList.add('layout-theme-builder');
  }

  ngAfterViewInit(): void {
    this.buildColorStructure();

    this.applyPreviewStyles();
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');
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

      if (!this.activePreset[theme]) {
        this.resetAllThemeColors(theme);

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
  }

  resetAllThemeColors(theme: string) {
    for (const key of Object.keys(this.colorStruct[theme])) {
      const tokenGroup = this.colorStruct[theme][key];

      for (let i = 0; i < tokenGroup.length; i++) {
        tokenGroup[i].color = null;
      }
    }
  }

  resetColor($event: Event, color: Color, colorGroup: Color[] = []) {
    $event.stopPropagation();
    color.color = null;

    colorGroup?.forEach(color => {
      color.color = null;
    });

    this.applyPreviewStyles();
  }

  async copyCSS(): Promise<void> {
    const css = this.generatedCss;

    // iframe communication to parent
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

        DEFAULT_OVERRIDES[color.name]?.forEach((override: string) => {
          // remove override if color isOriginalColor
          if (color.isOriginalColor) {
            el.style.removeProperty(override);
          } else {
            el.style.setProperty(override, `var(${color.name})`);
          }
        });
      }
    }
  }

  getContrast(color: Color): any {
    const contrast = {
      minContrast: {},
      backgrounds: [],
    };

    let minScore = 10;
    for (let bgName in this.backgrounds[this.activeTheme]) {
      const background = this.backgrounds[this.activeTheme][bgName];

      const score = contrastRatio(color.rgb, background.rgb);

      if (minScore > score) {
        minScore = score;
      }

      contrast.backgrounds.push({
        name: bgName,
        score,
        wcag: wcagScore(score),
      });
    }

    contrast.minContrast = {
      wcag: wcagScore(minScore),
      score: minScore,
    };

    return contrast;
  }

  getBadgeColor(contrastLabel: string) {
    switch (contrastLabel) {
      case 'Fail':
        return 'danger';
      case 'AA Large':
        return 'warning';
      case 'AA':
      default:
        return 'success';
    }
  }

  private colorBuilder(colorVariant: Color, colorGroup: Color[], isDarkTheme = this.isDarkTheme) {
    if (TOKEN_KEYS.baseTokens.includes(colorVariant.name)) {
      const baseColorHSL = colorVariant.color;

      colorGroup.forEach(item => {
        if (item.name.endsWith('-tint')) {
          item.color = [baseColorHSL[0], baseColorHSL[1], isDarkTheme ? 25 : 94];
        } else if (item.name.endsWith('-tint-dark')) {
          item.color = [baseColorHSL[0], baseColorHSL[1], isDarkTheme ? 18 : 95];
        } else if (item.name.endsWith('-shade')) {
          item.color = shiftL(baseColorHSL, isDarkTheme ? 7 : -7);
        } else if (item.name.endsWith('-dark')) {
          item.color = shiftL(baseColorHSL, isDarkTheme ? 10 : -10);
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
    }, 200);
  }
}
