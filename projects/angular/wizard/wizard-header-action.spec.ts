/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrWizardHeaderAction } from './wizard-header-action';
import { ClrWizardModule } from './wizard.module';

@Component({
  template: `
    <clr-wizard-header-action #unset></clr-wizard-header-action>
    <clr-wizard-header-action #disabled [clrWizardHeaderActionDisabled]="true"></clr-wizard-header-action>
    <clr-wizard-header-action #identified [id]="myId" title="I have a title"></clr-wizard-header-action>
    <clr-wizard-header-action #projected [id]="'projection'" [clrWizardHeaderActionDisabled]="disableMe">
      {{ projector }}
    </clr-wizard-header-action>
    <clr-wizard-header-action
      #clicker
      id="gotklikz"
      [title]="titleToUpdate"
      (actionClicked)="click($event)"
    ></clr-wizard-header-action>
  `,
  standalone: false,
})
class TestComponent {
  @ViewChild('unset', { static: true }) plainDefaultHA: ClrWizardHeaderAction;
  @ViewChild('disabled', { static: true }) disabledHA: ClrWizardHeaderAction;
  @ViewChild('identified', { static: true }) idHA: ClrWizardHeaderAction;
  @ViewChild('projected', { static: true }) projectedHA: ClrWizardHeaderAction;
  @ViewChild('clicker', { static: true }) clickedHA: ClrWizardHeaderAction;

  projector = 'montana';
  myId = 'ohai';
  disableMe = false;
  titleToUpdate = 'title to update';

  private _lastClickedHeaderAction = '';

  get lastClickedHeaderAction(): string {
    return this._lastClickedHeaderAction;
  }

  click(clickedActionId: string) {
    this._lastClickedHeaderAction = clickedActionId;
  }
}

