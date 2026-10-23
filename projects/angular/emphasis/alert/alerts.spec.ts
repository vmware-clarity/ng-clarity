/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, QueryList, Type, ViewChild, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrEmphasisModule } from '../emphasis.module';
import { ClrAlert } from './alert';
import { ClrAlerts } from './alerts';
import { MultiAlertService } from './providers/multi-alert.service';

describe('Alert Tests', () => {
  describe('ClrAlerts component', () => {
    let testContext: any;
    beforeEach(() => {
      testContext = {};
    });

    describe('Typescript API', () => {
      let component: ClrAlerts;
      let service: MultiAlertService;
      let queryList: QueryList<ClrAlert>;

      beforeEach(() => {
        service = new MultiAlertService();

        TestBed.configureTestingModule({ imports: [ClrEmphasisModule] });

        const alertFixture = TestBed.createComponent(ClrAlert);
        testContext.alert = alertFixture.componentInstance;

        const anotherAlertFixture = TestBed.createComponent(ClrAlert);
        testContext.anotherAlert = anotherAlertFixture.componentInstance;

        queryList = new QueryList<ClrAlert>();
        queryList.reset([testContext.alert, testContext.anotherAlert]);
        service.manage(queryList);
        component = new ClrAlerts(service);
      });

      it('knows the current alert', () => {
        expect(component.currentAlert).toEqual(testContext.alert);
      });
    });

    describe('Template API', () => {
      let fixture: ComponentFixture<any>;

      beforeEach(() => {
        testContext.create = <T>(componentType: Type<T>) => {
          TestBed.configureTestingModule({ imports: [ClrEmphasisModule], declarations: [componentType] });

          fixture = TestBed.createComponent(componentType);
          // fixture.detectChanges();
        };
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('offers two way binding on the alert index', () => {
        testContext.create(TestComponent);
        const testComponent = fixture.componentInstance;
        fixture.detectChanges();
        testComponent.currentAlertIndex = 0;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
        testComponent.alertsInstance.currentAlertIndex = 1;
        fixture.detectChanges();
        expect(testComponent.currentAlertIndex).toEqual(1);
      });

      it('allows changing alert index from 1 to 0', () => {
        testContext.create(TestComponent);
        const testComponent = fixture.componentInstance;
        fixture.detectChanges();
        testComponent.currentAlertIndex = 1;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(1);
        testComponent.currentAlertIndex = 0;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
      });

      it('does not allow invalid indexes (undefined, null, -1, 1.5, string)', () => {
        testContext.create(TestComponent);
        const testComponent = fixture.componentInstance;
        fixture.detectChanges();
        testComponent.currentAlertIndex = undefined;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
        testComponent.currentAlertIndex = null;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
        testComponent.currentAlertIndex = -1;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
        testComponent.currentAlertIndex = 1.5;
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
        testComponent.currentAlertIndex = 'string';
        fixture.detectChanges();
        expect(testComponent.alertsInstance.currentAlertIndex).toEqual(0);
      });

      it('offers two way binding on the alert instance', () => {
        testContext.create(TestAlertInstance);
        fixture.detectChanges();

        const clarityComponent = fixture.componentInstance.alertsInstance;
        const testComponent = fixture.componentInstance;

        expect(testComponent.alertInstances.length).toBe(2);
        expect(testComponent.alertInstances.first).toBeTruthy();
        expect(testComponent.alertInstances.last).toBeTruthy();

        testComponent.currentAlert = testComponent.alertInstances.first;
        fixture.detectChanges();
        expect(clarityComponent.currentAlert).toEqual(testComponent.currentAlert);

        clarityComponent.currentAlert = testComponent.alertInstances.last;
        fixture.detectChanges();
        expect(testComponent.currentAlert).toEqual(clarityComponent.currentAlert);
      });
    });

    describe('View basics', () => {
      let fixture: ComponentFixture<TestComponent>;
      let compiled: any;
      let alertElements: Array<Element>;

      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ClrEmphasisModule], declarations: [TestComponent] });

        fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();
        compiled = fixture.nativeElement;
        alertElements = compiled.querySelectorAll('clr-alert');
        expect(alertElements.length).toEqual(2);
      });

      afterEach(() => {
        fixture.destroy();
      });

      it('projects content based on clrCurrentAlertIndex', () => {
        expect(alertElements[0].textContent).toMatch(/This is the first alert/);
        expect(alertElements[0].classList).not.toContain('alert-hidden');
        expect(alertElements[1].classList).toContain('alert-hidden');

        fixture.componentInstance.currentAlertIndex = 1;
        fixture.detectChanges();

        expect(alertElements[1].textContent).toMatch(/This is the second alert/);
        expect(alertElements[1].classList).not.toContain('alert-hidden');
        expect(alertElements[0].classList).toContain('alert-hidden');
      });

      it('makes the previous alert active when the current alert is closed', () => {
        fixture.componentInstance.currentAlertIndex = 1;
        fixture.detectChanges();
        expect(alertElements[0].classList).toContain('alert-hidden');

        fixture.componentInstance.alertInstances.toArray()[1].close();
        fixture.detectChanges();
        expect(alertElements[0].classList).not.toContain('alert-hidden');
      });

      it('shows the pager only when there is more than one alert', () => {
        expect(compiled.querySelectorAll('clr-alerts-pager').length).toBe(1);
        fixture.componentInstance.alertInstances.toArray()[0].close();
        fixture.detectChanges();
        expect(compiled.querySelectorAll('clr-alerts-pager').length).toBe(0);
      });

      describe('sets classname as expected', () => {
        it('sets danger classname as expected', () => {
          const alertsContainer: Element = fixture.nativeElement.querySelector('.alerts');
          const myAlert: ClrAlert = fixture.componentInstance.alertsInstance.currentAlert;
          myAlert.alertType = 'danger';
          fixture.detectChanges();

          expect(alertsContainer.classList.contains('alert-danger')).toBe(true);
        });

        it('sets info classname as expected', () => {
          const alertsContainer: Element = fixture.nativeElement.querySelector('.alerts');
          const myAlert: ClrAlert = fixture.componentInstance.alertsInstance.currentAlert;
          myAlert.alertType = 'info';
          fixture.detectChanges();

          expect(alertsContainer.classList.contains('alert-info')).toBe(true);
        });

        it('sets success classname as expected', () => {
          const alertsContainer: Element = fixture.nativeElement.querySelector('.alerts');
          const myAlert: ClrAlert = fixture.componentInstance.alertsInstance.currentAlert;
          myAlert.alertType = 'success';
          fixture.detectChanges();

          expect(alertsContainer.classList.contains('alert-success')).toBe(true);
        });

        it('sets warning classname as expected', () => {
          const alertsContainer: Element = fixture.nativeElement.querySelector('.alerts');
          const myAlert: ClrAlert = fixture.componentInstance.alertsInstance.currentAlert;
          myAlert.alertType = 'warning';
          fixture.detectChanges();

          expect(alertsContainer.classList.contains('alert-warning')).toBe(true);
        });
        // no tests for unexpected/unrecognized values because the alert types service ignores them
        // and only changes an alert type when given a known value.
      });

      it('sets an aria label on the icon', () => {
        const myAlert: ClrAlert = fixture.componentInstance.alertsInstance.currentAlert;
        myAlert.alertType = 'warning';
        fixture.detectChanges();

        const icon: Element = fixture.nativeElement.querySelector('cds-icon[role="img"]');
        expect(icon.getAttribute('aria-label')).toEqual('Warning');
      });
    });

    describe('Supports dynamic alerts', () => {
      beforeEach(() => {
        TestBed.configureTestingModule({ imports: [ClrEmphasisModule], declarations: [DynamicAlerts] });

        testContext.fixture = TestBed.createComponent(DynamicAlerts);
        testContext.compiled = testContext.fixture.nativeElement;
        testContext.fixture.detectChanges();
      });

      it('contains dynamic alerts and set an initial index', () => {
        expect(testContext.fixture.componentInstance.alertsInstance.currentAlertIndex).toEqual(0);
        expect(testContext.fixture.componentInstance.alertInstances.length).toEqual(2);
      });
    });
  });

  describe('with an initially-closed alert', () => {
    @Component({
      template: `
        <clr-alerts>
          <clr-alert [clrAlertClosed]="true">
            <clr-alert-item>
              <span class="alert-text">This is the alert!</span>
            </clr-alert-item>
          </clr-alert>
        </clr-alerts>
      `,
      standalone: false,
    })
    class InitiallyClosedAlertTestComponent {}

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ClrEmphasisModule],
        declarations: [InitiallyClosedAlertTestComponent],
      });
    });

    it('does not throw an error', () => {
      const fixture = TestBed.createComponent(InitiallyClosedAlertTestComponent);
      fixture.detectChanges();

      // test will pass if no error is thrown
    });
  });
});

