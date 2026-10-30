/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { routes } from './routes';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet],
  template: `
    <nav class="bench-nav">
      @for (route of scenarios; track route.path) {
        <a [routerLink]="route.path">{{ route.path }}</a>
      }
    </nav>
    <router-outlet />
  `,
  styles: `
    .bench-nav {
      display: flex;
      gap: 1rem;
      padding: 0.5rem;
    }
  `,
})
export class AppComponent {
  readonly scenarios = routes.filter(route => route.path);
}
