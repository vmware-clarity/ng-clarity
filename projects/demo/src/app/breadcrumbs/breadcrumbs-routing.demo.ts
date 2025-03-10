/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { BreadcrumbDemoService } from './breadcrumb.demo.service';
import { MenuItem } from './breadcrumbs.demo.model';

@Component({
  selector: 'clr-breadcrumbs-routing-demo',
  templateUrl: './breadcrumbs-routing.demo.html',
})
export class BreadcrumbsRoutingDemo implements OnInit {
  menuItems: Observable<MenuItem[]>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breadcrumbservice: BreadcrumbDemoService
  ) {}

  ngOnInit(): void {
    this.menuItems = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() => this.breadcrumbservice.createBreadcrumbs(this.activatedRoute.root))
    );
  }
}
