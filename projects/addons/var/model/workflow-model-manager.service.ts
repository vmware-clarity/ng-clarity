/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject, Subscription, throwError } from 'rxjs';
import { catchError, map, pairwise, startWith, take, tap } from 'rxjs/operators';

import { StepInternal } from './step';
import { ModelChanges } from './step-interfaces';
import { StepModel } from './step.model';
import { ComputedVar, ComputeStrategy, SimpleVar } from './var';
import { WorkflowModel } from './workflow.model';
import { ActivationError } from '../error/interfaces';
import { getInputMappings, InputMappingMetadata, InputMappings } from '../mappings/input-mapping';
import { Mappings } from '../mappings/mappings';
import { getOutputMappings, OutputMappingMetadata, OutputMappings } from '../mappings/output-mapping';
import { formatError, parse, stringify } from '../util/util';

export class ModelChange {
  constructor(
    public propertyName: string,
    public oldValue: any,
    public newValue: any
  ) {}
}

export interface StepWithChanges {
  step?: StepInternal;
  changes: ModelChange[];
}

@Injectable()
export class WorkflowModelManager {
  /**
   * Emit when {@link injectPropertiesToPendingStep} method completes.
   * Emitted value contains the pending step and calculated properties for it.
   */
  onStepChange$ = new Subject<StepWithChanges>();

  /**
   * Emit when one or more workflow properties are changed.
   */
  onModelChange$ = new Subject<Array<ModelChange>>();

  /**
   * Emit "true" before start of computed properties evaluation.
   * Emit "false" when computed properties are evaluated.
   */
  loading$ = new BehaviorSubject<boolean>(false);

  private stepModelBindings: Map<StepModel, Subscription> = new Map();
  private workflowModelSubs: Subscription[] = [];
  private wizardModel: any;
  // Contains stringified values of the 'wizardModel' properties.
  private wizardModelOldValues: any = {};
  // Contains stringified values of the input step model properties.
  private stepModelLastValuesIn: Map<StepModel, any> = new Map();

  #steps: StepInternal[];

  /**
   * Workflow steps.
   */
  set steps(value: StepInternal[]) {
    this.#steps = value;
    this.initStepModels();
    this.onStepsOrModelChange();
  }

  /**
   * Workflow model.
   */
  get model(): WorkflowModel {
    return this.wizardModel;
  }

  set model(value: WorkflowModel) {
    if (typeof value === 'function' || Array.isArray(value)) {
      throw new Error('Workflow model cannot be a function or array.');
    }
    if (!value) {
      console.warn('Workflow model not initialized.!');
    }
    this.wizardModel = value;
    this.wizardModelOldValues = {};
    this.onStepsOrModelChange();
  }

  destroy(): void {
    this.unbindStepModelListeners();
    this.unbindWorkflowModelListeners();
  }

  /**
   * Ejects properties from provided step model to wizard model.
   */
  ejectPropertiesFromCurrentStep(currentStep: StepInternal | undefined): void {
    if (!this.wizardModel) {
      return;
    }

    if (!currentStep?.modelInstance) {
      return;
    }

    const outputMappings: OutputMappings = this.getOutputMappings(currentStep.modelInstance, currentStep.mappings);
    if (!outputMappings) {
      return;
    }

    const changes: (ModelChange | null)[] = [];
    for (const [key, outputMapping] of Object.entries(outputMappings)) {
      const stepModelValue = (currentStep.modelInstance as any)[key];
      const change = this.updateWizardModel(stepModelValue, outputMapping);
      changes.push(change);
    }

    this.emitModelChange(changes);
  }

  /**
   * Calculate the {@link ComputedVar} properties, if any.
   * Then inject properties to the provided step model.
   */
  injectPropertiesToPendingStep(pendingStep: StepInternal | undefined): Observable<InjectPropertiesResult> {
    if (!this.wizardModel) {
      return of({
        pendingStep: pendingStep,
      });
    }
    return this.injectPropertiesToPendingStepInternal(pendingStep).pipe(
      tap((result: InjectPropertiesInternalResult) => {
        this.emitModelChange(result.wizardModelChanges);
        this.onStepChange$.next({
          step: pendingStep,
          changes: result.wizardModelChanges,
        });
      }),
      map((result: InjectPropertiesInternalResult) => {
        return {
          pendingStep: pendingStep,
          stepModelChanges: result.stepModelChanges,
          recreateComponent: result.recreateComponent,
        };
      }),
      catchError((error: unknown) => {
        console.error(error);
        return of({
          pendingStep: pendingStep,
          error: formatError(error),
        });
      })
    );
  }

