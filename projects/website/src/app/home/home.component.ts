/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { environment } from '../../environments/environment';
import { SiteFooterComponent } from '../shared/site-footer/site-footer.component';
import { SiteNavComponent } from '../shared/site-nav/site-nav.component';
import { ThemeToggleComponent } from '../shared/theme-toggle/theme-toggle.component';
import { ThemedImageComponent } from '../shared/themed-image/themed-image.component';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrl: './home.component.scss',
  host: {
    '[class.content-container]': 'true',
  },
  imports: [RouterModule, SiteNavComponent, SiteFooterComponent, ThemeToggleComponent, ThemedImageComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  // currentSeason = `bg-img-${this.getCurrentSeason()}`;
  currentSeason = 'bg-img-collaboration';
  environment = environment;

  ngOnInit() {
    document.querySelector('app-root')?.classList.add('layout-home');
  }

  ngOnDestroy() {
    document.querySelector('app-root')?.classList.remove('layout-home');
  }

  // commenting out for now to keep lint happy
  // private getCurrentSeason(): string {
  //   const now = new Date();
  //   const currentYear = now.getFullYear();

  //   if (now < new Date(currentYear, 2, 1)) {
  //     return 'winter'; // Jan 1 - Mar 1
  //   }

  //   if (now < new Date(currentYear, 5, 1)) {
  //     return 'spring'; // Mar 1 - Jun 1
  //   }

  //   if (now < new Date(currentYear, 8, 1)) {
  //     return ''; // Jun 1 - Sep 1
  //   }

  //   if (now < new Date(currentYear, 11, 1)) {
  //     return ''; // Sep 1 - Dec 1
  //   }

  //   return 'winter'; // Dec 1 - Dec 31
  // }
}
