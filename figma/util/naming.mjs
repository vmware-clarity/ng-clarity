/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Canonical CSS ↔ Figma name conversion utilities.
 *
 * These are the single source of truth for name conversion used throughout
 * the pipeline — planner, extract-view, and populate-from-existing all share
 * this module so the logic never drifts between callers.
 */

/**
 * Convert a CSS custom-property name to a slash-separated Figma variable path.
 *
 * e.g. `--cds-alias-color-action-primary` → `cds/alias/color/action/primary`
 *
 * @param {string} name CSS custom-property name (with leading `--`).
 * @returns {string} Figma-path variable name.
 */
export const cssNameToFigmaName = name => name.replace(/^--/, '').replace(/-/g, '/');

/**
 * Convert a slash-separated Figma variable path back to a CSS custom-property name.
 *
 * e.g. `cds/alias/color/action/primary` → `--cds-alias-color-action-primary`
 *
 * @param {string} name Figma-path variable name (slash-separated).
 * @returns {string} CSS custom-property name (with leading `--`).
 */
export const figmaNameToCssName = name => '--' + name.replace(/\//g, '-');
