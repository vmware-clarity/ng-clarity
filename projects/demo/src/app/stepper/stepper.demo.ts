/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ClrIfExpanded} from "@clr/angular";

@Component({
  templateUrl: 'stepper.demo.html',
  styleUrls: ['./stepper.demo.scss'],
  providers: [ClrIfExpanded]
})
export class StepperDemo {
  form: FormGroup;
  expanded = {
    name: false,
    contact: false,
    address: false,
    phone: false,
  };

  expName = false;
  expContact = false;
  expAddress = false;
  expPhone = false;

  initialStep: string;
  loading = false;

  protected readonly expand;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: this.formBuilder.group({
        first: ['Luke', Validators.required],
        last: ['Skywalker', Validators.required],
      }),
      contact: this.formBuilder.group({
        email: [],
        phone: [],
      }),
      address: this.formBuilder.group({
        city: [],
        line: [],
      }),
      phone: this.formBuilder.group({
        mobile: [],
      }),
      password: this.formBuilder.group({
        password: [],
        confirm: [],
      }),
    });
  }

  handleClick() {
    this.loading = true;
    // this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.initialStep = 'address';
        this.loading = false;

      }, 200);
    // });
  }

  submit() {
    console.log('reactive form submit', this.form.value);
  }
}
