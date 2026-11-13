import * as i3$1 from "@angular/common";
import { CommonModule } from "@angular/common";
import * as i0 from "@angular/core";
import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, InjectionToken, Input, NgModule, Optional, Output, SkipSelf, ViewChild, ViewContainerRef } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { A11yModule } from "@clr/addons/a11y";
import { PropertyViewModule } from "@clr/addons/property-view";
import * as i1$2 from "@clr/addons/workflow/strings";
import { WorkflowStrings } from "@clr/addons/workflow/strings";
import * as i3 from "@clr/angular/data/stack-view";
import { ClrStackViewModule } from "@clr/angular/data/stack-view";
import * as i1 from "@clr/angular/emphasis/alert";
import { ClrAlertModule } from "@clr/angular/emphasis/alert";
import * as i2 from "@clr/angular/icon";
import { ClarityIcons, ClrIcon, angleIcon, barsIcon, exclamationCircleIcon, pencilIcon, refreshIcon, successStandardIcon } from "@clr/angular/icon";
import * as i1$3 from "@clr/angular/popover/signpost";
import { ClrSignpostModule } from "@clr/angular/popover/signpost";
import * as i1$1 from "@clr/angular/progress/spinner";
import { ClrSpinnerModule } from "@clr/angular/progress/spinner";
import * as i2$1 from "@clr/angular/popover/common";
import { ClrPopoverContent } from "@clr/angular/popover/common";
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription, combineLatest, of, throwError } from "rxjs";
import { bufferTime, catchError, map, pairwise, shareReplay, startWith, switchMap, take, tap } from "rxjs/operators";
import "reflect-metadata";
var WorkflowConfigurationService = class WorkflowConfigurationService {
	constructor() {
		this.debugLocalStorageKey = "clr-addons-var.debug";
		this.localStorage = this.getLocalStorage(window);
		this.debugValue = this.getData(this.debugLocalStorageKey, false);
	}
	get debug() {
		return this.debugValue;
	}
	set debug(newValue) {
		this.debugValue = newValue;
	}
	getData(key, defaultValue) {
		if (this.localStorage) {
			let data = this.localStorage.getItem(key);
			if (data) {
				data = JSON.parse(data);
				return data;
			}
		}
		return defaultValue;
	}
	getLocalStorage(window) {
		try {
			if (window.localStorage) return window.localStorage;
		} catch (_ignored) {}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowConfigurationService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowConfigurationService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WorkflowConfigurationService,
	decorators: [{ type: Injectable }],
	ctorParameters: () => []
});
function resettableShareReplay(config) {
	return (source) => source.lift(shareReplayOperator(config));
}
function shareReplayOperator({ bufferSize = Infinity, windowTime = Infinity, refCount: useRefCount, scheduler, reset: onReset }) {
	let subject;
	let refCount = 0;
	let subscription;
	let resetSubscription;
	let hasError = false;
	return function shareReplayOperation(source) {
		refCount++;
		if (!subject || hasError) {
			resetSubscription = onReset.subscribe(() => {
				if (subject) subject.unsubscribe();
				subject = new ReplaySubject(bufferSize, windowTime, scheduler);
			});
			hasError = false;
			subject = new ReplaySubject(bufferSize, windowTime, scheduler);
			subscription = source.subscribe({
				next(value) {
					subject?.next(value);
				},
				error(err) {
					hasError = true;
					subject?.error(err);
				},
				complete() {
					subscription = void 0;
					subject?.complete();
				}
			});
		}
		let innerSub = subject.subscribe(this);
		const resetSub = onReset.subscribe(() => {
			innerSub = subject?.subscribe(this);
		});
		this.add(() => {
			refCount--;
			innerSub?.unsubscribe();
			resetSub.unsubscribe();
			if (subscription && useRefCount && refCount === 0) {
				subscription.unsubscribe();
				subscription = void 0;
				subject = void 0;
				resetSubscription?.unsubscribe();
				resetSubscription = void 0;
			}
		});
	};
}
const stringify = (value, propertyName = "") => {
	try {
		return JSON.stringify(value);
	} catch (e) {
		console.warn(`Cannot stringify property: ${propertyName}`, value, e);
	}
};
const parse = (value, propertyName = "") => {
	if (value) try {
		return JSON.parse(value);
	} catch (e) {
		console.warn(`Cannot parse property: ${propertyName}`, value, e);
	}
};
const formatError = (error) => {
	if (typeof error === "object") {
		if (error.data?.message) return error;
		if (error.messages?.length) return handleVapiErrorMessages(error.messages);
		if (error.info?.messages?.length) return handleVapiErrorMessages(error.info.messages);
		if (error.message) return { data: {
			message: error.message,
			stackTrace: error.stack
		} };
	}
	if (typeof error === "string") return { data: { message: error } };
	return { data: { message: stringify(error) } };
};
const handleVapiErrorMessages = (messages) => {
	return { data: { message: messages.map((message) => message?.localized || message.defaultMessage).join("\n") } };
};
var Var = class {
	#value;
	constructor() {}
	get value() {
		return this.#value;
	}
	set value(newValue) {
		this.#value = newValue;
		this.onSetValue(newValue);
	}
	static of(initialValue) {
		const result = new SimpleVar();
		if (initialValue !== void 0) result.value = initialValue;
		return result;
	}
	static from(...deps) {
		function fromApi(strategy) {
			return {
				by(fn) {
					return new ComputedVar({
						dependsOn: deps,
						computeFn: fn,
						strategy
					});
				},
				pluck(propName) {
					return new ComputedVar({
						dependsOn: deps,
						computeFn: (depValue) => of(depValue[propName]),
						strategy
					});
				}
			};
		}
		return {
			...fromApi(ComputeStrategy.lazy),
			withEagerEval: () => fromApi(ComputeStrategy.eager),
			withLazyEval: () => fromApi(ComputeStrategy.lazy)
		};
	}
};
var SimpleVar = class SimpleVar extends Var {
	static {
		this.count = 0;
	}
	#value$ = new ReplaySubject(1);
	#isSet = false;
	constructor() {
		super();
		this.name = "simpleVar" + SimpleVar.count++;
	}
	get value$() {
		return this.#value$;
	}
	get isSet() {
		return this.#isSet;
	}
	updateValueIfDirty() {
		if (this.lastValueStr !== stringify(this.value)) this.onSetValue(this.value);
	}
	onSetValue(newValue) {
		this.#isSet = true;
		this.lastValueStr = stringify(newValue);
		this.#value$.next(newValue);
	}
};
var ComputeStrategy;
(function(ComputeStrategy) {
	ComputeStrategy["eager"] = "eager";
	ComputeStrategy["lazy"] = "lazy";
})(ComputeStrategy || (ComputeStrategy = {}));
var ComputedVar = class ComputedVar extends Var {
	static {
		this.count = 0;
	}
	#value$;
	constructor(config) {
		super();
		this.config = config;
		this.isLastComputationSuccessful = false;
		this.name = "computedVar" + ComputedVar.count++;
		this.validateArguments(config);
		this.setDefaults(config);
		this.initValue();
	}
	get value$() {
		return this.#value$;
	}
	get strategy() {
		return this.config.strategy;
	}
	get areDependenciesSatisfied() {
		const computedVarDependencySatisfied = this.config.dependsOn.filter((flowVar) => {
			return flowVar instanceof ComputedVar;
		}).every((curr) => curr.areDependenciesSatisfied);
		const simpleVarDependencySatisfied = this.config.dependsOn.filter((flowVar) => {
			return flowVar instanceof SimpleVar;
		}).every((curr) => curr.isSet);
		return computedVarDependencySatisfied && simpleVarDependencySatisfied;
	}
	get unsatisfiedDependencies() {
		const unsatisfiedDependencies = [];
		this.config.dependsOn.forEach((flowVar) => {
			if (flowVar instanceof SimpleVar && !flowVar.isSet) unsatisfiedDependencies.push(flowVar.name);
			else if (flowVar instanceof ComputedVar && !flowVar.areDependenciesSatisfied) unsatisfiedDependencies.push(flowVar.name);
		});
		return unsatisfiedDependencies;
	}
	onSetValue() {}
	validateArguments(arg) {
		arg.dependsOn.forEach((dependency, index) => {
			if (!dependency) throw new Error(`${name}: Dependency is null or undefined at dependsOn[${index}]`);
		});
	}
	setDefaults(config) {
		config.strategy = config.strategy || ComputeStrategy.lazy;
	}
	initValue() {
		const depValues$ = this.extractDependencyValues$();
		this.#value$ = depValues$.length ? this.initValueFromDependencies(depValues$) : this.config.computeFn().pipe(tap((fnResult) => {
			this.value = fnResult;
		}), shareReplay(1));
	}
	initValueFromDependencies(depValues$) {
		const reset$ = new Subject();
		return combineLatest(depValues$).pipe(switchMap((depValues) => {
			let depValuesChanged = true;
			const depValuesStr = stringify(depValues);
			if (depValuesStr !== void 0) {
				if (depValues?.length && this.lastDependencyValues === depValuesStr) depValuesChanged = false;
			} else console.warn("Can not detect if dependencies have changed for Var " + this.name + ". Assume they have changed!");
			if (!this.isLastComputationSuccessful || depValuesChanged) {
				if (this.lastDependencyValues) reset$.next();
				return this.config.computeFn(...depValues).pipe(tap((fnResult) => {
					this.lastDependencyValues = depValuesStr;
					this.isLastComputationSuccessful = true;
					this.value = fnResult;
				}), catchError((e) => {
					this.isLastComputationSuccessful = false;
					return throwError(() => e);
				}));
			}
			return of(this.value);
		}), resettableShareReplay({
			bufferSize: 1,
			refCount: true,
			reset: reset$
		}));
	}
	extractDependencyValues$() {
		return this.config.dependsOn.map((flowVar) => {
			if (flowVar instanceof ComputedVar) return flowVar.value$;
			else if (flowVar instanceof SimpleVar) return flowVar.value$;
			else throw new Error("Unsupported Var descendant");
		});
	}
};
const inputMappingMetadataKey = "InputMapping";
function In(inputMapping) {
	return function(prototype, srcPropName) {
		const mapping = {
			propertyName: srcPropName,
			optional: inputMapping && inputMapping.optional
		};
		let mappings = Reflect.getMetadata(inputMappingMetadataKey, prototype);
		if (!mappings) {
			mappings = {};
			Reflect.defineMetadata(inputMappingMetadataKey, mappings, prototype);
		}
		mappings[srcPropName] = mapping;
	};
}
function getInputMappings(target) {
	const mappings = Reflect.getMetadata(inputMappingMetadataKey, target.constructor.prototype);
	if (mappings) return JSON.parse(JSON.stringify(mappings));
	return mappings;
}
const outputMappingMetadataKey = "OutputMapping";
function Out() {
	return function(prototype, srcPropName) {
		const mapping = { propertyName: srcPropName };
		let mappings = Reflect.getMetadata(outputMappingMetadataKey, prototype);
		if (!mappings) {
			mappings = {};
			Reflect.defineMetadata(outputMappingMetadataKey, mappings, prototype);
		}
		mappings[srcPropName] = mapping;
	};
}
function getOutputMappings(target) {
	const mappings = Reflect.getMetadata(outputMappingMetadataKey, target.constructor.prototype);
	if (mappings) return JSON.parse(JSON.stringify(mappings));
	return mappings;
}
var ModelChange = class {
	constructor(propertyName, oldValue, newValue) {
		this.propertyName = propertyName;
		this.oldValue = oldValue;
		this.newValue = newValue;
	}
};
var WorkflowModelManager = class WorkflowModelManager {
	constructor() {
		this.onStepChange$ = new Subject();
		this.onModelChange$ = new Subject();
		this.loading$ = new BehaviorSubject(false);
		this.stepModelBindings = /* @__PURE__ */ new Map();
		this.workflowModelSubs = [];
		this.wizardModelOldValues = {};
		this.stepModelLastValuesIn = /* @__PURE__ */ new Map();
	}
	#steps;
	set steps(value) {
		this.#steps = value;
		this.initStepModels();
		this.onStepsOrModelChange();
	}
	get model() {
		return this.wizardModel;
	}
	set model(value) {
		if (typeof value === "function" || Array.isArray(value)) throw new Error("Workflow model cannot be a function or array.");
		if (!value) console.warn("Workflow model not initialized.!");
		this.wizardModel = value;
		this.wizardModelOldValues = {};
		this.onStepsOrModelChange();
	}
	destroy() {
		this.unbindStepModelListeners();
		this.unbindWorkflowModelListeners();
	}
	ejectPropertiesFromCurrentStep(currentStep) {
		if (!this.wizardModel) return;
		if (!currentStep?.modelInstance) return;
		const outputMappings = this.getOutputMappings(currentStep.modelInstance, currentStep.mappings);
		if (!outputMappings) return;
		const changes = [];
		for (const [key, outputMapping] of Object.entries(outputMappings)) {
			const stepModelValue = currentStep.modelInstance[key];
			const change = this.updateWizardModel(stepModelValue, outputMapping);
			changes.push(change);
		}
		this.emitModelChange(changes);
	}
	injectPropertiesToPendingStep(pendingStep) {
		if (!this.wizardModel) return of({ pendingStep });
		return this.injectPropertiesToPendingStepInternal(pendingStep).pipe(tap((result) => {
			this.emitModelChange(result.wizardModelChanges);
			this.onStepChange$.next({
				step: pendingStep,
				changes: result.wizardModelChanges
			});
		}), map((result) => {
			return {
				pendingStep,
				stepModelChanges: result.stepModelChanges,
				recreateComponent: result.recreateComponent
			};
		}), catchError((error) => {
			console.error(error);
			return of({
				pendingStep,
				error: formatError(error)
			});
		}));
	}
	onStepsOrModelChange() {
		this.unbindStepModelListeners();
		this.unbindWorkflowModelListeners();
		this.stepModelLastValuesIn.clear();
		if (!this.#steps || !this.wizardModel) return;
		this.bindStepModelListeners();
		this.processWorkflowModel();
	}
	initStepModels() {
		(this.#steps || []).filter((step) => !step.instantiateLazy).forEach((step) => {
			this.initStepModel(step);
		});
	}
	initStepModel(step) {
		if (typeof step.model === "function") step.modelInstance = step.model();
		else {
			if (step.recreateComponent) throw new Error("When recreateComponent is defined, model should be a factory function");
			step.modelInstance = step.model;
		}
		if (step.mappings) step.mappings.validate(step.modelInstance);
		return step.modelInstance;
	}
	bindStepModelListeners() {
		for (const page of this.#steps) this.bindStepModelListener(page);
	}
	bindStepModelListener(page) {
		if (!page.modelInstance) return;
		const mappings = this.getOutputMappings(page.modelInstance, page.mappings);
		if (!mappings) return;
		const subscription = new Subscription();
		for (const [propertyName, outputMapping] of Object.entries(mappings)) {
			const propertyValue = page.modelInstance[propertyName];
			if (propertyValue instanceof Observable) {
				console.warn(`Step ${page.title} has property ${propertyName}: Observable.Using Observable in Step models is deprecated and will be removed soon. Use Var.from() instead`);
				subscription.add(propertyValue.subscribe((value) => {
					if (this.wizardModel) {
						const change = this.updateWizardModel(value, outputMapping);
						this.emitModelChange([change]);
					}
				}));
			} else if (propertyValue instanceof SimpleVar) subscription.add(propertyValue.value$.subscribe((value) => {
				if (this.wizardModel) {
					const change = this.updateWizardModel(value, outputMapping);
					this.emitModelChange([change]);
				}
			}));
		}
		this.stepModelBindings.set(page.modelInstance, subscription);
	}
	unbindStepModelListeners() {
		this.stepModelBindings.forEach((s) => s.unsubscribe());
		this.stepModelBindings.clear();
	}
	unbindStepModelListener(page) {
		if (!page.modelInstance) return;
		const stepModelBinding = this.stepModelBindings.get(page.modelInstance);
		if (stepModelBinding) {
			stepModelBinding.unsubscribe();
			this.stepModelBindings.delete(page.modelInstance);
		}
	}
	processWorkflowModel() {
		for (const [propName, propValue] of Object.entries(this.wizardModel)) if (propValue instanceof SimpleVar) propValue.name = propName;
		else if (propValue instanceof ComputedVar) {
			propValue.name = propName;
			if (propValue.strategy === ComputeStrategy.eager) this.workflowModelSubs.push(propValue.value$.pipe(startWith(void 0), pairwise()).subscribe(([prevValue, newValue]) => {
				const change = new ModelChange(propName, prevValue, newValue);
				this.emitModelChange([change]);
			}));
		}
	}
	unbindWorkflowModelListeners() {
		this.workflowModelSubs.forEach((s) => s.unsubscribe());
		this.workflowModelSubs = [];
	}
	updateWizardModel(newValue, outputMapping) {
		if (newValue instanceof Observable) return null;
		if (newValue instanceof SimpleVar) {
			newValue.updateValueIfDirty();
			return null;
		}
		const outputMappingPropertyName = outputMapping.propertyName;
		const oldValue = this.wizardModel[outputMappingPropertyName];
		if (oldValue instanceof ComputedVar) throw new Error(`Cannot update ${outputMappingPropertyName} in WizardModel, because it is ComputedVar.`);
		else if (oldValue instanceof SimpleVar) this.wizardModel[outputMappingPropertyName].value = newValue;
		else this.wizardModel[outputMappingPropertyName] = newValue;
		const newValueStr = stringify(newValue, outputMappingPropertyName);
		const oldValueStr = this.wizardModelOldValues[outputMappingPropertyName];
		if (oldValueStr !== newValueStr) {
			this.wizardModelOldValues[outputMappingPropertyName] = newValueStr;
			return new ModelChange(outputMappingPropertyName, parse(oldValueStr, outputMappingPropertyName), newValue);
		}
		return null;
	}
	injectPropertiesToPendingStepInternal(pendingStep) {
		const defaultResult = {
			wizardModelChanges: [],
			stepModelChanges: {}
		};
		const result = of(defaultResult);
		if (!pendingStep) return result;
		let createdModelInstance = false;
		if (pendingStep.instantiateLazy && !pendingStep.modelInstance) {
			this.initStepModel(pendingStep);
			this.bindStepModelListener(pendingStep);
			createdModelInstance = true;
		}
		const stepModel = pendingStep.modelInstance;
		if (!stepModel) return result;
		const inputMappings = this.getInputMappings(stepModel, pendingStep.mappings);
		if (!inputMappings) {
			if (pendingStep.recreateComponent && pendingStep.recreateComponent({})) {
				this.unbindStepModelListener(pendingStep);
				this.initStepModel(pendingStep);
				this.bindStepModelListener(pendingStep);
				return of({
					...defaultResult,
					recreateComponent: true
				});
			}
			return result;
		}
		const wizardProps = Object.entries(inputMappings).map(([stepModelPropName, inputMapping]) => {
			return this.wrapWorkflowPropertyInObservable(stepModelPropName, inputMapping);
		});
		const wizardProps$ = wizardProps.map((wrapper) => wrapper.value$);
		const wizardCompProps = Object.keys(this.wizardModel).filter((propName) => this.wizardModel[propName] instanceof ComputedVar);
		const oldWizardModelCompPropValues = this.extractModelProperties(this.wizardModel, wizardCompProps);
		if (oldWizardModelCompPropValues.length) this.loading$.next(true);
		const stepInputProperties = Object.keys(inputMappings);
		const oldStepModelValues = this.extractLastStepInputValues(stepModel, stepInputProperties);
		return combineLatest(wizardProps$).pipe(take(1), map((propValues) => {
			this.injectWizardPropertiesToStepModel(wizardProps, propValues, stepModel);
			const newStepModelValues = this.extractModelProperties(stepModel, stepInputProperties);
			const stepModelChanges = (this.diffPropertyValues(oldStepModelValues, newStepModelValues) || []).reduce((res, curr) => {
				res[curr.propertyName] = curr;
				return res;
			}, {});
			const recreateComponent = pendingStep.recreateComponent && pendingStep.recreateComponent(stepModelChanges);
			if (recreateComponent && !createdModelInstance) {
				this.unbindStepModelListener(pendingStep);
				const newStepModel = this.initStepModel(pendingStep);
				this.bindStepModelListener(pendingStep);
				this.injectWizardPropertiesToStepModel(wizardProps, propValues, newStepModel, pendingStep.mappings);
			}
			const newWizardModelCompPropValues = this.extractModelProperties(this.wizardModel, wizardCompProps);
			return {
				wizardModelChanges: this.diffPropertyValues(oldWizardModelCompPropValues, newWizardModelCompPropValues),
				stepModelChanges,
				recreateComponent
			};
		}), tap(() => this.loading$.next(false)), catchError((error) => {
			this.loading$.next(false);
			return throwError(() => error);
		}));
	}
	injectWizardPropertiesToStepModel(wizardProps, propValues, stepModel, mappings) {
		wizardProps.forEach((wrapper, index) => {
			const stepModelNewValue = propValues[index];
			this.updateStepModel(stepModel, wrapper.name, stepModelNewValue);
		});
		this.cacheStepModelInputProps(stepModel, mappings);
	}
	wrapWorkflowPropertyInObservable(stepModelPropName, inputMapping) {
		const wizardProp = this.wizardModel[inputMapping.propertyName];
		if (!Object.prototype.hasOwnProperty.call(this.wizardModel, inputMapping.propertyName) && !Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this.wizardModel), inputMapping.propertyName)) return this.wrapOptionalWorkflowPropertyInObservable(stepModelPropName, inputMapping);
		else if (wizardProp instanceof ComputedVar) return this.wrapComputedWorkflowPropertyInObservable(stepModelPropName, inputMapping);
		else if (wizardProp instanceof SimpleVar) return this.wrapSimpleWorkflowPropertyInObservable(stepModelPropName, inputMapping);
		else return {
			name: stepModelPropName,
			value$: of(wizardProp),
			computed: false
		};
	}
	wrapOptionalWorkflowPropertyInObservable(stepModelPropName, inputMapping) {
		if (!inputMapping.optional) throw new Error(`Workflow model property ${inputMapping.propertyName} not found or not initialized.`);
		return {
			name: stepModelPropName,
			value$: of(missingOptionalProperty),
			computed: false
		};
	}
	wrapComputedWorkflowPropertyInObservable(stepModelPropName, inputMapping) {
		const wizardProp = this.wizardModel[inputMapping.propertyName];
		const unsatisfiedDeps = wizardProp.unsatisfiedDependencies;
		if (unsatisfiedDeps.length) {
			if (inputMapping.optional) return {
				name: stepModelPropName,
				value$: of(missingOptionalProperty),
				computed: true
			};
			else throw new Error(`Dependencies not satisfied for Var: ${wizardProp.name} --> ${unsatisfiedDeps}`);
		} else return {
			name: stepModelPropName,
			value$: wizardProp.value$,
			computed: true
		};
	}
	wrapSimpleWorkflowPropertyInObservable(stepModelPropName, inputMapping) {
		const wizardProp = this.wizardModel[inputMapping.propertyName];
		if (wizardProp.value === void 0) {
			if (inputMapping.optional) return {
				name: stepModelPropName,
				value$: of(missingOptionalProperty),
				computed: false
			};
			else throw new Error(`Value not initialized for Var: ${wizardProp.name}`);
		} else return {
			name: stepModelPropName,
			value$: wizardProp.value$,
			computed: false
		};
	}
	updateStepModel(stepModel, propertyName, newValue) {
		if (newValue === missingOptionalProperty) return;
		if (stepModel[propertyName] instanceof SimpleVar) stepModel[propertyName].value = newValue;
		else stepModel[propertyName] = newValue;
	}
	diffPropertyValues(oldValues, newValues) {
		const changes = [];
		oldValues.forEach((nameValue, index) => {
			if (nameValue.valueStr !== newValues[index].valueStr) {
				const change = new ModelChange(nameValue.name, nameValue.value, newValues[index].value);
				changes.push(change);
			}
		});
		return changes;
	}
	extractLastStepInputValues(model, propNames) {
		const lastStepModelValues = this.stepModelLastValuesIn.get(model);
		if (!lastStepModelValues) return this.extractModelProperties(model, propNames);
		const result = [];
		for (const propertyName of propNames) {
			const valueStr = lastStepModelValues[propertyName];
			const propertyValue = parse(valueStr, propertyName);
			result.push({
				name: propertyName,
				value: propertyValue,
				valueStr
			});
		}
		return result;
	}
	extractModelProperties(model, propNames) {
		const result = [];
		for (const propertyName of propNames) {
			let propertyValue = model[propertyName];
			if (propertyValue instanceof ComputedVar || propertyValue instanceof SimpleVar) propertyValue = propertyValue.value;
			const valueStr = stringify(propertyValue, propertyName);
			result.push({
				name: propertyName,
				value: propertyValue,
				valueStr
			});
		}
		return result;
	}
	emitModelChange(changes) {
		const nonNullChanges = changes.filter((change) => !!change);
		if (nonNullChanges.length) this.onModelChange$.next(nonNullChanges);
	}
	cacheStepModelInputProps(stepModel, mappings) {
		const inputMappings = this.getInputMappings(stepModel, mappings);
		if (inputMappings) {
			const stepModelStringifiedProps = {};
			for (const [key] of Object.entries(inputMappings)) {
				let propertyValue = stepModel[key];
				if (propertyValue instanceof ComputedVar || propertyValue instanceof SimpleVar) propertyValue = propertyValue.value;
				stepModelStringifiedProps[key] = stringify(propertyValue, key);
			}
			this.stepModelLastValuesIn.set(stepModel, stepModelStringifiedProps);
		}
	}
	getInputMappings(stepModel, mappings) {
		const externalMappings = mappings?.getPropertyMappings();
		const inputMappings = getInputMappings(stepModel);
		if (inputMappings && externalMappings) for (const [stepModelPropertyName, wizardModelPropertyName] of Object.entries(externalMappings)) {
			const propertyMapping = inputMappings[stepModelPropertyName];
			if (propertyMapping) propertyMapping.propertyName = wizardModelPropertyName;
		}
		return inputMappings;
	}
	getOutputMappings(stepModel, mappings) {
		const externalMappings = mappings?.getPropertyMappings();
		const outputMappings = getOutputMappings(stepModel);
		if (outputMappings && externalMappings) for (const [stepModelPropertyName, wizardModelPropertyName] of Object.entries(externalMappings)) {
			const propertyMapping = outputMappings[stepModelPropertyName];
			if (propertyMapping) propertyMapping.propertyName = wizardModelPropertyName;
		}
		return outputMappings;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowModelManager,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowModelManager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WorkflowModelManager,
	decorators: [{ type: Injectable }]
});
var OptionalProperty = class {};
const missingOptionalProperty = new OptionalProperty();
var WorkflowModelMonitorComponent = class WorkflowModelMonitorComponent {
	constructor() {
		this.isOpen = false;
		this.debugModel = [];
		this.subscriptions = new Subscription();
	}
	set popoverContent(popoverContent) {
		if (popoverContent) popoverContent.outsideClickClose = false;
	}
	ngOnInit() {
		this.bindModelChangeListeners();
		this.bindStepChangeListeners();
		this.initDebugModel();
	}
	ngOnDestroy() {
		this.subscriptions.unsubscribe();
	}
	bindModelChangeListeners() {
		this.subscriptions.add(this.modelMgr.onModelChange$.pipe(bufferTime(100), map((changes) => [].concat(...changes))).subscribe((changes) => this.updateDebugModel(changes)));
	}
	bindStepChangeListeners() {
		this.subscriptions.add(this.modelMgr.onStepChange$.subscribe((value) => {
			this.resetDebugModel();
			this.updateDebugModel(value.changes);
		}));
	}
	updateDebugModel(changes) {
		if (!this.modelMgr.model) return;
		for (const change of changes) {
			const propertyModelValue = this.modelMgr.model[change.propertyName];
			const nameValue = this.getPropertyNameValue(change.propertyName, propertyModelValue);
			const existing = this.debugModel.find((value) => value.name === change.propertyName);
			if (!nameValue) continue;
			if (existing) {
				existing.value = nameValue.value;
				existing.changed = true;
			} else {
				nameValue.changed = true;
				this.debugModel.push(nameValue);
				this.debugModel.sort((a, b) => a.name.localeCompare(b.name));
			}
		}
	}
	initDebugModel() {
		this.debugModel = [];
		if (!this.modelMgr.model) return;
		for (const [name, value] of Object.entries(this.modelMgr.model)) {
			const nameValue = this.getPropertyNameValue(name, value);
			if (nameValue) this.debugModel.push(nameValue);
		}
		this.debugModel.sort((a, b) => a.name.localeCompare(b.name));
	}
	resetDebugModel() {
		for (const entry of this.debugModel) entry.changed = false;
	}
	getPropertyNameValue(name, value) {
		let propValue = value;
		let strValue = "";
		let isComputedVar = false;
		let isSimpleVar = false;
		if (value instanceof ComputedVar) {
			propValue = value.value;
			isComputedVar = true;
		} else if (value instanceof SimpleVar) {
			propValue = value.value;
			isSimpleVar = true;
		} else throw new Error("Unsupported step type: " + value);
		if (typeof propValue === "object") try {
			strValue = JSON.stringify(propValue);
		} catch (_ignored) {
			console.warn(`Cannot stringify workflow property ${name}`);
			strValue = "{object}";
		}
		else if (typeof propValue === "function") return null;
		else strValue = propValue + "";
		return {
			name,
			value: strValue,
			computedVar: isComputedVar,
			simpleVar: isSimpleVar,
			changed: false
		};
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: WorkflowModelMonitorComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: WorkflowModelMonitorComponent,
			isStandalone: false,
			selector: "appfx-model-popup",
			inputs: { modelMgr: "modelMgr" },
			viewQueries: [{
				propertyName: "popoverContent",
				first: true,
				predicate: ClrPopoverContent,
				descendants: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<clr-signpost>\n  <ng-template [(clrIfOpen)]=\"isOpen\">\n    <clr-signpost-content #signpostContent clrPosition=\"left-bottom\">\n      <h4 class=\"title\">Workflow Model</h4>\n\n      <div *ngFor=\"let prop of debugModel\" class=\"clr-row clr-flex-nowrap\">\n        <div class=\"clr-col-7\">\n          <h6\n            class=\"prop-name text-truncate\"\n            title=\"{{ prop.name }}\"\n            [class.simple-var]=\"prop.simpleVar\"\n            [class.computed-var]=\"prop.computedVar\"\n          >\n            {{ prop.name }}\n          </h6>\n        </div>\n        <div class=\"clr-col-5\">\n          <h6 class=\"prop-value text-truncate\" title=\"{{ prop.value }}\" [class.prop-changed]=\"prop.changed\">\n            {{ prop.value }}\n          </h6>\n        </div>\n      </div>\n    </clr-signpost-content>\n  </ng-template>\n</clr-signpost>\n",
			styles: [".title{margin-bottom:.36rem}.prop-name{margin-top:.12rem}.prop-value{white-space:nowrap;margin-top:.12rem}.text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.simple-var{color:#2283bc}.computed-var{color:#9c46bf}.prop-changed{color:#3fa740}:host ::ng-deep .signpost-content-body{max-height:650px}:host ::ng-deep .signpost-trigger{height:1.2rem;line-height:normal}\n"],
			dependencies: [
				{
					kind: "component",
					type: i1$3.ClrSignpost,
					selector: "clr-signpost",
					inputs: ["clrSignpostTriggerAriaLabel", "clrSignpostHideTrigger"]
				},
				{
					kind: "component",
					type: i1$3.ClrSignpostContent,
					selector: "clr-signpost-content",
					inputs: ["clrSignpostCloseAriaLabel", "clrPosition"]
				},
				{
					kind: "directive",
					type: i2$1.ClrIfOpen,
					selector: "[clrIfOpen]",
					inputs: ["clrIfOpen"],
					outputs: ["clrIfOpenChange"]
				},
				{
					kind: "directive",
					type: i3$1.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: WorkflowModelMonitorComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-model-popup",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n\n<clr-signpost>\n  <ng-template [(clrIfOpen)]=\"isOpen\">\n    <clr-signpost-content #signpostContent clrPosition=\"left-bottom\">\n      <h4 class=\"title\">Workflow Model</h4>\n\n      <div *ngFor=\"let prop of debugModel\" class=\"clr-row clr-flex-nowrap\">\n        <div class=\"clr-col-7\">\n          <h6\n            class=\"prop-name text-truncate\"\n            title=\"{{ prop.name }}\"\n            [class.simple-var]=\"prop.simpleVar\"\n            [class.computed-var]=\"prop.computedVar\"\n          >\n            {{ prop.name }}\n          </h6>\n        </div>\n        <div class=\"clr-col-5\">\n          <h6 class=\"prop-value text-truncate\" title=\"{{ prop.value }}\" [class.prop-changed]=\"prop.changed\">\n            {{ prop.value }}\n          </h6>\n        </div>\n      </div>\n    </clr-signpost-content>\n  </ng-template>\n</clr-signpost>\n",
			styles: [".title{margin-bottom:.36rem}.prop-name{margin-top:.12rem}.prop-value{white-space:nowrap;margin-top:.12rem}.text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.simple-var{color:#2283bc}.computed-var{color:#9c46bf}.prop-changed{color:#3fa740}:host ::ng-deep .signpost-content-body{max-height:650px}:host ::ng-deep .signpost-trigger{height:1.2rem;line-height:normal}\n"]
		}]
	}],
	propDecorators: {
		modelMgr: [{ type: Input }],
		popoverContent: [{
			type: ViewChild,
			args: [ClrPopoverContent]
		}]
	}
});
var ErrorComponent = class ErrorComponent {
	constructor(workflowStrings) {
		this.workflowStrings = workflowStrings;
		this.onRetry = new EventEmitter();
	}
	retry() {
		this.onRetry.emit();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ErrorComponent,
			deps: [{ token: i1$2.WorkflowStrings }],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ErrorComponent,
			isStandalone: false,
			selector: "appfx-error",
			inputs: { error: "error" },
			outputs: { onRetry: "onRetry" },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-row\">\n  <div class=\"clr-col-12\">\n    <div class=\"card\">\n      <div class=\"card-header\">\n        <cds-icon shape=\"exclamation-circle\" solid status=\"danger\" size=\"36\"></cds-icon>\n        <span>{{ workflowStrings.error.title }}</span>\n      </div>\n      <div class=\"card-block\">\n        <div>{{ workflowStrings.error.description }}</div>\n        <clr-stack-view class=\"clr-component mt-1\">\n          <clr-stack-block [clrStackViewLevel]=\"1\">\n            <clr-stack-label>{{ workflowStrings.error.details }}</clr-stack-label>\n            <clr-stack-block [clrStackViewLevel]=\"2\" class=\"error-details-block\">\n              <clr-stack-content>\n                <span>{{ error?.data?.message }}</span>\n                <div *ngIf=\"error?.data?.stackTrace\" class=\"stack-trace mt-1\">\n                  {{ error?.data?.stackTrace }}\n                </div>\n              </clr-stack-content>\n            </clr-stack-block>\n          </clr-stack-block>\n        </clr-stack-view>\n      </div>\n      <div class=\"card-footer text-right\">\n        <button class=\"btn btn-primary\" (click)=\"retry()\">\n          <cds-icon shape=\"refresh\"></cds-icon>{{ workflowStrings.error.retry }}\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n",
			styles: ["clr-stack-view ::ng-deep .stack-view{height:unset}.error-details-block{font-family:monospace}.error-details-block ::ng-deep div.stack-view-key{display:none}.error-details-block ::ng-deep div.stack-block-label{padding-left:0;width:100%}.stack-trace{white-space:pre;overflow-x:auto}.btn-primary cds-icon{margin-right:5px}\n"],
			dependencies: [
				{
					kind: "component",
					type: i2.ClrIcon,
					selector: "clr-icon, cds-icon",
					inputs: [
						"shape",
						"size",
						"direction",
						"flip",
						"solid",
						"status",
						"inverse",
						"badge",
						"innerOffset"
					]
				},
				{
					kind: "component",
					type: i3.ClrStackView,
					selector: "clr-stack-view"
				},
				{
					kind: "component",
					type: i3.ClrStackBlock,
					selector: "clr-stack-block",
					inputs: [
						"clrSbExpanded",
						"clrSbExpandable",
						"clrStackViewLevel",
						"clrSbNotifyChange"
					],
					outputs: ["clrSbExpandedChange"]
				},
				{
					kind: "component",
					type: i3.ClrStackViewLabel,
					selector: "clr-stack-label",
					inputs: ["id"]
				},
				{
					kind: "directive",
					type: i3.ClrStackViewCustomTags,
					selector: "clr-stack-content"
				},
				{
					kind: "directive",
					type: i3$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ErrorComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-error",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"clr-row\">\n  <div class=\"clr-col-12\">\n    <div class=\"card\">\n      <div class=\"card-header\">\n        <cds-icon shape=\"exclamation-circle\" solid status=\"danger\" size=\"36\"></cds-icon>\n        <span>{{ workflowStrings.error.title }}</span>\n      </div>\n      <div class=\"card-block\">\n        <div>{{ workflowStrings.error.description }}</div>\n        <clr-stack-view class=\"clr-component mt-1\">\n          <clr-stack-block [clrStackViewLevel]=\"1\">\n            <clr-stack-label>{{ workflowStrings.error.details }}</clr-stack-label>\n            <clr-stack-block [clrStackViewLevel]=\"2\" class=\"error-details-block\">\n              <clr-stack-content>\n                <span>{{ error?.data?.message }}</span>\n                <div *ngIf=\"error?.data?.stackTrace\" class=\"stack-trace mt-1\">\n                  {{ error?.data?.stackTrace }}\n                </div>\n              </clr-stack-content>\n            </clr-stack-block>\n          </clr-stack-block>\n        </clr-stack-view>\n      </div>\n      <div class=\"card-footer text-right\">\n        <button class=\"btn btn-primary\" (click)=\"retry()\">\n          <cds-icon shape=\"refresh\"></cds-icon>{{ workflowStrings.error.retry }}\n        </button>\n      </div>\n    </div>\n  </div>\n</div>\n",
			styles: ["clr-stack-view ::ng-deep .stack-view{height:unset}.error-details-block{font-family:monospace}.error-details-block ::ng-deep div.stack-view-key{display:none}.error-details-block ::ng-deep div.stack-block-label{padding-left:0;width:100%}.stack-trace{white-space:pre;overflow-x:auto}.btn-primary cds-icon{margin-right:5px}\n"]
		}]
	}],
	ctorParameters: () => [{ type: i1$2.WorkflowStrings }],
	propDecorators: {
		error: [{ type: Input }],
		onRetry: [{ type: Output }]
	}
});
var SpinnerComponent = class SpinnerComponent {
	constructor() {
		this.politeness = "assertive";
		this.isModal = true;
		this.actionClick = new EventEmitter();
	}
	invokeAction() {
		this.actionClick.next();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: SpinnerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: SpinnerComponent,
			isStandalone: false,
			selector: "appfx-spinner",
			inputs: {
				message: "message",
				politeness: "politeness",
				isModal: "isModal",
				progressDetails: "progressDetails",
				showActionButton: "showActionButton",
				actionButtonLabel: "actionButtonLabel"
			},
			outputs: { actionClick: "actionClick" },
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section class=\"overlay-spinner\" *ngIf=\"!isModal; else spinner\">\n  <ng-template [ngTemplateOutlet]=\"spinner\"></ng-template>\n</section>\n\n<ng-template #spinner>\n  <clr-spinner>\n    {{ message }}\n  </clr-spinner>\n  <span [attr.aria-live]=\"politeness\" class=\"clr-sr-only\">\n    {{ message }}\n  </span>\n\n  <span *ngIf=\"progressDetails\" class=\"progress-item\" aria-live=\"polite\">\n    {{ progressDetails }}\n  </span>\n\n  <button *ngIf=\"showActionButton\" class=\"btn btn-link btn-sm\" (click)=\"invokeAction()\">\n    {{ actionButtonLabel }}\n  </button>\n</ng-template>\n",
			styles: [":host{position:absolute;top:50%;left:0;z-index:999;width:100%;display:flex;flex-direction:column;align-items:center}:host .progress-item{padding-top:.5rem}:host .overlay-spinner{position:absolute;display:flex;align-items:center;flex-direction:column;justify-content:center;width:100%;min-height:inherit;inset:0;z-index:1200}\n"],
			dependencies: [
				{
					kind: "component",
					type: i1$1.ClrSpinner,
					selector: "clr-spinner",
					inputs: [
						"clrInline",
						"clrInverse",
						"clrSmall",
						"clrMedium"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgTemplateOutlet,
					selector: "[ngTemplateOutlet]",
					inputs: [
						"ngTemplateOutletContext",
						"ngTemplateOutlet",
						"ngTemplateOutletInjector"
					]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: SpinnerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-spinner",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<section class=\"overlay-spinner\" *ngIf=\"!isModal; else spinner\">\n  <ng-template [ngTemplateOutlet]=\"spinner\"></ng-template>\n</section>\n\n<ng-template #spinner>\n  <clr-spinner>\n    {{ message }}\n  </clr-spinner>\n  <span [attr.aria-live]=\"politeness\" class=\"clr-sr-only\">\n    {{ message }}\n  </span>\n\n  <span *ngIf=\"progressDetails\" class=\"progress-item\" aria-live=\"polite\">\n    {{ progressDetails }}\n  </span>\n\n  <button *ngIf=\"showActionButton\" class=\"btn btn-link btn-sm\" (click)=\"invokeAction()\">\n    {{ actionButtonLabel }}\n  </button>\n</ng-template>\n",
			styles: [":host{position:absolute;top:50%;left:0;z-index:999;width:100%;display:flex;flex-direction:column;align-items:center}:host .progress-item{padding-top:.5rem}:host .overlay-spinner{position:absolute;display:flex;align-items:center;flex-direction:column;justify-content:center;width:100%;min-height:inherit;inset:0;z-index:1200}\n"]
		}]
	}],
	propDecorators: {
		message: [{ type: Input }],
		politeness: [{ type: Input }],
		isModal: [{ type: Input }],
		progressDetails: [{ type: Input }],
		showActionButton: [{ type: Input }],
		actionButtonLabel: [{ type: Input }],
		actionClick: [{ type: Output }]
	}
});
var StepValidationState = class {
	#errors;
	#warnings;
	#infos;
	constructor(errors = [], warnings = [], infos = []) {
		this.#errors = errors;
		this.#warnings = warnings;
		this.#infos = infos;
	}
	get errors() {
		return this.#errors || [];
	}
	set errors(messages) {
		this.#errors = messages;
	}
	get warnings() {
		return this.#warnings || [];
	}
	set warnings(messages) {
		this.#warnings = messages;
	}
	get infos() {
		return this.#infos || [];
	}
	set infos(messages) {
		this.#infos = messages;
	}
	isEmpty() {
		return this.errors.length === 0 && this.warnings.length === 0 && this.infos.length === 0;
	}
	isValid() {
		return !this.#errors || this.#errors.length === 0;
	}
};
var ValidationBannerInternalComponent = class ValidationBannerInternalComponent {
	constructor() {
		this.closable = true;
		this.closed = false;
		this.#items = [];
	}
	#items;
	get items() {
		return this.#items;
	}
	set items(value) {
		this.#items = value;
		this.closed = false;
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ValidationBannerInternalComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ValidationBannerInternalComponent,
			isStandalone: false,
			selector: "appfx-validation-banner-internal",
			inputs: {
				type: "type",
				closable: "closable",
				closed: "closed",
				items: "items"
			},
			ngImport: i0,
			template: ` <clr-alert
    role="alert"
    aria-live="polite"
    [clrAlertType]="type"
    *ngIf="items?.length"
    [clrAlertClosable]="closable"
    [(clrAlertClosed)]="closed"
  >
    <clr-alert-item *ngFor="let item of items">
      <span class="alert-text" [textContent]="item"></span>
    </clr-alert-item>
  </clr-alert>`,
			isInline: true,
			dependencies: [
				{
					kind: "component",
					type: i1.ClrAlert,
					selector: "clr-alert",
					inputs: [
						"clrAlertSizeSmall",
						"clrAlertClosable",
						"clrAlertAppLevel",
						"clrCloseButtonAriaLabel",
						"clrAlertLightweight",
						"clrAlertType",
						"clrAlertIcon",
						"clrAlertClosed"
					],
					outputs: ["clrAlertClosedChange"]
				},
				{
					kind: "component",
					type: i1.ClrAlertItem,
					selector: "clr-alert-item"
				},
				{
					kind: "directive",
					type: i1.ClrAlertText,
					selector: ".alert-text"
				},
				{
					kind: "directive",
					type: i3$1.NgForOf,
					selector: "[ngFor][ngForOf]",
					inputs: [
						"ngForOf",
						"ngForTrackBy",
						"ngForTemplate"
					]
				},
				{
					kind: "directive",
					type: i3$1.NgIf,
					selector: "[ngIf]",
					inputs: [
						"ngIf",
						"ngIfThen",
						"ngIfElse"
					]
				}
			],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ValidationBannerInternalComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-validation-banner-internal",
			standalone: false,
			template: ` <clr-alert
    role="alert"
    aria-live="polite"
    [clrAlertType]="type"
    *ngIf="items?.length"
    [clrAlertClosable]="closable"
    [(clrAlertClosed)]="closed"
  >
    <clr-alert-item *ngFor="let item of items">
      <span class="alert-text" [textContent]="item"></span>
    </clr-alert-item>
  </clr-alert>`,
			changeDetection: ChangeDetectionStrategy.Eager
		}]
	}],
	propDecorators: {
		type: [{ type: Input }],
		closable: [{ type: Input }],
		closed: [{ type: Input }],
		items: [{ type: Input }]
	}
});
var ValidationBannerComponent = class ValidationBannerComponent {
	constructor() {
		this.closable = true;
	}
	get closed() {
		return !this.state || this.state.isEmpty();
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: ValidationBannerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: ValidationBannerComponent,
			isStandalone: false,
			selector: "appfx-validation-banner",
			inputs: {
				state: "state",
				closable: "closable"
			},
			ngImport: i0,
			template: `
    <appfx-validation-banner-internal
      *ngIf="state && state.errors?.length"
      [items]="state.errors"
      [type]="'danger'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.warnings?.length"
      [items]="state.warnings"
      [type]="'warning'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.infos?.length"
      [items]="state.infos"
      [type]="'info'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
  `,
			isInline: true,
			styles: [":host{display:block;margin-bottom:var(--cds-global-space-4)}\n"],
			dependencies: [{
				kind: "directive",
				type: i3$1.NgIf,
				selector: "[ngIf]",
				inputs: [
					"ngIf",
					"ngIfThen",
					"ngIfElse"
				]
			}, {
				kind: "component",
				type: ValidationBannerInternalComponent,
				selector: "appfx-validation-banner-internal",
				inputs: [
					"type",
					"closable",
					"closed",
					"items"
				]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: ValidationBannerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-validation-banner",
			standalone: false,
			template: `
    <appfx-validation-banner-internal
      *ngIf="state && state.errors?.length"
      [items]="state.errors"
      [type]="'danger'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.warnings?.length"
      [items]="state.warnings"
      [type]="'warning'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
    <appfx-validation-banner-internal
      *ngIf="state && state.infos?.length"
      [items]="state.infos"
      [type]="'info'"
      [closable]="closable"
      [closed]="closed"
    ></appfx-validation-banner-internal>
  `,
			changeDetection: ChangeDetectionStrategy.Eager,
			styles: [":host{display:block;margin-bottom:var(--cds-global-space-4)}\n"]
		}]
	}],
	propDecorators: {
		state: [{ type: Input }],
		closable: [{ type: Input }]
	}
});
var StepContainerComponent = class StepContainerComponent {
	constructor() {
		this.onRetry = new EventEmitter();
	}
	get readyToComplete() {
		if (this.pageComponent?.model) {
			const stepModel = this.pageComponent.model;
			return stepModel.readyToComplete === void 0 ? true : stepModel.readyToComplete;
		}
		return true;
	}
	get isValid() {
		return this.readyToComplete && this.isPageStateValid;
	}
	get isPageStateValid() {
		if (this.pageComponent?.model?.validationState) return this.pageComponent.model.validationState.isValid();
		return true;
	}
	ngOnInit() {
		if (!this.step.instantiateLazy) this.loadComponent();
	}
	ngOnDestroy() {
		this.unsubscribeRetry();
	}
	onActivate(error, stepModelChanges, recreateComponent, resetValidationState = true) {
		this.unsubscribeRetry();
		if (error) {
			this.loadErrorComponent(error);
			return;
		}
		if (recreateComponent || !this.pageComponent && !!this.step.instantiateLazy) this.loadComponent();
		if (!this.pageComponent) return;
		if (resetValidationState) this.resetValidationState();
		if (typeof this.pageComponent.activate === "function") this.pageComponent.activate(stepModelChanges);
	}
	onCommit() {
		if (!this.pageComponent) return of(true);
		if (typeof this.pageComponent.validate === "function") {
			const result = this.pageComponent.validate();
			if (!(result instanceof Observable)) throw new Error("'validate' function must return Observable<boolean>");
			return result.pipe(map((isValid) => isValid && this.isValid));
		}
		return of(this.isValid);
	}
	loadComponent() {
		if (!this.step.componentClass) return;
		this.componentContainer.clear();
		const cr = this.componentContainer.createComponent(this.step.componentClass);
		this.pageComponent = cr.instance;
		this.pageComponent.model = this.step.modelInstance;
	}
	loadErrorComponent(error) {
		this.componentContainer.clear();
		const cr = this.componentContainer.createComponent(ErrorComponent);
		this.pageComponent = cr.instance;
		this.pageComponent.error = error;
		this.retrySubscription = this.pageComponent.onRetry.pipe(take(1)).subscribe(() => this.onRetry.emit(this.step));
	}
	unsubscribeRetry() {
		if (this.retrySubscription && !this.retrySubscription.closed) this.retrySubscription.unsubscribe();
	}
	resetValidationState() {
		if (this.pageComponent?.model) {
			this.pageComponent.model.readyToComplete = true;
			if (this.pageComponent.model.validationState) {
				this.pageComponent.model.validationState.errors = [];
				this.pageComponent.model.validationState.warnings = [];
				this.pageComponent.model.validationState.infos = [];
			}
		}
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: StepContainerComponent,
			deps: [],
			target: i0.ɵɵFactoryTarget.Component
		});
	}
	static {
		this.ɵcmp = i0.ɵɵngDeclareComponent({
			minVersion: "14.0.0",
			version: "22.2.4",
			type: StepContainerComponent,
			isStandalone: false,
			selector: "appfx-step-container",
			inputs: {
				step: "step",
				description: "description"
			},
			outputs: { onRetry: "onRetry" },
			viewQueries: [{
				propertyName: "componentContainer",
				first: true,
				predicate: ["componentContainer"],
				descendants: true,
				read: ViewContainerRef,
				static: true
			}],
			ngImport: i0,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"pr-1 clr-flex-grow-0 clr-flex-shrink-0\">\n  <span *ngIf=\"description\">{{ description }}</span>\n  <appfx-validation-banner\n    *ngIf=\"step.modelInstance?.validationState?.isEmpty() === false\"\n    [state]=\"step.modelInstance?.validationState ?? null\"\n  >\n  </appfx-validation-banner>\n</div>\n<div class=\"content-container clr-flex-column clr-flex-grow-1 clr-flex-shrink-1\">\n  <ng-template #componentContainer> </ng-template>\n</div>\n",
			dependencies: [{
				kind: "directive",
				type: i3$1.NgIf,
				selector: "[ngIf]",
				inputs: [
					"ngIf",
					"ngIfThen",
					"ngIfElse"
				]
			}, {
				kind: "component",
				type: ValidationBannerComponent,
				selector: "appfx-validation-banner",
				inputs: ["state", "closable"]
			}],
			changeDetection: i0.ChangeDetectionStrategy.Eager
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: StepContainerComponent,
	decorators: [{
		type: Component,
		args: [{
			selector: "appfx-step-container",
			standalone: false,
			changeDetection: ChangeDetectionStrategy.Eager,
			template: "<!--\n  ~ Copyright (c) 2016-2026 Broadcom. All Rights Reserved.\n  ~ The term \"Broadcom\" refers to Broadcom Inc. and/or its subsidiaries.\n  ~ This software is released under MIT license.\n  ~ The full license information can be found in LICENSE in the root directory of this project.\n  -->\n<div class=\"pr-1 clr-flex-grow-0 clr-flex-shrink-0\">\n  <span *ngIf=\"description\">{{ description }}</span>\n  <appfx-validation-banner\n    *ngIf=\"step.modelInstance?.validationState?.isEmpty() === false\"\n    [state]=\"step.modelInstance?.validationState ?? null\"\n  >\n  </appfx-validation-banner>\n</div>\n<div class=\"content-container clr-flex-column clr-flex-grow-1 clr-flex-shrink-1\">\n  <ng-template #componentContainer> </ng-template>\n</div>\n"
		}]
	}],
	propDecorators: {
		step: [{ type: Input }],
		description: [{ type: Input }],
		onRetry: [{ type: Output }],
		componentContainer: [{
			type: ViewChild,
			args: ["componentContainer", {
				read: ViewContainerRef,
				static: true
			}]
		}]
	}
});
const modalServiceToken = new InjectionToken("ModalService#openModalComponent");
function workflowConfigurationServiceFactory(existing) {
	return existing || new WorkflowConfigurationService();
}
function workflowStringsServiceFactory(existing) {
	return existing || new WorkflowStrings();
}
const components = [
	ValidationBannerComponent,
	ValidationBannerInternalComponent,
	StepContainerComponent,
	WorkflowModelMonitorComponent,
	ErrorComponent,
	SpinnerComponent
];
const clarityDependencies = [
	ClrAlertModule,
	ClrIcon,
	ClrSpinnerModule,
	ClrStackViewModule,
	ClrSignpostModule
];
const addonsDependencies = [PropertyViewModule, A11yModule];
var AppfxWorkflowCoreModule = class AppfxWorkflowCoreModule {
	constructor() {
		ClarityIcons.addIcons(angleIcon, barsIcon, exclamationCircleIcon, pencilIcon, refreshIcon, successStandardIcon);
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowCoreModule,
			deps: [],
			target: i0.ɵɵFactoryTarget.NgModule
		});
	}
	static {
		this.ɵmod = i0.ɵɵngDeclareNgModule({
			minVersion: "14.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowCoreModule,
			declarations: [
				ValidationBannerComponent,
				ValidationBannerInternalComponent,
				StepContainerComponent,
				WorkflowModelMonitorComponent,
				ErrorComponent,
				SpinnerComponent
			],
			imports: [
				PropertyViewModule,
				A11yModule,
				ClrAlertModule,
				ClrIcon,
				ClrSpinnerModule,
				ClrStackViewModule,
				ClrSignpostModule,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			exports: [
				ValidationBannerComponent,
				ValidationBannerInternalComponent,
				StepContainerComponent,
				WorkflowModelMonitorComponent,
				ErrorComponent,
				SpinnerComponent
			]
		});
	}
	static {
		this.ɵinj = i0.ɵɵngDeclareInjector({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: AppfxWorkflowCoreModule,
			providers: [{
				provide: WorkflowConfigurationService,
				useFactory: workflowConfigurationServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowConfigurationService
				]]
			}, {
				provide: WorkflowStrings,
				useFactory: workflowStringsServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowStrings
				]]
			}],
			imports: [
				addonsDependencies,
				clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			]
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: AppfxWorkflowCoreModule,
	decorators: [{
		type: NgModule,
		args: [{
			imports: [
				...addonsDependencies,
				...clarityDependencies,
				CommonModule,
				FormsModule,
				ReactiveFormsModule
			],
			declarations: [...components],
			providers: [{
				provide: WorkflowConfigurationService,
				useFactory: workflowConfigurationServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowConfigurationService
				]]
			}, {
				provide: WorkflowStrings,
				useFactory: workflowStringsServiceFactory,
				deps: [[
					new Optional(),
					new SkipSelf(),
					WorkflowStrings
				]]
			}],
			exports: [...components]
		}]
	}],
	ctorParameters: () => []
});
var Mappings = class {
	constructor() {
		this.mappings = {};
	}
	mapStepProp(stepModelPropertyName) {
		const self = this;
		return { to(wizardModelPropertyName) {
			if (self.mappings[stepModelPropertyName]) throw new Error(`A mapping for property ${String(stepModelPropertyName)} is defined more than once.`);
			else if (Object.values(self.mappings).indexOf(wizardModelPropertyName) >= 0) throw new Error(`A mapping for property ${String(wizardModelPropertyName)} is defined more than once.`);
			self.mappings[stepModelPropertyName] = wizardModelPropertyName;
			return self;
		} };
	}
	validate(model) {
		if (model) {
			const inputMappings = getInputMappings(model);
			const outputMappings = getOutputMappings(model);
			const missingMappings = this.validateMappings(inputMappings, outputMappings);
			if (missingMappings.length) throw new Error(`No @In or @Out decorator found for property names ` + JSON.stringify(missingMappings));
		}
	}
	getPropertyMappings() {
		return { ...this.mappings };
	}
	validateMappings(inputMappings, outputMappings) {
		const defaultMappings = {
			...inputMappings,
			...outputMappings
		};
		return Object.keys(this.mappings).filter((key) => !defaultMappings[key]);
	}
};
var RelevanceService = class RelevanceService {
	constructor() {
		this.loading = false;
		this.isRelevantSubs = [];
		this.stepRelevanceChange$ = new Subject();
		this.#steps = [];
	}
	#steps;
	set steps(steps) {
		this.#steps = steps || [];
		this.unbindIsRelevantListeners();
		this.bindIsRelevantListeners();
	}
	checkComplete$() {
		const relevantVarValues = this.#steps.filter((step) => step.isRelevant instanceof ComputedVar && step.isRelevant.areDependenciesSatisfied).map((step) => step.isRelevant.value$);
		let stepsObservable;
		if (relevantVarValues.length) {
			this.loading = true;
			stepsObservable = combineLatest(relevantVarValues).pipe(map(() => {
				this.loading = false;
				return this.#steps;
			}));
		} else stepsObservable = of(this.#steps);
		return stepsObservable;
	}
	destroy() {
		this.#steps = [];
		this.unbindIsRelevantListeners();
	}
	onStepRelevanceChange$() {
		return this.stepRelevanceChange$.asObservable();
	}
	bindIsRelevantListeners() {
		return this.#steps.filter((step) => step.isRelevant).forEach((step) => {
			if (step.isRelevant instanceof ComputedVar || step.isRelevant instanceof SimpleVar) this.isRelevantSubs.push(step.isRelevant.value$.pipe(startWith(false)).subscribe((isRelevant) => {
				const oldValue = step.isSkipped;
				step.isSkipped = !isRelevant;
				if (oldValue !== step.isSkipped) this.stepRelevanceChange$.next(step);
			}));
		});
	}
	unbindIsRelevantListeners() {
		this.isRelevantSubs.forEach((s) => s.unsubscribe());
		this.isRelevantSubs = [];
	}
	static {
		this.ɵfac = i0.ɵɵngDeclareFactory({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RelevanceService,
			deps: [],
			target: i0.ɵɵFactoryTarget.Injectable
		});
	}
	static {
		this.ɵprov = i0.ɵɵngDeclareInjectable({
			minVersion: "12.0.0",
			version: "22.2.4",
			ngImport: i0,
			type: RelevanceService
		});
	}
};
i0.ɵɵngDeclareClassMetadata({
	minVersion: "12.0.0",
	version: "22.2.4",
	ngImport: i0,
	type: RelevanceService,
	decorators: [{ type: Injectable }]
});
var TabLayout;
(function(TabLayout) {
	TabLayout["horizontal"] = "horizontal";
	TabLayout["vertical"] = "vertical";
	TabLayout["secondary"] = "horizontal-secondary";
})(TabLayout || (TabLayout = {}));
export { AppfxWorkflowCoreModule, TabLayout as DialogLayout, TabLayout, ErrorComponent, In, Mappings, ModelChange, Out, RelevanceService, SpinnerComponent as Spinner, SpinnerComponent, StepContainerComponent as StepContainer, StepContainerComponent, StepValidationState, ValidationBannerComponent as ValidationBanner, ValidationBannerComponent, ValidationBannerInternalComponent as ValidationBannerInternal, ValidationBannerInternalComponent, Var, WorkflowConfigurationService, WorkflowModelManager, WorkflowModelMonitorComponent as WorkflowModelMonitor, WorkflowModelMonitorComponent, formatError, modalServiceToken, stringify };

//# sourceMappingURL=clr-addons-var.mjs.map