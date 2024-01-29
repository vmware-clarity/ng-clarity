/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'clr-basic-button-group-demo',
  templateUrl: './basic-button-group.html',
  styleUrls: ['../../button-group.demo.scss'],
})
export class BasicButtonGroupDemo {
  position = 'bottom-left';

  readonly asyncMenuButtons = of([5, 6, 7]).pipe(delay(100));

  handleClick(id: number): void {
    console.log(`Button ${id} clicked!`);
  }
}
