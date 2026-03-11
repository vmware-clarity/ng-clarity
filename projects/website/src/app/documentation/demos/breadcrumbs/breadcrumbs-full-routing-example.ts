/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BreadcrumbItem, ClrBreadcrumbsModule, ClrIcon, ClrIconModule, ClrVerticalNavModule } from '@clr/angular';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<div class="main-container">
  <header class="header">
    <div class="branding">
      <a routerLink="./framework" routerLinkActive="active">
        <clr-icon shape="cog"></clr-icon>
        <span class="title">Technology</span>
      </a>
    </div>
  </header>
  <div class="content-container">
    <clr-vertical-nav>
      <a clrVerticalNavLink routerLink="./framework" routerLinkActive="active">Framework</a>
    </clr-vertical-nav>
    <div class="content-area breadcrumbs-content-area">
      <clr-breadcrumbs [items]="(breadcrumbs | async) || []"></clr-breadcrumbs>
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
`;

const TS_EXAMPLE = `
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  
  imports: [ClrBreadcrumbsModule, ClarityModule, RouterModule, CommonModule],
})
export class ExampleComponent {
  readonly breadcrumbs: Observable<BreadcrumbItem[]>;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    ClarityIcons.addIcons(cogIcon);

    this.breadcrumbs = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() => createBreadcrumbs(activatedRoute.root))
    );
  }
}

function createBreadcrumbs(route: ActivatedRoute): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  let currentUrl = '';

  let currentRoute = route;

  while (currentRoute.children.length !== 0) {
    currentRoute = currentRoute.children[0];
    const currentRouteLabel = currentRoute.snapshot.data['breadcrumb'];
    const currentRouteUrl = currentRoute.snapshot.url.map(segment => segment.path).join('/');

    if (currentRouteUrl) {
      currentUrl += \`/\${currentRouteUrl}\`;
    }

    if (currentRouteLabel && currentRouteUrl) {
      breadcrumbs.push({ label: currentRouteLabel, routerLink: currentUrl });
    }
  }

  return breadcrumbs;
}
`;

const additionalFiles = {
  'app.routes.ts': require('!raw-loader!./stackblitz-examples/app.routes').default,
  'stackblitz-examples/project-technology/react-example.ts':
    require('!raw-loader!./stackblitz-examples/project-technology/react-example').default,
  'stackblitz-examples/project-technology/framework-example.ts':
    require('!raw-loader!./stackblitz-examples/project-technology/framework-example').default,
  'stackblitz-examples/project-technology/angular-example.ts':
    require('!raw-loader!./stackblitz-examples/project-technology/angular-example').default,
  'stackblitz-examples/project-technology/clarity-example.ts':
    require('!raw-loader!./stackblitz-examples/project-technology/clarity-example').default,
  'stackblitz-examples/project-technology/dashboard-example.ts':
    require('!raw-loader!./stackblitz-examples/project-technology/dashboard-example').default,
};

@Component({
  selector: 'clr-breadcrumb-full-routing-example-demo',
  styles: [
    `
      .main-container {
        .content-container {
          min-height: 350px;

          .content-area {
            padding-top: 0.5rem;
          }
        }
      }
    `,
  ],
  templateUrl: './breadcrumbs-full-routing-example.html',
  imports: [
    RouterLink,
    RouterLinkActive,
    ClrIcon,
    ClrIconModule,
    ClrVerticalNavModule,
    ClrBreadcrumbsModule,
    RouterOutlet,
    StackblitzExampleComponent,
    AsyncPipe,
  ],
})
export class BreadcrumbFullRoutingDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
  additionalFiles = additionalFiles;
  readonly breadcrumbs: Observable<BreadcrumbItem[]>;

  constructor(router: Router, activatedRoute: ActivatedRoute) {
    this.breadcrumbs = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(undefined),
      map(() => createBreadcrumbs(activatedRoute.root))
    );
  }
}

function createBreadcrumbs(route: ActivatedRoute): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
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
