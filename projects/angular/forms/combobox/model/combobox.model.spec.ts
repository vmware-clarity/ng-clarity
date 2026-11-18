/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComboboxModel } from './combobox.model';
import { MultiSelectComboboxModel } from './multi-select-combobox.model';
import { PseudoFocusModel } from './pseudo-focus.model';
import { SingleSelectComboboxModel } from './single-select-combobox.model';

describe('Combobox component', () => {
  describe('Model', () => {
    describe('Combobox Model', () => {
      let singleModel: ComboboxModel<any>;
      let multiModel: ComboboxModel<any>;
      let pseudoFocusModel: PseudoFocusModel<any>;
      let models: any[] = [];

      beforeEach(() => {
        singleModel = new SingleSelectComboboxModel<any>();
        multiModel = new MultiSelectComboboxModel<any>();
        pseudoFocusModel = new PseudoFocusModel<any>();
        models = [singleModel, multiModel, pseudoFocusModel];
      });

      function populateModels() {
        models.forEach(model => {
          model.select('one');
          model.select('two');
          model.select('three');
        });
      }

      it('models can be instantiated', () => {
        models.forEach(model => {
          expect(model).toBeDefined();
        });
      });

      it('can add items', () => {
        expect(populateModels).not.toThrow();
      });

      it('single and pseudo-focuscontains only the last item and multiple contains all items', () => {
        populateModels();

        expect(Array.isArray(singleModel.model)).toBe(false);
        expect(singleModel.model).toEqual('three');
        expect(Array.isArray(pseudoFocusModel.model)).toBe(false);
        expect(pseudoFocusModel.model).toEqual('three');

        expect(Array.isArray(multiModel.model)).toBe(true);
        expect(multiModel.model.length).toBe(3);
        expect(multiModel.model).toEqual(['one', 'two', 'three']);
      });

      it('can check if model contains item', () => {
        // not initialized
        expect(() => singleModel.containsItem('zero')).not.toThrow();
        expect(singleModel.containsItem('zero')).toBe(false);
        expect(() => pseudoFocusModel.containsItem('zero')).not.toThrow();
        expect(pseudoFocusModel.containsItem('zero')).toBe(false);
        expect(() => multiModel.containsItem('zero')).not.toThrow();
        expect(multiModel.containsItem('zero')).toBe(false);

        // initialized
        populateModels();

        expect(singleModel.containsItem(undefined)).toBe(false);
        expect(singleModel.containsItem('zero')).toBe(false);
        expect(singleModel.containsItem('one')).toBe(false);
        expect(singleModel.containsItem('three')).toBe(true);

        expect(pseudoFocusModel.containsItem(undefined)).toBe(false);
        expect(pseudoFocusModel.containsItem('zero')).toBe(false);
        expect(pseudoFocusModel.containsItem('one')).toBe(false);
        expect(pseudoFocusModel.containsItem('three')).toBe(true);

        expect(multiModel.containsItem(undefined)).toBe(false);
        expect(multiModel.containsItem('zero')).toBe(false);
        expect(multiModel.containsItem('one')).toBe(true);
        expect(multiModel.containsItem('three')).toBe(true);
      });

      it('can remove items', () => {
        populateModels();

        expect(() => singleModel.unselect('zero')).not.toThrow();
        // we don't accidentally remove value
        expect(singleModel.model).toEqual('three');
        singleModel.unselect('three');
        expect(singleModel.model).toBeFalsy();

        expect(() => pseudoFocusModel.unselect('zero')).not.toThrow();
        // we don't accidentally remove value
        expect(pseudoFocusModel.model).toEqual('three');
        pseudoFocusModel.unselect('three');
        expect(pseudoFocusModel.model).toBeFalsy();

        expect(() => multiModel.unselect('zero')).not.toThrow();
        // we don't accidentally remove value
        expect(multiModel.model).toEqual(['one', 'two', 'three']);
        multiModel.unselect('two');
        expect(multiModel.model).toEqual(['one', 'three']);

        // verify multiModel gets null when empty; needed for form validation
        multiModel.unselect('one');
        multiModel.unselect('three');
        expect(multiModel.model).toBeNull();

        // verify we can add new options after empty
        expect(() => multiModel.select('one')).not.toThrow();
        expect(multiModel.model).toEqual(['one']);
      });

      it('can pop the last item', () => {
        populateModels();

        expect(singleModel.pop()).toEqual('three');
        expect(singleModel.model).toBeFalsy();

        expect(pseudoFocusModel.pop()).toEqual('three');
        expect(pseudoFocusModel.model).toBeFalsy();

        expect(multiModel.pop()).toEqual('three');
        expect(multiModel.model).toEqual(['one', 'two']);
      });

      it('has toString method', () => {
        // no value
        expect(singleModel.toString()).toEqual('');
        expect(pseudoFocusModel.toString()).toEqual('');
        expect(multiModel.toString()).toEqual('');

        // string values
        populateModels();
        expect(singleModel.toString()).toEqual('three');
        expect(pseudoFocusModel.toString()).toEqual('three');
        expect(multiModel.toString()).toEqual('one two three');

        // object values
        const objectData = { big: 'big', fish: 'fish' };
        singleModel.model = objectData;
        pseudoFocusModel.model = objectData;
        multiModel.model = [objectData, { big: 'small', fish: 'frog' }];

        expect(singleModel.toString('fish')).toEqual('fish');
        expect(pseudoFocusModel.toString('fish')).toEqual('fish');
        expect(multiModel.toString('fish')).toEqual('fish frog');
        expect(multiModel.toString('fish', 1)).toEqual('frog');
      });

      it('pseudo-focus model has focusChanged observable', () => {
        let changeValue: string = null;
        pseudoFocusModel.focusChanged.subscribe(value => {
          changeValue = value;
        });
        pseudoFocusModel.select('giant squid');
        expect(changeValue).toBe('giant squid');
      });

      describe('identityFn', () => {
        const byId = (item: { id: number }) => item.id;

        it('SingleSelectComboboxModel containsItem uses identityFn when set', () => {
          const model = new SingleSelectComboboxModel<{
            id: number;
            name: string;
          }>();
          model.model = { id: 1, name: 'A' };
          expect(model.containsItem({ id: 1, name: 'Other' })).toBe(false);

          model.identityFn = byId;
          expect(model.containsItem({ id: 1, name: 'Other' })).toBe(true);
          expect(model.containsItem({ id: 2, name: 'B' })).toBe(false);
        });

        it('SingleSelectComboboxModel containsItem uses reference when identityFn not set', () => {
          const model = new SingleSelectComboboxModel<{
            id: number;
          }>();
          const obj = { id: 1 };
          model.model = obj;
          expect(model.containsItem(obj)).toBe(true);
          expect(model.containsItem({ id: 1 })).toBe(false);
        });

        it('MultiSelectComboboxModel containsItem uses identityFn when set', () => {
          const model = new MultiSelectComboboxModel<{
            id: number;
            name: string;
          }>();
          model.model = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
          ];
          model.identityFn = byId;
          expect(model.containsItem({ id: 1, name: 'Other' })).toBe(true);
          expect(model.containsItem({ id: 3, name: 'C' })).toBe(false);
        });

        it('MultiSelectComboboxModel removeItem uses identityFn when set', () => {
          const model = new MultiSelectComboboxModel<{
            id: number;
            name: string;
          }>();
          model.model = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
          ];
          model.identityFn = byId;
          model.unselect({ id: 2, name: 'Different ref' } as any);
          expect(model.model).toEqual([{ id: 1, name: 'A' }]);
        });
      });
    });
  });
});
