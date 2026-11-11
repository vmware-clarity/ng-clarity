/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrInput, ClrInputContainer } from '@clr/angular/forms/input';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSignpostModule, ClrSignpostTrigger } from '@clr/angular/popover/signpost';
import { expectActiveElementToBe } from '@clr/angular/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrControlLabel } from './label';
import { ControlIdService } from './providers/control-id.service';
import { ClrFormLayout, LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Component({
  template: `<label></label>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class NoForTest {}

@Component({
  template: `<label [for]="forValue"></label>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExplicitForTest {
  forValue = 'hello';
}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [ControlIdService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ContainerizedTest {
  @ViewChild(ClrControlLabel, { static: true }) label;
}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [NgControlService],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class WrapperTest {}

@Component({
  template: `<label for="hello" class="clr-col-12 clr-col-md-3"></label>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExistingGridTest {}

@Component({
  template: `
    <label>
      <clr-signpost>
        <cds-icon id="signpost-trigger" shape="info-standard" clrSignpostTrigger>Trigger</cds-icon>
        <clr-signpost-content *clrIfOpen>Signpost content</clr-signpost-content>
      </clr-signpost>
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class SignpostTest {
  @ViewChild(ClrSignpostTrigger) signpostTrigger: ClrSignpostTrigger;
}

@Component({
  template: `
    <label>
      Test
      <input type="text" />
    </label>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class DefaultClickBehaviorTest {}

@Component({
  template: `<label id="explicit-label"></label>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExplicitIdTest {}

@Component({
  template: `
    <clr-input-container>
      <label>Label</label>
      <input clrInput />
    </clr-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ControlIdTest {}

@Component({
  template: `
    <clr-input-container>
      <label>Label</label>
      <input id="explicit-control" clrInput />
    </clr-input-container>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class ExplicitControlIdTest {}

describe('Forms common utilities', () => {
  describe('ClrControlLabel', () => {
    it("doesn't crash if it is not used in an Angular form", function () {
      TestBed.configureTestingModule({ declarations: [ClrControlLabel, NoForTest] });
      expect(() => {
        const fixture = TestBed.createComponent(NoForTest);
        renderFixture(fixture);
      }).not.toThrow();
    });

    it("doesn't set the the class unless its inside of a container", function () {
      TestBed.configureTestingModule({ declarations: [ClrControlLabel, NoForTest] });
      const fixture = TestBed.createComponent(NoForTest);
      renderFixture(fixture);
      expect(fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')).toBe(
        false
      );
    });

    it('does set the the class when its inside of a container', function () {
      TestBed.configureTestingModule({
        imports: [ClrIcon],
        declarations: [ClrControlLabel, ContainerizedTest],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      renderFixture(fixture);
      expect(fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')).toBe(
        true
      );
    });

    it('does set the class when its inside of a wrapper', function () {
      TestBed.configureTestingModule({
        imports: [ClrIcon],
        declarations: [ClrControlLabel, WrapperTest],
      });
      const fixture = TestBed.createComponent(WrapperTest);
      renderFixture(fixture);
      expect(fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')).toBe(
        true
      );
    });

    it('sets the for attribute to the id given by the service', function () {
      TestBed.configureTestingModule({ declarations: [ClrControlLabel, NoForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(NoForTest);
      renderFixture(fixture);
      const controlIdService = fixture.debugElement.injector.get(ControlIdService);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe(controlIdService.id);
      controlIdService.id = 'test';
      renderFixture(fixture);
      expect(label.getAttribute('for')).toBe('test');
    });

    it('adds the grid classes for non-vertical layouts', function () {
      TestBed.configureTestingModule({
        imports: [ClrIcon],
        declarations: [ClrControlLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-2')).toBe(true);
      expect(label.classList.contains('clr-col-12')).toBe(true);
    });

    it('adds the grid classes for non-vertical non-default layouts', function () {
      TestBed.configureTestingModule({
        imports: [ClrIcon],
        declarations: [ClrControlLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      layoutService.labelSize = 3;
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-3')).toBe(true);
      expect(label.classList.contains('clr-col-12')).toBe(true);
    });

    it('disables adding the grid classes when manually disabled', function () {
      TestBed.configureTestingModule({
        imports: [ClrIcon],
        declarations: [ClrControlLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      fixture.componentInstance.label.disableGrid();
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-2')).toBe(false);
      expect(label.classList.contains('clr-col-12')).toBe(false);
    });

    it('leaves the grid classes untouched if they exist', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, ExistingGridTest],
        providers: [ControlIdService],
      });
      const fixture = TestBed.createComponent(ExistingGridTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.className).not.toContain('clr-col-md-2');
      expect(label.className).toContain('clr-col-md-3');
    });

    it('leaves the for attribute untouched if it exists', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, ExplicitForTest],
        providers: [ControlIdService],
      });
      const fixture = TestBed.createComponent(ExplicitForTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe('hello');
    });

    it('provides a host binding on the for attribute', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, ExplicitForTest],
        providers: [ControlIdService],
      });
      const fixture = TestBed.createComponent(ExplicitForTest);
      renderFixture(fixture);
      fixture.componentInstance.forValue = 'updatedFor';
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe('updatedFor');
    });

    it('leaves the id attribute untouched if it exists (with control id service)', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, ExplicitIdTest],
        providers: [ControlIdService],
      });
      const fixture = TestBed.createComponent(ExplicitIdTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe('explicit-label');
    });

    it('leaves the id attribute untouched if it exists (without control id service)', function () {
      TestBed.configureTestingModule({ declarations: [ClrControlLabel, ExplicitIdTest] });
      const fixture = TestBed.createComponent(ExplicitIdTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe('explicit-label');
    });

    it('uses the control id when present', function () {
      TestBed.configureTestingModule({ declarations: [ClrControlLabel, ClrInputContainer, ClrInput, ControlIdTest] });
      const fixture = TestBed.createComponent(ControlIdTest);
      renderFixture(fixture);
      const input = fixture.nativeElement.querySelector('input');
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe(`${input.id}-label`);
    });

    it('uses an explicit control id when present', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, ClrInputContainer, ClrInput, ExplicitControlIdTest],
      });
      const fixture = TestBed.createComponent(ExplicitControlIdTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.id).toBe('explicit-control-label');
      expect(label.getAttribute('for')).toBe('explicit-control');
    });

    it('signposts work inside labels', function () {
      TestBed.configureTestingModule({
        imports: [ClrSignpostModule, ClrIcon],
        declarations: [ClrControlLabel, SignpostTest],
      });
      const fixture = TestBed.createComponent(SignpostTest);
      renderFixture(fixture);
      const signpostTrigger = fixture.nativeElement.querySelector('#signpost-trigger');
      signpostTrigger.click();
      renderFixture(fixture);
      expect(fixture.componentInstance.signpostTrigger.isOpen).toBe(true);
    });

    it('focus input on label click', function () {
      TestBed.configureTestingModule({
        declarations: [ClrControlLabel, DefaultClickBehaviorTest],
      });
      const fixture = TestBed.createComponent(DefaultClickBehaviorTest);
      renderFixture(fixture);
      const label = fixture.nativeElement.querySelector('label');
      label.click();
      renderFixture(fixture);
      const input = fixture.nativeElement.querySelector('input');
      expectActiveElementToBe(input);
    });
  });
});
