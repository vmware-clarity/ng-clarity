/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrCommonFormsModule, LayoutService, NgControlService } from '@clr/angular/forms/common';
import { ClrIcon } from '@clr/angular/icon';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrRadio } from './radio';
import { ClrRadioContainer } from './radio-container';
import { ClrRadioWrapper } from './radio-wrapper';
import { ClrRadioModule } from './radio.module';
import { ContainerNoLabelSpec, ReactiveSpec, TemplateDrivenSpec } from '../tests/container';
import {
  ContainerChangeDetectionSpec,
  ContainerTestHostOptions,
  containerTestHosts,
  eachContainerHost,
} from '../tests/onpush-container';

@Component({
  template: `
    <clr-radio-container>
      <clr-control-helper>Helper text</clr-control-helper>
    </clr-radio-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoLabelTest {}

@Component({
  template: `
    <clr-radio-container [clrInline]="inline">
      <label>Hello World</label>
      <clr-radio-wrapper>
        <label>Two</label>
        <input type="radio" clrRadio name="model" required [(ngModel)]="model" value="two" [disabled]="disabled" />
      </clr-radio-wrapper>
      <clr-control-error>There was an error</clr-control-error>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-success>Valid</clr-control-success>
    </clr-radio-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TemplateDrivenTest {
  inline = false;
  disabled = false;
  model = '';
}

@Component({
  template: `
    <clr-radio-container>
      <label [id]="labelId">My Group</label>
      <clr-radio-wrapper>
        <label>Option</label>
        <input type="radio" clrRadio name="opt" [(ngModel)]="model" value="opt" />
      </clr-radio-wrapper>
    </clr-radio-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class AriaLabelledByTest {
  model = '';
  labelId: string = null;
}

@Component({
  template: `
    <clr-radio-container>
      <label>My Group</label>
    </clr-radio-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class AriaLabelledByNoRadiosTest {}

@Component({
  template: `
    <form [formGroup]="form">
      <clr-radio-container>
        <label>Hello World</label>
        <clr-radio-wrapper>
          <label>One</label>
          <input clrRadio type="radio" formControlName="model" value="one" />
        </clr-radio-wrapper>
        <clr-radio-wrapper>
          <label>Two</label>
          <input clrRadio type="radio" formControlName="model" value="two" />
        </clr-radio-wrapper>
        <clr-control-error>There was an error</clr-control-error>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-success>Valid</clr-control-success>
      </clr-radio-container>
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
  wrapperLabel: true,
  imports: [ClrRadioModule],
  container: 'clr-radio-container',
  controlMarkup:
    '<clr-radio-wrapper><input type="radio" clrRadio value="one" [formControl]="control" /><label>One</label></clr-radio-wrapper>',
  initialValue: null,
  validValue: 'one',
  validator: Validators.required,
};

describe('Radio component', () => {
  describe('ClrRadioContainer', () => {
    ContainerNoLabelSpec(ClrRadioContainer, [ClrRadio, ClrRadioWrapper], NoLabelTest);
    TemplateDrivenSpec(
      ClrRadioContainer,
      [ClrRadio, ClrRadioWrapper],
      TemplateDrivenTest,
      '.clr-radio-wrapper [clrRadio]'
    );
    ReactiveSpec(ClrRadioContainer, [ClrRadio, ClrRadioWrapper], ReactiveTest, '.clr-radio-wrapper [clrRadio]');

    describe('aria-labelledby', () => {
      function createFixture<T>(testComponent: Type<T>) {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
          declarations: [ClrRadioContainer, ClrRadioWrapper, ClrRadio, testComponent],
          providers: [NgControlService, LayoutService],
        });
        const fixture = TestBed.createComponent(testComponent);
        const containerEl = fixture.debugElement.query(By.directive(ClrRadioContainer)).nativeElement;
        return { fixture, containerEl };
      }

      it('sets aria-labelledby on the host pointing to a generated label id', () => {
        const { fixture, containerEl } = createFixture(AriaLabelledByTest);
        renderFixture(fixture);
        const label = containerEl.querySelector('label');
        expect(label.id).toBeTruthy();
        expect(containerEl.getAttribute('aria-labelledby')).toBe(label.id);
      });

      it('preserves an existing label id instead of overwriting it', () => {
        const { fixture, containerEl } = createFixture(AriaLabelledByTest);
        fixture.componentInstance.labelId = 'my-label';
        renderFixture(fixture);
        expect(containerEl.getAttribute('aria-labelledby')).toBe('my-label');
      });

      it('does not set aria-labelledby when there are no radios', () => {
        const { fixture, containerEl } = createFixture(AriaLabelledByNoRadiosTest);
        renderFixture(fixture);
        expect(containerEl.getAttribute('aria-labelledby')).toBeNull();
      });

      it('does not throw and leaves aria-labelledby unset when there is no label', () => {
        const { fixture, containerEl } = createFixture(NoLabelTest);
        expect(() => renderFixture(fixture)).not.toThrow();
        expect(containerEl.getAttribute('aria-labelledby')).toBeNull();
      });
    });

    describe('inline buttons', () => {
      let fixture: ComponentFixture<TemplateDrivenTest>;
      let containerDE: DebugElement;
      let containerEl: HTMLElement;

      beforeEach(() => {
        TestBed.configureTestingModule({
          imports: [ClrIcon, ClrCommonFormsModule, FormsModule],
          declarations: [ClrRadioContainer, ClrRadioWrapper, ClrRadio, TemplateDrivenTest],
          providers: [NgControlService, LayoutService],
        });
        fixture = TestBed.createComponent(TemplateDrivenTest);

        containerDE = fixture.debugElement.query(By.directive(ClrRadioContainer));
        containerEl = containerDE.nativeElement;
        renderFixture(fixture);
      });

      it('sets the inline class', () => {
        expect(containerEl.querySelector('.clr-control-container').className).not.toContain('clr-control-inline');
        fixture.debugElement.componentInstance.inline = true;
        renderFixture(fixture);
        expect(containerEl.querySelector('.clr-control-container').className).toContain('clr-control-inline');
      });
    });
  });

  ContainerChangeDetectionSpec(hostOptions);

  describe('clr-radio-wrapper in a container', () => {
    eachContainerHost(hostOptions.container, containerTestHosts(hostOptions), context => {
      it('renders the wrapper and groups the control under the container label', () => {
        const { containerEl } = context();
        const label = containerEl.querySelector(':scope > label');

        expect(containerEl.querySelector('clr-radio-wrapper').classList).toContain('clr-radio-wrapper');
        expect(containerEl.getAttribute('aria-labelledby')).toBe(label.id);
      });
    });
  });
});
