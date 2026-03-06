/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, PlatformLocation } from '@angular/common';
import { Inject, Injectable, Optional, Provider } from '@angular/core';
import { UrlSerializer } from '@angular/router';

import { getFeatureFlags } from './feature-flags';

@Injectable()
export class FeatureFlagPathLocationStrategy extends PathLocationStrategy {
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

    for (const [featureFlagKey, featureEnabled] of Object.entries(getFeatureFlags())) {
      if (featureEnabled) {
        urlTree.queryParams = { ...urlTree.queryParams, [featureFlagKey]: 'true' };
      }
    }

    return urlTree.toString();
  }
}

export const featureFlagPathLocationStrategyProvider: Provider = {
  provide: LocationStrategy,
  useClass: FeatureFlagPathLocationStrategy,
};
