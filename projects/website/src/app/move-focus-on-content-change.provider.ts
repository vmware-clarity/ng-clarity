/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, inject, PlatformRef, provideAppInitializer } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { delay, distinctUntilChanged, filter, map, skip } from 'rxjs';

export const moveFocusOnContentChangeProvider: EnvironmentProviders = provideAppInitializer(() => {
  const initializerFn = moveFocusOnContentChangeFactory(inject(PlatformRef), inject(Router));
  return initializerFn();
});

function moveFocusOnContentChangeFactory(platformRef: PlatformRef, router: Router): () => void {
  return () => {
    const subscription = router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        delay(0), // This ensures the DOM is updated.
        map(event => trimUrl(event.urlAfterRedirects)),
        distinctUntilChanged(),
        skip(1) // Don't move focus on first navigation.
      )
      .subscribe(moveFocusOnContentChange);

    platformRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  };
}

function moveFocusOnContentChange() {
  const h1Element = document.querySelector('h1');

  if (h1Element) {
    h1Element.setAttribute('tabindex', '-1');
    h1Element.focus();
  }
}

function trimUrl(url: string) {
  return (
    url
      // remove fragment (#heading)
      .replace(/#.+$/, '')
      // remove docs tab and all subsequent route segments
      .replace(/\/(code|themes|density|usage|api)(\/.+)?$/, '')
  );
}
