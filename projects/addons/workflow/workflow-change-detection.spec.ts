/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, inject, Injectable, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { OnStepActivate, Step, StepModel, StepModelHolder, StepValidationState, Var } from '@clr/addons/var';
import { renderFixture } from '@clr/angular/utils/testing';
import { Observable, Subject } from 'rxjs';

import { AppfxWorkflowsModule } from './appfx-workflows.module';

class ConsumerModel implements StepModel {
  loading = false;
  validationState = new StepValidationState();
}

@Component({
  selector: 'consumer-step',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<p class="consumer-text">{{ text }}</p>`,
})
class ConsumerStep implements StepModelHolder, OnStepActivate {
  model: ConsumerModel;
  text = 'initial';

  activate(): void {
    // Consumer steps don't have to do anything on activation.
  }
}

@Injectable()
class WorkflowState {
  readonly relevanceResult = new Subject<boolean>();
  readonly dependency = Var.of(true);
  readonly steps: Step[] = [{ title: 'Consumer step', componentClass: ConsumerStep, model: new ConsumerModel() }];
  readonly model = {};

  /** Adds a step whose relevance check waits for `relevanceResult`. */
  withPendingRelevanceCheck(): this {
    this.steps.push({
      title: 'Optional step',
      componentClass: ConsumerStep,
      model: new ConsumerModel(),
      isRelevant: Var.from(this.dependency).by((): Observable<boolean> => this.relevanceResult),
    });
    return this;
  }
}

const template = {
  wizard: `<appfx-wizard title="Workflow" [pages]="state.steps" [wizardModel]="state.model"></appfx-wizard>`,
  stepper: `<appfx-stepper [steps]="state.steps" [wizardModel]="state.model"></appfx-stepper>`,
  tabs: `<appfx-tabs [tabs]="state.steps" [model]="state.model"></appfx-tabs>`,
};

function host(name: keyof typeof template, changeDetection: ChangeDetectionStrategy) {
  @Component({
    selector: 'workflow-host',
    changeDetection,
    imports: [AppfxWorkflowsModule],
    template: template[name],
  })
  class WorkflowHost {
    readonly state = inject(WorkflowState);
  }
  return WorkflowHost;
}

describe('workflow change detection', () => {
  for (const name of Object.keys(template) as (keyof typeof template)[]) {
    describe(`appfx-${name}`, () => {
      let fixture: ComponentFixture<{ state: WorkflowState }>;

      function create(hostType: Type<{ state: WorkflowState }>, setUp?: (state: WorkflowState) => void) {
        const state = new WorkflowState();
        setUp?.(state);
        TestBed.configureTestingModule({
          // Importing the module here makes TestBed apply its scope again, after specs that declare its components.
          imports: [AppfxWorkflowsModule],
          providers: [{ provide: WorkflowState, useValue: state }],
        });
        fixture = TestBed.createComponent(hostType);
      }

      function query(selector: string): HTMLElement | null {
        return fixture.nativeElement.querySelector(selector);
      }

      function consumerStep(): ConsumerStep {
        return fixture.debugElement.query(By.directive(ConsumerStep)).componentInstance;
      }

      // After every async task, a Zone app checks all Eager views without any notification from the code.
      // `zoneTick()` does the same check from the root view here.
      describe('in a Zone app with an Eager host', () => {
        const zoneTick = () => renderFixture(fixture);

        beforeEach(async () => {
          create(host(name, ChangeDetectionStrategy.Eager));
          await fixture.whenStable();
        });

        it('renders a field that the consumer step sets from async code', () => {
          consumerStep().text = 'loaded';
          zoneTick();

          expect(query('.consumer-text')?.textContent).toBe('loaded');
        });

        it('shows the spinner while the consumer step model is loading', () => {
          const model = consumerStep().model;

          model.loading = true;
          zoneTick();
          expect(query('appfx-spinner')).not.toBeNull();

          model.loading = false;
          zoneTick();
          expect(query('appfx-spinner')).toBeNull();
        });

        it('renders errors that the consumer pushes into the validation state', () => {
          const errors = consumerStep().model.validationState.errors;

          errors.push('Name is required');
          zoneTick();
          errors.push('Name is too long');
          zoneTick();

          const texts = [...fixture.nativeElement.querySelectorAll('appfx-validation-banner .alert-text')];
          expect(texts.map(text => text.textContent)).toEqual(['Name is required', 'Name is too long']);
        });
      });

      describe('in an OnPush host', () => {
        it('renders a validation state that the consumer replaces', async () => {
          create(host(name, ChangeDetectionStrategy.OnPush));
          await fixture.whenStable();

          consumerStep().model.validationState.errors = ['Name is required'];
          await fixture.whenStable();

          expect(query('appfx-validation-banner .alert-text')?.textContent).toBe('Name is required');
        });

        it('shows the spinner until a pending relevance check completes', async () => {
          create(host(name, ChangeDetectionStrategy.OnPush), state => state.withPendingRelevanceCheck());
          await fixture.whenStable();
          expect(query('appfx-spinner')).not.toBeNull();

          fixture.componentInstance.state.relevanceResult.next(true);
          await fixture.whenStable();

          expect(query('appfx-spinner')).toBeNull();
          expect(query('.consumer-text')?.textContent).toBe('initial');
        });
      });
    });
  }
});
