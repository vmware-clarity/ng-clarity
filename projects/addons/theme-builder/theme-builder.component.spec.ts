/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ThemeBuilderComponent } from './theme-builder.component';
import { Color } from './utils/color';
import { PRESETS } from './utils/presets';
import { ThemePreset } from './utils/types';

const buildStructureMs = 200;

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
  beforeEach(function (this: ThisTest) {
    TestBed.configureTestingModule({ imports: [ThemeBuilderComponent, NoopAnimationsModule] });
    this.fixture = TestBed.createComponent(ThemeBuilderComponent);
    this.component = this.fixture.componentInstance;
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  it('defaults presets to the built-in PRESETS list and selects the first one', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    expect(this.component.presets).toBe(PRESETS);
    expect(this.component.activePreset).toBe(PRESETS[0]);
  }));

  it('selects the first entry of a custom [presets] input', fakeAsync(function (this: ThisTest) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    expect(this.component.activePreset).toBe(testPresets[0]);
  }));

  it('renders the built-in preview by default', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);
    this.fixture.detectChanges();

    const host: HTMLElement = this.fixture.nativeElement;
    expect(host.querySelector('clr-breadcrumbs')).toBeTruthy();
  }));

  it('emits generatedCSS reporting no changes once the initial color structure is built', fakeAsync(function (
    this: ThisTest
  ) {
    const emitted: string[] = [];
    this.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    expect(emitted.length).toBeGreaterThan(0);
    expect(emitted[emitted.length - 1]).toContain('NO changes');
  }));

  it('emits updated generatedCSS and clears the active preset when a color is edited', fakeAsync(function (
    this: ThisTest
  ) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    const emitted: string[] = [];
    this.component.generatedCSS.subscribe((css: string) => emitted.push(css));

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    this.component.setCurrentColor(primaryBase, '#112233', this.component.colorStruct['light']['primary']);

    expect(this.component.activePreset).toBeNull();
    expect(emitted[emitted.length - 1]).not.toContain('NO changes');
    expect(emitted[emitted.length - 1]).toContain('--cds-alias-primary:');
  }));

  it('recomputes tint/shade/dark variants from an edited base color', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    const primaryGroup: Color[] = this.component.colorStruct['light']['primary'];
    const primaryBase = primaryGroup.find(c => c.label === 'Base');
    const shade = primaryGroup.find(c => c.label === 'Shade');
    const originalShadeHsl = shade.hsl;

    this.component.setCurrentColor(primaryBase, '#112233', primaryGroup);

    expect(shade.hsl).not.toBe(originalShadeHsl);
    expect(shade.color.h).toBe(primaryBase.color.h);
  }));

  it('ignores non-hex input in setCurrentColor', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    const before = primaryBase.hsl;

    this.component.setCurrentColor(primaryBase, 'not-a-hex-color');

    expect(primaryBase.hsl).toBe(before);
  }));

  it('applies a preset to both the light and dark color structures', fakeAsync(function (this: ThisTest) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    this.component.applyPreset(testPresets[1]);

    const lightPrimary = this.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    const darkPrimary = this.component.colorStruct['dark']['primary'].find(c => c.label === 'Base');

    expect(lightPrimary.hsl).toBe('hsl(160deg, 69%, 36%)');
    expect(darkPrimary.hsl).toBe('hsl(160deg, 69%, 53%)');
    expect(this.component.activePreset).toBe(testPresets[1]);
  }));

  it('restores original colors when re-applying the null (Clarity Default) preset', fakeAsync(function (
    this: ThisTest
  ) {
    this.component.presets = testPresets;
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    this.component.applyPreset(testPresets[1]);
    this.component.applyPreset(testPresets[0]);

    const lightPrimary = this.component.colorStruct['light']['primary'].find(c => c.label === 'Base');
    expect(lightPrimary.isOriginalColor).toBe(true);
  }));

  it('resets an individual color back to its original value', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    const primaryBase = this.component.colorStruct['light']['primary'][0];
    this.component.setCurrentColor(primaryBase, '#112233');
    expect(primaryBase.isOriginalColor).toBe(false);

    const fakeEvent = { stopPropagation: () => {} } as Event;
    this.component.resetColor(fakeEvent, primaryBase);

    expect(primaryBase.isOriginalColor).toBe(true);
  }));

  it('toggles the active preview theme between light and dark', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    expect(this.component.activeTheme).toBe('light');
    this.component.toggleActiveTheme();
    expect(this.component.activeTheme).toBe('dark');
    expect(this.component.isDarkTheme).toBe(true);
    this.component.toggleActiveTheme();
    expect(this.component.activeTheme).toBe('light');
  }));

  it('includes the warning-text override in generatedCSS only while enabled', fakeAsync(function (this: ThisTest) {
    this.fixture.detectChanges(false);
    tick(buildStructureMs);

    const warningBase = this.component.colorStruct['light']['warning'][0];
    this.component.setCurrentColor(warningBase, '#f0a000');

    expect(this.component.warningTextOverrideEnabled).toBe(true);
    expect(this.component.generatedCss).toContain('--cds-alias-typography-color-black');

    this.component.warningTextOverrideEnabled = false;
    this.component.onWarningTextOverrideChange();

    expect(this.component.generatedCss).not.toContain('--cds-alias-typography-color-black');
  }));
});

@Component({
  imports: [ThemeBuilderComponent],
  template: `
    <clr-theme-builder [customContent]="true">
      <div class="custom-preview-marker">Custom preview content</div>
    </clr-theme-builder>
  `,
})
class CustomContentHostComponent {
  @ViewChild(ThemeBuilderComponent) themeBuilder: ThemeBuilderComponent;
}

describe('ThemeBuilderComponent with customContent', () => {
  let fixture: ComponentFixture<CustomContentHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CustomContentHostComponent, NoopAnimationsModule] });
    fixture = TestBed.createComponent(CustomContentHostComponent);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('renders projected content instead of the built-in preview', fakeAsync(() => {
    fixture.detectChanges(false);
    tick(buildStructureMs);
    fixture.detectChanges();

    const host: HTMLElement = fixture.nativeElement;
    expect(host.querySelector('.custom-preview-marker')).toBeTruthy();
    expect(host.querySelector('clr-breadcrumbs')).toBeFalsy();
  }));
});
