/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ClarityIcons, ClrIcon } from '@clr/angular';

@Component({
  selector: 'app-use-dont-use',
  templateUrl: './use-dont-use.component.html',
  styleUrl: './use-dont-use.component.scss',
  imports: [CommonModule, ClrIcon],
})
export class UseDontUseComponent {
  readonly type = input<'use' | 'dont_use'>('use');
  readonly heading = input('');

  constructor() {
    // We can't use the 'check-circle' and 'times-circle' icons from @cds/core because the circles are not the same size.
    ClarityIcons.addIcons(
      [
        'UseDontUseComponent:use',
        {
          outline:
            '<path d="M18 2C9.16344 2 2 9.16344 2 18C2 26.8366 9.16344 34 18 34C26.8366 34 34 26.8366 34 18C34 13.7565 32.3143 9.68687 29.3137 6.68629C26.3131 3.68571 22.2435 2 18 2ZM18 32C10.268 32 4 25.732 4 18C4 10.268 10.268 4 18 4C25.732 4 32 10.268 32 18C32 21.713 30.525 25.274 27.8995 27.8995C25.274 30.525 21.713 32 18 32ZM26.59 12.1C26.98 11.7123 27.61 11.7123 28 12.1C28.1893 12.2878 28.2958 12.5434 28.2958 12.81C28.2958 13.0766 28.1893 13.3322 28 13.52L15.49 26L8 18.53C7.61892 18.1185 7.64355 17.4761 8.055 17.095C8.46645 16.7139 9.10892 16.7385 9.49 17.15L15.49 23.15L26.59 12.1Z" />',
        },
      ],
      [
        'UseDontUseComponent:dont_use',
        {
          outline:
            '<path d="M18 34C9.16344 34 2 26.8366 2 18C2 9.16344 9.16344 2 18 2C26.8366 2 34 9.16344 34 18C34 22.2435 32.3143 26.3131 29.3137 29.3137C26.3131 32.3143 22.2435 34 18 34ZM18 4C10.268 4 4 10.268 4 18C4 25.732 10.268 32 18 32C25.732 32 32 25.732 32 18C32 10.268 25.732 4 18 4ZM24.47 13.14L19.61 18L24.33 22.69C24.6698 23.0868 24.6469 23.6782 24.2776 24.0476C23.9082 24.4169 23.3168 24.4398 22.92 24.1L18.18 19.36L13.41 24.13C13.1656 24.4154 12.7819 24.5397 12.4166 24.4518C12.0513 24.3639 11.7661 24.0787 11.6782 23.7134C11.5903 23.3481 11.7146 22.9644 12 22.72L16.78 18L11.9 13.06C11.5602 12.6632 11.5831 12.0718 11.9524 11.7024C12.3218 11.3331 12.9132 11.3102 13.31 11.65L18.2 16.54L23.06 11.73C23.4568 11.3902 24.0482 11.4131 24.4176 11.7824C24.7869 12.1518 24.8098 12.7432 24.47 13.14Z" />',
        },
      ]
    );
  }
}
