/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  templateUrl: 'accordion.demo.html',
  styleUrls: ['./accordion.demo.scss'],
  standalone: false,
})
export class AccordionDemo {
  stepOpen = true;
  disableThirdPanel = true;

  users = [
    {
      id: 'id-1',
      name: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    },
    {
      id: 'id-2',
      name: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    },
    {
      id: 'id-3',
      name: 'cccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
    },
    {
      id: 'id-4',
      name: 'dddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
    },
  ];

  change(event) {
    console.log('Accordion Changed', event);
  }
}
