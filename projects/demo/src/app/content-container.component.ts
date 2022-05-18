/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Route } from '@angular/router';

import { APP_ROUTES } from './app.routing';

@Component({
  selector: 'my-app-content-container',
  template: `
    <clr-vertical-nav>
      <ng-container *ngFor="let route of routes">
        <a
          *ngIf="route.path != ''"
          clrVerticalNavLink
          clrAriaCurrentLink
          [routerLink]="[route.path]"
          [routerLinkActive]="['active']"
          >{{ route.path }}</a
        >
      </ng-container>
    </clr-vertical-nav>
    <main class="content-area">
      <router-outlet></router-outlet>
    </main>

    <!--DO NOT DELETE THE COMMENTS BELOW. Needed for testing the Vertical Nav-->
    <!--clr-vertical-nav [clrVerticalNavCollapsible]="true" [clrVerticalNavCollapsed]="false" [clr-nav-level]="2">
                <clr-vertical-nav-group>
                    <cds-icon shape="home" clrVerticalNavIcon></cds-icon>
                    Home
                    <ng-container *ngFor="let route of routes" ngProjectAs="[clrVerticalNavLink]">
                        <a clrVerticalNavLink *ngIf="route.path != ''"
                           [routerLink]="[route.path]"
                           [routerLinkActive]="['active']">
                            {{route.path}}
                        </a>
                    </ng-container>
                </clr-vertical-nav-group>
            </clr-vertical-nav-->

    <!--clr-vertical-nav [clrVerticalNavCollapsible]="true" [clrVerticalNavCollapsed]="false" [clr-nav-level]="2">
                <ng-container *ngFor="let route of routes">
                    <a clrVerticalNavLink *ngIf="route.path != ''"
                       [routerLink]="[route.path]"
                       [routerLinkActive]="['active']">
                        {{route.path}}
                    </a>
                </ng-container>
            </clr-vertical-nav-->
  `,
})
export class AppContentContainerComponent {
  public routes: Route[] = APP_ROUTES;
}
