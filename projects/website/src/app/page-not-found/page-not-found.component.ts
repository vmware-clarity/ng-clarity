/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { SiteNavComponent } from '../shared/site-nav/site-nav.component';

@Component({
  selector: 'page-not-found',
  templateUrl: 'page-not-found.component.html',
  styleUrl: 'page-not-found.component.scss',
  host: {
    '[class.content-container]': 'true',
  },
  imports: [SiteNavComponent],
})
export class PageNotFoundComponent implements OnInit {
  constructor(private readonly title: Title) {}

  ngOnInit() {
    this.title.setTitle('Page Not Found - Clarity Design System');
  }
}
