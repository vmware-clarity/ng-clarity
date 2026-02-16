/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE1 = `
<clr-spinner *ngIf="fetchingUserInformation">Loading data</clr-spinner>

<!-- Buttons to fetch user info or cancel fetch of user info -->
<button *ngIf="!fetchingUserInformation" (click)="toggleUserInfo()" class="btn btn-primary">
  Fetch user information
</button>
<button *ngIf="fetchingUserInformation" class="btn" (click)="toggleUserInfo()">
  Cancel fetching user information
</button>
`;

const EXAMPLE2 = `
<div *ngIf="downloadingFile">
  <clr-spinner clrInline>Downloading</clr-spinner>
  <span>Downloading</span>
</div>

<!-- Buttons to Download file or cancel Download of file -->
<button *ngIf="!downloadingFile" (click)="toggleSpinner()" class="btn btn-primary">
  Download file
</button>
<button *ngIf="downloadingFile" class="btn" (click)="toggleSpinner()">Cancel file download</button>
`;

const CODE1 = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrSpinnerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrSpinnerModule],
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
import { CommonModule } from '@angular/common';
import { ClrSpinnerModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [CommonModule, ClrSpinnerModule],
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
  standalone: false,
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
