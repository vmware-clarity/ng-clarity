/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  ClarityIcons,
  ClarityModule,
  ClrIcon,
  loadChartIconSet,
  loadCommerceIconSet,
  loadCoreIconSet,
  loadEssentialIconSet,
  loadMediaIconSet,
  loadMiniIconSet,
  loadSocialIconSet,
  loadTechnologyIconSet,
  loadTextEditIconSet,
  loadTravelIconSet,
} from '@clr/angular';
import { elements } from 'helpers/elements.data';

import { organization } from './organization';
import { VerticalNavIconService } from '../../../../projects/angular/src/layout/vertical-nav/providers/vertical-nav-icon.service';

@Component({
  selector: 'storybook-application-layout',
  templateUrl: './application-layout.storybook.component.html',
  styleUrls: ['./application-layout.storybook.component.scss'],
  standalone: true,
  imports: [CommonModule, ClarityModule, ClrIcon],
  providers: [VerticalNavIconService],
})
export class ApplicationLayoutStorybookComponent {
  rootDirectory = organization;
  elements = elements;
  selected = [];
  breadcrumbs = [
    { label: 'Framework', href: '/framework' },
    { label: 'Angular', href: '/framework/angular' },
    { label: 'Clarity', href: '/framework/angular/clarity' },
  ];

  @Input() level1Navigation = true;
  @Input() level2Navigation = true;
  @Input() level3Navigation = true;
  @Input() level4Navigation = true;

  constructor() {
    loadChartIconSet();
    loadCommerceIconSet();
    loadCoreIconSet();
    loadEssentialIconSet();
    loadMediaIconSet();
    loadMiniIconSet();
    loadSocialIconSet();
    loadTechnologyIconSet();
    loadTextEditIconSet();
    loadTravelIconSet();
    ClarityIcons.addIcons([
      'vm-bug-new',
      `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 36 36" fill="none">
  <g clip-path="url(#clip0_56849_12289)">
    <path d="M36 33C36 34.6569 34.6569 36 33 36H3C1.34315 36 0 34.6569 0 33V3C0 1.34315 1.34315 0 3 0H33C34.6569 0 36 1.34315 36 3V33Z" fill="url(#paint0_linear_56849_12289)"/>
    <path d="M24.51 21.58L22.6 16.06C22.56 15.93 22.5 15.71 22.5 15.52C22.5 15.01 22.91 14.51 23.57 14.51C24.12 14.51 24.49 14.86 24.65 15.37L25.85 19.34L27.08 15.38C27.24 14.85 27.65 14.49 28.22 14.49H28.35C28.92 14.49 29.33 14.86 29.49 15.38L30.73 19.35L31.96 15.35C32.11 14.88 32.44 14.5 33.03 14.5C33.64 14.5 34.07 14.97 34.07 15.52C34.07 15.67 34.03 15.87 34 15.97L32 21.58C31.77 22.27 31.31 22.57 30.77 22.57H30.7C30.16 22.57 29.71 22.26 29.5 21.62L28.26 17.68L27 21.62C26.8 22.26 26.34 22.57 25.8 22.57H25.73C25.2 22.57 24.74 22.26 24.51 21.58Z" fill="white"/>
    <path d="M3.96995 14.87C3.71995 14.31 3.08995 14.06 2.49995 14.32C1.90996 14.58 1.69995 15.23 1.95995 15.79L4.41995 21.14C4.80995 21.98 5.21996 22.42 5.97995 22.42C6.79995 22.42 7.15995 21.94 7.53995 21.14C7.53995 21.14 9.68995 16.46 9.70995 16.41C9.72995 16.36 9.79995 16.21 10.02 16.21C10.2099 16.21 10.36 16.36 10.36 16.56V21.14C10.36 21.84 10.7499 22.42 11.5 22.42C12.25 22.42 12.66 21.84 12.66 21.14V17.4C12.66 16.68 13.18 16.21 13.88 16.21C14.58 16.21 15.05 16.69 15.05 17.4V21.14C15.05 21.84 15.44 22.42 16.1899 22.42C16.9399 22.42 17.35 21.84 17.35 21.14V17.4C17.35 16.68 17.87 16.21 18.57 16.21C19.2699 16.21 19.74 16.69 19.74 17.4V21.14C19.74 21.84 20.1299 22.42 20.8799 22.42C21.6299 22.42 22.0399 21.84 22.0399 21.14V16.88C22.0399 15.31 20.78 14.22 19.27 14.22C17.76 14.22 16.8099 15.27 16.8099 15.27C16.3099 14.62 15.6099 14.22 14.4399 14.22C13.1999 14.22 12.1099 15.27 12.1099 15.27C11.5999 14.62 10.7499 14.22 10.0399 14.22C8.93995 14.22 8.06995 14.7 7.53995 15.92L5.96995 19.63L3.96995 14.87Z" fill="white"/>
  </g>
  <defs>
    <linearGradient id="paint0_linear_56849_12289" x1="0" y1="36" x2="36" y2="0" gradientUnits="userSpaceOnUse">
      <stop stop-color="#005C8A"/>
      <stop offset="1" stop-color="#0098C7"/>
    </linearGradient>
    <clipPath id="clip0_56849_12289">
      <rect width="36" height="36" fill="white"/>
    </clipPath>
  </defs>
</svg>`,
    ]);
  }
}
