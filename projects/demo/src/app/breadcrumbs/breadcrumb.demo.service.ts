/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { MenuItem } from './breadcrumbs.demo.model';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbDemoService {
  breadcrumbs: BehaviorSubject<MenuItem[]> = new BehaviorSubject<MenuItem[]>([]);

  createBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    if (route.children.length === 0) {
      return breadcrumbs;
    }

    for (const child of route.children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      if (child.snapshot.data['breadcrumb'] && child.snapshot.url.length) {
        breadcrumbs.push({ label: child.snapshot.data['breadcrumb'], routerLink: url });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }
    return breadcrumbs;
  }
}
