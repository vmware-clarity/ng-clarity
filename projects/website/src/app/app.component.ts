/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClrMainContainerModule, ClrNavigationModule } from '@clr/angular';

import { getFeatureFlags } from './feature-flags';
import { DensityToggleComponent } from './shared/density-toggle/density-toggle.component';
import { SearchHighlightService } from './shared/search/search-highlight.service';
import { SearchInputComponent } from './shared/search/search-input.component';
import { SearchResult } from './shared/search/search.service';
import { SkipLinkComponent } from './shared/skip-link/skip-link.component';
import { ThemeToggleComponent } from './shared/theme-toggle/theme-toggle.component';
import { VersionSelectComponent } from './shared/version-select/version-select.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      .header {
        /* CDE-1484: Remove after CDE-1482 and CDE-1483 are completed. */
        background-color: #0b1622;
      }
    `,
  ],
  imports: [
    RouterModule,
    ClrMainContainerModule,
    ClrNavigationModule,
    SkipLinkComponent,
    ThemeToggleComponent,
    DensityToggleComponent,
    VersionSelectComponent,
    SearchInputComponent,
  ],
})
export class AppComponent {
  protected readonly themeBuilderOnly = getFeatureFlags().themeBuilderOnly;

  constructor(private highlightService: SearchHighlightService) {
    highlightService.init();
  }

  /**
   * Handle search result selection
   */
  onSearchResultSelected(result: SearchResult): void {
    // Navigation is handled by the SearchInputComponent
    // This method can be used for analytics or other side effects
    console.log('Search result selected:', result);
  }
}
