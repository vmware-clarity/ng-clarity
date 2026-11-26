/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, isSignal, signal, Type, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { renderFixture } from '@clr/angular/utils/testing';

type HostField<T> = T | WritableSignal<T>;

/**
 * A test host with one container around one control. `label` and `messages` (helper, error and success)
 * are conditional in the host template, so the specs can add and remove them after the first render.
 * Each conditional block has one root element, so it is projected by that element's selector.
 */
export interface ContainerTestHost {
  control: FormControl;
  validValue: unknown;
  label: HostField<string | null>;
  messages: HostField<boolean>;
}

export interface ContainerTestHosts {
  /** An Eager host whose plain fields are changed from code, then refreshed by a full check, as Zone.js does. */
  eager: Type<ContainerTestHost>;
  /** An OnPush host with signal fields. Nothing forces a render: the changes must notify. */
  onPush: Type<ContainerTestHost>;
}

export interface ContainerTestContext {
  fixture: ComponentFixture<ContainerTestHost>;
  host: ContainerTestHost;
  containerEl: HTMLElement;
  /** Waits for the change the way the host's application would render it. */
  settle: () => Promise<void>;
  set: <K extends 'label' | 'messages'>(
    field: K,
    value: ContainerTestHost[K] extends HostField<infer T> ? T : never
  ) => void;
}

export interface ContainerTestHostOptions {
  /** The NgModule (or standalone types) that declares the container and the control. */
  imports: unknown[];
  container: string;
  /** Attributes or bindings on the container element. */
  containerAttributes?: string;
  /** The control markup has a wrapper with its own label (checkbox, toggle, radio). */
  wrapperLabel?: boolean;
  /** Markup of the control(s) inside the container, bound to `control` with `[formControl]`. */
  controlMarkup: string;
  initialValue: unknown;
  validValue: unknown;
  validator: ValidatorFn;
}

/** Builds the Eager and the OnPush host for one container, with the same markup. */
export function containerTestHosts(options: ContainerTestHostOptions): ContainerTestHosts {
  const template = (read: (field: string) => string) => `
    <form clrForm>
      <${options.container} ${options.containerAttributes ?? ''}>
        @if (${read('label')}; as text) {
          <label>{{ text }}</label>
        }
        ${options.controlMarkup}
        @if (${read('messages')}) {
          <clr-control-helper>Helper</clr-control-helper>
        }
        @if (${read('messages')}) {
          <clr-control-error>Error</clr-control-error>
        }
        @if (${read('messages')}) {
          <clr-control-success>Valid</clr-control-success>
        }
      </${options.container}>
    </form>
  `;

  @Component({
    imports: [ReactiveFormsModule, ClrCommonFormsModule, ...(options.imports as Type<unknown>[])],
    template: template(field => field),
    changeDetection: ChangeDetectionStrategy.Eager,
  })
  class EagerHost implements ContainerTestHost {
    control = new FormControl(options.initialValue, options.validator);
    validValue = options.validValue;
    label: string | null = 'Name';
    messages = true;
  }

  @Component({
    imports: [ReactiveFormsModule, ClrCommonFormsModule, ...(options.imports as Type<unknown>[])],
    template: template(field => `${field}()`),
    changeDetection: ChangeDetectionStrategy.OnPush,
  })
  class OnPushHost implements ContainerTestHost {
    control = new FormControl(options.initialValue, options.validator);
    validValue = options.validValue;
    label = signal<string | null>('Name');
    messages = signal(true);
  }

  return { eager: EagerHost, onPush: OnPushHost };
}

/**
 * Runs `specs` once with each host. Consumer code changes the control (touch, value, disable) and the
 * conditional content; exhaustive `checkNoChanges` turns any stale container binding into NG0100.
 */
