/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-breadcrumbs-href-demo',
  templateUrl: './breadcrumbs-href.demo.html',
  styleUrls: ['./breadcrumbs.demo.scss'],
  standalone: false,
})
export class BreadcrumbsHrefDemo {
  menuItems = [
    { label: 'Paints', href: '/demo/breadcrumbs/href' },
    { label: 'Watercolor', href: '/demo/breadcrumbs/href' },
    { label: 'Sennelier', href: '/demo/breadcrumbs/href/sennelier' },
  ];
}
