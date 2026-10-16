/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { of, throwError } from 'rxjs';
import { take } from 'rxjs/operators';

import { StepInternal } from './step';
import { ModelChanges } from './step-interfaces';
import { StepModel } from './step.model';
import { ComputedVar, SimpleVar, Var } from './var';
import { InjectPropertiesResult, ModelChange, WorkflowModelManager } from './workflow-model-manager.service';
import { getInputMappings, In } from '../mappings/input-mapping';
import { Mappings } from '../mappings/mappings';
import { getOutputMappings, Out } from '../mappings/output-mapping';

interface NestedType {
  var1: string;
}

@Component({
  standalone: false,
  template: ``,
})
class MockComponent {}

class MockStep1Model implements StepModel {
  loading = false;

  @In() var1 = '';

  @Out() var4 = Var.of<string>('');

  @In() cp1 = Var.of('');

  @Out() var2 = Var.of('');

  @In() var3 = Var.of<string>();

  @Out() var5 = Var.of<string>();

  @In() var6 = Var.of<string>();

  @Out() nestedVar = Var.of<NestedType>();
}
class MockStep2Model implements StepModel {
  loading = false;
  modelProperty = 'defaultModelPropertyValue';

  @In() cp2 = '';

  @Out() var3 = Var.of('default');

  @In() nestedVar1 = Var.of<string>();
}
class MockStep3Model implements StepModel {
  loading = false;

  @In() cp3 = '';

  @In() var3 = Var.of<string>();
}

class MockStep2WayBindingModel implements StepModel {
  loading = false;

  @In()
  @Out()
  v1 = Var.of<number>();
}

class MockStepWithGetterSetter implements StepModel {
  loading = false;

  #prop1: string;

  @In()
  @Out()
  get prop1(): string {
    return this.#prop1;
  }
  set prop1(val: string) {
    this.#prop1 = val;
  }
}

class MockStepWithOutToComputedVar implements StepModel {
  loading = false;

  @Out() cp1 = 'value';
}

class MockStepModelWithoutInputProperties implements StepModel {
  loading = false;

  @Out() modelProperty = Var.of('defaultModelPropertyValue');
}

class MockStepModelWithNestedObjectOutput implements StepModel {
  loading = false;

  @Out() var1: string;

  @Out() nt: NestedType;

  @Out() nestedVar = Var.of<NestedType>();
}

class MockStepModelWithNestedObjectInput implements StepModel {
  loading = false;

  @In() var1: string;

  @In() nt: NestedType;

  @In() nestedVar = Var.of<NestedType>();
}

class StepModelWithOptionalInputs implements StepModel {
  loading = false;

  @In() var1 = '';

  @In({ optional: true }) var2: string;
}

class EmptyStepModel implements StepModel {
  loading = false;
}

class StepModelForExternalMappings implements StepModel {
  loading = false;

  @In() defaultInVar = Var.of('defaultInVar');

  @Out() defaultOutVar = Var.of('defaultOutVar');
}

class WorkflowModel {
  v1 = Var.of(10);
  c1: Var<number>;

  var1 = Var.of('var1');
  var2 = Var.of<string>();
  var3 = Var.of<string>();
  var4 = Var.of<string>('');

  cp1 = Var.from().by(() => {
    return of('cp1');
  });
  cp2 = Var.from(this.var2).by(var2 => {
    return of(var2 + 'cp2');
  });
  cp3: Var<string> = Var.from(this.var3).by(() => {
    return throwError(() => new Error('cp3'));
  });

  nt: NestedType;
  nestedVar = Var.of<NestedType>();
  nestedVar1 = Var.from(this.nestedVar).pluck('var1');

  modelProperty = Var.of('');

  #prop1 = 'prop1';

  get prop1(): string {
    return this.#prop1;
  }
  set prop1(val: string) {
    this.#prop1 = val;
  }
}

interface ThisTest {
  mgr: WorkflowModelManager;
  step1Model: MockStep1Model;
  step1: StepInternal;
  step2Model: MockStep2Model;
  step2: StepInternal;
  step3Model: MockStep3Model;
  step3: StepInternal;
  wizardModel: WorkflowModel;
  onModelChangeSpy: jasmine.Spy;
  onStepChangeSpy: jasmine.Spy;
}

function createWorkflowModel(): WorkflowModel {
  const model = new WorkflowModel();
  model.c1 = Var.from(model.v1)
    .withEagerEval()
    .by((v1: number) => of(v1 + 1));
  expect(model.c1.value).toBeUndefined();
  return model;
}

