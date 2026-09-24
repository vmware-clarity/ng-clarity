/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface DemoHost {
  name: string;
  cluster: string;
  status: string;
}

export const DEMO_HOSTS: DemoHost[] = [
  { name: 'esx-prod-01', cluster: 'alpha', status: 'Connected' },
  { name: 'esx-prod-02', cluster: 'alpha', status: 'Connected' },
  { name: 'esx-prod-03', cluster: 'beta', status: 'Maintenance' },
  { name: 'esx-edge-01', cluster: 'edge', status: 'Disconnected' },
];
