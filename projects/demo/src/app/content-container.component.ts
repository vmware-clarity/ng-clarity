/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Route } from '@angular/router';

import { APP_ROUTES } from './app.routing';

@Component({
  selector: 'my-app-content-container',
  template: `
    <clr-vertical-nav [clrVerticalNavCollapsible]="true">
      <clr-vertical-nav-group>
        <cds-icon shape="applications" clrVerticalNavIcon></cds-icon>
        Components
        <ng-template [clrIfExpanded]="componentsExpanded" (clrIfExpandedChange)="componentsExpanded = $event">
          <clr-vertical-nav-group-children>
            @for (route of componentRoutes; track route) {
              <a clrVerticalNavLink clrAriaCurrentLink [routerLink]="[route.path]" routerLinkActive="active">
                {{ formatLabel(route) }}
              </a>
            }
          </clr-vertical-nav-group-children>
        </ng-template>
      </clr-vertical-nav-group>

      <clr-vertical-nav-group>
        <cds-icon shape="plugin" clrVerticalNavIcon></cds-icon>
        Addons
        <ng-template [clrIfExpanded]="addonsExpanded" (clrIfExpandedChange)="addonsExpanded = $event">
          <clr-vertical-nav-group-children>
            @for (route of addonRoutes; track route) {
              <a clrVerticalNavLink clrAriaCurrentLink [routerLink]="[route.path]" routerLinkActive="active">
                {{ route.data?.['label'] || formatLabel(route) }}
              </a>
            }
          </clr-vertical-nav-group-children>
        </ng-template>
      </clr-vertical-nav-group>
    </clr-vertical-nav>
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>
  `,
  standalone: false,
})
export class AppContentContainerComponent {
  componentRoutes: Route[] = APP_ROUTES.filter(r => r.path && !r.data?.['section']);
  addonRoutes: Route[] = APP_ROUTES.filter(r => r.data?.['section'] === 'addons');

  componentsExpanded = true;
  addonsExpanded = true;

  formatLabel(route: Route): string {
    if (!route.path) {
      return '';
    }
    return route.path.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}