@Component({
  template: `
    <clr-alerts [(clrCurrentAlertIndex)]="currentAlertIndex">
      <clr-alert
        [clrAlertType]="'alert-danger'"
        [clrAlertClosable]="true"
        [clrAlertClosed]="false"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text">This is the first alert!</span>
        </clr-alert-item>
      </clr-alert>
      <clr-alert
        [clrAlertType]="'alert-danger'"
        [clrAlertClosable]="true"
        [clrAlertClosed]="false"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text">This is the second alert!</span>
        </clr-alert-item>
      </clr-alert>
    </clr-alerts>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild(ClrAlerts) alertsInstance: ClrAlerts;
  @ViewChildren(ClrAlert) alertInstances: QueryList<ClrAlert>;

  currentAlertIndex = 0;
}

@Component({
  template: `
    <clr-alerts [(clrCurrentAlert)]="currentAlert">
      <clr-alert
        [clrAlertType]="'alert-danger'"
        [clrAlertClosable]="true"
        [clrAlertClosed]="false"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text">This is the first alert!</span>
        </clr-alert-item>
      </clr-alert>
      <clr-alert
        [clrAlertType]="'alert-danger'"
        [clrAlertClosable]="true"
        [clrAlertClosed]="false"
        [clrAlertAppLevel]="true"
      >
        <clr-alert-item>
          <span class="alert-text">This is the second alert!</span>
        </clr-alert-item>
      </clr-alert>
    </clr-alerts>
  `,
  standalone: false,
})
class TestAlertInstance {
  @ViewChild(ClrAlerts) alertsInstance: ClrAlerts;
  @ViewChildren(ClrAlert) alertInstances: QueryList<ClrAlert>;

  currentAlert: ClrAlert;
}

@Component({
  template: `
    <clr-alerts>
      @for (alert of dynamicAlerts; track alert.type) {
        <clr-alert [clrAlertType]="alert.type" [clrAlertAppLevel]="alert.isAppLevel">
          <div class="alert-item">
            <span class="alert-text">
              {{ alert.text }}
            </span>
          </div>
        </clr-alert>
      }
    </clr-alerts>
  `,
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false,
})
class DynamicAlerts {
  @ViewChild(ClrAlerts) alertsInstance: ClrAlerts;
  @ViewChildren(ClrAlert) alertInstances: QueryList<ClrAlert>;

  dynamicAlerts: Array<any>;

  ngOnInit() {
    this.dynamicAlerts = [
      { type: 'info', text: "I'm an informational", isAppLevel: true },
      { type: 'danger', text: 'Watch out!', isAppLevel: false },
    ];
  }
}
