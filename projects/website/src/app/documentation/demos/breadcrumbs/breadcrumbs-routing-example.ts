/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrBreadcrumbsModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `<clr-breadcrumbs [items]="breadcrumbs"></clr-breadcrumbs>`;

const TS_EXAMPLE = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrBreadcrumbsModule],
})
export class ExampleComponent {
  breadcrumbs = [
    { label: 'Framework', routerLink: '/framework' },
    { label: 'Angular', routerLink: '/framework/angular' },
    { label: 'Clarity', routerLink: '/framework/angular/clarity' },
  ];
}
`;

@Component({
  selector: 'clr-breadcrumb-routing-example-demo',
  templateUrl: './breadcrumbs-routing-example.html',
  imports: [ClrBreadcrumbsModule, StackblitzExampleComponent],
})
export class BreadcrumbRoutingDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
  breadcrumbs = [
    { label: 'Framework', routerLink: './framework' },
    { label: 'Angular', routerLink: './framework/angular' },
    { label: 'Clarity', routerLink: './framework/angular/clarity' },
  ];
}
