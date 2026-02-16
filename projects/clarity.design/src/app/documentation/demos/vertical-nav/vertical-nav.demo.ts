/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Route, Router } from '@angular/router';
import {
  blockIcon,
  boltIcon,
  bugIcon,
  certificateIcon,
  ClarityIcons,
  downloadCloudIcon,
  flameIcon,
  imageIcon,
  sadFaceIcon,
  shieldIcon,
  userIcon,
} from '@cds/core/icon';
import { Subscription } from 'rxjs';

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
  standalone: false,
})
export class VerticalNavDemo extends ClarityDocComponent implements OnInit, OnDestroy {
  @ViewChild('demoView', { static: true }) demoView: ElementRef<HTMLElement> | undefined;

  childRoutes: DemoRoute[] | undefined;

  previous = false;
  next = false;

  previousRoute: DemoRoute | undefined;
  nextRoute: DemoRoute | undefined;

  parentRoute = '';

  private _subscriptions: Subscription[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
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
    if (this.demoView) {
      this.demoView.nativeElement.scrollIntoView();
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
