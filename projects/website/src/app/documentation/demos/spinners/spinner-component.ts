/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSpinnerModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE1 = `
@if (fetchingUserInformation) {
  <clr-spinner>Loading data</clr-spinner>
}

@if (!fetchingUserInformation) {
  <button (click)="toggleUserInfo()" class="btn btn-primary">Fetch user information</button>
} @else {
  <button class="btn" (click)="toggleUserInfo()">Cancel fetching user information</button>
}
`;

const EXAMPLE2 = `
@if (downloadingFile) {
  <div>
    <clr-spinner clrInline>Downloading</clr-spinner>
    <span>Downloading</span>
  </div>
}

@if (!downloadingFile) {
  <button (click)="toggleSpinner()" class="btn btn-primary">Download file</button>
} @else {
  <button class="btn" (click)="toggleSpinner()">Cancel file download</button>
}
`;

const CODE1 = `
import { Component } from '@angular/core';
import { ClrSpinnerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrSpinnerModule],
})
export class ExampleComponent {
  fetchingUserInformation = false;

  toggleUserInfo() {
    this.fetchingUserInformation = !this.fetchingUserInformation;
  }
}
`;

const CODE2 = `
import { Component } from '@angular/core';
import { ClrSpinnerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrSpinnerModule],
})
export class ExampleComponent {
  downloadingFile = false;

  toggleSpinner() {
    this.downloadingFile = !this.downloadingFile;
  }
}
`;

@Component({
  selector: 'clr-spinner-component',
  templateUrl: './spinner-component.html',
  styleUrl: './spinner.demo.scss',
  imports: [ClrSpinnerModule, StackblitzExampleComponent],
})
export class SpinnerComponentDemo {
  example1 = EXAMPLE1;
  example2 = EXAMPLE2;
  code1 = CODE1;
  code2 = CODE2;

  // Triggers
  fetchingUserInformation = false;
  downloadingFile = false;

  toggleSpinner(name: 'fetchingUserInformation' | 'downloadingFile') {
    this[name] = !this[name];
  }
}
