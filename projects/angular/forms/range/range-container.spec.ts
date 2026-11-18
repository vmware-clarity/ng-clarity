/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrRange } from './range';
import { ClrRangeContainer } from './range-container';
import { ClrRangeModule } from './range.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container';
import {
  ContainerChangeDetectionSpec,
  ContainerTestHostOptions,
  containerTestHosts,
  eachContainerHost,
} from '../tests/onpush-container';

@Component({
  template: `
    <clr-range-container>
      <input name="model" clrRange required [(ngModel)]="model" [disabled]="disabled" />
      <label>Hello World</label>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>Must be at least 5 characters</clr-control-error>
      <clr-control-success>Valid</clr-control-success>
    </clr-range-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SimpleTest {
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-range-container>
      <input clrRange name="model" [(ngModel)]="model" />
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-range-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoLabelTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-range-container>
        <input clrRange formControlName="model" />
        <label>Hello World</label>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>Must be at least 5 characters</clr-control-error>
        <clr-control-success>Valid</clr-control-success>
      </clr-range-container>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ReactiveTest {
  disabled = false;
  form = new FormGroup({
    model: new FormControl({ value: '', disabled: this.disabled }, Validators.required),
  });
}

const hostOptions: ContainerTestHostOptions = {
  imports: [ClrRangeModule],
  container: 'clr-range-container',
  controlMarkup: '<input type="range" clrRange [formControl]="control" />',
  initialValue: 0,
  validValue: 50,
  validator: Validators.min(10),
};

describe('Radio component', () => {
  describe('ClrRangeContainer', () => {
    ContainerNoLabelSpec(ClrRangeContainer, ClrRange, NoLabelTest);
    TemplateDrivenSpec(ClrRangeContainer, ClrRange, SimpleTest, '.clr-range-wrapper [clrRange]');
    ReactiveSpec(ClrRangeContainer, ClrRange, ReactiveTest, '.clr-range-wrapper [clrRange]');
  });

  ContainerChangeDetectionSpec(hostOptions);

  describe('ClrRangeContainer progress fill', () => {
    eachContainerHost(
      'clr-range-container',
      containerTestHosts({ ...hostOptions, containerAttributes: '[clrRangeHasProgress]="true"' }),
      context => {
        function input() {
          return context().containerEl.querySelector('input');
        }
        function fillWidth() {
          return parseFloat(context().containerEl.querySelector<HTMLElement>('.fill-input').style.width);
        }

        it('follows a value set from consumer code', async () => {
          const { host, settle } = context();
          const width = input().offsetWidth;

          host.control.setValue(25);
          await settle();
          expect(fillWidth()).toBeCloseTo(width / 4);

          host.control.setValue(100);
          await settle();
          expect(fillWidth()).toBeCloseTo(width);
        });

        it('follows the value the user drags to', async () => {
          const { settle } = context();
          const width = input().offsetWidth;

          input().value = '75';
          input().dispatchEvent(new Event('input'));
          await settle();
          expect(fillWidth()).toBeCloseTo((width * 3) / 4);
        });
      }
    );

    it('follows a changed max on the next application check (Zone.js)', async () => {
      const { eager } = containerTestHosts({ ...hostOptions, containerAttributes: '[clrRangeHasProgress]="true"' });
      TestBed.configureTestingModule({ imports: [eager] });
      const fixture = TestBed.createComponent(eager);
      fixture.componentInstance.control.setValue(50);
      renderFixture(fixture);
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      const fill: HTMLElement = fixture.nativeElement.querySelector('.fill-input');
      expect(parseFloat(fill.style.width)).toBeCloseTo(input.offsetWidth / 2);

      input.max = '200';
      renderFixture(fixture);

      expect(parseFloat(fill.style.width)).toBeCloseTo(input.offsetWidth / 4);
      fixture.destroy();
    });
  });
});
