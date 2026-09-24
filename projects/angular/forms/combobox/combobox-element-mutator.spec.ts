/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ClrContextEngineService,
  ClrElementMutationResult,
  ClrMutationEngineService,
  ClrPageContext,
  provideClrMutationPolicy,
} from '@clr/angular/ai';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrComponentContext, ClrElementMutation, readElementMutator } from '@clr/angular/utils';

import { ClrComboboxModule } from './combobox.module';

type ElementContextCallback = (options: { maxItemsPerCollection?: number }) => {
  type: string;
  state: Record<string, unknown>;
};

@Component({
  selector: 'combobox-mutator-host',
  template: `
    <form [formGroup]="form">
      <clr-combobox-container>
        <label>City</label>
        <clr-combobox class="city" formControlName="city" [clrEditable]="true" [clrEditableResolverFn]="resolve">
          <clr-options>
            <clr-option clrValue="paris">Paris</clr-option>
            <clr-option clrValue="rome">Rome</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-combobox-container>
        <label>Town</label>
        <clr-combobox class="town" formControlName="town" [clrEditable]="true">
          <clr-options>
            <clr-option clrValue="oslo">Oslo</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-combobox-container>
        <label>Country</label>
        <clr-combobox class="country" formControlName="country">
          <clr-options>
            <clr-option clrValue="fr">France</clr-option>
            <clr-option clrValue="it">Italy</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-combobox-container>
        <label>Fruits</label>
        <clr-combobox class="fruits" formControlName="fruits" clrMulti="true">
          <clr-options>
            <clr-option clrValue="apple">Apple</clr-option>
            <clr-option clrValue="pear">Pear</clr-option>
            <clr-option clrValue="plum">Plum</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
      <clr-combobox-container>
        <label>Berries</label>
        <clr-combobox class="berries" formControlName="berries" clrMulti="true">
          <clr-options>
            <clr-option clrValue="cherry">Cherry</clr-option>
          </clr-options>
        </clr-combobox>
      </clr-combobox-container>
    </form>
  `,
  standalone: false,
})
class ComboboxMutatorHost {
  form = new FormGroup({
    city: new FormControl<string | null>(null),
    town: new FormControl<string | null>(null),
    country: new FormControl<string | null>(null),
    fruits: new FormControl<string[]>([]),
    berries: new FormControl<string[] | null>(null),
  });
  resolve = jasmine.createSpy('resolve').and.callFake((text: string) => `custom:${text.toUpperCase()}`);
}

function findNode(
  nodes: ClrComponentContext[],
  match: (node: ClrComponentContext) => boolean
): ClrComponentContext | null {
  for (const node of nodes) {
    if (match(node)) {
      return node;
    }
    const inside = findNode(node.children ?? [], match);
    if (inside) {
      return inside;
    }
  }
  return null;
}

function refOf(snapshot: ClrPageContext, label: string): string {
  const node = findNode(snapshot.components, candidate => !!candidate.ref && candidate.label === label);
  if (!node?.ref) {
    throw new Error(`no ref for "${label}" in ${JSON.stringify(snapshot.components)}`);
  }
  return node.ref;
}

