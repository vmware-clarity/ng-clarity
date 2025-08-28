/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-paints-list-demo',
  template: `<h3>Paints</h3>
    <p>We have the perfect Art paints to help you create stunning masterpieces</p>
    <ul>
      <li><a [routerLink]="['./watercolor']">Watercolor</a></li>
      <li><a [routerLink]="['./oils']">Oils</a></li>
    </ul> `,
  standalone: false,
})
export class PaintsListDemo {}
