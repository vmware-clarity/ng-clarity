/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter } from 'rxjs';

import { MenuItem } from './breadcrumbs.demo.model';

@Component({
  selector: 'clr-breadcrumbs-routing-demo',
  templateUrl: './breadcrumbs-routing.demo.html',
})
export class BreadcrumbsRoutingDemo implements OnInit {
  menuItems = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.menuItems = this.createBreadcrumbs(this.activatedRoute.root);
    console.log('Menu:', this.menuItems);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged()
      )
      .subscribe(() => (this.menuItems = this.createBreadcrumbs(this.activatedRoute.root)));
  }

  createBreadcrumbs(route: ActivatedRoute, url = '', breadcrumbs: MenuItem[] = []): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
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
