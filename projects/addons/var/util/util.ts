/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ActivationError } from '../error/interfaces';

export const stringify = (value: any, propertyName = ''): string | undefined => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    console.warn(`Cannot stringify property: ${propertyName}`, value, e);
  }
  return undefined;
};

export const parse = (value: any, propertyName = ''): any => {
  if (value) {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(`Cannot parse property: ${propertyName}`, value, e);
    }
  }
  return undefined;
};

export const formatError = (error: any): ActivationError => {
  if (typeof error === 'object') {
    // if error is from http call, this is mostly the case
    if (error.data?.message) {
      return error;
    }

    // if error is a backend response of vapi type
    if (error.messages?.length) {
      return handleVapiErrorMessages(error.messages);
    }
    if (error.info?.messages?.length) {
      return handleVapiErrorMessages(error.info.messages);
    }

    // if error is thrown like throwError(new Error("error message"))
    if (error.message) {
      return {
        data: {
          message: error.message,
          stackTrace: error.stack,
        },
      };
    }
  }
  // if error is thrown like throwError("error message")
  if (typeof error === 'string') {
    return {
      data: {
        message: error,
      },
    };
  }
  // Stringify the object. That is the default formatting when all other options are exhausted.
  return {
    data: {
      message: stringify(error),
    },
  };
};

const handleVapiErrorMessages = (messages: any[]): ActivationError => {
  return {
    data: {
      message: messages.map((message: any) => message?.localized || message.defaultMessage).join('\n'),
    },
  };
};
