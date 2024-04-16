/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'clr-toast-demo',
  templateUrl: './toast.demo.html',
})
export class ToastDemo {
  toasts: any = [];

  createToast(type: string) {
    const message = {
      title: 'Something..!',
      message: 'Something new got created.',
    };
    message['type'] = type;
    this.toasts.push(message);
  }

  closeToast(index) {
    this.toasts.splice(index, 1);
  }
}
