/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  NavigationCancel,
  NavigationCancellationCode,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationSkippedCode,
  NavigationStart,
  Router,
  Event as RouterEvent,
  UrlTree,
} from '@angular/router';

import { ClrNavigationOutcome } from './mutation.interface';

/** A route pattern with its parameters filled in, or the parameter that was missing. */
export type ClrFilledPath = { url: string; missing?: never } | { missing: string; url?: never };

/**
 * Fills a route pattern's `:param` segments from the values given: `clusters/:id` with
 * `{ id: '42' }` is `/clusters/42`. Values are encoded, so a value with a slash in it
 * stays one segment rather than becoming two.
 */
export function fillRoutePath(pattern: string, params: Record<string, string> = {}): ClrFilledPath {
  const segments: string[] = [];
  for (const segment of pattern.split('/').filter(Boolean)) {
    if (!segment.startsWith(':')) {
      segments.push(segment);
      continue;
    }
    const name = segment.slice(1);
    const value = params[name];
    if (typeof value !== 'string' || !value) {
      return { missing: name };
    }
    segments.push(encodeURIComponent(value));
  }
  return { url: '/' + segments.join('/') };
}

export interface ClrNavigationReport {
  outcome: ClrNavigationOutcome;
  /** The router URL once the navigation has settled. */
  url: string;
  detail?: string;
}

/**
 * Navigates and reports what actually happened, from the router's event stream rather
 * than its promise. The promise resolves `true` when a guard redirected the user
 * elsewhere, because the redirect target did activate, and `false` when the navigation
 * was skipped as a no-op, so it cannot tell an agent whether it is where it asked to be.
 * The events can, and a redirect is followed to wherever it ends up so the reported URL
 * is the one the user is looking at.
 */
export function navigateAndReport(router: Router, target: UrlTree): Promise<ClrNavigationReport> {
  const requested = router.serializeUrl(target);
  return new Promise<ClrNavigationReport>(resolve => {
    let id: number | null = null;
    let redirected = false;
    const subscription = router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        if (id === null) {
          id = event.id;
        } else if (redirected) {
          // The redirect's own navigation: follow it to see where the user ends up.
          id = event.id;
        }
        return;
      }
      // A skipped navigation never starts, so it is the first thing heard of it.
      if (event instanceof NavigationSkipped && id === null) {
        id = event.id;
      }
      if (!('id' in event) || (event as { id: number }).id !== id) {
        return;
      }
      const settle = (report: ClrNavigationReport) => {
        subscription.unsubscribe();
        resolve(report);
      };
      if (event instanceof NavigationEnd) {
        settle({
          outcome: redirected || event.urlAfterRedirects !== requested ? 'redirected' : 'navigated',
          url: router.url,
        });
      } else if (event instanceof NavigationCancel) {
        if (event.code === NavigationCancellationCode.Redirect) {
          redirected = true;
          return;
        }
        settle({
          outcome:
            event.code === NavigationCancellationCode.GuardRejected
              ? 'rejected'
              : event.code === NavigationCancellationCode.SupersededByNewNavigation
                ? 'superseded'
                : 'failed',
          url: router.url,
          detail: cancellationDetail(event.code),
        });
      } else if (event instanceof NavigationSkipped) {
        settle({
          outcome: event.code === NavigationSkippedCode.IgnoredSameUrlNavigation ? 'unchanged' : 'failed',
          url: router.url,
          detail:
            event.code === NavigationSkippedCode.IgnoredSameUrlNavigation
              ? undefined
              : 'The application does not let the router handle this URL.',
        });
      } else if (event instanceof NavigationError) {
        settle({ outcome: 'failed', url: router.url, detail: errorMessage(event.error) });
      }
    });

    router.navigateByUrl(target).then(
      () => {
        // The events normally settle this first; should none have, the URL decides.
        setTimeout(() => {
          if (!subscription.closed) {
            subscription.unsubscribe();
            const url = router.url;
            resolve(url === requested ? { outcome: 'navigated', url } : { outcome: 'failed', url });
          }
        });
      },
      error => {
        subscription.unsubscribe();
        resolve({ outcome: 'failed', url: router.url, detail: errorMessage(error) });
      }
    );
  });
}

function cancellationDetail(code: NavigationCancellationCode | undefined): string | undefined {
  switch (code) {
    case NavigationCancellationCode.GuardRejected:
      return 'A route guard refused the navigation.';
    case NavigationCancellationCode.SupersededByNewNavigation:
      return 'Another navigation started before this one finished.';
    case NavigationCancellationCode.NoDataFromResolver:
      return 'A route resolver completed without data.';
    default:
      return 'The navigation was cancelled.';
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error ?? 'The navigation failed.');
}
