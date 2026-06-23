/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import 'reflect-metadata';

export interface InputMappings {
  [propName: string]: InputMappingMetadata;
}

const inputMappingMetadataKey = 'InputMapping';

export interface InputMappingMetadata extends InDecoratorSchema {
  /**
   * The name of the property of the object from where to extract the value and inject
   * it in the decorated property.
   */
  propertyName: string;
}

export interface InDecoratorSchema {
  /**
   * If the property does not need to be always provided set optional to true
   */
  optional?: boolean;
}

/**
 * Decorates property with input mapping information
 * which is used for injecting property value from another object.
 */
// TODO: tganchev: see how decorators can be called out to apply class-like conventions.

export function In(inputMapping?: InDecoratorSchema) {
  return function (prototype: any, srcPropName: string) {
    const mapping: InputMappingMetadata = {
      propertyName: srcPropName,
      optional: inputMapping && inputMapping.optional,
    };
    let mappings: any = Reflect.getMetadata(inputMappingMetadataKey, prototype);
    if (!mappings) {
      mappings = {};
      Reflect.defineMetadata(inputMappingMetadataKey, mappings, prototype);
    }
    mappings[srcPropName] = mapping;
  };
}

/**
 * Gets all input property mappings for the given object.
 */
export function getInputMappings(target: any): InputMappings {
  const mappings = Reflect.getMetadata(inputMappingMetadataKey, target.constructor.prototype);
  if (mappings) {
    // Return deep clone of the mappings to protect them from accidental alternation.
    return JSON.parse(JSON.stringify(mappings));
  }
  return mappings;
}
