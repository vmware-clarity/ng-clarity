/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrBreadcrumbsModule } from '@clr/angular';

@Component({
  selector: 'clr-breadcrumbs-href-example',
  templateUrl: './href.example.html',
  imports: [ClrBreadcrumbsModule],
})
export class BreadcrumbsHrefExample {
  breadcrumbs = [
    { label: 'Framework', href: 'javascript://;' },
    { label: 'Angular', href: 'javascript://;' },
    { label: 'Clarity', href: 'javascript://;' },
  ];
}
