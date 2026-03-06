/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Injector, OnDestroy, OnInit, Type } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';

import RAW_PAGES from '../../compiled-content/pages.json';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { HashListenerDirective } from '../shared/hash-listener/hash-listener.directive';
import { SafeHtmlPipe } from '../shared/pipes/safe-html.pipe';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';
import { TableOfContentsComponent } from '../shared/table-of-contents/table-of-contents.component';
import { ThemedImageComponent } from '../shared/themed-image/themed-image.component';

const PAGES = RAW_PAGES as Record<string, (typeof RAW_PAGES)[keyof typeof RAW_PAGES]>;

@Component({
  templateUrl: './content-page.component.html',
  styleUrl: './content-page.component.scss',
  host: {
    '[class.content-container]': 'true',
  },
  imports: [
    CommonModule,
    SiteNavComponent,
    SiteFooterComponent,
    PageNotFoundComponent,
    TableOfContentsComponent,
    HashListenerDirective,
    SafeHtmlPipe,
  ],
})
export class ContentPageComponent implements OnInit, OnDestroy {
  readonly page: Observable<{ title: string; html: string }>;

  private subscription: Subscription | undefined;

  constructor(
    injector: Injector,
    activatedRoute: ActivatedRoute,
    private readonly title: Title,
    private readonly router: Router
  ) {
    registerCustomElements(injector);

    this.page = activatedRoute.params.pipe(map(({ slug }) => PAGES[slug]));
  }

  ngOnInit() {
    this.subscription = this.setBrowserTitleOnPageChange();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  protected onContentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    if (targetElement.tagName === 'A') {
      this.onLinkClick(event);
    }
  }

  private setBrowserTitleOnPageChange() {
    return this.page.subscribe(page => {
      this.title.setTitle(`${page?.title || 'Page Not Found'} - Clarity Design System`);
    });
  }

  private onLinkClick(event: MouseEvent) {
    const linkElement = event.target as HTMLLinkElement;

    const href = linkElement.getAttribute('href');
    const target = linkElement.getAttribute('target');

    if (!href || !href.startsWith('/')) {
      return;
    }

    if (!!target && target !== '_self') {
      return;
    }

    if (event.button !== 0 || event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      return;
    }

    event.preventDefault();
    this.router.navigateByUrl(href);
  }
}

function registerCustomElements(injector: Injector) {
  const customElementsMap: Record<string, Type<any>> = {
    'app-themed-image': ThemedImageComponent,
  };

  for (const [tagName, component] of Object.entries(customElementsMap)) {
    if (!customElements.get(tagName)) {
      customElements.define(tagName, createCustomElement(component, { injector }));
    }
  }
}
