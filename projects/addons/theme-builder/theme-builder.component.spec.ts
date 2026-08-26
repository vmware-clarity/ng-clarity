/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({ imports: [ThemeBuilderComponent, NoopAnimationsModule] });
    this.fixture = TestBed.createComponent(ThemeBuilderComponent);
    this.component = this.fixture.componentInstance;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('defaults presets to the Clarity Default preset plus the built-in PRESETS list, selecting the first one', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    expect(this.component.presets[0]).toBe(CLARITY_DEFAULT_PRESET);
    PRESETS.forEach((preset, i) => expect(this.component.presets[i + 1]).toBe(preset));
    expect(this.component.activePreset).toBe(CLARITY_DEFAULT_PRESET);
  });

  it('always prepends the Clarity Default preset to a custom [presets] input and selects it', function (this: ThisTest) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);

    expect(this.component.presets[0]).toBe(CLARITY_DEFAULT_PRESET);
    expect(this.component.presets[1]).toBe(testPresets[0]);
    expect(this.component.presets[2]).toBe(testPresets[1]);
    expect(this.component.activePreset).toBe(CLARITY_DEFAULT_PRESET);
  });

  it('renders the built-in preview by default', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const host: HTMLElement = this.fixture.nativeElement;
    expect(host.querySelector('clr-breadcrumbs')).toBeTruthy();
  });

  it('emits generatedCSS reporting no changes once the initial color structure is built', function (this: ThisTest) {
    const emitted: string[] = [];
    this.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    this.fixture.detectChanges(false);

    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[emitted.length - 1]).toContain('NO changes');
  });

  it('emits updated generatedCSS and clears the active preset when a color is edited', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const emitted: string[] = [];
    this.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    this.component.setCurrentColor(primaryBase, '#112233', this.component.colorStruct['light']['primary']);

    expect(this.component.activePreset).toBeNull();
    expect(emitted[emitted.length - 1]).not.toContain('NO changes');
    expect(emitted[emitted.length - 1]).toContain('--cds-alias-primary:');
  });

  it('recomputes tint/shade/dark variants from an edited base color', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const primaryGroup: Color[] = this.component.colorStruct['light']['primary'];
    const primaryBase = primaryGroup.find(c => c.label === 'Base');
    const shade = primaryGroup.find(c => c.label === 'Shade');
    const originalShadeHsl = shade.hsl;

    this.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

    expect(shade.hsl).not.toBe(originalShadeHsl);
    expect(shade.color.h).toBe(primaryBase.color.h);
  });

  it('ignores non-hex input in setCurrentColor', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    const before = primaryBase.hsl;

    this.component.setCurrentColor(primaryBase, 'not-a-hex-color');

    expect(primaryBase.hsl).toBe(before);
  });

  it('applies a preset to both the light and dark color structures', function (this: ThisTest) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);

    this.component.applyPreset(testPresets[1]);

    const lightPrimary = this.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    const darkPrimary = this.component.colorStruct['dark']['primary'].find(c => c.label === 'Base');

    expect(lightPrimary.hsl).toBe('hsl(160deg, 69%, 36%)');
    expect(darkPrimary.hsl).toBe('hsl(160deg, 69%, 53%)');
    expect(this.component.activePreset).toBe(testPresets[1]);
  });

  it('restores original colors when re-applying the null (Clarity Default) preset', function (this: ThisTest) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);

    this.component.applyPreset(testPresets[1]);
    this.component.applyPreset(testPresets[0]);

    const lightPrimary = this.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    expect(lightPrimary.isOriginalColor).toBe(true);
  });

  it('resets an individual color back to its original value', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    this.component.setCurrentColor(primaryBase, '#112233');
    expect(primaryBase.isOriginalColor).toBe(false);

    const fakeEvent = { stopPropagation: () => {} } as Event;
    this.component.resetColor(fakeEvent, primaryBase);

    expect(primaryBase.isOriginalColor).toBe(true);
  });

  it('toggles the active preview theme between light and dark', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    expect(this.component.activeTheme).toBe('light');
    this.component.toggleActiveTheme();
    expect(this.component.activeTheme).toBe('dark');
    expect(this.component.isDarkTheme).toBe(true);
    this.component.toggleActiveTheme();
    expect(this.component.activeTheme).toBe('light');
  });

  it('includes the warning-text override in generatedCSS only while enabled', function (this: ThisTest) {
    this.fixture.detectChanges(false);

    const warningBase = this.component.colorStruct['light']['warning'][0];
    this.component.setCurrentColor(warningBase, '#f0a000');

    expect(this.component.warningTextOverrideEnabled).toBe(true);
    expect(this.component.generatedCss).toContain('--cds-alias-typography-color-black');

    this.component.warningTextOverrideEnabled = false;
    this.component.onWarningTextOverrideChange();

    expect(this.component.generatedCss).not.toContain('--cds-alias-typography-color-black');
  });

  describe('importCSS', () => {
    it('re-applies a color exported via generatedCss, deriving its variants', function (this: ThisTest) {
      this.fixture.detectChanges(false);

      const primaryGroup = this.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      this.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      const css = this.component.generatedCss;

      this.component.resetAllThemeColors('light');
      expect(primaryBase.isOriginalColor).toBe(true);

      this.component.importCSS(css);

      const shade = primaryGroup.find(c => c.label === 'Shade');
      expect(primaryBase.isOriginalColor).toBe(false);
      expect(primaryBase.hex).toBe('#112233');
      expect(shade.color.h).toBe(primaryBase.color.h);
      expect(this.component.activePreset).toBeNull();
    });

    it('clears colors not present in the imported CSS', function (this: ThisTest) {
      this.fixture.detectChanges(false);

      const primaryGroup = this.component.colorStruct['light']['primary'];
      const primaryBase = primaryGroup.find(c => c.label === 'Base');
      this.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

      const infoGroup = this.component.colorStruct['light']['info'];
      const infoBase = infoGroup.find(c => c.label === 'Base');
      this.component.setCurrentColor(infoBase, '#332211', infoGroup);

      // CSS mentioning only the primary change — info should be reset back to original.
      const css = `[cds-theme~='light'] {\n  ${primaryBase.name}: ${primaryBase.hsl};\n}`;

      this.component.importCSS(css);

      expect(primaryBase.isOriginalColor).toBe(false);
      expect(infoBase.isOriginalColor).toBe(true);
    });
  });
});

@Component({
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
    TestBed.configureTestingModule({ imports: [ProjectedContentHostComponent, NoopAnimationsModule] });
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
