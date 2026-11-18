/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { signal, WritableSignal } from '@angular/core';

/**
 * Errors, warnings and infos of a step. Assigning a new list notifies the views that show it.
 */
export class StepValidationState {
  readonly #errors: WritableSignal<string[]>;
  readonly #warnings: WritableSignal<string[]>;
  readonly #infos: WritableSignal<string[]>;

  constructor(errors: string[] = [], warnings: string[] = [], infos: string[] = []) {
    this.#errors = signal(errors);
    this.#warnings = signal(warnings);
    this.#infos = signal(infos);
  }

  get errors(): string[] {
    return this.#errors() || [];
  }

  set errors(messages: string[]) {
    this.#errors.set(messages);
  }

  get warnings(): string[] {
    return this.#warnings() || [];
  }

  set warnings(messages: string[]) {
    this.#warnings.set(messages);
  }

  get infos(): string[] {
    return this.#infos() || [];
  }

  set infos(messages: string[]) {
    this.#infos.set(messages);
  }

  isEmpty(): boolean {
    return this.errors.length === 0 && this.warnings.length === 0 && this.infos.length === 0;
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }
}
