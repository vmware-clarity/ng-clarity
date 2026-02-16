/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
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
import { ClrSelectModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',
  standalone: true,
  imports: [AppfxTranslateModule, ClrSelectModule, CommonModule, FormsModule],
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
export class ExampleComponent {
  readonly locales = Object.entries(AppfxLocale);

  readonly dateTimeKinds = Object.entries(DateTimeKind).filter(([key]) => Number.isNaN(Number(key)));
  readonly hourFormats = Object.entries(HourFormat);

  readonly dateTimeFormat: DateTimeFormatOptions = {
    dateTimeKind: DateTimeKind.DateTime,
    hourFormat: HourFormat.Hour24,
  };

  constructor(readonly translateService: AppfxTranslateService) {}

  getNow(): Date {
    return new Date();
  }
}