describe('appfx-workflow-model-manager.service.spec', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    testContext.mgr = new WorkflowModelManager();
    testContext.mgr.steps = [];

    testContext.step1Model = new MockStep1Model();
    testContext.step1 = {
      title: 'title 1',
      model: testContext.step1Model,
      componentClass: MockComponent,
      mappings: new Mappings<MockStep1Model, WorkflowModel>()
        .mapStepProp('var5')
        .to('var3')
        .mapStepProp('var6')
        .to('var1'),
    };
    testContext.step2Model = new MockStep2Model();
    testContext.step2 = {
      title: 'title 2',
      model: testContext.step2Model,
      componentClass: MockComponent,
    };
    testContext.onModelChangeSpy = spyOn(testContext.mgr.onModelChange$, 'next').and.callThrough();
    testContext.onStepChangeSpy = spyOn(testContext.mgr.onStepChange$, 'next').and.callThrough();
  });

  afterEach(() => {
    testContext.mgr.destroy();
  });

  describe('processWorkflowModel()', () => {
    it("'value' is set immediately when dependency is changed", () => {
      const model = createWorkflowModel();

      let modelChanges: ModelChange[] = [];
      const subscription = testContext.mgr.onModelChange$.subscribe(
        (changes: ModelChange[]) => (modelChanges = changes)
      );
      expect(modelChanges.length).toEqual(0);

      // Set the model. At this point a subscription to eager computed vars is done.
      // Since the dependent Var (v1) already has a value, c1 will be set immediately.
      testContext.mgr.model = model;

      expect(model.c1.value).toEqual(11);
      expect(modelChanges).toBeDefined();
      expect(modelChanges.length).toEqual(1);
      let change: ModelChange = modelChanges[0];
      expect(change.propertyName).toEqual('c1');
      expect(change.oldValue).toBeUndefined();
      expect(change.newValue).toEqual(11);

      // Change the dependent Var's value.
      // Verify that computed var is immediately recalculated.
      model.v1.value = 1;
      expect(model.c1.value).toEqual(2);
      change = modelChanges[0];
      expect(change.propertyName).toEqual('c1');
      expect(change.oldValue).toEqual(11);
      expect(change.newValue).toEqual(2);

      subscription.unsubscribe();
    });

    it('test unsubscribe on new model', () => {
      const model = createWorkflowModel();
      testContext.mgr.model = model;

      expect(model.c1.value).toEqual(11);

      // Set new model
      testContext.mgr.model = {};

      // Change the dependent Var's value. Verify that computed var is NOT recalculated.
      model.v1.value = 1;
      expect(model.c1.value).toEqual(11);
    });

    it('test unsubscribe on destroy', () => {
      const model = createWorkflowModel();
      testContext.mgr.model = model;

      expect(model.c1.value).toEqual(11);

      // Destroy the manager should unsubscribe the eager computed vars.
      testContext.mgr.destroy();

      // Change the dependent Var's value. Verify that computed var is NOT recalculated.
      model.v1.value = 1;
      expect(model.c1.value).toEqual(11);
    });
  });

  describe('input and output mappings', () => {
    describe('WHEN there is no wizardModel', () => {
      beforeEach(() => {
        testContext.mgr.steps = [testContext.step1, testContext.step2];
      });

      it('THEN onStepChange$ and onModelChange$ is never called', () => {
        let result: InjectPropertiesResult | undefined;
        testContext.mgr.ejectPropertiesFromCurrentStep(undefined);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step1)
          .pipe(take(1))
          .subscribe(
            pendingStep => {
              result = pendingStep;
            },
            () => {
              fail('should never reach here');
            }
          );
        expect(result).toEqual({ pendingStep: testContext.step1 });
        expect(testContext.mgr.onModelChange$.next).not.toHaveBeenCalled();
        expect(testContext.mgr.onStepChange$.next).not.toHaveBeenCalled();
      });
    });

    describe('WHEN there is wizardModel', () => {
      beforeEach(() => {
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step1, testContext.step2];
      });

      it('injectPropertiesToPendingStep injects the properties on the first step', () => {
        let result: InjectPropertiesResult | undefined;
        testContext.wizardModel.var3.value = 'var3';
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step1)
          .pipe(take(1))
          .subscribe(
            res => (result = res),
            () => fail('should never reach here')
          );
        const stepModelChanges: ModelChanges = {
          var1: new ModelChange('var1', '', 'var1'),
          cp1: new ModelChange('cp1', '', 'cp1'),
          var3: new ModelChange('var3', undefined, 'var3'),
          var6: new ModelChange('var6', undefined, 'var1'),
        };
        expect(result).toEqual({
          pendingStep: testContext.step1,
          stepModelChanges: stepModelChanges,
          recreateComponent: undefined,
        });
        const changes = [new ModelChange('cp1', undefined, 'cp1')];
        expect(testContext.mgr.onModelChange$.next).toHaveBeenCalledWith(changes);
        expect(testContext.mgr.onStepChange$.next).toHaveBeenCalledWith({
          step: testContext.step1,
          changes: changes,
        });
        expect(testContext.step1Model.var1).toEqual('var1');
        expect(testContext.step1Model.cp1.value).toEqual('cp1');
      });

      it(`ejectPropertiesFromCurrentStep ejects the properties from first step and
               injectPropertiesToPendingStep injects the properties on the second step`, () => {
        let result: InjectPropertiesResult | undefined;
        // transition to step1
        testContext.mgr.ejectPropertiesFromCurrentStep(undefined);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step1)
          .pipe(take(1))
          .subscribe(
            pendingStep => {
              result = pendingStep;
            },
            () => {
              fail('should never reach here');
            }
          );
        expect(testContext.step1Model.var6.value).toEqual('var1'); // verify @out external mapping
        // transition to step2
        testContext.onModelChangeSpy.calls.reset();
        testContext.onStepChangeSpy.calls.reset();
        testContext.step1Model.var2.value = 'var2';
        testContext.step1Model.var4.value = 'var4';
        testContext.step1Model.var5.value = testContext.step1Model.var1;
        testContext.step1Model.nestedVar.value = { var1: 'var1' };
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        expect(testContext.wizardModel.var3.value).toEqual('var1'); // verify @in external mapping
        expect(testContext.wizardModel.nestedVar.value).toEqual({ var1: 'var1' });
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step2)
          .pipe(take(1))
          .subscribe(
            pendingStep => {
              result = pendingStep;
            },
            () => {
              fail('should never reach here');
            }
          );
        const stepModelChanges: ModelChanges = {
          cp2: new ModelChange('cp2', '', 'var2cp2'),
          nestedVar1: new ModelChange('nestedVar1', undefined, 'var1'),
        };
        expect(result).toEqual({
          pendingStep: testContext.step2,
          stepModelChanges: stepModelChanges,
          recreateComponent: undefined,
        });
        expect(testContext.wizardModel.var2.value).toEqual('var2');
        expect(testContext.step2Model.cp2).toEqual('var2cp2');
        let changes = [new ModelChange('cp2', undefined, 'var2cp2'), new ModelChange('nestedVar1', undefined, 'var1')];
        expect(testContext.mgr.onStepChange$.next).toHaveBeenCalledTimes(1);
        expect(testContext.mgr.onStepChange$.next).toHaveBeenCalledWith({
          step: testContext.step2,
          changes: changes,
        });
        expect(testContext.mgr.onModelChange$.next).toHaveBeenCalledTimes(5);
        expect(testContext.mgr.onModelChange$.next).toHaveBeenCalledWith(changes);
        changes = [new ModelChange('var2', '', 'var2')];
        expect(testContext.mgr.onModelChange$.next).toHaveBeenCalledWith(changes);
        changes = [new ModelChange('var3', 'default', 'var1')];
        expect(testContext.mgr.onModelChange$.next).toHaveBeenCalledWith(changes);
        changes = [new ModelChange('var4', 'var1', 'var4')];
        expect(testContext.wizardModel.var3.value).toEqual('var1');
        expect(testContext.wizardModel.var4.value).toEqual('var4');
      });

      it(`WHEN going back to previous step and modifying the output,
               THEN injectPropertiesToPendingStep correctly identifies changes`, () => {
        const step1Model = new MockStepModelWithNestedObjectOutput();
        const step2Model = new MockStepModelWithNestedObjectInput();
        testContext.step1.mappings = undefined;
        testContext.step1.model = step1Model;
        testContext.step2.model = step2Model;
        testContext.mgr.steps = [testContext.step1, testContext.step2];

        let modelChanges: ModelChange[] = [];
        const subscription = testContext.mgr.onModelChange$.subscribe(
          (changes: ModelChange[]) => (modelChanges = changes)
        );

        // Transition to step1.
        testContext.mgr.ejectPropertiesFromCurrentStep(undefined);
        testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();

        step1Model.var1 = 'value-1';
        const nestedObject1 = 'nested-object-1';
        step1Model.nt = { var1: nestedObject1 };
        step1Model.nestedVar.value = { var1: 'nested_var-1' };

        // Transition to step2.
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        // 2 not 3 changes, because 'nestedVar' is Var and is copied instantaneously to the wizard model.
        let wizardModelChanges: ModelChange[] = [
          new ModelChange('var1', undefined, 'value-1'),
          new ModelChange('nt', undefined, { var1: nestedObject1 }),
        ];
        expect(modelChanges).toEqual(wizardModelChanges);
        testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();

        // Transition back to step1 and modify the outputs. When 'Back' is clicked,
        // 'WorkflowModelManager.ejectPropertiesFromCurrentStep' is not invoked.
        testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();
        step1Model.var1 = 'value-2';
        const nestedObject2 = 'nested-object-2';
        step1Model.nt.var1 = nestedObject2; // modify the reference
        step1Model.nestedVar.value.var1 = 'nested_var-2'; // modify the reference

        // Transition to step2.
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        wizardModelChanges = [
          new ModelChange('var1', 'value-1', 'value-2'),
          new ModelChange('nt', { var1: nestedObject1 }, { var1: nestedObject2 }),
        ];
        expect(modelChanges).toEqual(wizardModelChanges);

        let result: InjectPropertiesResult | undefined;
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step2)
          .pipe(take(1))
          .subscribe((pendingStep: InjectPropertiesResult) => (result = pendingStep));

        const stepModelChanges: ModelChanges = {
          var1: new ModelChange('var1', 'value-1', 'value-2'),
          nt: new ModelChange('nt', { var1: nestedObject1 }, { var1: nestedObject2 }),
          nestedVar: new ModelChange('nestedVar', { var1: 'nested_var-1' }, { var1: 'nested_var-2' }),
        };
        expect(result?.stepModelChanges).toEqual(stepModelChanges);
        subscription.unsubscribe();
      });

      it(`WHEN going back to previous step with optional inputs,
               THEN injectPropertiesToPendingStep correctly identifies changes`, () => {
        const step1Model = new StepModelWithOptionalInputs();
        testContext.step1.mappings = undefined;
        testContext.step1.model = step1Model;
        testContext.step2.model = new EmptyStepModel();
        testContext.mgr.steps = [testContext.step1, testContext.step2];
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();

        // Transition to step1.
        let injectResult: InjectPropertiesResult = {};
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step1)
          .pipe(take(1))
          .subscribe((result: InjectPropertiesResult) => (injectResult = result));

        // Verify that ModelChanges contain only `var1`.
        let stepModelChanges: ModelChanges = {
          var1: new ModelChange('var1', '', 'var1'),
        };
        expect(stepModelChanges).toEqual(injectResult.stepModelChanges as ModelChanges);

        // Transition to step2.
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();

        // Transition back to step1. When 'Back' is clicked,
        // 'WorkflowModelManager.ejectPropertiesFromCurrentStep' is not invoked.
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step1)
          .pipe(take(1))
          .subscribe((result: InjectPropertiesResult) => (injectResult = result));

        // Verify that ModelChanges do not contain neither `var1`, nor `var2`.
        stepModelChanges = {};
        expect(stepModelChanges).toEqual(injectResult.stepModelChanges as ModelChanges);
      });

      it(`WHEN there is change in Var with @outputMapping Mapping,
               THEN ejectPropertiesFromCurrentStep should emit changes`, () => {
        testContext.onModelChangeSpy.calls.reset();
        testContext.step1Model.var2.value = 'var2';
        expect(testContext.onModelChangeSpy).toHaveBeenCalledWith([new ModelChange('var2', '', 'var2')]);
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        expect(testContext.wizardModel.var2.value).toEqual('var2');
      });

      it(`ejectPropertiesFromCurrentStep should update the wizard model with correct value
               when nested properties have changed without calling var value setter`, () => {
        expect(testContext.wizardModel.nestedVar.value).toBeUndefined();
        expect(testContext.wizardModel.nestedVar1.value).toBeUndefined();
        const subscription = (<SimpleVar<string>>testContext.wizardModel.nestedVar1).value$.subscribe();
        testContext.step1Model.nestedVar.value = { var1: 'var1' };
        expect(testContext.wizardModel.nestedVar.value).toEqual({ var1: 'var1' });
        testContext.step1Model.nestedVar.value.var1 = 'updatedVar1';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        expect(testContext.wizardModel.nestedVar.value).toEqual({ var1: 'updatedVar1' });
        expect(testContext.wizardModel.nestedVar1.value).toEqual('updatedVar1');
        subscription.unsubscribe();
      });

      it(`ejectPropertiesFromCurrentStep should throw error WHEN wizard property is ComputedVar`, () => {
        testContext.step1.mappings = undefined;
        testContext.step1.model = new MockStepWithOutToComputedVar();
        testContext.mgr.steps = [testContext.step1];
        let isError = false;
        try {
          testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        } catch {
          isError = true;
        }
        expect(isError).toBeTruthy();
      });
    });

    it('wizard model should get updated with initial value of step model var', () => {
      testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
      expect(testContext.wizardModel.var3.value).toBeUndefined();
      testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
      testContext.mgr.steps = [testContext.step1, testContext.step2];

      // without changing the value of step model, wizard model gets updated from undefined to "default" (initial value)
      expect(testContext.wizardModel.var3.value).toEqual('default');
    });

    describe('WHEN a ComputedVar throws an error of type', () => {
      beforeEach(() => {
        testContext.step3Model = new MockStep3Model();
        testContext.step3 = {
          title: 'title 3',
          model: testContext.step3Model,
          componentClass: MockComponent,
        };
        testContext.mgr.steps = [testContext.step1, testContext.step2, testContext.step3];
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
      });

      it('Error Object, THEN injectPropertiesToPendingStep will return error object', () => {
        let result: InjectPropertiesResult | undefined;
        testContext.step2Model.var3.value = 'var3';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step2);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step3)
          .pipe(take(1))
          .subscribe(pendingStep => {
            result = pendingStep;
          });
        expect(result?.pendingStep).toEqual(testContext.step3);
        expect(result?.error?.data.message).toEqual('cp3');
        expect(result?.error?.data.stackTrace).toBeTruthy();
      });

      it('string, THEN injectPropertiesToPendingStep will return error string', () => {
        testContext.wizardModel.cp3 = Var.from(testContext.wizardModel.var3).by(() => {
          return throwError(() => 'cp3');
        });
        let result: InjectPropertiesResult | undefined;
        testContext.step2Model.var3.value = 'var3';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step2);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step3)
          .pipe(take(1))
          .subscribe(pendingStep => {
            result = pendingStep;
          });
        expect(result?.pendingStep).toEqual(testContext.step3);
        expect(result?.error?.data.message).toEqual('cp3');
        expect(result?.error?.data.stackTrace).toBeUndefined();
      });

      it('http backend error, THEN injectPropertiesToPendingStep will return error', () => {
        testContext.wizardModel.cp3 = Var.from(testContext.wizardModel.var3).by(() => {
          return throwError({ data: { message: 'cp3', stackTrace: 'cp3stacktrace' } });
        });
        let result: InjectPropertiesResult | undefined;
        testContext.step2Model.var3.value = 'var3';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step2);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step3)
          .pipe(take(1))
          .subscribe(pendingStep => {
            result = pendingStep;
          });
        expect(result?.pendingStep).toEqual(testContext.step3);
        expect(result?.error?.data.message).toEqual('cp3');
        expect(result?.error?.data.stackTrace).toEqual('cp3stacktrace');
      });

      it('custom error, THEN injectPropertiesToPendingStep will return error with json stringify', () => {
        const customObj = { error: 'customError' };
        testContext.wizardModel.cp3 = Var.from(testContext.wizardModel.var3).by(() => {
          return throwError(() => customObj);
        });
        let result: InjectPropertiesResult | undefined;
        testContext.step2Model.var3.value = 'var3';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step2);
        testContext.mgr
          .injectPropertiesToPendingStep(testContext.step3)
          .pipe(take(1))
          .subscribe(pendingStep => {
            result = pendingStep;
          });
        expect(result?.pendingStep).toEqual(testContext.step3);
        expect(result?.error?.data.message).toEqual(JSON.stringify(customObj));
        expect(result?.error?.data.stackTrace).toBeUndefined();
      });
    });

    describe('WHEN there are missing dependencies', () => {
      beforeEach(() => {
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step1, testContext.step2];
      });

      it('WHEN ComputeVar dependency is not satisfied, injectPropertiesToPendingStep should throw error', () => {
        const var2 = Var.of<string>() as SimpleVar<string>;
        var2.name = 'var2';
        testContext.wizardModel.var2 = var2;
        const cp2 = Var.from<string>(testContext.wizardModel.var2).by(() => of('var2')) as ComputedVar<string>;
        cp2.name = 'cp2';
        testContext.wizardModel.cp2 = cp2;
        let result = '';
        try {
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
        } catch (e) {
          result = (e as Error).message;
        }
        expect(result).toEqual('Dependencies not satisfied for Var: cp2 --> var2');
      });

      it('WHEN SimpleVar value is not initialised, injectPropertiesToPendingStep should throw error', () => {
        const var3 = Var.of<string>() as SimpleVar<string>;
        var3.name = 'var3';
        testContext.wizardModel.var3 = var3;
        let result = '';
        try {
          testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();
        } catch (e) {
          result = (e as Error).message;
        }
        expect(result).toEqual('Value not initialized for Var: var3');
      });

      describe('optional inputs', () => {
        it('WHEN input property does not exist in wizard model', () => {
          class StepModelWithOptionalInput implements StepModel {
            loading = false;
            @In({ optional: true }) notExisting: string;
            @In() var1: string;
          }

          const model = new StepModelWithOptionalInput();
          const step = <StepInternal>{
            title: '',
            model: model,
            componentClass: MockComponent,
          };
          testContext.mgr.steps = [step];
          testContext.mgr.injectPropertiesToPendingStep(step).pipe(take(1)).subscribe();
          expect(model.notExisting).toBeUndefined();
          expect(model.var1).toEqual('var1');
        });

        it('WHEN input property maps to SimpleVar that is unset', () => {
          class StepModelWithOptionalInput implements StepModel {
            loading = false;
            @In() var1: string;
            // Maps to WorkflowModel.var2 that is unset SimpleVar.
            @In({ optional: true }) var2: string;
          }

          const model = new StepModelWithOptionalInput();
          const step = <StepInternal>{
            title: '',
            model: model,
            componentClass: MockComponent,
          };
          testContext.wizardModel.var2 = Var.of<string>();
          testContext.mgr.steps = [step];
          testContext.mgr.injectPropertiesToPendingStep(step).pipe(take(1)).subscribe();
          expect(model.var1).toEqual('var1');
          expect(model.var2).toBeUndefined();
        });

        it('WHEN input property maps to ComputedVar with missing dependencies', () => {
          class StepModelWithOptionalInput implements StepModel {
            loading = false;
            @In() var1: string;
            // Maps to WorkflowModel.cp2 that is a ComputedVar, whose dependencies are not satisfied.
            @In({ optional: true }) cp2: string;
          }

          const model = new StepModelWithOptionalInput();
          const step = <StepInternal>{
            title: '',
            model: model,
            componentClass: MockComponent,
          };
          testContext.wizardModel.var2 = Var.of<string>();
          testContext.wizardModel.cp2 = Var.from(testContext.wizardModel.var2).by(() => of('cp2'));
          testContext.mgr.steps = [step];
          testContext.mgr.injectPropertiesToPendingStep(step).pipe(take(1)).subscribe();
          expect(model.var1).toEqual('var1');
          expect(model.cp2).toBeUndefined();
        });
      });
    });

    describe('WHEN both @In() and @Out() are declared on same Property', () => {
      beforeEach(() => {
        testContext.step1.model = new MockStep2WayBindingModel();
        testContext.step1.mappings = undefined;
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step1];
      });

      it('injectPropertiesToPendingStep injects the properties to step Model', () => {
        const step1Model: MockStep2WayBindingModel = testContext.step1.modelInstance as MockStep2WayBindingModel;
        let loading = true;
        const subscription = testContext.mgr.loading$.subscribe(l => (loading = l));
        expect(loading).toEqual(false);
        testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();
        expect(step1Model.v1.value).toEqual(10);
        expect(loading).toEqual(false);
        step1Model.v1.value = 20;
        expect(testContext.wizardModel.v1.value).toEqual(20);
        subscription.unsubscribe();
      });
    });

    describe('WHEN wizard model has property with Getter and setter', () => {
      beforeEach(() => {
        testContext.step1.model = new MockStepWithGetterSetter();
        testContext.step1.mappings = undefined;
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step1];
      });

      it(`injectPropertiesToPendingStep injects the properties to step Model and
               ejectPropertiesFromCurrentStep ejects the properties to Wizard Model`, () => {
        const step1Model: MockStepWithGetterSetter = testContext.step1.modelInstance as MockStepWithGetterSetter;
        testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();
        expect(step1Model.prop1).toEqual('prop1');
        step1Model.prop1 = 'prop1Changed';
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        expect(testContext.wizardModel.prop1).toEqual('prop1Changed');
      });
    });

    describe('WHEN Same Step model used in different Step with different External Mappings', () => {
      beforeEach(() => {
        testContext.step1.model = new StepModelForExternalMappings();
        testContext.step2.model = new StepModelForExternalMappings();
        testContext.step1.mappings = new Mappings<StepModelForExternalMappings, WorkflowModel>()
          .mapStepProp('defaultInVar')
          .to('var1')
          .mapStepProp('defaultOutVar')
          .to('var2');
        testContext.step2.mappings = new Mappings<StepModelForExternalMappings, WorkflowModel>()
          .mapStepProp('defaultInVar')
          .to('cp1')
          .mapStepProp('defaultOutVar')
          .to('var3');
        testContext.step1.componentClass = MockComponent;
        testContext.step2.componentClass = MockComponent;
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step1, testContext.step2];
      });

      it(`injectPropertiesToPendingStep injects the properties to step Model from correct wizard model properties`, () => {
        const step1Model: StepModelForExternalMappings = testContext.step1
          .modelInstance as StepModelForExternalMappings;
        testContext.mgr.injectPropertiesToPendingStep(testContext.step1).pipe(take(1)).subscribe();
        expect(step1Model.defaultInVar.value).toEqual('var1');
        const step2Model: StepModelForExternalMappings = testContext.step2
          .modelInstance as StepModelForExternalMappings;
        testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
        expect(step2Model.defaultInVar.value).toEqual('cp1');

        // verify that actual inputMappings is not changed
        const inputMappings1 = getInputMappings(testContext.step1.modelInstance);
        expect(inputMappings1['defaultInVar'].propertyName).toEqual('defaultInVar');
        const inputMappings2 = getInputMappings(testContext.step2.modelInstance);
        expect(inputMappings2['defaultInVar'].propertyName).toEqual('defaultInVar');
      });

      it(`ejectPropertiesFromCurrentStep ejects the properties to correct Wizard Model properties`, () => {
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step1);
        expect(testContext.wizardModel.var2.value).toEqual('defaultOutVar');
        testContext.mgr.ejectPropertiesFromCurrentStep(testContext.step2);
        expect(testContext.wizardModel.var3.value).toEqual('defaultOutVar');

        // verify that actual outputMappings is not changed
        const outputMappings1 = getOutputMappings(testContext.step1.modelInstance);
        expect(outputMappings1['defaultOutVar'].propertyName).toEqual('defaultOutVar');
        const outputMappings2 = getOutputMappings(testContext.step2.modelInstance);
        expect(outputMappings2['defaultOutVar'].propertyName).toEqual('defaultOutVar');
      });
    });
  });

  describe('when recreateComponent=true', () => {
    it('AND step model is not function, THEN error should be thrown', () => {
      testContext.step2.recreateComponent = () => true;
      let error = false;
      try {
        testContext.mgr.steps = [testContext.step2];
      } catch {
        error = true;
      }
      expect(error).toEqual(true);
    });

    describe('AND step model is function', () => {
      beforeEach(() => {
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.step2.recreateComponent = () => true;
        testContext.step2.model = () => new MockStep2Model();
        testContext.mgr.steps = [testContext.step2];
      });

      it('modelInstance should be assigned', () => {
        expect(testContext.step2.modelInstance).toBeDefined();
      });

      it('wizard model should get updated with initial value of step model var', () => {
        // This verifies the bindings to step model @out property created by step model factory.
        expect(testContext.wizardModel.var3.value).toEqual('default');
      });

      it(`injectPropertiesToPendingStep should re-create modelInstance and inject properties to new model`, () => {
        testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
        testContext.mgr.steps = [testContext.step2];
        let step2Model = <MockStep2Model>testContext.step2.modelInstance;
        expect(step2Model.modelProperty).toEqual('defaultModelPropertyValue');
        testContext.wizardModel.var2.value = 'var2';
        testContext.wizardModel.nestedVar.value = {
          var1: 'var1',
        };
        step2Model.modelProperty = 'modifiedModelVarValue';
        testContext.wizardModel.var3.value = 'changed';
        testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
        step2Model = <MockStep2Model>testContext.step2.modelInstance;
        expect(step2Model.nestedVar1.value).toEqual('var1');
        // change
        testContext.wizardModel.nestedVar.value = {
          var1: 'modifiedVar',
        };
        step2Model.modelProperty = 'modifiedModelVarValue';
        testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
        step2Model = <MockStep2Model>testContext.step2.modelInstance;
        expect(step2Model.modelProperty).toEqual('defaultModelPropertyValue');
        expect(step2Model.nestedVar1.value).toEqual('modifiedVar');
      });

      describe('WHEN there is no @In properties in step model', () => {
        beforeEach(() => {
          testContext.step2.recreateComponent = () => true;
          testContext.step2.model = () => new MockStepModelWithoutInputProperties();
          testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
          testContext.mgr.steps = [testContext.step2];
        });

        it(`injectPropertiesToPendingStep should re-create modelInstance`, () => {
          let step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          expect(step2Model.modelProperty.value).toEqual('defaultModelPropertyValue');
          step2Model.modelProperty.value = 'modifiedModelVarValue';
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
          step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          expect(step2Model.modelProperty.value).toEqual('defaultModelPropertyValue');
        });

        it(`Should bind to re-created modelInstance's Out Var`, () => {
          let step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          expect(step2Model.modelProperty.value).toEqual('defaultModelPropertyValue');
          step2Model.modelProperty.value = 'modifiedModelVarValue';
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
          step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          step2Model.modelProperty.value = 'modifiedModelVarValue2';
          expect(testContext.wizardModel.modelProperty.value).toEqual('modifiedModelVarValue2');
        });
      });
    });
  });

  describe('when recreateComponent=false', () => {
    describe('AND step model is function', () => {
      beforeEach(() => {
        testContext.step2.recreateComponent = () => false;
        testContext.step2.model = () => new MockStep2Model();
        testContext.step2.mappings = new Mappings<MockStep2Model, WorkflowModel>();
      });

      it('modelInstance should be assigned', () => {
        testContext.mgr.steps = [testContext.step2];
        expect(testContext.step2.modelInstance).toBeDefined();
      });

      describe('WHEN there is no @In properties in step model', () => {
        beforeEach(() => {
          testContext.step2.recreateComponent = () => false;
          testContext.step2.model = () => new MockStepModelWithoutInputProperties();
          testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
          testContext.mgr.steps = [testContext.step2];
        });

        it(`injectPropertiesToPendingStep should NOT re-create modelInstance`, () => {
          let step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          expect(step2Model.modelProperty.value).toEqual('defaultModelPropertyValue');
          step2Model.modelProperty.value = 'modifiedModelVarValue';
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
          step2Model = <MockStepModelWithoutInputProperties>testContext.step2.modelInstance;
          expect(step2Model.modelProperty.value).toEqual('modifiedModelVarValue');
        });
      });

      describe('when there is wizard model', () => {
        it('wizard model should get updated with initial value of step model var', () => {
          testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
          expect(testContext.wizardModel.var3.value).toBeUndefined();
          testContext.mgr.steps = [testContext.step2];
          expect(testContext.wizardModel.var3.value).toEqual('default');
        });

        it(`injectPropertiesToPendingStep should NOT re-create modelInstance
                  and inject properties to old model`, () => {
          testContext.mgr.model = testContext.wizardModel = new WorkflowModel();
          testContext.mgr.steps = [testContext.step2];
          let step2Model = <MockStep2Model>testContext.step2.modelInstance;
          expect(step2Model.modelProperty).toEqual('defaultModelPropertyValue');
          testContext.wizardModel.var2.value = 'var2';
          testContext.wizardModel.nestedVar.value = {
            var1: 'var1',
          };
          step2Model.modelProperty = 'modifiedModelVarValue';
          testContext.wizardModel.var3.value = 'changed';
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
          step2Model = <MockStep2Model>testContext.step2.modelInstance;
          expect(step2Model.nestedVar1.value).toEqual('var1');
          // change
          testContext.wizardModel.nestedVar.value = {
            var1: 'modifiedVar',
          };
          step2Model.modelProperty = 'modifiedModelVarValue';
          testContext.mgr.injectPropertiesToPendingStep(testContext.step2).pipe(take(1)).subscribe();
          step2Model = <MockStep2Model>testContext.step2.modelInstance;
          expect(step2Model.modelProperty).toEqual('modifiedModelVarValue');
          expect(step2Model.nestedVar1.value).toEqual('modifiedVar');
        });
      });
    });
  });

  describe('WorkflowModel', () => {
    it('WHEN model is function, THEN it should throw error', () => {
      let errorMessage = '';
      try {
        testContext.mgr.model = () => {
          // no action
        };
      } catch (e) {
        errorMessage = (e as Error).message;
      }
      expect(errorMessage).toEqual('Workflow model cannot be a function or array.');
    });

    it('WHEN model is array, THEN it should throw error', () => {
      let errorMessage = '';
      try {
        testContext.mgr.model = [];
      } catch (e) {
        errorMessage = (e as Error).message;
      }
      expect(errorMessage).toEqual('Workflow model cannot be a function or array.');
    });
  });
});
