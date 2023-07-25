/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-button-group-projection-update-test-1-demo',
  templateUrl: './projection-update-test-1.html',
  styleUrls: ['../../button-group.demo.scss'],
})
export class ProjectionUpdateTest1Demo {
  show = true;
  show1 = true;
  show2 = true;
  show3 = true;
  show4 = true;
  show5 = true;

  toggleShow(): void {
    this.show = !this.show;
  }

  toggleShow1(): void {
    this.show1 = !this.show1;
  }

  toggleShow2(): void {
    this.show2 = !this.show2;
  }

  toggleShow3(): void {
    this.show3 = !this.show3;
  }

  toggleShow4(): void {
    this.show4 = !this.show4;
  }

  toggleShow5(): void {
    this.show5 = !this.show5;
  }
}