describe('New Wizard Tests', () => {
  describe('New Wizard Header Action', () => {
    let fixture: ComponentFixture<any>;
    let testComponent: TestComponent;
    let debugEl: DebugElement;

    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [ClrWizardModule], declarations: [TestComponent] });
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      debugEl = fixture.debugElement;
    });

    afterEach(() => {
      fixture.destroy();
    });

    describe('Typescript API', () => {
      describe('id', () => {
        it('should return an indexed id if none is specified', () => {
          const haToTest = testComponent.plainDefaultHA;
          // placement here
          //
          // is important b/c the index updates at a
          // global level to avoid id conflicts...
          expect(haToTest.id).toContain('clr-wizard-header-action-');
        });

        it('should return expected id', () => {
          const haToTest = testComponent.idHA;
          expect(haToTest.id, 'id reflects input that is set').toBe('clr-wizard-header-action-ohai');
          haToTest._id = 'onoez';
          fixture.detectChanges();
          expect(haToTest.id, 'id honors internal changes to id').toBe('clr-wizard-header-action-onoez');
        });
      });

      describe('click', () => {
        let onClickSpy: any;
        let clicker: ClrWizardHeaderAction;

        beforeEach(() => {
          clicker = testComponent.clickedHA;
          onClickSpy = vi.spyOn(clicker.headerActionClicked, 'emit').mockImplementation(() => undefined);
        });

        it('should emit event', () => {
          clicker.click();
          expect(onClickSpy).toHaveBeenCalled();
        });

        it('should not emit event if disabled', () => {
          clicker.disabled = true;
          fixture.detectChanges();
          clicker.click();
          expect(onClickSpy).not.toHaveBeenCalled();
        });
      });
    });

    // Inputs, Outputs, and initialization of component based on content-children
    describe('Template API', () => {
      describe('title', () => {
        it('should be blank by default', () => {
          expect(testComponent.plainDefaultHA.title).toBe('');
        });

        it('should be settable', () => {
          expect(testComponent.idHA.title).toBe('I have a title');
        });

        it('should be able to change via host component', () => {
          const myHA = testComponent.clickedHA;
          expect(myHA.title, 'should init with expected value').toBe('title to update');
          testComponent.titleToUpdate = 'updated title';
          fixture.detectChanges();
          expect(myHA.title, 'should update as expected').toBe('updated title');
        });
      });

      describe('id', () => {
        let haToTest: ClrWizardHeaderAction;
        const haToTestDefaultId = 'clr-wizard-header-action-ohai';

        beforeEach(() => {
          haToTest = testComponent.idHA;
        });

        it('should pass id input to id getter', () => {
          expect(haToTest.id).toBe(haToTestDefaultId);
        });

        it('should update id input as expected', () => {
          testComponent.myId = 'update';
          fixture.detectChanges();
          expect(haToTest.id).toBe('clr-wizard-header-action-update');
        });

        it('should be able to handle a component without an id defined', () => {
          const unsetHA = testComponent.plainDefaultHA;
          expect(unsetHA.id, 'id exists on unset header action').toBeTruthy();
          expect(unsetHA.id, 'id should have ' + 'format of header action id').toContain('clr-wizard-header-action-');
          testComponent.myId = null;
          fixture.detectChanges();
          expect(haToTest.id, 'nulling id should change id').not.toBe(haToTestDefaultId);
          expect(unsetHA.id, 'id exists on null id header action').toBeTruthy();
          expect(unsetHA.id, 'new id ' + ' on null id should have format of header action id').toContain(
            'clr-wizard-header-action-'
          );
          expect(unsetHA.id, 'new id ' + ' on null id should not contain null keyword in the id').not.toContain(
            '-null'
          );
        });
      });

      describe('disabled', () => {
        it('should default to enabled', () => {
          expect(testComponent.plainDefaultHA.disabled).toBe(false);
        });

        it('should be disabled if set via input', () => {
          expect(testComponent.disabledHA.disabled).toBe(true);
        });

        it('should be able to be enabled/disabled via input', () => {
          const testMe = testComponent.projectedHA;
          expect(testMe.disabled, 'disabled input is initted to false').toBe(false);
          testComponent.disableMe = true;
          fixture.detectChanges();
          expect(testMe.disabled, 'disabled input has been changed to true').toBe(true);
        });
      });

      describe('actionClicked', () => {
        it('should emit event as expected on click', () => {
          testComponent.clickedHA.click();
          expect(testComponent.lastClickedHeaderAction).toBe('gotklikz');
        });

        it('should not emit event when disabled', () => {
          testComponent.clickedHA.disabled = true;
          fixture.detectChanges();
          testComponent.clickedHA.click();
          expect(testComponent.lastClickedHeaderAction).toBe('');
        });
      });

      describe('content', () => {
        let lookupEl: HTMLElement;
        let projectedEl: Element;

        beforeEach(() => {
          lookupEl = debugEl.nativeElement;
          projectedEl = lookupEl.querySelector('#clr-wizard-header-action-projection');
        });

        it('projects as expected', () => {
          expect(projectedEl.textContent.trim()).toBe(testComponent.projector);
        });

        it('should update projected content as expected', () => {
          const newContent = 'rice';
          expect(projectedEl.textContent.trim(), 'verify that projected content is initted properly').toBe(
            testComponent.projector
          );
          testComponent.projector = newContent;
          fixture.detectChanges();
          expect(projectedEl.textContent.trim(), 'verify that projected content is updated properly').toBe(newContent);
        });
      });
    });

    describe('View and Behavior', () => {
      describe('id', () => {
        it('should have id', () => {
          const idToCheck = 'clr-wizard-header-action-' + testComponent.myId;
          const lookupEl = debugEl.nativeElement;
          const allHAs = lookupEl.querySelectorAll('.clr-wizard-header-action');
          let myIdWasFound = false;

          for (const ha of allHAs) {
            if (idToCheck === ha.id) {
              myIdWasFound = true;
              break;
            }
          }
          expect(myIdWasFound).toBe(true);
        });
      });

      describe('disabled', () => {
        it('should have .disabled class if set to be disabled', () => {
          testComponent.disableMe = true;
          fixture.detectChanges();
          expect(testComponent.projectedHA.disabled, 'verify component disabled as expected').toBe(true);
          const testMe = debugEl.nativeElement.querySelector('#clr-wizard-header-action-projection');
          expect(testMe.classList.contains('disabled'), 'disabled header action has .disabled').toBe(true);
        });
      });

      describe('title', () => {
        it('should be empty string by default', () => {
          expect(testComponent.projectedHA.title, 'verify inits as empty string').toBe('');
          const testMe = debugEl.nativeElement.querySelector('#clr-wizard-header-action-projection');
          expect(testMe.getAttribute('title'), 'verify DOM title is also an empty string').toBe('');
        });

        it('should be settable', () => {
          expect(testComponent.idHA.title, 'verify title is set').toBe('I have a title');
          const testMe = debugEl.nativeElement.querySelector('#clr-wizard-header-action-ohai');
          expect(testMe.getAttribute('title'), 'verify DOM title is also set').toBe('I have a title');
        });

        it('should update', () => {
          expect(testComponent.clickedHA.title, 'verify title is set').toBe('title to update');
          const testMe = debugEl.nativeElement.querySelector('#clr-wizard-header-action-gotklikz');
          expect(testMe.getAttribute('title'), 'verify DOM title updated').toBe('title to update');
          testComponent.titleToUpdate = 'updated title';
          fixture.detectChanges();
          expect(testMe.getAttribute('title'), 'verify DOM title updated').toBe('updated title');
        });
      });
    });
  });
});
