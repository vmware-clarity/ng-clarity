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
  UrlSegment,
  UrlSegmentGroup,
  UrlTree,
} from '@angular/router';

import { ClrNavigationOutcome } from './mutation.interface';

/** A route pattern's path segments with its parameters filled in, or why it could not be filled. */
export type ClrFilledPath =
  | { segments: string[]; missing?: never; invalid?: never }
  | { missing: string; segments?: never; invalid?: never }
  | { invalid: string; segments?: never; missing?: never };

/**
 * Fills a route pattern's `:param` segments from the values given: `clusters/:id` with
 * `{ id: '42' }` is `['clusters', '42']`. Each value is one segment, literally — a slash
 * or a space in it stays part of that segment — and `.` or `..` is refused, because the
 * router would read it as a step up the path and arrive at a route nobody classified.
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

/**
 * The URL tree for literal path segments. Built directly rather than through
 * `createUrlTree`, which would split a segment at its slashes and read `..` as a step up.
 */
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

/** How long a navigation may take before it is reported as not having settled. */
const NAVIGATION_TIMEOUT_MS = 60_000;

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
        // This navigation, recognised by where it is going — not whichever navigation
        // happens to start next — and, after a guard redirected it, the redirect's own
        // navigation, followed to see where the user ends up.
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

    // A guard waiting on the user can hold a navigation indefinitely; the agent is told it
    // has not settled rather than left waiting for good.
    timer = setTimeout(
      () =>
        settle({
          outcome: 'failed',
          url: router.url,
          detail: 'The navigation had not settled after a minute; it may still complete.',
        }),
      NAVIGATION_TIMEOUT_MS
    );

    router.navigateByUrl(target).then(
      () => {
        // The events normally settle this first; should none have, the URL decides.
        setTimeout(() => {
          if (!subscription.closed) {
            const url = router.url;
            settle(url === requested ? { outcome: 'navigated', url } : { outcome: 'failed', url });
          }
        });
      },
      error => settle({ outcome: 'failed', url: router.url, detail: errorMessage(error) })
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
