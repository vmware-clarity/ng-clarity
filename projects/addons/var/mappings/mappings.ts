/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { getInputMappings, InputMappings } from './input-mapping';
import { getOutputMappings, OutputMappings } from './output-mapping';

/**
 * Class to define property mappings between step model and wizard model.
 *
 * Note: If property name of both Step model and Wizard model is the same, no need to define this external mappings.
 * @template S any object that has @In/@Out decorators
 * @template W Wizard Model
 */
export class Mappings<S, W> {
  private mappings: PropertyMappings = {};

  /**
   * step model property name to which wizard model {@link wizardModelPropertyName} to be mapped
   * @param stepModelPropertyName Step model property name to map
   */
  mapStepProp(stepModelPropertyName: keyof S) {
    // TODO: fix the above exclusion

    const self = this;
    return {
      /**
       * wizard model property name to which step model {@link stepModelPropertyName} to be mapped
       * @param wizardModelPropertyName Wizard model property name to map
       */
      to(wizardModelPropertyName: keyof W): Mappings<S, W> {
        if (self.mappings[stepModelPropertyName as string]) {
          throw new Error(`A mapping for property ${String(stepModelPropertyName)} is defined more than once.`);
        } else if (Object.values(self.mappings).indexOf(wizardModelPropertyName as string) >= 0) {
          throw new Error(`A mapping for property ${String(wizardModelPropertyName)} is defined more than once.`);
        } else {
          // no action
        }
        self.mappings[stepModelPropertyName as string] = wizardModelPropertyName as string;
        return self;
      },
    };
  }

  /**
   * Validates input and output mappings property names with the mappings defined by {@link mapStepProp} method.
   * @param model Step model
   */
  validate(model: any) {
    if (model) {
      const inputMappings = getInputMappings(model);
      const outputMappings = getOutputMappings(model);
      const missingMappings = this.validateMappings(inputMappings, outputMappings);
      if (missingMappings.length) {
        throw new Error(`No @In or @Out decorator found for property names ` + JSON.stringify(missingMappings));
      }
    }
  }

  /**
   * Returns property mappings defined.
   */
  getPropertyMappings(): PropertyMappings {
    return { ...this.mappings };
  }

  private validateMappings(inputMappings: InputMappings, outputMappings: OutputMappings): string[] {
    const defaultMappings = {
      ...inputMappings,
      ...outputMappings,
    };
    return Object.keys(this.mappings).filter(key => !defaultMappings[key]);
  }
}

/**
 * Interface which represents property Mappings
 */
export interface PropertyMappings {
  /**
   * @param {string} propertyName Step model property name
   */
  [propertyName: string]: string;
}