export function eachContainerHost(
  containerSelector: string,
  hosts: ContainerTestHosts,
  specs: (context: () => ContainerTestContext) => void
): void {
  const variants: [string, Type<ContainerTestHost>, boolean][] = [
    ['Eager host checked by the application (Zone.js)', hosts.eager, true],
    ['OnPush host with signals (zoneless)', hosts.onPush, false],
  ];

  for (const [name, hostType, fullCheck] of variants) {
    describe(name, () => {
      let context: ContainerTestContext;

      beforeEach(async () => {
        TestBed.configureTestingModule({ imports: [hostType] });
        const fixture = TestBed.createComponent(hostType);
        const host = fixture.componentInstance;
        const settle = async () => {
          if (fullCheck) {
            renderFixture(fixture);
          }
          await fixture.whenStable();
        };
        const set: ContainerTestContext['set'] = (field, value) => {
          const current = host[field];
          if (isSignal(current)) {
            (current as WritableSignal<unknown>).set(value);
          } else {
            (host as unknown as Record<string, unknown>)[field] = value;
          }
        };

        await settle();
        context = { fixture, host, containerEl: fixture.nativeElement.querySelector(containerSelector), settle, set };
      });

      afterEach(() => context?.fixture.destroy());

      specs(() => context);
    });
  }
}

/** Container behaviour every simple form container shares. */
export function ContainerChangeDetectionSpec(options: ContainerTestHostOptions): void {
  describe('change detection', () => {
    eachContainerHost(options.container, containerTestHosts(options), context => {
      function controlContainer() {
        return context().containerEl.querySelector('.clr-control-container');
      }

      /** Text of the labels that are direct children of the container: the consumer's label or the grid placeholder. */
      function containerLabels() {
        return Array.from(context().containerEl.querySelectorAll(':scope > label')).map(label =>
          label.textContent.trim()
        );
      }

      it('shows the error when consumer code marks the control as touched', async () => {
        const { host, containerEl, settle } = context();
        expect(containerEl.querySelector('clr-control-error')).toBeNull();

        host.control.markAsTouched();
        await settle();

        expect(controlContainer().classList).toContain('clr-error');
        expect(containerEl.querySelector('clr-control-error')).not.toBeNull();
      });

      it('shows the success message when consumer code sets a valid value', async () => {
        const { host, containerEl, settle } = context();
        host.control.markAsTouched();
        await settle();

        host.control.setValue(host.validValue);
        await settle();

        expect(controlContainer().classList).toContain('clr-success');
        expect(containerEl.querySelector('clr-control-success')).not.toBeNull();
        expect(containerEl.querySelector('clr-control-error')).toBeNull();
      });

      it('follows disable() and enable() from consumer code', async () => {
        const { host, containerEl, settle } = context();

        host.control.disable();
        await settle();
        expect(containerEl.classList).toContain('clr-form-control-disabled');

        host.control.enable();
        await settle();
        expect(containerEl.classList).not.toContain('clr-form-control-disabled');
      });

      it('catches up with changes made with emitEvent: false when the consumer is checked', async () => {
        const { fixture, host, containerEl, settle } = context();

        host.control.disable({ emitEvent: false });
        fixture.changeDetectorRef.markForCheck();
        await settle();
        expect(containerEl.classList).toContain('clr-form-control-disabled');

        host.control.enable({ emitEvent: false });
        fixture.changeDetectorRef.markForCheck();
        await settle();
        expect(containerEl.classList).not.toContain('clr-form-control-disabled');
      });

      it('shows messages that are added after the first render', async () => {
        const { host, containerEl, settle, set } = context();
        set('messages', false);
        host.control.markAsTouched();
        await settle();
        expect(containerEl.querySelector('clr-control-helper')).toBeNull();
        expect(containerEl.querySelector('clr-control-error')).toBeNull();

        set('messages', true);
        await settle();

        expect(containerEl.querySelector('clr-control-helper')).not.toBeNull();
        expect(containerEl.querySelector('clr-control-error')).not.toBeNull();
      });

      it('follows a label that is removed and added again', async () => {
        const { settle, set } = context();
        expect(containerLabels()).toEqual(['Name']);

        set('label', null);
        await settle();
        // Without its own label the container keeps the grid column with an empty one. A checkbox or radio
        // container instead finds the label of its first wrapper (a descendant), so it needs no placeholder.
        expect(containerLabels()).toEqual(options.wrapperLabel ? [] : ['']);

        set('label', 'Name');
        await settle();
        expect(containerLabels()).toEqual(['Name']);
      });

      it('ignores control changes after it is destroyed', async () => {
        const { fixture, host } = context();
        fixture.destroy();

        expect(() => {
          host.control.markAsTouched();
          host.control.setValue(host.validValue);
          host.control.disable();
        }).not.toThrow();
        await fixture.whenStable();
      });
    });
  });
}
