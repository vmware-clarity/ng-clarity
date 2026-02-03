/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, NgModule } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { AppfxTranslateModule } from './translate.module';
import {
  AppfxLocale,
  appfxMissingTranslationToken,
  AppfxTranslateService,
  AppfxTranslations,
  appfxTranslationsToken,
} from './translate.service';

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

interface TestTranslateComponent {
  translate(key: string): string;
}

@Component({
  selector: 'test-translate-component-one',
  standalone: false,
  template: '',
  providers: [AppfxTranslateService, { provide: appfxTranslationsToken, useValue: testTranslations1 }],
})
class Test1Component implements TestTranslateComponent {
  constructor(private readonly translateService: AppfxTranslateService) {}

  translate(key: string): string {
    return this.translateService.translate(key);
  }
}

@Component({
  selector: 'test-translate-component-two',
  standalone: false,
  template: '',
  providers: [AppfxTranslateService, { provide: appfxTranslationsToken, useValue: testTranslations2 }],
})
class Test2Component implements TestTranslateComponent {
  constructor(private readonly translateService: AppfxTranslateService) {}

  translate(key: string): string {
    return this.translateService.translate(key);
  }
}

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

describe('Service: Translate', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppfxTranslateService],
    });
  });

  // Ensure that the locale is reset after each test because the locale state is global
  afterEach(inject([AppfxTranslateService], (service: AppfxTranslateService) => {
    service.locale = AppfxLocale.En;
  }));

  it('exists', inject([AppfxTranslateService], (service: AppfxTranslateService) => {
    expect(service).toBeTruthy();
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

    it('has no translations outside the component', inject(
      [AppfxTranslateService],
      (service: AppfxTranslateService) => {
        expect(service.translate('key')).toBe('key');
      }
    ));

    it('translates with the proper appfxTranslations instance', () => {
      expect(component1.componentInstance.translate('key')).toBe('t1');
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

    it('has no translations outside the component', inject(
      [AppfxTranslateService],
      (service: AppfxTranslateService) => {
        expect(service.translate('key')).toBe('key');
      }
    ));

    it('translates with the proper appfxTranslations instance', () => {
      expect(component2.componentInstance.translate('key')).toBe('t2');
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

    it('has no translations outside the components', inject(
      [AppfxTranslateService],
      (service: AppfxTranslateService) => {
        expect(service.translate('key')).toBe('key');
      }
    ));

    it('translates component 1 with the proper appfxTranslations instance', () => {
      expect(component1.componentInstance.translate('key')).toBe('t1');
    });

    it('translates component 2 with the proper appfxTranslations instance', () => {
      expect(component2.componentInstance.translate('key')).toBe('t2');
    });

    describe('and the language is changed', () => {
      let languageChangedSpy: jasmine.Spy;

      beforeEach(inject([AppfxTranslateService], (service: AppfxTranslateService) => {
        languageChangedSpy = jasmine.createSpy('next');
        const subscription = service.localeChanged$.subscribe({ next: languageChangedSpy });
        service.locale = AppfxLocale.Es;
        subscription.unsubscribe();
      }));

      it('emits the new language through languageChanged', () => {
        expect(languageChangedSpy).toHaveBeenCalledWith(AppfxLocale.Es);
      });

      it('language getter returns the new language', inject(
        [AppfxTranslateService],
        (service: AppfxTranslateService) => {
          expect(service.locale).toBe(AppfxLocale.Es);
        }
      ));

      it('has no translations outside the components', inject(
        [AppfxTranslateService],
        (service: AppfxTranslateService) => {
          expect(service.translate('key')).toBe('key');
        }
      ));

      it('translates component 1 with the changed language', () => {
        expect(component1.componentInstance.translate('key')).toBe('t1-es');
      });

      it('translates component 2 with the changed language', () => {
        expect(component2.componentInstance.translate('key')).toBe('t2-es');
      });
    });
  });

  describe('when the default missing translations hook is invoked', () => {
    describe('and the english translation is present', () => {
      const testTranslations = {
        [AppfxLocale.En]: {
          'test-key': 'test (en)',
        },
        [AppfxLocale.Es]: {
          'test-key': 'test (de)',
        },
      };

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            AppfxTranslateService,
            {
              provide: appfxTranslationsToken,
              useValue: testTranslations,
            },
          ],
        });
      });

      it('the hook returns the english translation', inject(
        [AppfxTranslateService],
        (service: AppfxTranslateService) => {
          service.locale = AppfxLocale.Fr;
          expect(service.translate('test-key')).toBe('test (en)');
        }
      ));
    });

    describe('and the english translation is missing', () => {
      const testTranslations = {
        [AppfxLocale.Es]: {
          'test-key': 'test (es)',
        },
      };

      beforeEach(() => {
        TestBed.configureTestingModule({
          providers: [
            AppfxTranslateService,
            {
              provide: appfxTranslationsToken,
              useValue: testTranslations,
            },
          ],
        });
      });

      it('the hook returns the key', inject([AppfxTranslateService], (service: AppfxTranslateService) => {
        service.locale = AppfxLocale.Fr;
        expect(service.translate('test-key')).toBe('test-key');
      }));
    });
  });

  describe('when a custom missing translations hook is specified', () => {
    const testTranslations = {};
    const testInterpolations = {};
    let missingTranslationSpy: jasmine.Spy;

    beforeEach(() => {
      missingTranslationSpy = jasmine.createSpy('missingTranslation');

      TestBed.configureTestingModule({
        providers: [
          AppfxTranslateService,
          {
            provide: appfxTranslationsToken,
            useValue: testTranslations,
          },
          {
            provide: appfxMissingTranslationToken,
            useValue: missingTranslationSpy,
          },
        ],
      });
    });

    it('calls the hook with the correct parameters', inject(
      [AppfxTranslateService],
      (service: AppfxTranslateService) => {
        service.translate('test', testInterpolations);
        expect(missingTranslationSpy).toHaveBeenCalledWith(
          testTranslations,
          AppfxLocale.En,
          'test',
          testInterpolations
        );
      }
    ));
  });

  describe('all locales have translations', () => {
    const localeValues = Object.values(AppfxLocale);
    const testTranslations = Object.fromEntries(
      localeValues.map(value => [value, { 'test-key': `test ${value}` }])
    ) as unknown as AppfxTranslations;
    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AppfxTranslateService,
          {
            provide: appfxTranslationsToken,
            useValue: testTranslations,
          },
        ],
      });
    });

    for (const [key, value] of Object.entries(AppfxLocale)) {
      it(`translate for ${key} returns the ${key} translation`, inject(
        [AppfxTranslateService],
        (service: AppfxTranslateService) => {
          service.locale = value;
          expect(service.translate('test-key')).toBe(`test ${value}`);
        }
      ));
    }
  });

  describe('translate interpolation', () => {
    const valueInterpolated = 'Hello World!';
    const valueWithUnmodifiedInterpolationParam = 'Hello {{ name }}!';

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          AppfxTranslateService,
          {
            provide: appfxTranslationsToken,
            useValue: {
              [AppfxLocale.En]: {
                hello: valueWithUnmodifiedInterpolationParam,
              },
            },
          },
        ],
      });
    });

    it('with the correct interpolation arguments', inject([AppfxTranslateService], (service: AppfxTranslateService) => {
      expect(service.translate('hello', { name: 'World' })).toBe(valueInterpolated);
    }));

    it('with extra interpolation arguments', inject([AppfxTranslateService], (service: AppfxTranslateService) => {
      expect(service.translate('hello', { name: 'World', from: 'Earth' })).toBe(valueInterpolated);
    }));

    it('with missing interpolation arguments', inject([AppfxTranslateService], (service: AppfxTranslateService) => {
      expect(service.translate('hello', {})).toBe(valueWithUnmodifiedInterpolationParam);
      expect(service.translate('hello')).toBe(valueWithUnmodifiedInterpolationParam);
    }));

    describe('corner cases', () => {
      function setup(value: string): void {
        TestBed.configureTestingModule({
          providers: [
            AppfxTranslateService,
            {
              provide: appfxTranslationsToken,
              useValue: {
                [AppfxLocale.En]: {
                  hello: value,
                },
              },
            },
          ],
        });
      }

      it('without spaces around the placeholder', () => {
        setup('Hello {{name}}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { name: 'World' })).toBe(valueInterpolated);
      });

      it('with excessive spaces around the placeholder', () => {
        setup('Hello {{   name     }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { name: 'World' })).toBe(valueInterpolated);
      });

      it('with tabs around the placeholder', () => {
        setup('Hello {{\tname\t}}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { name: 'World' })).toBe(valueInterpolated);
      });

      it('with dashes in the interpolation keys', () => {
        setup('Hello {{     name-key }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { 'name-key': 'World' })).toBe(valueInterpolated);
      });

      it('with underscores in the interpolation keys', () => {
        setup('Hello {{ name_key }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { name_key: 'World' })).toBe(valueInterpolated);
      });

      it('with number in the interpolation keys', () => {
        setup('Hello {{ 123 }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { '123': 'World' })).toBe(valueInterpolated);
      });

      it('with symbols in the interpolation keys', () => {
        setup('Hello {{ !@#$%^&*() }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { '!@#$%^&*()': 'World' })).toBe(valueInterpolated);
      });

      it('with empty curly brackets', () => {
        setup('Hello {{ }}!');

        const service = TestBed.inject(AppfxTranslateService);
        expect(service.translate('hello', { name: 'World' })).toBe('Hello !');
      });
    });
  });
});
