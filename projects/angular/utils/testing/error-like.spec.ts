/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { errorLike } from '../../../test-matchers';

describe('Error assertion compatibility', () => {
  it.each([
    ['Error', new Error('message')],
    ['Error subclass', new TypeError('message')],
    ['error-like object', { message: 'message', stack: 'stack' }],
  ])('accepts an exact message on an %s', (_name, error) => {
    expect(() => {
      throw error;
    }).toThrowError(errorLike('message'));
  });

  it.each([
    ['a message prefix', new Error('extra message')],
    ['a message suffix', new Error('message extra')],
    ['a different message', new Error('other')],
    ['a thrown string', 'message'],
    ['a plain message object', { message: 'message' }],
    ['undefined', undefined],
  ])('rejects %s', (_name, error) => {
    expect(() => {
      expect(() => {
        throw error;
      }).toThrowError(errorLike('message'));
    }).toThrow();
  });

  it('requires an error to be thrown', () => {
    expect(() => {
      expect(() => {}).toThrowError(errorLike('message'));
    }).toThrow();
  });

  it('does not interpret the expected message as a regular expression', () => {
    expect(() => {
      throw new Error('.*[]?');
    }).toThrowError(errorLike('.*[]?'));
    expect(() => {
      expect(() => {
        throw new Error('other');
      }).toThrowError(errorLike('.*[]?'));
    }).toThrow();
  });

  it('invokes the action exactly once', () => {
    const action = vi.fn(() => {
      throw new Error('message');
    });
    expect(action).toThrowError(errorLike('message'));
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('checks error type when no message was specified', () => {
    expect(() => {
      throw new TypeError('any message');
    }).toThrowError(errorLike());
    expect(() => {
      throw 'message';
    }).not.toThrowError(errorLike());
    expect(() => {}).not.toThrowError(errorLike());
  });
});
