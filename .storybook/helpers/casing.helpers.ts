/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export function toCamelCase(value: string) {
  return `${value[0].toLowerCase()}${value.substring(1).replace(/\s+/g, '')}`;
}

export function toKebabCase(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-');
}
