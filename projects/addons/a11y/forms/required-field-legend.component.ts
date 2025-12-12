/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { AppfxTranslateService, appfxTranslationsToken } from '@clr/addons/translate';

import { translations } from './required-field-legend.l10n';

@Component({
  selector: 'appfx-required-field-legend',
  standalone: false,
  templateUrl: 'required-field-legend.component.html',
  styleUrls: ['required-field-legend.component.scss'],
  providers: [
    AppfxTranslateService,
    {
      provide: appfxTranslationsToken,
      useValue: translations,
    },
  ],
})
export class RequiredFieldLegendComponent {}
