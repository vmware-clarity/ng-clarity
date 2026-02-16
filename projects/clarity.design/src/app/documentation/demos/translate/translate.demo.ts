/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@cds/core/icon';
import {
  AppfxLocale,
  appfxMissingTranslationToken,
  AppfxTranslateService,
  AppfxTranslations,
  appfxTranslationsToken,
  DateTimeFormatOptions,
  DateTimeKind,
  HourFormat,
} from '@clr/addons/translate';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

/* eslint-disable @typescript-eslint/no-var-requires */
const DefaultHtml = require('!raw-loader!./ng/default.html').default;
const DefaultTs = require('!raw-loader!./ng/default.ts').default;

@Component({
  selector: 'clr-translate-addon-demo',
  templateUrl: './translate.demo.html',
  styleUrl: './translate.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  standalone: false,
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