describe('ClrCombobox element mutator', () => {
  let fixture: ComponentFixture<ComboboxMutatorHost>;
  let host: ComboboxMutatorHost;

  async function settle() {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  function element(name: string): HTMLElement {
    return fixture.nativeElement.querySelector(`clr-combobox.${name}`);
  }

  function coerce(name: string, proposed: unknown): ClrElementMutation {
    const mutator = readElementMutator(element(name));
    if (!mutator?.coerce) {
      throw new Error(`expected the ${name} combobox to publish a mutator with coerce`);
    }
    return mutator.coerce(proposed);
  }

  function read(name: string): unknown {
    const mutator = readElementMutator(element(name));
    if (!mutator?.read) {
      throw new Error(`expected the ${name} combobox to publish a mutator with read`);
    }
    return mutator.read();
  }

  function publishedValue(name: string): unknown {
    const callback = (element(name) as HTMLElement & { clrElementContext?: ElementContextCallback }).clrElementContext;
    if (!callback) {
      throw new Error(`expected the ${name} combobox to publish a clrElementContext callback`);
    }
    return callback({}).state.value;
  }

  /** Writes the way the mutation engine does: coerce, then set the form control. */
  async function write(name: keyof ComboboxMutatorHost['form']['controls'], proposed: unknown) {
    const coerced = coerce(name, proposed);
    if (coerced.refused === undefined) {
      const control = host.form.controls[name] as FormControl<unknown>;
      control.markAsDirty();
      control.markAsTouched();
      control.setValue(coerced.value);
      await settle();
    }
    return coerced;
  }

  async function set(label: string, value: unknown): Promise<ClrElementMutationResult> {
    const ref = refOf(TestBed.inject(ClrContextEngineService).getSnapshot(), label);
    const report = await TestBed.inject(ClrMutationEngineService).apply([
      { operation: 'setValue', ref, description: label, value },
    ]);
    await settle();
    return report.results[0] as ClrElementMutationResult;
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ReactiveFormsModule, ClrCommonFormsModule, ClrComboboxModule],
      declarations: [ComboboxMutatorHost],
      providers: [provideClrMutationPolicy({ classify: () => 'reversible' })],
    });
    fixture = TestBed.createComponent(ComboboxMutatorHost);
    host = fixture.componentInstance;
    await settle();
  });

  afterEach(() => fixture.destroy());

  describe('editable', () => {
    it('takes free text through the editable resolver and the model holds what it resolved', async () => {
      const result = await write('city', 'Lisbon');

      expect(host.resolve).toHaveBeenCalledOnceWith('Lisbon');
      expect(result).toEqual({ value: 'custom:LISBON' });
      expect(host.form.value.city).toBe('custom:LISBON');
      expect(read('city')).toBe('custom:LISBON');
    });

    it('trims free text before resolving it', () => {
      coerce('city', '  Lisbon  ');

      expect(host.resolve).toHaveBeenCalledOnceWith('Lisbon');
    });

    it('still chooses an option by label, without the resolver', async () => {
      const result = await write('city', 'rome');

      expect(result).toEqual({ value: 'rome' });
      expect(host.resolve).not.toHaveBeenCalled();
      expect(read('city')).toBe('Rome');
    });

    it('takes free text as it is with the default resolver', async () => {
      const result = await write('town', 'Bergen');

      expect(result).toEqual({ value: 'Bergen' });
      expect(host.form.value.town).toBe('Bergen');
      expect(read('town')).toBe('Bergen');
    });

    it('refuses text that is only whitespace', () => {
      expect(coerce('city', '   ').refused).toContain('"Paris", "Rome"');
      expect(host.resolve).not.toHaveBeenCalled();
    });

    it('refuses free text for a combobox that is not editable', () => {
      expect(coerce('country', 'Spain').refused).toContain('"France", "Italy"');
    });

    it('writes free text through the mutation engine', async () => {
      const result = await set('City', 'Lisbon');

      expect(result.applied).toBeTrue();
      expect(result.value).toBe('custom:LISBON');
      expect(host.form.value.city).toBe('custom:LISBON');
      expect(host.resolve).toHaveBeenCalledOnceWith('Lisbon');
    });
  });

  describe('empty multi-select', () => {
    it('reads [] when its model is an empty array', () => {
      expect(publishedValue('fruits')).toEqual([]);
      expect(read('fruits')).toEqual([]);
    });

    it('reads [] when its model is null', () => {
      expect(publishedValue('berries')).toEqual([]);
      expect(read('berries')).toEqual([]);
    });

    it('reads [] again after being cleared', async () => {
      await write('fruits', ['Apple']);
      expect(read('fruits')).toEqual(['Apple']);

      expect(await write('fruits', null)).toEqual({ value: [] });
      expect(host.form.value.fruits).toEqual([]);
      expect(publishedValue('fruits')).toEqual([]);
      expect(read('fruits')).toEqual([]);
    });

    it('reports [] as the previous value through the mutation engine', async () => {
      const result = await set('Fruits', ['Pear']);

      expect(result.applied).toBeTrue();
      expect(result.previous).toEqual([]);
    });
  });

  describe('multi-select writes', () => {
    it('selects every label it is given', async () => {
      const result = await write('fruits', ['Apple', 'plum', ' Pear ']);

      expect(result).toEqual({ value: ['apple', 'plum', 'pear'] });
      expect(host.form.value.fruits).toEqual(['apple', 'plum', 'pear']);
      expect(read('fruits')).toEqual(['Apple', 'Plum', 'Pear']);
      expect(publishedValue('fruits')).toEqual(['Apple', 'Plum', 'Pear']);
    });

    it('takes a single label as a selection of one', async () => {
      expect(await write('fruits', 'Pear')).toEqual({ value: ['pear'] });
      expect(read('fruits')).toEqual(['Pear']);
    });

    it('refuses the whole write when one label is unknown, naming the options', async () => {
      await write('fruits', ['Apple']);

      const result = await write('fruits', ['Plum', 'Kiwi']);

      expect(result.refused).toContain('"Apple", "Pear", "Plum"');
      expect(host.form.value.fruits).toEqual(['apple']);
      expect(read('fruits')).toEqual(['Apple']);
    });

    it('refuses several labels for a single-select combobox', () => {
      expect(coerce('country', ['France', 'Italy']).refused).toBeDefined();
    });

    it('selects several labels through the mutation engine and refuses an unknown one', async () => {
      const result = await set('Fruits', ['Plum', 'Apple']);

      expect(result.applied).toBeTrue();
      expect(result.value).toEqual(['Plum', 'Apple']);
      expect(host.form.value.fruits).toEqual(['plum', 'apple']);

      const refused = await set('Fruits', ['Pear', 'Kiwi']);

      expect(refused.applied).toBeFalse();
      expect(refused.refused).toBe('invalid');
      expect(refused.detail).toContain('"Apple", "Pear", "Plum"');
      expect(host.form.value.fruits).toEqual(['plum', 'apple']);
    });
  });
});
