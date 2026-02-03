/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type AppfxTranslations = Readonly<Record<AppfxLocale, Readonly<Record<string, string>>>>;
export type InterpolationParams = Readonly<Record<string, unknown>>;
export type EmptyTranslationCallback = (
  translations: AppfxTranslations,
  locale: AppfxLocale,
  key: string,
  args?: InterpolationParams
) => string;

/**
 * Injection token which provides the translation strings.
 */
export const appfxTranslationsToken = new InjectionToken<AppfxTranslations>('appfx-translations', {
  providedIn: 'root',
  factory: () => Object.fromEntries(Object.values(AppfxLocale).map(lang => [lang, {}])) as AppfxTranslations,
});

/**
 * Injection token which overrides the default behavior for a missing translation string.
 */
export const appfxMissingTranslationToken = new InjectionToken<EmptyTranslationCallback>('appfx-missing-translation', {
  providedIn: 'root',
  factory: () => defaultMissingTranslationHandler,
});

/**
 * The default appfxMissingTranslation handler.
 *
 * Tries to translate into Locale.En and if that fails then the key is returned.
 */
export function defaultMissingTranslationHandler(
  translations: AppfxTranslations,
  locale: AppfxLocale,
  key: string
): string {
  return translations?.[AppfxLocale.En]?.[key] ?? key;
}

/**
 * Supported locales in AppFx.
 */
export enum AppfxLocale {
  En = 'en',
  Es = 'es',
  Fr = 'fr',
  Ja = 'ja',
}

const placeholderRegex = /{{\s*?([^{}\s]*?)\s*?}}/g;

/**
 * Provide light weight translation capability for AppFx.
 *
 * Consumers of the AppFx library should sync the {@link AppfxTranslateService.locale} with their app locale.
 * Avoid using the service as a general purpose translate service as that
 *
 * @example <caption>Use the component providers to isolate its translations.</caption>
 * @Component({
 *     providers: [
 *         TranslateService,
 *         {
 *             provide: appfxTranslations,
 *             useValue: {
 *                 [Locale.En]: {
 *                     "hello-world": "Hello World!",
 *                 },
 *                 [Locale.De]: {
 *                     "hello-world": "Hallo Welt!",
 *                 },
 *             },
 *         },
 *         {
 *             provide: appfxMissingTranslation,
 *             useValue: (translations: Translations, locale: Locale, key: string, args?: InterpolationParams) => {
 *                 return \`<Missing translation for locale "\${locale}" with key "\${key}">\`;
 *             },
 *         },
 *     ],
 * })
 * export class TranslateDemoComponent {}
 */
@Injectable()
export class AppfxTranslateService {
  private static readonly localeSubject = new BehaviorSubject<AppfxLocale>(AppfxLocale.En);

  readonly localeChanged$: Observable<AppfxLocale> = AppfxTranslateService.localeSubject.asObservable();

  constructor(
    @Inject(appfxTranslationsToken) private readonly translations: AppfxTranslations,
    @Inject(appfxMissingTranslationToken)
    private readonly emptyTranslationKeyCallback: EmptyTranslationCallback
  ) {}

  get locale(): AppfxLocale {
    return AppfxTranslateService.localeSubject.value;
  }

  set locale(locale: AppfxLocale) {
    AppfxTranslateService.localeSubject.next(locale);
  }

  /**
   * Translates the given key in the current {@link AppfxTranslateService.locale}
   * @param key The translation key
   * @param args Optional key-value pairs where the key is interpolated in the translation value
   *             through placeholders using the moustache syntax. For example "{{ placeholder-key }}".
   *             If there's a missing interpolation param it's replaced with an empty string.
   *             If no interpolation params are passed then placeholders are treated as normal text.
   *
   * @example <caption>Translation with params</caption>
   * // Translations
   * ...
   * [Locale.En]: {
   *     "hello": "Hello {{ name }}!",
   * },
   * ...
   *
   * const value = translateService.translate("hello", { name: "World" });
   *
   * console.log(value); // "Hello World!"
   */
  translate(key: string, args?: InterpolationParams): string {
    const interpolationString: string =
      this.translations?.[this.locale]?.[key] ??
      this.emptyTranslationKeyCallback(this.translations, this.locale, key, args);

    if (!interpolationString || typeof args !== 'object' || !Object.keys(args).length) {
      return interpolationString;
    }

    return interpolationString.replace(placeholderRegex, (match, interpolationKey) => {
      return String(args?.[interpolationKey] ?? '');
    });
  }

  /**
   * Converts the {@link AppfxTranslateService.locale} to BCP 47 Language Tag to use with {@link Intl.DateTimeFormat}
   */
  localeAsBcp47(): string {
    return this.locale.replace('_', '-');
  }
}
