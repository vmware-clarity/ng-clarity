/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';

import { MenuItem } from './breadcrumbs.demo.model';

@Component({
  selector: 'clr-breadcrumbs-demo',
  templateUrl: './breadcrumbs.demo.html',
  styleUrls: ['./breadcrumbs.demo.scss'],
})
export class BreadcrumbsDemo {
  readonly menuItems: Observable<MenuItem[]>;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    this.menuItems = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() => createBreadcrumbs(activatedRoute.root))
    );
  }
}

function createBreadcrumbs(route: ActivatedRoute): MenuItem[] {
  const breadcrumbs: MenuItem[] = [];
  let currentUrl = '';

  let currentRoute = route;

  while (currentRoute.children.length !== 0) {
    currentRoute = currentRoute.children[0];
    const currentRouteLabel = currentRoute.snapshot.data['breadcrumb'];
    const currentRouteUrl = currentRoute.snapshot.url.map(segment => segment.path).join('/');

    if (currentRouteUrl) {
      currentUrl += `/${currentRouteUrl}`;
    }

    if (currentRouteLabel && currentRouteUrl) {
      breadcrumbs.push({ label: currentRouteLabel, routerLink: currentUrl });
    }
  }

  return breadcrumbs;
}
