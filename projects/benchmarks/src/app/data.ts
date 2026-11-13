/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * The size of a scenario, from the `?size=` query parameter.
 */
export function sizeParam(fallback: number) {
  const size = Number(inject(ActivatedRoute).snapshot.queryParamMap.get('size'));
  return size > 0 ? size : fallback;
}

export interface Item {
  id: number;
  name: string;
  status: string;
  owner: string;
  cpu: number;
  memory: number;
  created: Date;
}

const statuses = ['Running', 'Stopped', 'Suspended', 'Error'];
const owners = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank'];

/**
 * Deterministic items, so that the base and the head of a pull request render the same data.
 */
export function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `vm-${String((i * 7919) % count).padStart(5, '0')}`,
    status: statuses[i % statuses.length],
    owner: owners[(i * 5) % owners.length],
    cpu: (i * 37) % 100,
    memory: ((i * 53) % 64) + 1,
    created: new Date(Date.UTC(2026, 0, 1) + i * 3_600_000),
  }));
}
