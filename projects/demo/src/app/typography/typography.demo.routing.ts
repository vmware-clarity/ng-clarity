/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TypographyFontAutopsyDemo } from './typography-font-autopsy';
import { TypographyFontCharTestDemo } from './typography-font-char-test';
import { TypographyFontWeightDemo } from './typography-font-weight';
import { TypographyHeadersDemo } from './typography-headers';
import { TypographyHeadingsCDS } from './typography-headings-cds';
import { TypographyLineHeightDemo } from './typography-line-height';
import { TypographyLinksDemo } from './typography-links';
import { TypographyTextDemo } from './typography-text';
import { TypographyDemo } from './typography.demo';

const ROUTES: Routes = [
  {
    path: '',
    component: TypographyDemo,
    children: [
      { path: '', redirectTo: 'typography-font-weight', pathMatch: 'full' },
      { path: 'typography-font-weight', component: TypographyFontWeightDemo },
      { path: 'typography-headers', component: TypographyHeadersDemo },
      { path: 'typography-text', component: TypographyTextDemo },
      { path: 'typography-links', component: TypographyLinksDemo },
      { path: 'typography-font-char-test', component: TypographyFontCharTestDemo },
      { path: 'typography-line-height', component: TypographyLineHeightDemo },
      { path: 'typography-font-autopsy', component: TypographyFontAutopsyDemo },
      { path: 'typography-headings-cds', component: TypographyHeadingsCDS },
    ],
  },
];

export const ROUTING: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
