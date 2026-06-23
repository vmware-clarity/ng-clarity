/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'reflect-metadata';

export interface OutputMappings {
  [propName: string]: OutputMappingMetadata;
}

const outputMappingMetadataKey = 'OutputMapping';

export interface OutputMappingMetadata {
  /**
   * The name of the property where the value from the decorated property will be
   * ejected/output.
   */
  propertyName: string;
}

/**
 * Decorates property with output mapping information
 * which is used for ejecting/outputting property value into another object.
 */
// TODO: tganchev: see how decorators can be called out to apply class-like conventions.

export function Out() {
  return function (prototype: any, srcPropName: string) {
    const mapping: OutputMappingMetadata = {
      propertyName: srcPropName,
    };
    let mappings: any = Reflect.getMetadata(outputMappingMetadataKey, prototype);
    if (!mappings) {
      mappings = {};
      Reflect.defineMetadata(outputMappingMetadataKey, mappings, prototype);
    }
    mappings[srcPropName] = mapping;
  };
}

/**
 * Gets all output property mappings for the given object.
 */
export function getOutputMappings(target: any): OutputMappings {
  const mappings = Reflect.getMetadata(outputMappingMetadataKey, target.constructor.prototype);
  if (mappings) {
    // Return deep clone of the mappings to protect them from accidental alternation.
    return JSON.parse(JSON.stringify(mappings));
  }
  return mappings;
}
