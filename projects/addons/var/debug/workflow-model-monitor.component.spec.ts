/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClrSignpostContent, ClrSignpostModule } from '@clr/angular/popover/signpost';
import { of, Subject } from 'rxjs';

import { WorkflowModelMonitorComponent } from './workflow-model-monitor.component';
import { ComputedVar, Var } from '../model/var';
import { ModelChange, WorkflowModelManager } from '../model/workflow-model-manager.service';

describe('WorkflowModelMonitor', () => {
  let mockModelManager: WorkflowModelManager;
  let component: WorkflowModelMonitorComponent;
  let fixture: ComponentFixture<WorkflowModelMonitorComponent>;
  const onStepChange$ = new Subject();

  beforeEach(() => {
    mockModelManager = {
      onModelChange$: new Subject(),
      onStepChange$: onStepChange$,
      model: {
        property1: Var.of('Value1'),
        property2: Var.of('Value2'),
        property3: Var.of({ obj: 'Value3' }),
        property4: new ComputedVar<string>({
          dependsOn: [Var.of('Value1')],
          computeFn: () => {
            return of('observable!');
          },
        }),
        property5: Var.of(() => 'func'),
      },
    } as WorkflowModelManager;

    TestBed.configureTestingModule({
      imports: [ClrSignpostModule],
      declarations: [WorkflowModelMonitorComponent],
      providers: [{ provide: ClrSignpostContent, useValue: {} }],
    });
    fixture = TestBed.createComponent(WorkflowModelMonitorComponent);
    component = fixture.componentInstance;
    component.modelMgr = mockModelManager;
    fixture.detectChanges();
  });

  function updateModelManagerMock(changes: ModelChange[]) {
    changes.forEach(c => ((mockModelManager.model as any)[c.propertyName] = c.newValue));
  }

  it('should create', () => {
    const monitor = new WorkflowModelMonitorComponent();
    expect(monitor).toBeTruthy();
  });

  it('should init debugModel', () => {
    const monitor = new WorkflowModelMonitorComponent();
    monitor.modelMgr = new WorkflowModelManager();
    monitor.ngOnInit();

    expect(component.debugModel.length).toBe(4);
  });

  it('should reset debugModel', () => {
    (component as any).resetDebugModel();
    expect(component.debugModel.every((property: any) => !property.changed)).toBeTrue();
  });

  it('should update debugModel', () => {
    const changes: ModelChange[] = [
      { propertyName: 'property1', oldValue: undefined, newValue: Var.of('NewValue1') },
      { propertyName: 'property3', oldValue: undefined, newValue: Var.of('NewValue3') },
    ];
    updateModelManagerMock(changes);

    (component as any).updateDebugModel(changes);

    expect(component.debugModel.length).toBe(4);
    expect(component.debugModel[0].value).toBe('NewValue1');
    expect(component.debugModel[0].changed).toBeTrue();
    expect(component.debugModel[2].name).toBe('property3');
    expect(component.debugModel[2].value).toBe('NewValue3');
    expect(component.debugModel[2].changed).toBeTrue();
  });

  it('should add non existing properties to the model', () => {
    const changes: ModelChange[] = [
      { propertyName: 'property6', oldValue: undefined, newValue: Var.of('NewValue1') },
      { propertyName: 'property7', oldValue: undefined, newValue: Var.of('NewValue3') },
    ];
    updateModelManagerMock(changes);
    (component as any).updateDebugModel(changes);

    expect(component.debugModel.length).toBe(6);

    expect(component.debugModel[4].name).toBe('property6');
    expect(component.debugModel[4].value).toBe('NewValue1');
    expect(component.debugModel[4].changed).toBeTrue();
    expect(component.debugModel[5].name).toBe('property7');
    expect(component.debugModel[5].value).toBe('NewValue3');
    expect(component.debugModel[5].changed).toBeTrue();
  });

  it('should ignore the property value if it is a function', () => {
    const changes: ModelChange[] = [{ propertyName: 'property6', oldValue: undefined, newValue: Var.of(() => 'func') }];
    updateModelManagerMock(changes);

    (component as any).updateDebugModel(changes);

    expect(component.debugModel.length).toBe(4);
  });

  it('should set property value to string when provided object has circular dependency', () => {
    const object1 = {
      ref: {},
    };
    const object2 = {
      ref: {},
    };
    object1.ref = object2;
    object2.ref = object1;

    const changes: ModelChange[] = [{ propertyName: 'property6', oldValue: undefined, newValue: Var.of(object1) }];
    updateModelManagerMock(changes);

    (component as any).updateDebugModel(changes);
    expect(component.debugModel.length).toBe(5);
    expect(component.debugModel[4].name).toEqual('property6');
    expect(component.debugModel[4].value).toEqual('{object}');
    expect(component.debugModel[4].changed).toBeTrue();
  });

  it('should set isOpen to false on ngOnInit', () => {
    component.ngOnInit();
    expect(component.isOpen).toBeFalse();
  });

  it('should detach outside click listener when spContent is set', () => {
    const popoverContent = {
      outsideClickClose: true,
    };
    (component as any).popoverContent = popoverContent;

    expect(popoverContent.outsideClickClose).toBe(false);
  });

  it('should reset debugModel when step changes', () => {
    (component as any).updateDebugModel([{ propertyName: 'property3', newValue: Var.of('NewValue3') }]);
    onStepChange$.next({ changes: [] });

    expect(component.debugModel.every((property: any) => !property.changed)).toBeTrue();
  });
});
