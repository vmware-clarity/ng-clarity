/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectionStrategy,
  Component,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
  signal,
  ViewChild,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeBuilderComponent } from './theme-builder.component';

@Component({
  imports: [ThemeBuilderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<clr-theme-builder (generatedCSS)="css.set($event)"></clr-theme-builder><output>{{ css() }}</output>',
})
class ThemeBuilderHost {
  readonly css = signal('');
  @ViewChild(ThemeBuilderComponent) builder: ThemeBuilderComponent;
}

describe('Theme builder initialization (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ThemeBuilderHost>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ThemeBuilderHost],
      providers: [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })],
    });
    fixture = TestBed.createComponent(ThemeBuilderHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('renders colors read from the preview after its first render without changing checked bindings', () => {
    expect(fixture.componentInstance.builder.themeColors.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('.tb-control-header').textContent).toContain('PRIMARY');
    expect(fixture.componentInstance.css()).toContain('/* NO changes */');
    expect(fixture.nativeElement.querySelector('output').textContent).toContain('/* NO changes */');
  });

  it('renders initialized controls without an output listener notifying the host', async () => {
    const standalone = TestBed.createComponent(ThemeBuilderComponent);
    standalone.autoDetectChanges();
    await standalone.whenStable();
    expect(standalone.nativeElement.querySelector('.tb-control-header').textContent).toContain('PRIMARY');
    standalone.destroy();
  });

  it('cancels pending initialization when destroyed before rendering', async () => {
    const pending = TestBed.createComponent(ThemeBuilderComponent);
    const applyStyles = vi.spyOn(pending.componentInstance, 'applyPreviewStyles');
    const output = vi.spyOn(pending.componentInstance.generatedCSS, 'emit');
    pending.componentInstance.ngAfterViewInit();
    pending.destroy();
    fixture.componentInstance.css.set('Render after destruction');
    await fixture.whenStable();
    expect(applyStyles).not.toHaveBeenCalled();
    expect(output).not.toHaveBeenCalled();
  });

  it('updates the preview and output after a preset is clicked', async () => {
    const preset = fixture.componentInstance.builder.presets[1];
    fixture.nativeElement.querySelectorAll('.tb-preset-card')[1].click();
    await fixture.whenStable();
    expect(fixture.componentInstance.builder.activePreset).toBe(preset);
    expect(fixture.nativeElement.querySelectorAll('.tb-preset-card')[1].classList).toContain('tb-preset-card-active');
    expect(fixture.componentInstance.css()).toBe(fixture.componentInstance.builder.generatedCss);
  });
});
