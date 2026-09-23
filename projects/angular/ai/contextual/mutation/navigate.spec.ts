/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fillRoutePath } from './navigate';

describe('fillRoutePath', () => {
  it('fills parameters into the pattern', () => {
    expect(fillRoutePath('clusters/:id/hosts', { id: '42' })).toEqual({ url: '/clusters/42/hosts' });
  });

  it('keeps a value with a slash in it to one segment', () => {
    expect(fillRoutePath('files/:name', { name: 'a/b' })).toEqual({ url: '/files/a%2Fb' });
  });

  it('names the parameter that is missing', () => {
    expect(fillRoutePath('clusters/:id', {})).toEqual({ missing: 'id' });
    expect(fillRoutePath('clusters/:id', { id: '' })).toEqual({ missing: 'id' });
  });

  it('treats the root as itself', () => {
    expect(fillRoutePath('/')).toEqual({ url: '/' });
  });
});
