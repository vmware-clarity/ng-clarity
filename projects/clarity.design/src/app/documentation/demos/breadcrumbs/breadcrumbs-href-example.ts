/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `<clr-breadcrumbs [items]="breadcrumbs"></clr-breadcrumbs>`;

const TS_EXAMPLE = `
import { Component } from '@angular/core';
import { ClrBreadcrumbsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrBreadcrumbsModule],
})
export class ExampleComponent {
  breadcrumbs = [
    { label: 'Framework', href: '/framework' },
    { label: 'Angular', href: '/framework/angular' },
    { label: 'Clarity', href: '/framework/angular/clarity' },
  ];
}
`;

@Component({
  selector: 'clr-breadcrumb-href-example-demo',
  templateUrl: './breadcrumbs-href-example.html',
  standalone: false,
})
export class BreadcrumbHrefDemo {
  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;
  breadcrumbs = [
    { label: 'Framework', href: 'javascript://;' },
    { label: 'Angular', href: 'javascript://;' },
    { label: 'Clarity', href: 'javascript://;' },
  ];
}
