/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export * from './date-time.pipe';
export * from './date-time.service';
export { AppfxTranslateModule } from './translate.module';
export {
  /**
   * @deprecated Use AppfxAppLinkingModule import instead.
   */
  AppfxTranslateModule as TranslateModule,
} from './translate.module';
export * from './translate.pipe';
export { appfxMissingTranslationToken, appfxTranslationsToken } from './translate.service';
export { defaultMissingTranslationHandler } from './translate.service';
export {
  /**
   * @deprecated Use AppfxTranslateService import instead.
   */
  AppfxTranslateService as TranslateService,
} from './translate.service';
export { AppfxTranslateService } from './translate.service';
export { AppfxTranslations } from './translate.service';
export {
  /**
   * @deprecated Use AppfxTranslations import instead.
   */
  AppfxTranslations as Translations,
} from './translate.service';
export { InterpolationParams } from './translate.service';
export { EmptyTranslationCallback } from './translate.service';
export {
  /**
   * @deprecated Use AppfxLocale import instead.
   */
  AppfxLocale as Locale,
} from './translate.service';
export { AppfxLocale } from './translate.service';
