/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Ajv from 'ajv/dist/2020';

import { ClrMutationService } from './mutation-engine.service';
import {
  ClrClearOperation,
  ClrMutationOperation,
  ClrNavigateOperation,
  ClrSetValueOperation,
  provideClrMutationPolicy,
} from './mutation.interface';
import { CLR_MUTATION_MAX_OPERATIONS, CLR_MUTATION_OPERATIONS_SCHEMA } from './schema';
import { validate as generatedValidator } from '../schemas/mutation-operations.validator';

/** Every key of `T`, so the compiler fails when the interface gains one the list misses. */
type Keys<T> = { [K in keyof Required<T>]: true };

describe('CLR_MUTATION_OPERATIONS_SCHEMA', () => {
  // A default Ajv, as a backend would create it: unknown formats or keywords would throw here.
  const validate = new Ajv().compile(CLR_MUTATION_OPERATIONS_SCHEMA);
  const valid: ClrMutationOperation[] = [
    { operation: 'setValue', ref: 'e1', description: 'Name', value: 'Ada' },
    { operation: 'clear', ref: 'e2', description: 'Notes' },
    { operation: 'navigate', path: 'hosts/:id', params: { id: '42' }, queryParams: { tab: 'logs' } },
  ];
  const invalid = [
    [{ operation: 'setValue', ref: 'e1', description: 'Name' }],
    [{ operation: 'clear', ref: 'e2', description: 'Notes', value: '' }],
    [{ operation: 'navigate', path: 'hosts/:id', params: { id: 42 } }],
    [{ operation: 'submit', ref: 'e3' }],
    Array.from({ length: CLR_MUTATION_MAX_OPERATIONS + 1 }, () => valid[1]),
  ];

  it('validates with the generated validator exactly as with Ajv itself', () => {
    expect(validate(valid)).toBe(true);
    expect(generatedValidator(valid)).toBe(true);
    for (const operations of invalid) {
      expect(validate(operations)).toBe(false);
      expect(generatedValidator(operations)).toBe(false);
    }
  });

  it('lists the same fields as the operation types', () => {
    const fields: [Keys<ClrSetValueOperation>, Keys<ClrClearOperation>, Keys<ClrNavigateOperation>] = [
      { operation: true, ref: true, description: true, value: true },
      { operation: true, ref: true, description: true },
      { operation: true, path: true, params: true, queryParams: true },
    ];

    CLR_MUTATION_OPERATIONS_SCHEMA.items.oneOf.forEach((branch, index) => {
      expect(Object.keys(branch.properties).sort()).toEqual(Object.keys(fields[index]).sort());
    });
  });

  it('fits a tool definition, holding no reference to resolve', () => {
    expect(JSON.stringify(CLR_MUTATION_OPERATIONS_SCHEMA)).not.toContain('$ref');
  });
});

describe('ClrMutationService, taking only what matches the schema', () => {
  let engine: ClrMutationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideClrMutationPolicy({ classify: () => 'reversible' })],
    });
    engine = TestBed.inject(ClrMutationService);
  });

  it('refuses an operation with a property the schema does not have, naming it', async () => {
    const report = await engine.apply([{ operation: 'clear', ref: 'e1', description: 'Name', value: '' } as never]);

    expect(report.results[0]).toEqual(
      expect.objectContaining({
        refused: 'unsupported',
        detail:
          'The clear operation does not match CLR_MUTATION_OPERATIONS_SCHEMA: clear must NOT have additional properties (value).',
      })
    );
  });

  it('refuses a value of the wrong type, naming its field', () => {
    const [entry] = engine.plan([{ operation: 'setValue', ref: 'e1', description: 7, value: 'x' } as never]);

    expect(entry.refused).toBe('unsupported');
    expect(entry.detail).toContain('description must be string');
  });

  it(`refuses every operation past the first ${CLR_MUTATION_MAX_OPERATIONS}`, async () => {
    const operations = Array.from({ length: CLR_MUTATION_MAX_OPERATIONS + 2 }, (_, index) => ({
      operation: 'clear' as const,
      ref: `e${index}`,
      description: 'Name',
    }));

    const results = (await engine.apply(operations)).results;
    const planned = engine.plan(operations);

    for (const outcomes of [results, planned]) {
      expect(outcomes.length).toBe(operations.length);
      expect(outcomes[CLR_MUTATION_MAX_OPERATIONS - 1].refused).toBe('stale');
      expect(outcomes.slice(CLR_MUTATION_MAX_OPERATIONS).map(outcome => outcome.detail)).toEqual([
        `One call takes at most ${CLR_MUTATION_MAX_OPERATIONS} operations.`,
        `One call takes at most ${CLR_MUTATION_MAX_OPERATIONS} operations.`,
      ]);
    }
  });
});
