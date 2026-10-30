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
  provideZoneChangeDetection,
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
  restore: ((builder: ThemeBuilderComponent) => void) | undefined;
  @ViewChild(ThemeBuilderComponent) builder: ThemeBuilderComponent;
  ngAfterViewInit() {
    this.restore?.(this.builder);
  }
}

for (const zoneless of [true, false]) {
  describe(`Theme builder initialization (${zoneless ? 'zoneless' : 'zone-based'}, OnPush host)`, () => {
    let fixture: ComponentFixture<ThemeBuilderHost>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [ThemeBuilderHost],
        providers: [
          zoneless ? provideZonelessChangeDetection() : provideZoneChangeDetection(),
          provideCheckNoChangesConfig({ exhaustive: true }),
        ],
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
      const applyStyles = spyOn(pending.componentInstance, 'applyPreviewStyles');
      pending.componentInstance.ngAfterViewInit();
      pending.destroy();
      fixture.componentInstance.css.set('Render after destruction');
      await fixture.whenStable();
      expect(applyStyles).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('output').textContent).toBe('Render after destruction');
    });

    it('updates the preview and output after a preset is clicked', async () => {
      const preset = fixture.componentInstance.builder.presets[1];
      fixture.nativeElement.querySelectorAll('.tb-preset-card')[1].click();
      await fixture.whenStable();
      expect(fixture.componentInstance.builder.activePreset).toBe(preset);
      expect(fixture.nativeElement.querySelectorAll('.tb-preset-card')[1].classList).toContain('tb-preset-card-active');
      expect(fixture.componentInstance.css()).toBe(fixture.componentInstance.builder.generatedCss);
      expect(fixture.componentInstance.css()).toContain('--cds-alias-primary:');
      expect(
        fixture.componentInstance.builder.previewWrapper.nativeElement.style.getPropertyValue('--cds-alias-primary')
      ).toBe(preset.light.primary[0].hsl);
    });

    for (const request of ['preset', 'css'] as const) {
      it(`restores a ${request} requested from the host's first ngAfterViewInit`, async () => {
        const early = TestBed.createComponent(ThemeBuilderHost);
        const preset = fixture.componentInstance.builder.presets[1];
        fixture.componentInstance.builder.applyPreset(preset);
        const css = fixture.componentInstance.builder.generatedCss;
        early.componentInstance.restore = builder => {
          if (request === 'preset') {
            builder.applyPreset(preset);
          } else {
            expect(builder.importCSS(css)).toBe(true);
          }
        };
        early.autoDetectChanges();
        await early.whenStable();
        expect(early.nativeElement.querySelector('output').textContent).toContain('--cds-alias-primary:');
        expect(
          early.componentInstance.builder.previewWrapper.nativeElement.style.getPropertyValue('--cds-alias-primary')
        ).toBe(preset.light.primary[0].hsl);
        expect(early.componentInstance.builder.activePreset).toBe(request === 'preset' ? preset : null);
        early.destroy();
      });
    }

    it('uses the latest valid early request and does not replace it with malformed CSS', async () => {
      const early = TestBed.createComponent(ThemeBuilderHost);
      const source = fixture.componentInstance.builder;
      const first = source.presets[1];
      const last = source.presets[2];
      source.applyPreset(first);
      const css = source.generatedCss;
      early.componentInstance.restore = builder => {
        builder.applyPreset(first);
        expect(builder.importCSS(css)).toBe(true);
        builder.applyPreset(last);
        expect(builder.importCSS('invalid CSS')).toBe(false);
      };
      early.autoDetectChanges();
      await early.whenStable();
      expect(early.componentInstance.builder.activePreset).toBe(last);
      expect(
        early.componentInstance.builder.previewWrapper.nativeElement.style.getPropertyValue('--cds-alias-primary')
      ).toBe(last.light.primary[0].hsl);
      expect(early.nativeElement.querySelector('output').textContent).toContain('--cds-alias-primary:');
      early.destroy();
    });
  });
}