  private onStepsOrModelChange(): void {
    // Clear bindings to old steps/model.
    this.unbindStepModelListeners();
    this.unbindWorkflowModelListeners();
    this.stepModelLastValuesIn.clear();

    if (!this.#steps || !this.wizardModel) {
      return;
    }
    // Both steps and model is set.
    this.bindStepModelListeners();
    this.processWorkflowModel();
  }

  private initStepModels() {
    (this.#steps || [])
      .filter(step => !step.instantiateLazy) // if instantiateLazy, init later when required ( in injectPropertiesToPendingStepInternal )
      .forEach(step => {
        this.initStepModel(step);
      });
  }

  private initStepModel(step: StepInternal): StepModel | undefined {
    if (typeof step.model === 'function') {
      step.modelInstance = step.model();
    } else {
      if (step.recreateComponent) {
        throw new Error(
          'When recreateComponent is defined, model should be faclibs/appfx/wizard/src/wizard.component.tstory function'
        );
      }
      step.modelInstance = step.model;
    }
    if (step.mappings) {
      step.mappings.validate(step.modelInstance);
    }
    return step.modelInstance;
  }

  private bindStepModelListeners(): void {
    for (const page of this.#steps) {
      this.bindStepModelListener(page);
    }
  }

  private bindStepModelListener(page: StepInternal): void {
    if (!page.modelInstance) {
      return;
    }

    const mappings: OutputMappings = this.getOutputMappings(page.modelInstance, page.mappings);
    if (!mappings) {
      return;
    }
    const subscription: Subscription = new Subscription();
    for (const [propertyName, outputMapping] of Object.entries(mappings)) {
      const propertyValue = (page.modelInstance as any)[propertyName];
      if (propertyValue instanceof Observable) {
        // TODO: Deprecated; to be removed!
        console.warn(
          `Step ${page.title} has property ${propertyName}: Observable.` +
            'Using Observable in Step models is deprecated and will be removed soon. ' +
            'Use Var.from() instead'
        );

        subscription.add(
          propertyValue.subscribe(value => {
            if (this.wizardModel) {
              const change = this.updateWizardModel(value, outputMapping);
              this.emitModelChange([change]);
            }
          })
        );
      } else if (propertyValue instanceof SimpleVar) {
        subscription.add(
          propertyValue.value$.subscribe(value => {
            if (this.wizardModel) {
              const change = this.updateWizardModel(value, outputMapping);
              this.emitModelChange([change]);
            }
          })
        );
      } else {
        // no action
      }
    }
    this.stepModelBindings.set(page.modelInstance, subscription);
  }

  private unbindStepModelListeners(): void {
    this.stepModelBindings.forEach(s => s.unsubscribe());
    this.stepModelBindings.clear();
  }

  private unbindStepModelListener(page: StepInternal) {
    if (!page.modelInstance) {
      return;
    }
    const stepModelBinding = this.stepModelBindings.get(page.modelInstance);
    if (stepModelBinding) {
      stepModelBinding.unsubscribe();
      this.stepModelBindings.delete(page.modelInstance);
    }
  }

  private processWorkflowModel(): void {
    for (const [propName, propValue] of Object.entries(this.wizardModel)) {
      if (propValue instanceof SimpleVar) {
        propValue.name = propName;
      } else if (propValue instanceof ComputedVar) {
        propValue.name = propName;
        if (propValue.strategy === ComputeStrategy.eager) {
          this.workflowModelSubs.push(
            propValue.value$.pipe(startWith(undefined), pairwise()).subscribe(([prevValue, newValue]) => {
              const change = new ModelChange(propName, prevValue, newValue);
              this.emitModelChange([change]);
            })
          );
        }
      } else {
        // no action
      }
    }
  }

  private unbindWorkflowModelListeners(): void {
    this.workflowModelSubs.forEach(s => s.unsubscribe());
    this.workflowModelSubs = [];
  }

  private updateWizardModel(newValue: any, outputMapping: OutputMappingMetadata): ModelChange | null {
    if (newValue instanceof Observable) {
      // TODO: This case is deprecated and will be removed soon.
      return null;
    }

    if (newValue instanceof SimpleVar) {
      // Wizard model is updated through bindings.
      // Make sure that the SimpleVar is not dirty, i.e. value is not changed without calling the "value" setter.
      newValue.updateValueIfDirty();
      return null;
    }
    const outputMappingPropertyName = outputMapping.propertyName;
    const oldValue = this.wizardModel[outputMappingPropertyName];
    if (oldValue instanceof ComputedVar) {
      throw new Error(`Cannot update ${outputMappingPropertyName} in WizardModel, because it is ComputedVar.`);
    } else if (oldValue instanceof SimpleVar) {
      this.wizardModel[outputMappingPropertyName].value = newValue;
    } else {
      this.wizardModel[outputMappingPropertyName] = newValue;
    }

    const newValueStr = stringify(newValue, outputMappingPropertyName);
    const oldValueStr = this.wizardModelOldValues[outputMappingPropertyName];
    if (oldValueStr !== newValueStr) {
      this.wizardModelOldValues[outputMappingPropertyName] = newValueStr;
      const oldValueParsed = parse(oldValueStr, outputMappingPropertyName);
      return new ModelChange(outputMappingPropertyName, oldValueParsed, newValue);
    }
    return null;
  }

  private injectPropertiesToPendingStepInternal(
    pendingStep: StepInternal | undefined
  ): Observable<InjectPropertiesInternalResult> {
    const defaultResult: InjectPropertiesInternalResult = {
      wizardModelChanges: [],
      stepModelChanges: {},
    };
    const result: Observable<InjectPropertiesInternalResult> = of(defaultResult);
    if (!pendingStep) {
      return result;
    }

    let createdModelInstance = false;
    if (pendingStep.instantiateLazy && !pendingStep.modelInstance) {
      // If lazy instantiated, modelInstance may not be initialized yet.
      this.initStepModel(pendingStep);
      this.bindStepModelListener(pendingStep);
      createdModelInstance = true;
    }
    const stepModel = pendingStep.modelInstance;
    if (!stepModel) {
      return result;
    }

    const inputMappings: InputMappings = this.getInputMappings(stepModel, pendingStep.mappings);
    if (!inputMappings) {
      // If there are no input mappings and recreateComponent is true, then re-create modelInstance
      // Since, there are no input properties, pass empty object as modelChanges to recreateComponent method.
      if (pendingStep.recreateComponent && pendingStep.recreateComponent({})) {
        this.unbindStepModelListener(pendingStep);
        this.initStepModel(pendingStep);
        this.bindStepModelListener(pendingStep);
        return of({
          ...defaultResult,
          recreateComponent: true,
        });
      }
      return result;
    }

    const wizardProps: PropertyWrapper[] = Object.entries(inputMappings).map(([stepModelPropName, inputMapping]) => {
      return this.wrapWorkflowPropertyInObservable(stepModelPropName, inputMapping);
    });
    const wizardProps$: Observable<any>[] = wizardProps.map(wrapper => wrapper.value$);

    const wizardCompProps = Object.keys(this.wizardModel).filter(
      propName => this.wizardModel[propName] instanceof ComputedVar
    );
    const oldWizardModelCompPropValues = this.extractModelProperties(this.wizardModel, wizardCompProps);
    if (oldWizardModelCompPropValues.length) {
      this.loading$.next(true);
    }
    const stepInputProperties = Object.keys(inputMappings);
    const oldStepModelValues = this.extractLastStepInputValues(stepModel, stepInputProperties);

    return combineLatest(wizardProps$).pipe(
      take(1), // apply the 'take' operator first to avoid recursive calls when both @In and @Out are declared on same property
      map((propValues: any[]) => {
        // Inject workflow values into the step model.
        this.injectWizardPropertiesToStepModel(wizardProps, propValues, stepModel);

        const newStepModelValues = this.extractModelProperties(stepModel, stepInputProperties);
        const stepModelChangesList = this.diffPropertyValues(oldStepModelValues, newStepModelValues);
        const stepModelChanges = (stepModelChangesList || []).reduce<ModelChanges>((res, curr) => {
          res[curr.propertyName] = curr;
          return res;
        }, {});

        // if recreateComponent, create new model.
        const recreateComponent = pendingStep.recreateComponent && pendingStep.recreateComponent(stepModelChanges);
        if (recreateComponent && !createdModelInstance) {
          this.unbindStepModelListener(pendingStep);
          const newStepModel = this.initStepModel(pendingStep);
          this.bindStepModelListener(pendingStep);
          this.injectWizardPropertiesToStepModel(wizardProps, propValues, newStepModel, pendingStep.mappings);
        }

        // Detect changes in all computed properties, because dependent computed
        // properties might also have changed.
        const newWizardModelCompPropValues = this.extractModelProperties(this.wizardModel, wizardCompProps);
        const wizardModelChanges = this.diffPropertyValues(oldWizardModelCompPropValues, newWizardModelCompPropValues);
        return {
          wizardModelChanges: wizardModelChanges,
          stepModelChanges: stepModelChanges,
          recreateComponent: recreateComponent,
        };
      }),
      tap(() => this.loading$.next(false)),
      catchError((error: unknown) => {
        this.loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  private injectWizardPropertiesToStepModel(
    wizardProps: PropertyWrapper[],
    propValues: any[],
    stepModel: any,
    mappings?: Mappings<any, any>
  ) {
    wizardProps.forEach((wrapper: PropertyWrapper, index: number) => {
      const stepModelNewValue = propValues[index];
      this.updateStepModel(stepModel, wrapper.name, stepModelNewValue);
    });

    this.cacheStepModelInputProps(stepModel, mappings);
  }

  private wrapWorkflowPropertyInObservable(
    stepModelPropName: string,
    inputMapping: InputMappingMetadata
  ): PropertyWrapper {
    const wizardProp = this.wizardModel[inputMapping.propertyName];
    if (
      !Object.prototype.hasOwnProperty.call(this.wizardModel, inputMapping.propertyName) &&
      !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.wizardModel), inputMapping.propertyName)
    ) {
      return this.wrapOptionalWorkflowPropertyInObservable(stepModelPropName, inputMapping);
    } else if (wizardProp instanceof ComputedVar) {
      return this.wrapComputedWorkflowPropertyInObservable(stepModelPropName, inputMapping);
    } else if (wizardProp instanceof SimpleVar) {
      return this.wrapSimpleWorkflowPropertyInObservable(stepModelPropName, inputMapping);
    } else {
      return {
        name: stepModelPropName,
        value$: of(wizardProp),
        computed: false,
      };
    }
  }

  private wrapOptionalWorkflowPropertyInObservable(stepModelPropName: string, inputMapping: InputMappingMetadata) {
    if (!inputMapping.optional) {
      throw new Error(`Workflow model property ${inputMapping.propertyName} not found or not initialized.`);
    }
    return {
      name: stepModelPropName,
      value$: of(missingOptionalProperty),
      computed: false,
    };
  }

  private wrapComputedWorkflowPropertyInObservable(stepModelPropName: string, inputMapping: InputMappingMetadata) {
    const wizardProp = this.wizardModel[inputMapping.propertyName];
    const unsatisfiedDeps = wizardProp.unsatisfiedDependencies;
    if (unsatisfiedDeps.length) {
      if (inputMapping.optional) {
        return {
          name: stepModelPropName,
          value$: of(missingOptionalProperty),
          computed: true,
        };
      } else {
        throw new Error(`Dependencies not satisfied for Var: ${wizardProp.name} --> ${unsatisfiedDeps}`);
      }
    } else {
      return {
        name: stepModelPropName,
        value$: wizardProp.value$,
        computed: true,
      };
    }
  }

  private wrapSimpleWorkflowPropertyInObservable(stepModelPropName: string, inputMapping: InputMappingMetadata) {
    const wizardProp = this.wizardModel[inputMapping.propertyName];
    if (wizardProp.value === undefined) {
      if (inputMapping.optional) {
        return {
          name: stepModelPropName,
          value$: of(missingOptionalProperty),
          computed: false,
        };
      } else {
        throw new Error(`Value not initialized for Var: ${wizardProp.name}`);
      }
    } else {
      return {
        name: stepModelPropName,
        value$: wizardProp.value$,
        computed: false,
      };
    }
  }

  private updateStepModel(stepModel: any, propertyName: string, newValue: any): void {
    // Early return if input mapping is defined as optional and there is no value.
    if (newValue === missingOptionalProperty) {
      return;
    }

    // Set the new value
    if (stepModel[propertyName] instanceof SimpleVar) {
      stepModel[propertyName].value = newValue;
    } else {
      stepModel[propertyName] = newValue;
    }
  }

  private diffPropertyValues(oldValues: NameValue[], newValues: NameValue[]): ModelChange[] {
    const changes: ModelChange[] = [];
    oldValues.forEach((nameValue: NameValue, index: number) => {
      const oldValueStr = nameValue.valueStr;
      const newValueStr = newValues[index].valueStr;
      if (oldValueStr !== newValueStr) {
        const change = new ModelChange(nameValue.name, nameValue.value, newValues[index].value);
        changes.push(change);
      }
    });
    return changes;
  }

  /**
   * Return the input step model values, that were cached during the last invocation of
   * {@link ejectPropertiesFromCurrentStep} method.
   */
  private extractLastStepInputValues(model: StepModel, propNames: string[]): NameValue[] {
    const lastStepModelValues = this.stepModelLastValuesIn.get(model);
    if (!lastStepModelValues) {
      // When a step is activated for the first time, it has no "last" values cached.
      return this.extractModelProperties(model, propNames);
    }

    const result: NameValue[] = [];
    for (const propertyName of propNames) {
      const valueStr = lastStepModelValues[propertyName];
      const propertyValue = parse(valueStr, propertyName);
      result.push({
        name: propertyName,
        value: propertyValue,
        valueStr: valueStr,
      });
    }
    return result;
  }

  /**
   * Return stringified values of {@link propNames} of the {@link model}.
   */
  private extractModelProperties(model: any, propNames: string[]): NameValue[] {
    const result: NameValue[] = [];
    for (const propertyName of propNames) {
      let propertyValue = model[propertyName];
      if (propertyValue instanceof ComputedVar || propertyValue instanceof SimpleVar) {
        propertyValue = propertyValue.value;
      }
      const valueStr = stringify(propertyValue, propertyName);
      result.push({
        name: propertyName,
        value: propertyValue,
        valueStr: valueStr,
      });
    }
    return result;
  }

  /**
   * Remove null elements from the "changes" array and emit on {@link onModelChange$}
   * if there are changes.
   */
  private emitModelChange(changes: (ModelChange | null)[]): void {
    const nonNullChanges: ModelChange[] = <ModelChange[]>changes.filter(change => !!change);

    if (nonNullChanges.length) {
      this.onModelChange$.next(nonNullChanges);
    }
  }

  private cacheStepModelInputProps(stepModel: any, mappings?: Mappings<any, any>): void {
    const inputMappings: InputMappings = this.getInputMappings(stepModel, mappings);
    if (inputMappings) {
      const stepModelStringifiedProps: any = {};
      for (const [key] of Object.entries(inputMappings)) {
        let propertyValue = stepModel[key];
        if (propertyValue instanceof ComputedVar || propertyValue instanceof SimpleVar) {
          propertyValue = propertyValue.value;
        }
        const stepModelValueStr = stringify(propertyValue, key);
        stepModelStringifiedProps[key] = stepModelValueStr;
      }
      this.stepModelLastValuesIn.set(stepModel, stepModelStringifiedProps);
    }
  }

  private getInputMappings(stepModel?: StepModel, mappings?: Mappings<any, any>): InputMappings {
    const externalMappings = mappings?.getPropertyMappings();
    const inputMappings = getInputMappings(stepModel);
    if (inputMappings && externalMappings) {
      for (const [stepModelPropertyName, wizardModelPropertyName] of Object.entries(externalMappings)) {
        const propertyMapping = inputMappings[stepModelPropertyName];
        if (propertyMapping) {
          propertyMapping.propertyName = wizardModelPropertyName;
        }
      }
    }
    return inputMappings;
  }

  private getOutputMappings(stepModel?: StepModel, mappings?: Mappings<any, any>): OutputMappings {
    const externalMappings = mappings?.getPropertyMappings();
    const outputMappings = getOutputMappings(stepModel);
    if (outputMappings && externalMappings) {
      for (const [stepModelPropertyName, wizardModelPropertyName] of Object.entries(externalMappings)) {
        const propertyMapping = outputMappings[stepModelPropertyName];
        if (propertyMapping) {
          propertyMapping.propertyName = wizardModelPropertyName;
        }
      }
    }
    return outputMappings;
  }
}

class OptionalProperty {}

// Value that will be returned when @InputMapping refers to an optional property,
// that is missing from the wizard model.
const missingOptionalProperty = new OptionalProperty();

interface PropertyWrapper {
  name: string;
  value$: Observable<any>;
  computed: boolean;
}

interface NameValue {
  name: string;
  value: any;

  /**
   * Stringified 'value' field.
   * If 'value' is undefined, 'valueStr' will also be undefined.
   */
  valueStr: string | undefined;
}

export interface InjectPropertiesResult {
  pendingStep?: StepInternal;
  error?: ActivationError;
  stepModelChanges?: ModelChanges;
  recreateComponent?: boolean;
}

interface InjectPropertiesInternalResult {
  wizardModelChanges: ModelChange[];
  stepModelChanges: ModelChanges;
  recreateComponent?: boolean;
}
