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
    light: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 36%)') },
    dark: { primary: new Color('--cds-alias-primary', 'hsl(160deg 69% 53%)') },
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
    TestBed.configureTestingModule({ imports: [ThemeBuilderComponent, NoopAnimationsModule] });
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

  it('restores original colors when re-applying the null (Clarity Default) preset', () => {
    testContext.component.presets = testPresets;
    testContext.fixture.detectChanges(false);

    testContext.component.applyPreset(testPresets[1]);
    testContext.component.applyPreset(testPresets[0]);

    const lightPrimary = testContext.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    expect(lightPrimary.isOriginalColor).toBe(true);
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
