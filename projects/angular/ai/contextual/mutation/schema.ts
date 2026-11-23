/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Version of the {@link ClrMutationOperation} format; a released version never changes. */
export const CLR_MUTATION_OPERATIONS_SCHEMA_VERSION = '1';

/** The most operations one `apply()` or `plan()` call takes. */
export const CLR_MUTATION_MAX_OPERATIONS = 50;

const strings = { type: 'object', additionalProperties: { type: 'string' } } as const;

/**
 * JSON Schema (draft-07) of the operations `apply()` takes, at version `'1'`. A backend validates what a model
 * proposes with it before the page applies it, and it fits a tool definition's input as
 * `{ type: 'object', properties: { operations: CLR_MUTATION_OPERATIONS_SCHEMA } }`, since it holds no `$ref`.
 */
export const CLR_MUTATION_OPERATIONS_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://clarity.design/schemas/mutation-operations/1.json',
  title: 'ClrMutationOperations',
  type: 'array',
  maxItems: CLR_MUTATION_MAX_OPERATIONS,
  items: {
    oneOf: [
      {
        type: 'object',
        required: ['operation', 'ref', 'description', 'value'],
        additionalProperties: false,
        properties: {
          operation: { const: 'setValue' },
          ref: { type: 'string' },
          description: { type: 'string' },
          value: {},
        },
      },
      {
        type: 'object',
        required: ['operation', 'ref', 'description'],
        additionalProperties: false,
        properties: { operation: { const: 'clear' }, ref: { type: 'string' }, description: { type: 'string' } },
      },
      {
        type: 'object',
        required: ['operation', 'path'],
        additionalProperties: false,
        properties: { operation: { const: 'navigate' }, path: { type: 'string' }, params: strings, queryParams: strings },
      },
    ],
  },
} as const;
