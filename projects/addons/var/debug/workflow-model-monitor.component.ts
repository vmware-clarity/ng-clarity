/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrPopoverContent } from '@clr/angular/popover/common';
import { Subscription } from 'rxjs';
import { bufferTime, map } from 'rxjs/operators';

import { ComputedVar, SimpleVar } from '../model/var';
import { ModelChange, StepWithChanges, WorkflowModelManager } from '../model/workflow-model-manager.service';

/**
 * Render given workflow model in a Clarity signpost.
 * Values, changed in the current step are marked in different color.
 * On next step, changed properties are reset.
 */
@Component({
  selector: 'appfx-model-popup',
  standalone: false,
  templateUrl: 'workflow-model-monitor.component.html',
  styleUrls: ['workflow-model-monitor.component.scss'],
})
export class WorkflowModelMonitorComponent implements OnInit, OnDestroy {
  @Input() modelMgr: WorkflowModelManager;

  isOpen = false;
  debugModel: NameValue[] = [];

  private subscriptions: Subscription = new Subscription();

  @ViewChild(ClrPopoverContent)
  set popoverContent(popoverContent: ClrPopoverContent) {
    if (popoverContent) {
      popoverContent.outsideClickClose = false;
    }
  }

  ngOnInit(): void {
    this.bindModelChangeListeners();
    this.bindStepChangeListeners();
    this.initDebugModel();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private bindModelChangeListeners(): void {
    this.subscriptions.add(
      // There could be a burst of onModelChange$ events on the same property
      // which can cause ExpressionChangedAfterItHasBeenCheckedError
      // use buffer time of 100ms
      this.modelMgr.onModelChange$
        .pipe(
          bufferTime(100),
          map(changes => ([] as ModelChange[]).concat(...changes)) // flatten the array
        )
        .subscribe(changes => this.updateDebugModel(changes))
    );
  }

  private bindStepChangeListeners(): void {
    this.subscriptions.add(
      this.modelMgr.onStepChange$.subscribe((value: StepWithChanges) => {
        this.resetDebugModel();
        this.updateDebugModel(value.changes);
      })
    );
  }

  private updateDebugModel(changes: ModelChange[]): void {
    if (!this.modelMgr.model) {
      return;
    }

    for (const change of changes) {
      const propertyModelValue = (this.modelMgr.model as any)[change.propertyName];
      const nameValue = this.getPropertyNameValue(change.propertyName, propertyModelValue);
      const existing = this.debugModel.find(value => value.name === change.propertyName);
      if (!nameValue) {
        // The property is a function. Ignore it.
        continue;
      }

      if (existing) {
        existing.value = nameValue.value;
        existing.changed = true;
      } else {
        nameValue.changed = true;
        this.debugModel.push(nameValue);
        // Sort model properties alphabetically.
        this.debugModel.sort((a: NameValue, b: NameValue) => a.name.localeCompare(b.name));
      }
    }
  }

  private initDebugModel(): void {
    this.debugModel = [];
    if (!this.modelMgr.model) {
      return;
    }

    for (const [name, value] of Object.entries(this.modelMgr.model)) {
      const nameValue = this.getPropertyNameValue(name, value);
      if (nameValue) {
        this.debugModel.push(nameValue);
      }
    }

    // Sort model properties alphabetically.
    this.debugModel.sort((a: NameValue, b: NameValue) => a.name.localeCompare(b.name));
  }

  private resetDebugModel(): void {
    for (const entry of this.debugModel) {
      entry.changed = false;
    }
  }

  private getPropertyNameValue(name: string, value: any): NameValue | null {
    let propValue = value;
    let strValue = '';
    let isComputedVar = false;
    let isSimpleVar = false;

    if (value instanceof ComputedVar) {
      const varValue = <ComputedVar<any>>value;
      propValue = varValue.value;
      isComputedVar = true;
    } else if (value instanceof SimpleVar) {
      const varValue = <SimpleVar<any>>value;
      propValue = varValue.value;
      isSimpleVar = true;
    } else {
      throw new Error('Unsupported step type: ' + value);
    }

    if (typeof propValue === 'object') {
      try {
        strValue = JSON.stringify(propValue);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_ignored) {
        console.warn(`Cannot stringify workflow property ${name}`);
        strValue = '{object}';
      }
    } else if (typeof propValue === 'function') {
      return null;
    } else {
      strValue = propValue + '';
    }

    return {
      name: name,
      value: strValue,
      computedVar: isComputedVar,
      simpleVar: isSimpleVar,
      changed: false,
    };
  }
}

interface NameValue {
  name: string;
  value: string;
  computedVar: boolean;
  simpleVar: boolean;
  changed: boolean;
}
