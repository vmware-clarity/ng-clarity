/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ClarityIcons, searchIcon } from '@cds/core/icon';

import { ICONS_STATES } from './icon-groups/icon-inventory';

@Component({
  selector: 'app-icon-shapes',
  templateUrl: './icon-shapes.component.html',
  styleUrl: './icon-shapes.component.scss',
  standalone: false,
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
