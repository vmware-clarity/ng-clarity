/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Subscription } from 'rxjs';

import { OptionSelectionService } from './option-selection.service';
import { ComboboxModel } from '../model/combobox.model';
import { MultiSelectComboboxModel } from '../model/multi-select-combobox.model';
import { SingleSelectComboboxModel } from '../model/single-select-combobox.model';

export default function () {
  describe('Option Selection Service', () => {
    let optionSelectionService: OptionSelectionService<string>;

    beforeEach(() => {
      optionSelectionService = new OptionSelectionService();
      optionSelectionService.selectionModel = new SingleSelectComboboxModel<string>() as ComboboxModel<string>;
    });

    it('provides an observable of changes to the input value', () => {
      expect(optionSelectionService.inputChanged).toBeDefined();
    });

    it('provides an observable to notify to render the option', () => {
      expect(optionSelectionService.selectionChanged).toBeDefined();
    });

    it('notifies that the value has changed', () => {
      let selectedValue: string;
      const subscription: Subscription = optionSelectionService.inputChanged.subscribe((value: string) => {
        selectedValue = value;
      });
      optionSelectionService.currentInput = 'Option 1';
      expect(selectedValue).toBe('Option 1');
      optionSelectionService.currentInput = 'Option 2';
      expect(selectedValue).toBe('Option 2');
      subscription.unsubscribe();
    });

    it('notifies that the option has changed', () => {
      let selectedOption: string;
      const subscription: Subscription = optionSelectionService.selectionChanged.subscribe(
        (option: ComboboxModel<string>) => {
          selectedOption = option.pop();
        }
      );
      optionSelectionService.select('Option 1');
      expect(selectedOption).toBe('Option 1');
      optionSelectionService.select('Option 2');
      expect(selectedOption).toBe('Option 2');
      subscription.unsubscribe();
    });

    it('can toggle an option and emits selection events', () => {
      let selectedOption: string;
      const subscription: Subscription = optionSelectionService.selectionChanged.subscribe(
        (option: ComboboxModel<string>) => {
          selectedOption = option.model as string;
        }
      );
      optionSelectionService.toggle('Option 1');
      expect(selectedOption).toBe('Option 1');
      optionSelectionService.toggle('Option 1');
      expect(selectedOption).toBeNull();
      subscription.unsubscribe();
    });

    it('does not notify when the value remains the same', () => {
      let count = 0;
      const sub: Subscription = optionSelectionService.inputChanged.subscribe(() => {
        count++;
      });
      optionSelectionService.select('Option 1');
      expect(count).toBe(1);
      optionSelectionService.select('Option 1');
      expect(count).toBe(1);
      sub.unsubscribe();
    });

    it('does not notify when the selected option remains the same', () => {
      let count = 0;
      const sub: Subscription = optionSelectionService.selectionChanged.subscribe(() => {
        count++;
      });
      optionSelectionService.select('Option 1');
      expect(count).toBe(1);
      optionSelectionService.select('Option 1');
      expect(count).toBe(1);
      sub.unsubscribe();
    });

    it('updates loading state if changed externally', () => {
      // protect against future implementation changes, as this public property is shared by different components
      expect(optionSelectionService.loading).toBeFalse();
      optionSelectionService.loading = true;
      expect(optionSelectionService.loading).toBeTrue();
      optionSelectionService.loading = false;
      expect(optionSelectionService.loading).toBeFalse();
    });

    it('clears selection in single selection mode when input empty', () => {
      optionSelectionService.currentInput = 'Option 1';
      optionSelectionService.setSelectionValue('Test value');
      expect(optionSelectionService.selectionModel.isEmpty()).toBeFalse();
      optionSelectionService.currentInput = '';
      expect(optionSelectionService.selectionModel.isEmpty()).toBeTrue();
    });

    it('does not emit selectionChanged when setSelectionValue is called with same value by identity', () => {
      type Item = { id: number };
      const service = new OptionSelectionService<Item>();
      service.selectionModel = new SingleSelectComboboxModel<Item>();
      service.identityFn = (item: Item) => item.id;

      let emitCount = 0;
      service.selectionChanged.subscribe(() => emitCount++);

      service.setSelectionValue({ id: 1 });
      expect(emitCount).toBe(1);
      service.setSelectionValue({ id: 1 }); // same identity, different ref
      expect(emitCount).toBe(1);
    });

    it('does not emit selectionChanged when setSelectionValue multi is same by identity', () => {
      type Item = { id: number };
      const service = new OptionSelectionService<Item>();
      service.selectionModel = new MultiSelectComboboxModel<Item>();
      service.identityFn = (item: Item) => item.id;

      let emitCount = 0;
      service.selectionChanged.subscribe(() => emitCount++);

      service.setSelectionValue([{ id: 1 }, { id: 2 }]);
      expect(emitCount).toBe(1);
      service.setSelectionValue([{ id: 2 }, { id: 1 }]); // same identities, different refs and order
      expect(emitCount).toBe(2);
      service.setSelectionValue([{ id: 2 }, { id: 1 }]); // same identities and order, different refs
      expect(emitCount).toBe(2);
    });

    describe('parseStringToModel', () => {
      it('returns string as-is when no displayField or resolver is set', () => {
        expect(optionSelectionService.parseStringToModel('test')).toBe('test');
      });

      it('creates object with displayField when displayField is set', () => {
        optionSelectionService.displayField = 'name';
        const result = optionSelectionService.parseStringToModel('test');
        expect(result).toEqual({ name: 'test' } as any);
      });

      it('uses editableResolver when provided, ignoring displayField', () => {
        type Item = { id: number; label: string };
        const service = new OptionSelectionService<Item>();
        service.selectionModel = new SingleSelectComboboxModel<Item>();
        service.displayField = 'label';
        let nextId = 100;
        service.editableResolver = (input: string) => ({ id: nextId++, label: input });

        const result = service.parseStringToModel('custom');
        expect(result).toEqual({ id: 100, label: 'custom' });
      });

      it('resolver creates objects compatible with identityFn', () => {
        type Item = { id: number; label: string };
        const service = new OptionSelectionService<Item>();
        service.selectionModel = new SingleSelectComboboxModel<Item>();
        service.identityFn = (item: Item) => item.id;

        let nextId = 200;
        service.editableResolver = (input: string) => ({ id: nextId++, label: input });

        const item = service.parseStringToModel('custom');
        service.select(item);
        expect(service.selectionModel.containsItem({ id: 200, label: 'custom' })).toBeTrue();
        expect(service.selectionModel.containsItem({ id: 999, label: 'custom' })).toBeFalse();
      });

      it('allows different entries in multi-select editable with displayField', () => {
        type Item = { symbol: string };
        const service = new OptionSelectionService<Item>();
        service.selectionModel = new MultiSelectComboboxModel<Item>();
        service.displayField = 'symbol';

        service.select(service.parseStringToModel('abc'));
        service.select(service.parseStringToModel('def'));
        expect((service.selectionModel.model as Item[]).length).toBe(2);
      });
    });

    it('should correctly handle falsy values like 0', () => {
      const service = new OptionSelectionService<number>();
      service.selectionModel = new SingleSelectComboboxModel<number>();

      let emitCount = 0;
      service.selectionChanged.subscribe(() => emitCount++);

      service.setSelectionValue(0);
      expect(emitCount).toBe(1);

      // Should emit again because null is different from 0
      service.setSelectionValue(null);
      expect(emitCount).toBe(2);

      // Should emit again because 0 is different from null
      service.setSelectionValue(0);
      expect(emitCount).toBe(3);
    });
  });
}
