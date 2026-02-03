/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, NgModule } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { AppfxTranslateModule } from './translate.module';
import { TranslatePipe } from './translate.pipe';
import { AppfxLocale, AppfxTranslateService, AppfxTranslations, appfxTranslationsToken } from './translate.service';

const testTranslations1 = {
  [AppfxLocale.En]: {
    key: 't1',
  },
  [AppfxLocale.Es]: {
    key: 't1-es',
  },
} as unknown as AppfxTranslations;

const testTranslations2 = {
  [AppfxLocale.En]: {
    key: 't2',
  },
  [AppfxLocale.Es]: {
    key: 't2-es',
  },
} as unknown as AppfxTranslations;

@Component({
  selector: 'test-translate-first-component',
  standalone: false,
  template: "{{ 'key' | translate }}",
  providers: [AppfxTranslateService, { provide: appfxTranslationsToken, useValue: testTranslations1 }],
})
class Test1Component {}

@Component({
  selector: 'test-translate-second-component',
  standalone: false,
  template: "{{ 'key' | translate }}",
  providers: [AppfxTranslateService, { provide: appfxTranslationsToken, useValue: testTranslations2 }],
})
class Test2Component {}

@NgModule({
  declarations: [Test1Component],
  imports: [AppfxTranslateModule],
})
class TestModule1 {}

@NgModule({
  declarations: [Test2Component],
  imports: [AppfxTranslateModule],
})
class TestModule2 {}

describe('Pipe: Translate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppfxTranslateService, TranslatePipe],
    });
  });

  // Ensure that the locale is reset after each test because the locale state is global
  afterEach(inject([AppfxTranslateService], (service: AppfxTranslateService) => {
    service.locale = AppfxLocale.En;
  }));

  it('exists', inject([TranslatePipe], (pipe: TranslatePipe) => {
    expect(pipe).toBeTruthy();
  }));

  describe('when used in component 1', () => {
    let component1: ComponentFixture<Test1Component>;

    beforeEach(() => {
      const testbed = TestBed.configureTestingModule({
        imports: [TestModule1],
      });

      component1 = testbed.createComponent(Test1Component);
      component1.detectChanges();
    });

    it('has no translations outside the component', inject([TranslatePipe], (pipe: TranslatePipe) => {
      expect(pipe.transform('key')).toBe('key');
    }));

    it('translates with the proper appfxTranslations instance', () => {
      expect((component1.nativeElement as HTMLElement).textContent?.trim()).toBe('t1');
    });
  });

  describe('when used in component 2', () => {
    let component2: ComponentFixture<Test2Component>;

    beforeEach(() => {
      const testbed = TestBed.configureTestingModule({
        imports: [TestModule2],
      });

      component2 = testbed.createComponent(Test2Component);
      component2.detectChanges();
    });

    it('has no translations outside the component', inject([TranslatePipe], (pipe: TranslatePipe) => {
      expect(pipe.transform('key')).toBe('key');
    }));

    it('translates with the proper appfxTranslations instance', () => {
      expect((component2.nativeElement as HTMLElement).textContent?.trim()).toBe('t2');
    });
  });

  describe('when used with two components', () => {
    let component1: ComponentFixture<Test1Component>;
    let component2: ComponentFixture<Test2Component>;

    beforeEach(() => {
      const testbed = TestBed.configureTestingModule({
        imports: [TestModule1, TestModule2],
      });

      component1 = testbed.createComponent(Test1Component);
      component1.detectChanges();
      component2 = testbed.createComponent(Test2Component);
      component2.detectChanges();
    });

    it('has no translations outside the components', inject([TranslatePipe], (pipe: TranslatePipe) => {
      expect(pipe.transform('key')).toBe('key');
    }));

    it('translates component 1 with the proper appfxTranslations instance', () => {
      expect((component1.nativeElement as HTMLElement).textContent?.trim()).toBe('t1');
    });

    it('translates component 2 with the proper appfxTranslations instance', () => {
      expect((component2.nativeElement as HTMLElement).textContent?.trim()).toBe('t2');
    });

    describe('and the locale is changed', () => {
      beforeEach(inject([AppfxTranslateService], (service: AppfxTranslateService) => {
        service.locale = AppfxLocale.Es;
        component1.detectChanges();
        component2.detectChanges();
      }));

      it('has no translations outside the components', inject([TranslatePipe], (pipe: TranslatePipe) => {
        expect(pipe.transform('key')).toBe('key');
      }));

      it('translates component 1 with the proper appfxTranslations instance', () => {
        expect((component1.nativeElement as HTMLElement).textContent?.trim()).toBe('t1-es');
      });

      it('translates component 2 with the proper appfxTranslations instance', () => {
        expect((component2.nativeElement as HTMLElement).textContent?.trim()).toBe('t2-es');
      });
    });
  });
});
