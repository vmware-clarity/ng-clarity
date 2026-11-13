import * as i0 from "@angular/core";
import { InjectionToken, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";
import * as i3 from "@angular/common";
export type AppfxTranslations = Readonly<Record<AppfxLocale, Readonly<Record<string, string>>>>;
export type InterpolationParams = Readonly<Record<string, unknown>>;
export type EmptyTranslationCallback = (translations: AppfxTranslations, locale: AppfxLocale, key: string, args?: InterpolationParams) => string;
/**
 * Injection token which provides the translation strings.
 */
export declare const appfxTranslationsToken: InjectionToken<Readonly<Record<AppfxLocale, Readonly<Record<string, string>>>>>;
/**
 * Injection token which overrides the default behavior for a missing translation string.
 */
export declare const appfxMissingTranslationToken: InjectionToken<EmptyTranslationCallback>;
/**
 * The default appfxMissingTranslation handler.
 *
 * Tries to translate into Locale.En and if that fails then the key is returned.
 */
export declare function defaultMissingTranslationHandler(translations: AppfxTranslations, locale: AppfxLocale, key: string): string;
/**
 * Supported locales in AppFx.
 */
export declare enum AppfxLocale {
  En = "en",
  Es = "es",
  Fr = "fr",
  Ja = "ja"
}
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
export declare class AppfxTranslateService {
  private readonly translations;
  private readonly emptyTranslationKeyCallback;
  private static readonly localeSubject;
  readonly localeChanged$: Observable<AppfxLocale>;
  constructor(translations: AppfxTranslations, emptyTranslationKeyCallback: EmptyTranslationCallback);
  get locale(): AppfxLocale;
  set locale(locale: AppfxLocale);
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
  translate(key: string, args?: InterpolationParams): string;
  /**
   * Converts the {@link AppfxTranslateService.locale} to BCP 47 Language Tag to use with {@link Intl.DateTimeFormat}
   */
  localeAsBcp47(): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<AppfxTranslateService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
export interface DateTimeFormatOptions {
  dateTimeKind: DateTimeKind;
  hourFormat?: HourFormat;
}
export declare enum DateTimeKind {
  Date = 0,
  Time = 1,
  DateTime = 2,
  LongDateTime = 3
}
export declare enum HourFormat {
  Hour12 = "h12",
  Hour24 = "h24"
}
export declare class DateTimeService {
  private readonly appfxTranslateService;
  private readonly optionsMap;
  private readonly defaultFormatOptions;
  constructor(appfxTranslateService: AppfxTranslateService);
  format(date?: Date, options?: DateTimeFormatOptions): string;
  private transformOptions;
  static ɵfac: i0.ɵɵFactoryDeclaration<DateTimeService, never>;
  static ɵprov: i0.ɵɵInjectableDeclaration<any>;
}
export declare class DateTimePipe implements PipeTransform {
  private readonly dateTimeService;
  constructor(dateTimeService: DateTimeService);
  transform(value?: Date, options?: DateTimeFormatOptions): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<DateTimePipe, never>;
  static ɵpipe: i0.ɵɵPipeDeclaration<DateTimePipe, "dateTime", false>;
}
export declare class TranslatePipe implements PipeTransform {
  private readonly appfxTranslateService;
  constructor(appfxTranslateService: AppfxTranslateService);
  transform(key: string, args?: Record<string, unknown>): string;
  static ɵfac: i0.ɵɵFactoryDeclaration<TranslatePipe, never>;
  static ɵpipe: i0.ɵɵPipeDeclaration<TranslatePipe, "translate", false>;
}
export declare class AppfxTranslateModule {
  static ɵfac: i0.ɵɵFactoryDeclaration<AppfxTranslateModule, never>;
  static ɵmod: i0.ɵɵNgModuleDeclaration<AppfxTranslateModule, [typeof DateTimePipe, typeof TranslatePipe], [typeof i3.CommonModule], [typeof DateTimePipe, typeof TranslatePipe]>;
  static ɵinj: i0.ɵɵInjectorDeclaration<AppfxTranslateModule>;
}
export { AppfxLocale as Locale, AppfxTranslateModule as TranslateModule, AppfxTranslateService as TranslateService, AppfxTranslations as Translations };