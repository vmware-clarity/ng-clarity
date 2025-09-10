/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ClrLabel } from './label';
import { ClrIconModule } from '../../icon/icon.module';
import { ClrSignpostModule, ClrSignpostTrigger } from '../../popover';
import { expectActiveElementToBe } from '../../utils/testing/helpers.spec';
import { ClrInput } from '../input/input';
import { ClrInputContainer } from '../input/input-container';
import { ControlIdService } from './providers/control-id.service';
import { ClrFormLayout, LayoutService } from './providers/layout.service';
import { NgControlService } from './providers/ng-control.service';

@Component({
  template: `<label></label>`,
  standalone: false,
})
class NoForTest {}

@Component({
  template: `<label [for]="forValue"></label>`,
  standalone: false,
})
class ExplicitForTest {
  forValue = 'hello';
}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [ControlIdService],
  standalone: false,
})
class ContainerizedTest {
  @ViewChild(ClrLabel, { static: true }) label;
}

@Component({
  template: `<div><label for="hello"></label></div>`,
  providers: [NgControlService],
  standalone: false,
})
class WrapperTest {}

@Component({
  template: `<label for="hello" class="clr-col-12 clr-col-md-3"></label>`,
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
  standalone: false,
})
class DefaultClickBehaviorTest {}

@Component({
  template: `<label id="explicit-label"></label>`,
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
  standalone: false,
})
class ExplicitControlIdTest {}

export default function (): void {
  describe('ClrLabel', () => {
    it("doesn't crash if it is not used in an Angular form", function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, NoForTest] });
      expect(() => {
        const fixture = TestBed.createComponent(NoForTest);
        fixture.detectChanges();
      }).not.toThrow();
    });

    it("doesn't set the the class unless its inside of a container", function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, NoForTest] });
      const fixture = TestBed.createComponent(NoForTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeFalse();
    });

    it('does set the the class when its inside of a container', function () {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [ClrLabel, ContainerizedTest],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeTrue();
    });

    it('does set the class when its inside of a wrapper', function () {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [ClrLabel, WrapperTest],
      });
      const fixture = TestBed.createComponent(WrapperTest);
      fixture.detectChanges();
      expect(
        fixture.debugElement.query(By.css('label')).nativeElement.classList.contains('clr-control-label')
      ).toBeTrue();
    });

    it('sets the for attribute to the id given by the service', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, NoForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(NoForTest);
      fixture.detectChanges();
      const controlIdService = fixture.debugElement.injector.get(ControlIdService);
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe(controlIdService.id);
      controlIdService.id = 'test';
      fixture.detectChanges();
      expect(label.getAttribute('for')).toBe('test');
    });

    it('adds the grid classes for non-vertical layouts', function () {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [ClrLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-2')).toBeTrue();
      expect(label.classList.contains('clr-col-12')).toBeTrue();
    });

    it('adds the grid classes for non-vertical non-default layouts', function () {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [ClrLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      layoutService.labelSize = 3;
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-3')).toBeTrue();
      expect(label.classList.contains('clr-col-12')).toBeTrue();
    });

    it('disables adding the grid classes when manually disabled', function () {
      TestBed.configureTestingModule({
        imports: [ClrIconModule],
        declarations: [ClrLabel, ClrInputContainer, ContainerizedTest],
        providers: [LayoutService],
      });
      const fixture = TestBed.createComponent(ContainerizedTest);
      const layoutService = fixture.debugElement.injector.get(LayoutService);
      layoutService.layout = ClrFormLayout.HORIZONTAL;
      fixture.componentInstance.label.disableGrid();
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.classList.contains('clr-col-md-2')).toBeFalse();
      expect(label.classList.contains('clr-col-12')).toBeFalse();
    });

    it('leaves the grid classes untouched if they exist', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ExistingGridTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExistingGridTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.className).not.toContain('clr-col-md-2');
      expect(label.className).toContain('clr-col-md-3');
    });

    it('leaves the for attribute untouched if it exists', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ExplicitForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExplicitForTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe('hello');
    });

    it('provides a host binding on the for attribute', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ExplicitForTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExplicitForTest);
      fixture.detectChanges();
      fixture.componentInstance.forValue = 'updatedFor';
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('for')).toBe('updatedFor');
    });

    it('leaves the id attribute untouched if it exists (with control id service)', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ExplicitIdTest], providers: [ControlIdService] });
      const fixture = TestBed.createComponent(ExplicitIdTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe('explicit-label');
    });

    it('leaves the id attribute untouched if it exists (without control id service)', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ExplicitIdTest] });
      const fixture = TestBed.createComponent(ExplicitIdTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe('explicit-label');
    });

    it('uses the control id when present', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ClrInputContainer, ClrInput, ControlIdTest] });
      const fixture = TestBed.createComponent(ControlIdTest);
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      const label = fixture.nativeElement.querySelector('label');
      expect(label.getAttribute('id')).toBe(`${input.id}-label`);
    });

    it('uses an explicit control id when present', function () {
      TestBed.configureTestingModule({ declarations: [ClrLabel, ClrInputContainer, ClrInput, ExplicitControlIdTest] });
      const fixture = TestBed.createComponent(ExplicitControlIdTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      expect(label.id).toBe('explicit-control-label');
      expect(label.getAttribute('for')).toBe('explicit-control');
    });

    it('signposts work inside labels', function () {
      TestBed.configureTestingModule({
        imports: [ClrSignpostModule, ClrIconModule],
        declarations: [ClrLabel, SignpostTest],
      });
      const fixture = TestBed.createComponent(SignpostTest);
      fixture.detectChanges();
      const signpostTrigger = fixture.nativeElement.querySelector('#signpost-trigger');
      signpostTrigger.click();
      fixture.detectChanges();
      expect(fixture.componentInstance.signpostTrigger.isOpen).toBe(true);
    });

    it('focus input on label click', function () {
      TestBed.configureTestingModule({
        declarations: [ClrLabel, DefaultClickBehaviorTest],
      });
      const fixture = TestBed.createComponent(DefaultClickBehaviorTest);
      fixture.detectChanges();
      const label = fixture.nativeElement.querySelector('label');
      label.click();
      fixture.detectChanges();
      const input = fixture.nativeElement.querySelector('input');
      expectActiveElementToBe(input);
    });
  });
}
