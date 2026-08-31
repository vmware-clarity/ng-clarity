/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { angleIcon, ClarityIcons } from '@clr/angular/icon';
import { ClrDropdownModule } from '@clr/angular/popover/dropdown';

import { PropertyViewCategoryComponent } from './components/property-view-category.component';
import { PropertyViewMessageComponent } from './components/property-view-message.component';
import { PropertyViewPropertyValueContainerComponent } from './components/property-view-property-value-container.component';
import { PropertyViewPropertyComponent } from './components/property-view-property.component';
import { PropertyViewSectionComponent } from './components/property-view-section.component';
import { PropertyViewComponent } from './components/property-view.component';
import { PropertyViewStrings } from './property-view-strings.service';
import { PropertyViewService } from './property-view.service';

export function pvStringsServiceFactory(existing: PropertyViewStrings) {
  return existing || new PropertyViewStrings();
}

@NgModule({
  imports: [ClrDropdownModule, CommonModule],
  declarations: [
    PropertyViewCategoryComponent,
    PropertyViewComponent,
    PropertyViewMessageComponent,
    PropertyViewPropertyComponent,
    PropertyViewPropertyValueContainerComponent,
    PropertyViewSectionComponent,
  ],
  providers: [
    PropertyViewService,
    {
      // This pattern allows the importer of this module to specify its own PropertyViewStrings.
      provide: PropertyViewStrings,
      useFactory: pvStringsServiceFactory,
      deps: [[new Optional(), new SkipSelf(), PropertyViewStrings]],
    },
  ],
  exports: [PropertyViewComponent],
})
export class AppfxPropertyViewModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon);
  }
}
