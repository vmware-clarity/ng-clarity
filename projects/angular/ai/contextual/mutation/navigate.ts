/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NgZone } from '@angular/core';
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
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { ClrNavigationOutcome } from './mutation.interface';

export type ClrFilledPath =
  | { segments: string[]; missing?: never; invalid?: never }
  | { missing: string; segments?: never; invalid?: never }
  | { invalid: string; segments?: never; missing?: never };

/**
 * Fills `:param` segments, one literal segment per value. `.` and `..` are refused: the router would
 * step up the path to a route nobody classified.
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
    if (value === '.' || value === '..') {
      return { invalid: name };
    }
    segments.push(value);
  }
  return { segments };
}

/** Built directly: `createUrlTree` would split at slashes and read `..` as a step up. */
export function urlTreeFor(segments: string[], queryParams: Record<string, string> = {}): UrlTree {
  const children: Record<string, UrlSegmentGroup> = segments.length
    ? {
        primary: new UrlSegmentGroup(
          segments.map(path => new UrlSegment(path, {})),
          {}
        ),
      }
    : {};
  return new UrlTree(new UrlSegmentGroup([], children), queryParams);
}

const NAVIGATION_TIMEOUT_MS = 60_000;

export interface ClrNavigationReport {
  outcome: ClrNavigationOutcome;
  url: string;
  detail?: string;
}

/**
 * Navigates and reports the outcome from the router's events: its promise is `true` after a redirect
 * and `false` for a skipped no-op.
 */
export function navigateAndReport(router: Router, target: UrlTree, zone: NgZone): Promise<ClrNavigationReport> {
  const requested = router.serializeUrl(target);
  return new Promise<ClrNavigationReport>(resolve => {
    let id: number | null = null;
    let redirected = false;
    let followedRedirect = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const settle = (report: ClrNavigationReport) => {
      subscription.unsubscribe();
      if (timer !== null) {
        clearTimeout(timer);
      }
      resolve(report);
    };
    const subscription = router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationStart) {
        // This navigation, by destination, and after a guard redirect, the redirect's own navigation.
        if ((id === null && event.url === requested) || redirected) {
          id = event.id;
          redirected = false;
        }
        return;
      }
      // A skipped navigation never starts, so it is the first thing heard of it.
      if (event instanceof NavigationSkipped && id === null && event.url === requested) {
        id = event.id;
      }
      if (!('id' in event) || (event as { id: number }).id !== id) {
        return;
      }
      if (event instanceof NavigationEnd) {
        settle({
          outcome: followedRedirect || event.urlAfterRedirects !== requested ? 'redirected' : 'navigated',
          url: router.url,
        });
      } else if (event instanceof NavigationCancel) {
        if (event.code === NavigationCancellationCode.Redirect) {
          redirected = true;
          followedRedirect = true;
          return;
        }
        settle({ ...cancellation(event.code), url: router.url });
      } else if (event instanceof NavigationSkipped) {
        settle(
          event.code === NavigationSkippedCode.IgnoredSameUrlNavigation
            ? { outcome: 'unchanged', url: router.url }
            : { outcome: 'failed', url: router.url, detail: 'The application does not let the router handle this URL.' }
        );
      } else if (event instanceof NavigationError) {
        settle({ outcome: 'failed', url: router.url, detail: errorMessage(event.error) });
      }
    });

    // A guard waiting on the user can hold a navigation indefinitely. Timed outside the zone to keep the app stable.
    timer = zone.runOutsideAngular(() =>
      setTimeout(
        () =>
          settle({
            outcome: 'failed',
            url: router.url,
            detail: 'The navigation had not settled after a minute; it may still complete.',
          }),
        NAVIGATION_TIMEOUT_MS
      )
    );

    router.navigateByUrl(target).then(
      () => {
        zone.runOutsideAngular(() =>
          setTimeout(() => {
            if (!subscription.closed) {
              const url = router.url;
              settle(url === requested ? { outcome: 'navigated', url } : { outcome: 'failed', url });
            }
          })
        );
      },
      error => settle({ outcome: 'failed', url: router.url, detail: errorMessage(error) })
    );
  });
}

function cancellation(code: NavigationCancellationCode | undefined): { outcome: ClrNavigationOutcome; detail: string } {
  switch (code) {
    case NavigationCancellationCode.GuardRejected:
      return { outcome: 'rejected', detail: 'A route guard refused the navigation.' };
    case NavigationCancellationCode.SupersededByNewNavigation:
      return { outcome: 'superseded', detail: 'Another navigation started before this one finished.' };
    case NavigationCancellationCode.NoDataFromResolver:
      return { outcome: 'failed', detail: 'A route resolver completed without data.' };
    default:
      return { outcome: 'failed', detail: 'The navigation was cancelled.' };
  }
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error ?? 'The navigation failed.');
}
