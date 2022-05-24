/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional, Provider } from '@angular/core';
import { UrlSerializer } from '@angular/router';

import { cdsThemeAttribute, getCdsThemeFromDom } from './cds-theme-select.component';

/**
 * This path location strategy adds the current theme to the query string so that
 * the selected theme persists across refreshes and link sharing.
 */
@Injectable()
export class CdsThemePathLocationStrategy extends PathLocationStrategy {
  constructor(
    platformLocation: PlatformLocation,
    @Optional() @Inject(APP_BASE_HREF) baseHref: string,
    private readonly urlSerializer: UrlSerializer
  ) {
    super(platformLocation, baseHref);
  }

  override prepareExternalUrl(internal: string): string {
    const url = super.prepareExternalUrl(internal);
    const urlTree = this.urlSerializer.parse(url);

    const currentTheme = getCdsThemeFromDom();

    if (currentTheme) {
      urlTree.queryParams = { ...urlTree.queryParams, [cdsThemeAttribute]: currentTheme };
    }

    return urlTree.toString();
  }
}

export const cdsThemePathLocationStrategyProvider: Provider = {
  provide: LocationStrategy,
  useClass: CdsThemePathLocationStrategy,
};
