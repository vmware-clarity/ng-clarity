/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClarityIcons, ClrIcon, moonIcon, sunIcon } from '@clr/angular';
import { Observable, Subscription } from 'rxjs';

type ThemeType = 'light' | 'dark';

const themeLocalStorageKey = 'theme';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      class="btn btn-link nav-link"
      [attr.aria-label]="'toggle to ' + (theme === 'light' ? 'dark' : 'light') + ' theme'"
      (click)="toggleTheme()"
      (mouseenter)="themeIconInverse = true"
      (mouseleave)="themeIconInverse = false"
    >
      <clr-icon class="theme-toggle-icon" size="md" [shape]="theme === 'light' ? 'moon' : 'sun'"></clr-icon>
      {{ theme === 'light' ? 'Dark' : 'Light' }}
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        position: relative;
      }
      clr-icon.theme-toggle-icon {
        color: var(--clr-header-font-color);
      }
    `,
  ],
  imports: [ClrIcon],
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  protected theme = getPreferredTheme();
  protected themeIconInverse = false;

  private toggleThemeOnSystemThemeChangeSubscription: Subscription | undefined;

  constructor() {
    ClarityIcons.addIcons(moonIcon, sunIcon);
  }

  ngOnInit() {
    this.setTheme(this.theme);

    if (!userHasSetTheme()) {
      this.toggleThemeOnSystemThemeChangeSubscription = this.toggleThemeOnSystemThemeChange().subscribe();
    }
  }

  ngOnDestroy() {
    this.toggleThemeOnSystemThemeChangeSubscription?.unsubscribe();
  }

  protected toggleTheme() {
    this.setTheme(this.theme === 'light' ? 'dark' : 'light');

    setPreferredTheme(this.theme);
    this.toggleThemeOnSystemThemeChangeSubscription?.unsubscribe();
  }

  private setTheme(theme: ThemeType) {
    this.theme = theme;

    document.body.setAttribute('cds-theme', theme);
  }

  private toggleThemeOnSystemThemeChange() {
    return new Observable(() => {
      const darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

      const handler = (event: MediaQueryListEvent) => {
        this.setTheme(event.matches ? 'dark' : 'light');
      };

      darkThemeMediaQuery.addEventListener('change', handler);

      return function teardown() {
        darkThemeMediaQuery.removeEventListener('change', handler);
      };
    });
  }
}

function getPreferredTheme(): ThemeType {
  const storedTheme = localStorage.getItem(themeLocalStorageKey);

  if (storedTheme) {
    return storedTheme === 'dark' ? 'dark' : 'light';
  } else {
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}

function userHasSetTheme(): boolean {
  return !!localStorage.getItem(themeLocalStorageKey);
}

function setPreferredTheme(theme: ThemeType) {
  return localStorage.setItem(themeLocalStorageKey, theme);
}
