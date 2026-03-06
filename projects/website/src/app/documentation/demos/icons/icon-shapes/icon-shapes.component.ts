/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ClarityIcons,
  ClrCheckboxModule,
  ClrCommonFormsModule,
  ClrIcon,
  ClrIconModule,
  ClrInputModule,
  ClrSelectModule,
  searchIcon,
} from '@clr/angular';

import { IconGroupsComponent } from './icon-groups/icon-groups.component';
import { ICONS_STATES } from './icon-groups/icon-inventory';

@Component({
  selector: 'app-icon-shapes',
  templateUrl: './icon-shapes.component.html',
  styleUrl: './icon-shapes.component.scss',
  imports: [
    FormsModule,
    ClrCommonFormsModule,
    ReactiveFormsModule,
    ClrInputModule,
    ClrIcon,
    ClrIconModule,
    ClrCheckboxModule,
    ClrSelectModule,
    IconGroupsComponent,
  ],
})
export class IconShapesComponent {
  iconStates = ICONS_STATES;

  form = new FormGroup({
    searchTerm: new FormControl(''),
    solid: new FormControl(false),
    badge: new FormControl(''),
  });

  constructor() {
    ClarityIcons.addIcons(searchIcon);
  }
}
