/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';

import { HeaderColorsDemo } from './header-colors';
import { HeaderTypesDemo } from './header-types';
import { HeaderTypesOldDemo } from './header-types-old';
import { HeadersDemo } from './headers';
import { NavDemo } from './nav.demo';
import { ROUTING } from './nav.demo.routing';
import { NavsDemo } from './navs';
import { SubNavDemo } from './sub-nav';

@NgModule({
  imports: [CommonModule, ClarityModule, ROUTING],
  declarations: [NavDemo, HeadersDemo, NavsDemo, HeaderColorsDemo, HeaderTypesDemo, SubNavDemo, HeaderTypesOldDemo],
  exports: [NavDemo, HeadersDemo, NavsDemo, HeaderColorsDemo, HeaderTypesDemo, SubNavDemo],
})
export class NavDemoModule {}
