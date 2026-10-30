/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeBuilderComponent } from './theme-builder.component';
import { Color } from './utils/color';
import { CLARITY_DEFAULT_PRESET, PRESETS } from './utils/presets';
import { ThemePreset } from './utils/types';

const testPresets: ThemePreset[] = [
  { name: 'Default', light: null, dark: null },
  {
    name: 'Custom',
    light: { primary: [new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)')] },
    dark: { primary: [new Color('--cds-alias-primary', 'hsl(160deg 69% 53%)')] },
  },
];

export interface ThisTest {
  fixture: ComponentFixture<ThemeBuilderComponent>;
  component: ThemeBuilderComponent;
}

describe('ThemeBuilderComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ThemeBuilderComponent] });
    testContext.fixture = TestBed.createComponent(ThemeBuilderComponent);
    testContext.component = testContext.fixture.componentInstance;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('defaults presets to the Clarity Default preset plus the built-in PRESETS list, selecting the first one', () => {
    testContext.fixture.detectChanges(false);

    expect(testContext.component.presets[0]).toBe(CLARITY_DEFAULT_PRESET);
    PRESETS.forEach((preset, i) => expect(testContext.component.presets[i + 1]).toBe(preset));
    expect(testContext.component.activePreset).toBe(CLARITY_DEFAULT_PRESET);
  });

  it('always prepends the Clarity Default preset to a custom [presets] input and selects it', () => {
    testContext.component.presets = testPresets;
    testContext.fixture.detectChanges(false);

    expect(testContext.component.presets[0]).toBe(CLARITY_DEFAULT_PRESET);
    expect(testContext.component.presets[1]).toBe(testPresets[0]);
    expect(testContext.component.presets[2]).toBe(testPresets[1]);
    expect(testContext.component.activePreset).toBe(CLARITY_DEFAULT_PRESET);
  });

  it('keeps only the first preset with a name, ignoring case', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const renamed: ThemePreset = { ...testPresets[1], name: 'CUSTOM' };

    testContext.component.presets = [testPresets[1], testPresets[0], renamed];

    expect(testContext.component.presets).toEqual([CLARITY_DEFAULT_PRESET, testPresets[1], testPresets[0]]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'Theme builder: more than one preset is named "CUSTOM", so only the first one is kept.'
    );
  });

  it('never replaces the Clarity Default preset with one reusing its name', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const impostor: ThemePreset = { ...testPresets[1], name: 'clarity default' };

    testContext.component.presets = [impostor, testPresets[0]];

    expect(testContext.component.presets).toEqual([CLARITY_DEFAULT_PRESET, testPresets[0]]);
    expect(warn).toHaveBeenCalledExactlyOnceWith(
      'Theme builder: more than one preset is named "clarity default", so only the first one is kept.'
    );
  });

  it('renders the built-in preview by default', () => {
    testContext.fixture.detectChanges(false);

    const host: HTMLElement = testContext.fixture.nativeElement;
    expect(host.querySelector('clr-breadcrumbs')).toBeTruthy();
  });

  it('emits generatedCSS reporting no changes once the initial color structure is built', () => {
    const emitted: string[] = [];
    testContext.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    testContext.fixture.detectChanges(false);

    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[emitted.length - 1]).toContain('NO changes');
  });

  it('emits updated generatedCSS and clears the active preset when a color is edited', () => {
    testContext.fixture.detectChanges(false);

    const emitted: string[] = [];
    testContext.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    const primaryBase = testContext.component.colorStruct['light']['primary'][0];
    testContext.component.setCurrentColor(
      primaryBase,
      '#112233',
      testContext.component.colorStruct['light']['primary']
    );

    expect(testContext.component.activePreset).toBeNull();
    expect(emitted[emitted.length - 1]).not.toContain('NO changes');
    expect(emitted[emitted.length - 1]).toContain('--cds-alias-primary:');
  });

  it('recomputes tint/shade/dark variants from an edited base color', () => {
    testContext.fixture.detectChanges(false);

    const primaryGroup: Color[] = testContext.component.colorStruct['light']['primary'];
    const primaryBase = primaryGroup.find(c => c.label === 'Base');
    const shade = primaryGroup.find(c => c.label === 'Shade');
    const originalShadeHsl = shade.hsl;

    testContext.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

    expect(shade.hsl).not.toBe(originalShadeHsl);
    expect(shade.color.h).toBe(primaryBase.color.h);
  });

  it('ignores non-hex input in setCurrentColor', () => {
    testContext.fixture.detectChanges(false);

    const primaryBase = testContext.component.colorStruct['light']['primary'][0];
    const before = primaryBase.hsl;

    testContext.component.setCurrentColor(primaryBase, 'not-a-hex-color');

    expect(primaryBase.hsl).toBe(before);
  });

  it('applies a preset to both the light and dark color structures', () => {
    testContext.component.presets = testPresets;
    testContext.fixture.detectChanges(false);

    testContext.component.applyPreset(testPresets[1]);

    const lightPrimary = testContext.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    const darkPrimary = testContext.component.colorStruct['dark']['primary'].find(c => c.label === 'Base');

    expect(lightPrimary.hsl).toBe('hsl(160deg, 69%, 36%)');
    expect(darkPrimary.hsl).toBe('hsl(160deg, 69%, 53%)');
    expect(testContext.component.activePreset).toBe(testPresets[1]);
  });

  it("derives each theme's primary variants from that theme's base when applying a preset", () => {
    testContext.component.presets = testPresets;
    testContext.fixture.detectChanges(false);

    testContext.component.applyPreset(testPresets[1]);

    const variantsByLabel = (theme: string) =>
      Object.fromEntries(testContext.component.colorStruct[theme]['primary'].map(c => [c.label, c.hsl]));

    expect(variantsByLabel('light')).toEqual({
      Base: 'hsl(160deg, 69%, 36%)',
      Tint: 'hsl(160deg, 69%, 94%)',
      'Tint dark': 'hsl(160deg, 69%, 95%)',
      Shade: 'hsl(160deg, 69%, 29%)',
      Dark: 'hsl(160deg, 69%, 26%)',
    });
    expect(variantsByLabel('dark')).toEqual({
      Base: 'hsl(160deg, 69%, 53%)',
      Tint: 'hsl(160deg, 69%, 25%)',
      'Tint dark': 'hsl(160deg, 69%, 18%)',
      Shade: 'hsl(160deg, 69%, 60%)',
      Dark: 'hsl(160deg, 69%, 73%)',
    });
  });

  it('restores original colors when re-applying the null (Clarity Default) preset', () => {
    testContext.component.presets = testPresets;
    testContext.fixture.detectChanges(false);

    testContext.component.applyPreset(testPresets[1]);
    testContext.component.applyPreset(testPresets[0]);

    const lightPrimary = testContext.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    expect(lightPrimary.isOriginalColor).toBe(true);
  });

  it('applies a preset that specifies a full set of variants for a group, not just the base', () => {
    const fullVariantPreset: ThemePreset = {
      name: 'Full variants',
      light: {
        primary: [
          new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)'),
          new Color('--cds-alias-primary-shade', 'hsl(200deg 50% 20%)'),
        ],
      },
      dark: {},
    };
    testContext.fixture.detectChanges(false);

    testContext.component.applyPreset(fullVariantPreset);

    const primaryGroup = testContext.component.colorStruct['light']['primary'];
    const base = primaryGroup.find(c => c.label === 'Base');
    const shade = primaryGroup.find(c => c.label === 'Shade');
    const tint = primaryGroup.find(c => c.label === 'Tint');

    expect(base.hsl).toBe('hsl(160deg, 69%, 36%)');
    // The preset's explicit shade overrides what colorBuilder would have derived from the base.
    expect(shade.hsl).toBe('hsl(200deg, 50%, 20%)');
    // Variants not specified by the preset are still derived from the base as usual.
    expect(tint.color.h).toBe(base.color.h);
  });

  it('ignores a group override whose base token name has no match in that color group', () => {
    // A malformed/stale preset: the "primary" group's override is tagged as a base
    // token (its name is one of TOKEN_KEYS.baseTokens), but it's actually the "info"
    // group's base token name, so it has no match inside colorStruct['light']['primary'].
    const malformedPreset: ThemePreset = {
      name: 'Malformed',
      light: { primary: [new Color('--cds-alias-status-info', 'hsl(160deg 69% 36%)')] },
      dark: {},
    };
    testContext.fixture.detectChanges(false);

    expect(() => testContext.component.applyPreset(malformedPreset)).not.toThrow();

    const base = testContext.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    expect(base.isOriginalColor).toBe(true);
  });

  it('resets an individual color back to its original value', () => {
    testContext.fixture.detectChanges(false);

    const primaryBase = testContext.component.colorStruct['light']['primary'][0];
    testContext.component.setCurrentColor(primaryBase, '#112233');
    expect(primaryBase.isOriginalColor).toBe(false);

    const fakeEvent = { stopPropagation: () => {} } as Event;
    testContext.component.resetColor(fakeEvent, primaryBase);

    expect(primaryBase.isOriginalColor).toBe(true);
  });

  it('toggles the active preview theme between light and dark', () => {
    testContext.fixture.detectChanges(false);

    expect(testContext.component.activeTheme).toBe('light');
    testContext.component.toggleActiveTheme();
    expect(testContext.component.activeTheme).toBe('dark');
    expect(testContext.component.isDarkTheme).toBe(true);
    testContext.component.toggleActiveTheme();
    expect(testContext.component.activeTheme).toBe('light');
  });

  it('includes the warning-text override in generatedCSS only while enabled', () => {
    testContext.fixture.detectChanges(false);

    const warningBase = testContext.component.colorStruct['light']['warning'][0];
    testContext.component.setCurrentColor(warningBase, '#f0a000');

    expect(testContext.component.warningTextOverrideEnabled).toBe(true);
    expect(testContext.component.generatedCss).toContain('--cds-alias-typography-color-black');

    testContext.component.warningTextOverrideEnabled = false;
    testContext.component.onWarningTextOverrideChange();

    expect(testContext.component.generatedCss).not.toContain('--cds-alias-typography-color-black');
  });

  describe('importCSS', () => {
    it('re-applies a color exported via generatedCss, deriving its variants', () => {
      testContext.fixture.detectChanges(false);

      const primaryGroup = testContext.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      testContext.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      const css = testContext.component.generatedCss;

      testContext.component.resetAllThemeColors('light');
      expect(primaryBase.isOriginalColor).toBe(true);

      testContext.component.importCSS(css);

      const shade = primaryGroup.find(c => c.label === 'Shade');
      expect(primaryBase.isOriginalColor).toBe(false);
      expect(primaryBase.hex).toBe('#112233');
      expect(shade.color.h).toBe(primaryBase.color.h);
      expect(testContext.component.activePreset).toBeNull();
    });

    it('clears colors not present in the imported CSS', () => {
      testContext.fixture.detectChanges(false);

      const primaryGroup = testContext.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      testContext.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      const infoGroup = testContext.component.colorStruct['light']['info'];
      const infoBase = infoGroup.find(c => c.label === 'Base');
      testContext.component.setCurrentColor(infoBase, '#332211', infoGroup);

      // CSS mentioning only the primary change — info should be reset back to original.
      const css = `[cds-theme~='light'] {\n  ${primaryBase.name}: ${primaryBase.hsl};\n}`;

      testContext.component.importCSS(css);

      expect(primaryBase.isOriginalColor).toBe(false);
      expect(infoBase.isOriginalColor).toBe(true);
    });

    it('leaves the current colors untouched and returns false for malformed CSS', () => {
      testContext.fixture.detectChanges(false);

      const primaryGroup = testContext.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      testContext.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      const malformed = `[cds-theme~='light'] {\n  ${primaryBase.name}: hsl(1.2.3deg 50% 50%);\n}`;

      for (const css of [malformed, 'not generated css']) {
        expect(testContext.component.importCSS(css)).toBe(false);
        expect(primaryBase.hex).toBe('#112233');
      }
    });

    it('returns true when the CSS is applied', () => {
      testContext.fixture.detectChanges(false);

      const primaryGroup = testContext.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      testContext.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      expect(testContext.component.importCSS(testContext.component.generatedCss)).toBe(true);
    });

    it("refuses the generated CSS of an unchanged theme (the '/* NO changes */' output)", () => {
      testContext.fixture.detectChanges(false);

      expect(testContext.component.generatedCss).toContain('NO changes');
      expect(testContext.component.importCSS(testContext.component.generatedCss)).toBe(false);
    });
  });

  describe('presetSwatchColor', () => {
    it("returns the preset's light primary base color as a hex string", () => {
      testContext.fixture.detectChanges(false);

      const primaryColor = new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)');
      const preset: ThemePreset = { name: 'Swatch test', light: { primary: [primaryColor] }, dark: {} };

      expect(testContext.component.presetSwatchColor(preset)).toBe('#1c9b71');
    });

    it('returns undefined when the preset has no light colors (e.g. Clarity Default)', () => {
      testContext.fixture.detectChanges(false);

      const preset: ThemePreset = { name: 'Clarity Default', light: null, dark: null };

      expect(testContext.component.presetSwatchColor(preset)).toBeUndefined();
    });

    it("returns undefined when the preset's light colors don't include a primary group", () => {
      testContext.fixture.detectChanges(false);

      const preset: ThemePreset = {
        name: 'No primary',
        light: { info: [new Color('--cds-alias-status-info', 'hsl(200deg 80% 50%)')] },
        dark: {},
      };

      expect(testContext.component.presetSwatchColor(preset)).toBeUndefined();
    });

    it('returns undefined when the preset has an empty primary group', () => {
      testContext.fixture.detectChanges(false);

      const preset: ThemePreset = { name: 'Empty primary', light: { primary: [] }, dark: {} };

      expect(testContext.component.presetSwatchColor(preset)).toBeUndefined();
    });
  });
});

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ThemeBuilderComponent],
  template: `
    <clr-theme-builder>
      <div class="custom-preview-marker">Custom preview content</div>
    </clr-theme-builder>
  `,
})
class ProjectedContentHostComponent {
  @ViewChild(ThemeBuilderComponent) themeBuilder: ThemeBuilderComponent;
}

describe('ThemeBuilderComponent with projected content', () => {
  let fixture: ComponentFixture<ProjectedContentHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ProjectedContentHostComponent] });
    fixture = TestBed.createComponent(ProjectedContentHostComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders projected content above the built-in preview', () => {
    fixture.detectChanges(false);

    const host: HTMLElement = fixture.nativeElement;
    const marker = host.querySelector('.custom-preview-marker');
    const breadcrumbs = host.querySelector('clr-breadcrumbs');

    expect(marker).toBeTruthy();
    expect(breadcrumbs).toBeTruthy();
    expect(marker.compareDocumentPosition(breadcrumbs) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
