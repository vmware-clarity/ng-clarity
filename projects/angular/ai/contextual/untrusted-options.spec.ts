/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { withoutFormValues, withoutUrlDetails } from './untrusted-options';

describe('withoutUrlDetails', () => {
  it('drops the page title and a frame’s document title with the address', () => {
    const shared = withoutUrlDetails({
      title: 'Statement for ACC-1',
      url: 'https://app.example/statements/1',
      regions: [],
      components: [
        { type: 'frame', element: 'iframe', state: { title: 'Statement for ACC-2', url: 'https://plugin.example/x' } },
      ],
      collectedAt: '',
    });

    expect(shared.title).toBe('');
    expect(JSON.stringify(shared)).not.toContain('ACC-');
    expect(shared.components[0].state).toEqual({ url: 'https://plugin.example/' });
  });

  it('drops the document title of a frame that is an editing host and reads as a textbox', () => {
    const shared = withoutUrlDetails({
      title: '',
      url: 'https://app.example/',
      regions: [],
      components: [
        {
          type: 'textbox',
          element: 'iframe',
          state: { title: 'Draft to ACC-4711', url: 'https://app.example/editor' },
        },
      ],
      collectedAt: '',
    });

    expect(JSON.stringify(shared)).not.toContain('ACC-');
    expect(shared.components[0].state).toEqual({ url: 'https://app.example/' });
  });
});

describe('withoutFormValues', () => {
  it('leaves no empty state behind when every key a node published is withheld', () => {
    const shared = withoutFormValues({
      title: '',
      regions: [],
      components: [{ type: 'grid', element: 'app-picker', state: { rows: ['Alice'] } }],
      collectedAt: '',
    });

    expect('state' in shared.components[0]).toBe(false);
  });

  it('withholds the rows a selectable grid lists along with its selection', () => {
    const shared = withoutFormValues({
      title: '',
      regions: [],
      components: [
        {
          type: 'grid',
          element: 'clr-datagrid',
          state: { rowCount: 2, rows: ['Alice | CONFIDENTIAL-1', 'Bob'], selection: ['Bob'], selectionMode: 'multi' },
        },
      ],
      collectedAt: '',
    });

    expect(shared.components[0].state).toEqual({ rowCount: 2, selectionMode: 'multi' });
  });

  it('withholds how many rows are selected, and keeps what a progress bar or meter shows', () => {
    const shared = withoutFormValues({
      title: '',
      regions: [],
      components: [
        { type: 'grid', state: { rowCount: 2, selectedRows: 1 } },
        { type: 'progressbar', label: 'Upload', state: { value: 40, max: 100 } },
        { type: 'meter', label: 'Disk', state: { value: 0.7 } },
        { type: 'slider', label: 'Volume', state: { value: 4, max: 10 } },
      ],
      collectedAt: '',
    });

    expect(shared.components.map(node => node.state)).toEqual([
      { rowCount: 2 },
      { value: 40, max: 100 },
      { value: 0.7 },
      { max: 10 },
    ]);
  });

  it('withholds which columns of a grid the user filtered or hid', () => {
    const shared = withoutFormValues({
      title: '',
      regions: [],
      components: [
        {
          type: 'grid',
          element: 'clr-datagrid',
          state: { totalRows: 40, filteredColumns: ['Name'], hiddenColumns: ['Status'] },
        },
      ],
      collectedAt: '',
    });

    expect(shared.components[0].state).toEqual({ totalRows: 40 });
  });

  it('withholds how many files a file input holds', () => {
    const shared = withoutFormValues({
      title: '',
      regions: [],
      components: [
        {
          type: 'clr-file-input-container',
          label: 'Statement',
          state: { fileCount: 2, redacted: true },
        },
      ],
      collectedAt: '',
    });

    expect(shared.components[0].state).toEqual({ redacted: true });
  });
});
