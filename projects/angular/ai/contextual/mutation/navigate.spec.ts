/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DefaultUrlSerializer } from '@angular/router';

import { fillRoutePath, urlTreeFor } from './navigate';

describe('fillRoutePath', () => {
  it('fills parameters into the pattern as path segments', () => {
    expect(fillRoutePath('clusters/:id/hosts', { id: '42' })).toEqual({ segments: ['clusters', '42', 'hosts'] });
  });

  it('keeps a value with a slash or a space in it to one literal segment', () => {
    expect(fillRoutePath('files/:name', { name: 'my file/2' })).toEqual({ segments: ['files', 'my file/2'] });
  });

  it('names the parameter that is missing', () => {
    expect(fillRoutePath('clusters/:id', {})).toEqual({ missing: 'id' });
    expect(fillRoutePath('clusters/:id', { id: '' })).toEqual({ missing: 'id' });
  });

  it('refuses a value that would step up the path', () => {
    expect(fillRoutePath('users/:id/edit', { id: '..' })).toEqual({ invalid: 'id' });
    expect(fillRoutePath('users/:id/edit', { id: '.' })).toEqual({ invalid: 'id' });
  });

  it('treats the root as no segments', () => {
    expect(fillRoutePath('/')).toEqual({ segments: [] });
  });
});

describe('urlTreeFor', () => {
  const serializer = new DefaultUrlSerializer();

  it('encodes each segment once, as the router does', () => {
    expect(serializer.serialize(urlTreeFor(['hosts', 'my host/2']))).toBe('/hosts/my%20host%2F2');
  });

  it('adds query parameters', () => {
    expect(serializer.serialize(urlTreeFor(['hosts'], { tab: 'a b' }))).toBe('/hosts?tab=a%20b');
  });

  it('is the root for no segments', () => {
    expect(serializer.serialize(urlTreeFor([]))).toBe('/');
  });
});
