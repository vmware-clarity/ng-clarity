/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppfxLocale, AppfxTranslateService } from '@clr/addons/translate';

import { AppfxA11yModule } from '../a11y.module';

@Component({
  imports: [AppfxA11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<appfx-required-field-legend></appfx-required-field-legend>',
})
class OnPushHost {}

describe('RequiredFieldLegendComponent in an OnPush host', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let translateService: AppfxTranslateService;

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    translateService = fixture.debugElement.children[0].injector.get(AppfxTranslateService);
  });

  afterEach(() => {
    // The locale is shared by every translate service instance.
    translateService.locale = AppfxLocale.En;
    fixture.destroy();
  });

  it('renders the legend in the current locale', () => {
    expect(fixture.nativeElement.textContent).toContain('Fields marked with');
    expect(fixture.nativeElement.textContent).toContain('are required');
  });

  it('renders the new locale when it changes after the legend was rendered', async () => {
    translateService.locale = AppfxLocale.Es;
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Campos marcados con');
    expect(fixture.nativeElement.textContent).toContain('son obligatorios');
  });
});
