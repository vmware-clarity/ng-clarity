/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ClrDatagridModule } from '@clr/angular';

interface Person {
  id: number;
  name: string;
  role: string;
  reports?: Person[];
}

const PEOPLE: Person[] = [
  {
    id: 1,
    name: 'Ana Ivanova',
    role: 'Engineering director',
    reports: [
      {
        id: 2,
        name: 'Boris Petrov',
        role: 'Engineering manager',
        reports: [
          { id: 3, name: 'Elena Georgieva', role: 'Software engineer' },
          { id: 4, name: 'Martin Kolev', role: 'Software engineer' },
        ],
      },
      {
        id: 5,
        name: 'Iva Dimitrova',
        role: 'Design manager',
        reports: [{ id: 6, name: 'Nikola Stoyanov', role: 'Designer' }],
      },
    ],
  },
  {
    id: 7,
    name: 'Georgi Todorov',
    role: 'Product director',
    reports: [{ id: 8, name: 'Maria Nikolova', role: 'Product manager' }],
  },
];

@Component({
  selector: 'clr-datagrid-tree-static-example',
  templateUrl: './static-example.html',
  imports: [ClrDatagridModule],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridTreeStaticExample {
  people = PEOPLE;

  identity = (item: Person) => item.id;

  // The children are already in the data, so they show as soon as a row is expanded.
  getChildren = (item: Person) => item.reports;
}
