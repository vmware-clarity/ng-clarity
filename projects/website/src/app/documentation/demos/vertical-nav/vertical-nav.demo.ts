/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router, RouterLink, RouterOutlet } from '@angular/router';
import {
  blockIcon,
  boltIcon,
  bugIcon,
  certificateIcon,
  ClarityIcons,
  ClrAlertModule,
  ClrIcon,
  ClrIconModule,
  downloadCloudIcon,
  flameIcon,
  imageIcon,
  sadFaceIcon,
  shieldIcon,
  userIcon,
} from '@clr/angular';
import { Subscription } from 'rxjs';

import { BasicNavDemo } from './basic-nav/basic-nav';
import { BasicNavUsage } from './basic-nav-usage/basic-nav-usage';
import { CollapsibleVerticalNavDemo } from './collapsible-nav/collapsible-nav';
import { VerticalNavIconsDemo } from './icons/icons';
import { JustNavsDemo } from './just-navs/just-navs';
import { NavGroupsDemo } from './nav-groups/nav-groups';
import { ProjectPokemonDemo } from './routes/project-pokemon/project-pokemon';
import { DoDontComponent } from '../../../shared/do-dont/do-dont.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StyleDocsComponent } from '../../../shared/style-docs/style-docs.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

type DemoRoute = Route & { data: { demoName: string } };

@Component({
  selector: 'clr-vertical-nav-demo',
  templateUrl: './vertical-nav.demo.html',
  styleUrl: './vertical-nav.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    BasicNavDemo,
    DoDontComponent,
    BasicNavUsage,
    JustNavsDemo,
    VerticalNavIconsDemo,
    NavGroupsDemo,
    ClrAlertModule,
    CollapsibleVerticalNavDemo,
    ThemedImageComponent,
    RouterLink,
    RouterOutlet,
    ClrIcon,
    ClrIconModule,
    StyleDocsComponent,
    ProjectPokemonDemo,
  ],
})
export class VerticalNavDemo extends ClarityDocComponent implements OnInit, OnDestroy {
  readonly demoView = viewChild<ElementRef<HTMLElement>>('demoView');

  childRoutes: DemoRoute[] | undefined;

  previous = false;
  next = false;

  previousRoute: DemoRoute | undefined;
  nextRoute: DemoRoute | undefined;

  parentRoute = '';

  private _subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    super('vertical-nav');
    ClarityIcons.addIcons(
      boltIcon,
      userIcon,
      flameIcon,
      certificateIcon,
      boltIcon,
      downloadCloudIcon,
      bugIcon,
      blockIcon,
      shieldIcon,
      sadFaceIcon,
      imageIcon
    );
  }

  ngOnInit() {
    const tempArr = this.route.routeConfig?.children as DemoRoute[] | undefined;
    if (tempArr && tempArr.length > 1) {
      this.childRoutes = tempArr.slice(1);
    }
    this._subscriptions.push(
      this.router.events.subscribe((change: any) => {
        if (change instanceof NavigationEnd) {
          if (change.url.includes('vertical-nav')) {
            this.initializePagination(change.url);
          }
        }
      })
    );

    this.initializePagination('/documentation/vertical-nav/code/' + this.route.children[0].routeConfig?.path);
  }

  ngOnDestroy() {
    this._subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  initializePagination(url: string): void {
    const tempArr: string[] = url.split('/');
    this.parentRoute = url.substr(0, url.indexOf('vertical-nav/code')) + 'vertical-nav/code/';
    if (tempArr.length > 1 && this.childRoutes) {
      const subRoute: string = tempArr[tempArr.length - 1];
      if (subRoute === 'vertical-nav') {
        this.nextRoute = this.childRoutes[1];
        this.next = true;
      } else {
        for (let i = 0; i < this.childRoutes.length; i++) {
          if (this.childRoutes[i].path === subRoute) {
            if (i === 0) {
              this.previous = false;
            } else {
              this.previousRoute = this.childRoutes[i - 1];
              this.previous = true;
            }

            if (i < this.childRoutes.length - 1) {
              this.nextRoute = this.childRoutes[i + 1];
              this.next = true;
            } else {
              this.next = false;
            }
            break;
          }
        }
      }
    }
  }

  scrollToDemoView() {
    const demoView = this.demoView();
    if (demoView) {
      demoView.nativeElement.scrollIntoView();
    }
  }

  moveNext() {
    if (this.nextRoute) {
      const tempPath = this.parentRoute + this.nextRoute.path;
      this.router.navigate([tempPath]);
      this.scrollToDemoView();
    }
  }

  movePrevious() {
    if (this.previousRoute) {
      const tempPath = this.parentRoute + this.previousRoute.path;
      this.router.navigate([tempPath]);
      this.scrollToDemoView();
    }
  }
}
