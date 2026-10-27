/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** Version of the {@link ClrPageContext} format; it changes only when a field changes meaning. */
export const CLR_PAGE_CONTEXT_SCHEMA_VERSION = '1';

/**
 * JSON Schema (draft-07) of {@link ClrPageContext} at `schemaVersion` `'1'`, for consumers that validate
 * snapshots outside TypeScript. Component `state` and the view's `metadata` are application-specific and
 * left open.
 */
export const CLR_PAGE_CONTEXT_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://clarity.design/schemas/page-context/1.json',
  title: 'ClrPageContext',
  type: 'object',
  required: ['schemaVersion', 'application', 'title', 'regions', 'components', 'collectedAt'],
  additionalProperties: false,
  properties: {
    schemaVersion: { const: CLR_PAGE_CONTEXT_SCHEMA_VERSION },
    application: {
      type: 'object',
      required: ['id'],
      additionalProperties: false,
      properties: { id: { type: 'string' }, version: { type: 'string' } },
    },
    viewId: { type: 'string' },
    metadata: { type: 'object' },
    enabled: { const: false },
    title: { type: 'string' },
    url: { type: 'string' },
    route: {
      type: 'object',
      required: ['url'],
      additionalProperties: false,
      properties: {
        url: { type: 'string' },
        path: { type: 'string' },
        params: { $ref: '#/definitions/strings' },
        queryParams: { $ref: '#/definitions/queryParams' },
        data: { type: 'object' },
      },
    },
    availableRoutes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['path'],
        additionalProperties: false,
        properties: { path: { type: 'string' }, title: { type: 'string' }, lazy: { type: 'boolean' } },
      },
    },
    regions: { type: 'array', items: { $ref: '#/definitions/component' } },
    components: { type: 'array', items: { $ref: '#/definitions/component' } },
    truncated: { type: 'boolean' },
    focus: { const: 'modal' },
    collectedAt: { type: 'string' },
  },
  definitions: {
    strings: { type: 'object', additionalProperties: { type: 'string' } },
    // A repeated query key is reported as a list.
    queryParams: {
      type: 'object',
      additionalProperties: { anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
    },
    component: {
      type: 'object',
      required: ['type'],
      additionalProperties: false,
      properties: {
        type: { type: 'string' },
        element: { type: 'string' },
        label: { type: 'string' },
        state: { type: 'object' },
        children: { type: 'array', items: { $ref: '#/definitions/component' } },
      },
    },
  },
} as const;
