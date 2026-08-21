/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export class StepValidationState {
  #errors: string[];
  #warnings: string[];
  #infos: string[];

  constructor(errors: string[] = [], warnings: string[] = [], infos: string[] = []) {
    this.#errors = errors;
    this.#warnings = warnings;
    this.#infos = infos;
  }

  get errors(): string[] {
    return this.#errors || [];
  }

  set errors(messages: string[]) {
    this.#errors = messages;
  }

  get warnings(): string[] {
    return this.#warnings || [];
  }

  set warnings(messages: string[]) {
    this.#warnings = messages;
  }

  get infos(): string[] {
    return this.#infos || [];
  }

  set infos(messages: string[]) {
    this.#infos = messages;
  }

  isEmpty(): boolean {
    return this.errors.length === 0 && this.warnings.length === 0 && this.infos.length === 0;
  }

  isValid(): boolean {
    return !this.#errors || this.#errors.length === 0;
  }
}
