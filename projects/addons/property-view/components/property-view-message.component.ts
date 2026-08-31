/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

import { PropertyViewMessageModel } from '../property-view.model';

@Component({
  selector: '[appfx-property-view-message]',
  standalone: false,
  templateUrl: 'property-view-message.component.html',
  styleUrls: ['property-view-message.component.scss'],
})
export class PropertyViewMessageComponent {
  @Input() data: PropertyViewMessageModel;
}
