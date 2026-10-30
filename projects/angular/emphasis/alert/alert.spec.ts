/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrAlert } from './alert';
import { ClrAlertModule } from './alert.module';

const CLOSE_ARIA_LABEL = 'Close Test Alert';

@Component({
  template: `
    <clr-alert
      [clrAlertType]="type"
      [clrAlertSizeSmall]="isSmall"
      [clrAlertClosable]="isClosable"
      [clrAlertLightweight]="isLightweight"
      [(clrAlertClosed)]="closed"
      [clrAlertAppLevel]="isAppLevel"
      [clrCloseButtonAriaLabel]="closeAriaLabel"
    >
      <div class="alert-item">
        <span class="alert-text">{{ alertMsg }}</span>
      </div>
    </clr-alert>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrAlert) alertInstance: ClrAlert;

  type = '';
  isSmall = false;
  isClosable = false;
  isLightweight = false;
  closed = false;
  isAppLevel = false;
  closeAriaLabel: string = CLOSE_ARIA_LABEL;

  alertMsg = 'This is an alert!';
}

describe('Alert Tests', () => {
  describe('Alert', () => {
    let fixture: ComponentFixture<any>;
    let compiled: any;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrAlertModule], declarations: [TestComponent] });

      fixture = TestBed.createComponent(TestComponent);
      renderFixture(fixture);
      compiled = fixture.nativeElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('projects content', () => {
      const newAlertMsg = 'OHAI';
      expect(compiled.textContent).toMatch(/This is an alert!/);
      fixture.componentInstance.alertMsg = newAlertMsg;
      renderFixture(fixture);
      expect(compiled.textContent).toContain(newAlertMsg);
    });

    it('Extends the alert-sm class when clrAlertSizeSmall is set to true', () => {
      expect(compiled.querySelector('.alert-sm')).toBeNull();
      fixture.componentInstance.isSmall = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert-sm')).not.toBeNull();
    });

    it('supports a clrAlertClosable option', () => {
      fixture.componentInstance.isClosable = false;
      renderFixture(fixture);
      expect(compiled.querySelector('.close')).toBeNull();
      fixture.componentInstance.isClosable = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.close')).not.toBeNull();
    });

    it('extends the alert type classes when clrAlertType is set', () => {
      // default info class
      expect(compiled.querySelector('.alert-info')).not.toBeNull();

      // set danger
      fixture.componentInstance.type = 'danger';
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-info')).toBeNull();
      expect(compiled.querySelector('.alert-danger')).not.toBeNull();

      // set warning
      fixture.componentInstance.type = 'warning';
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-danger')).toBeNull();
      expect(compiled.querySelector('.alert-warning')).not.toBeNull();

      // set success
      fixture.componentInstance.type = 'success';
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-warning')).toBeNull();
      expect(compiled.querySelector('.alert-success')).not.toBeNull();

      // set neutral
      fixture.componentInstance.type = 'neutral';
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-success')).toBeNull();
      expect(compiled.querySelector('.alert-neutral')).not.toBeNull();
    });

    it('loading and unknown types with regular and lightweight alerts', () => {
      // default info class
      expect(compiled.querySelector('.alert-info')).not.toBeNull();

      // set lightweight loading
      fixture.componentInstance.type = 'loading';
      fixture.componentInstance.isLightweight = true;
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-info')).toBeNull();
      expect(compiled.querySelector('.alert-neutral')).not.toBeNull();
      expect(compiled.querySelector('.alert-lightweight')).not.toBeNull();

      // set lightweight unknown
      fixture.componentInstance.type = 'unknown';
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-neutral')).not.toBeNull();
      expect(compiled.querySelector('.alert-lightweight')).not.toBeNull();

      // remove lightweight and leave only unknown -> should not behave like regular info
      fixture.componentInstance.isLightweight = false;
      renderFixture(fixture);

      expect(compiled.querySelector('.alert-neutral')).not.toBeNull();
      expect(compiled.querySelector('.alert-lightweight')).toBeNull();
      expect(compiled.querySelector('.alert-info')).toBeNull();
    });

    it('Removes the alert from the DOM when closed', () => {
      const instance: ClrAlert = fixture.componentInstance.alertInstance;

      expect(compiled.querySelector('.alert')).not.toBeNull();
      fixture.componentInstance.isClosable = true;
      renderFixture(fixture);

      instance.close();
      renderFixture(fixture);
      expect(compiled.querySelector('.alert')).toBeNull();
    });

    it('should be able to set close button text', () => {
      fixture.componentInstance.isClosable = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.close').getAttribute('aria-label')).toBe(CLOSE_ARIA_LABEL);
    });

    it('shows and hides the alert based on the clrAlertClosed input', () => {
      fixture.componentInstance.isClosable = true;
      expect(compiled.querySelector('.alert')).not.toBeNull();
      fixture.componentInstance.closed = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert')).toBeNull();
      fixture.componentInstance.closed = false;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert')).not.toBeNull();
    });

    it('supports a clrAlertAppLevel option', () => {
      fixture.componentInstance.isAppLevel = false;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert-app-level')).toBeNull();

      fixture.componentInstance.isAppLevel = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert-app-level')).not.toBeNull();
    });

    it('supports a clrAlertLightweight option', () => {
      fixture.componentInstance.isLightweight = false;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert-lightweight')).toBeNull();

      fixture.componentInstance.isLightweight = true;
      renderFixture(fixture);
      expect(compiled.querySelector('.alert-lightweight')).not.toBeNull();
    });
  });
});
