/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AppfxLocale,
  appfxMissingTranslationToken,
  AppfxTranslateModule,
  AppfxTranslateService,
  AppfxTranslations,
  appfxTranslationsToken,
  DateTimeFormatOptions,
  DateTimeKind,
  HourFormat,
} from '@clr/addons/translate';
import {
  circleIcon,
  ClarityIcons,
  ClrAlertModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrSelectModule,
  dotCircleIcon,
  errorStandardIcon,
  successStandardIcon,
} from '@clr/angular';

import { TranslateAddonDemoModule } from './translate.demo.module';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const DefaultHtml = '';
const DefaultTs = '';

@Component({
  selector: 'clr-translate-addon-demo',
  templateUrl: './translate.demo.html',
  styleUrl: './translate.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  providers: [
    AppfxTranslateService,
    {
      provide: appfxMissingTranslationToken,
      useValue: (translations: AppfxTranslations, locale: AppfxLocale, key: string) => {
        return `<Missing translation for locale "${locale}" with key "${key}">`;
      },
    },
    {
      provide: appfxTranslationsToken,
      useValue: {
        [AppfxLocale.En]: {
          'hello-world': 'Hello World!',
        },
        [AppfxLocale.Es]: {
          'hello-world': 'Hola Mundo!',
        },
      },
    },
  ],
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ClrIcon,
    ClrIconModule,
    ClrAlertModule,
    ClrSelectModule,
    ClrCommonFormsModule,
    FormsModule,
    StackblitzExampleComponent,
    TranslateAddonDemoModule,
    AppfxTranslateModule,
  ],
})
export class TranslateAddonDemo extends ClarityDocComponent {
  defaultHtml = DefaultHtml;
  defaultTs = DefaultTs;

  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  readonly locales = Object.entries(AppfxLocale);

  readonly dateTimeKinds = Object.entries(DateTimeKind).filter(([key]) => Number.isNaN(Number(key)));
  readonly hourFormats = Object.entries(HourFormat);

  readonly dateTimeFormat: DateTimeFormatOptions = {
    dateTimeKind: DateTimeKind.DateTime,
    hourFormat: HourFormat.Hour24,
  };

  constructor(readonly translateService: AppfxTranslateService) {
    super('translate');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }

  getNow(): Date {
    return new Date();
  }
}
