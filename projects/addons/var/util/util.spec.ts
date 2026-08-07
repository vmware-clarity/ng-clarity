/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { formatError } from './util';

describe('formatError should return error object, WHEN error of type', () => {
  it('http backend error', function () {
    const error = { data: { message: 'cp3', stackTrace: 'cp3stacktrace' } };
    const formatted = formatError(error);
    expect(formatted).toEqual(error);
  });

  const errorMessage = 'Error Message';

  describe('backend response of vapi type', () => {
    function formatAndVerifyErrorMessage(error: any): void {
      const formatted = formatError(error);
      expect(formatted).toEqual({ data: { message: errorMessage } });
    }

    it('when info is set', function () {
      const error = {
        info: {
          messages: [
            {
              defaultMessage: errorMessage,
              localized: errorMessage,
            },
          ],
        },
      };
      formatAndVerifyErrorMessage(error);
    });

    it('when messages are set', function () {
      const error = {
        messages: [
          {
            defaultMessage: errorMessage,
          },
        ],
      };
      formatAndVerifyErrorMessage(error);
    });

    function formatAndVerifyStringifiedMessage(error: any): void {
      const formatted = formatError(error);
      expect(formatted.data.message).toEqual(JSON.stringify(error));
    }

    it('when messages are set to an EMPTY array', function () {
      const error = { messages: [] };
      formatAndVerifyStringifiedMessage(error);
    });

    it('when messages and info are NOT set', function () {
      const error = { data: errorMessage };
      formatAndVerifyStringifiedMessage(error);
    });
  });

  it('Error object', function () {
    const error = new Error(errorMessage);
    const formatted = formatError(error);
    expect(formatted.data.message).toEqual(error.message);
    expect(formatted.data.stackTrace).toEqual(error.stack);
  });

  it('string', function () {
    const error = errorMessage;
    const formatted = formatError(error);
    expect(formatted.data.message).toEqual(error);
    expect(formatted.data.stackTrace).toBeUndefined();
  });

  it('Custom object', function () {
    const error = { data: errorMessage };
    const formatted = formatError(error);
    expect(formatted.data.message).toEqual(JSON.stringify(error));
    expect(formatted.data.stackTrace).toBeUndefined();
  });
});
