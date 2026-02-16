/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, inject, PlatformRef, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

declare let gtag: any;

export const logPageViewOnNavigationEndProvider: EnvironmentProviders = provideAppInitializer(() => {
  const initializerFn = logPageViewOnNavigationEndFactory(inject(PlatformRef), inject(Router));
  return initializerFn();
});

function logPageViewOnNavigationEndFactory(platformRef: PlatformRef, router: Router): () => void {
  return () => {
    // gtag does not exist if we aren't on the production site
    if (typeof gtag !== 'undefined') {
      const subscription = router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe(event => {
          gtag('send', 'pageview', event.urlAfterRedirects);
        });

      platformRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  };
}
