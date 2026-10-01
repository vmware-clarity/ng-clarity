/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { SearchInputComponent } from './search-input.component';
import { SearchResultsComponent } from './search-results.component';
import { SearchService } from './search.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule,
    ClarityModule,
    SearchInputComponent,
    SearchResultsComponent,
  ],
  providers: [SearchService],
  exports: [SearchInputComponent, SearchResultsComponent],
})
export class SearchModule {}
