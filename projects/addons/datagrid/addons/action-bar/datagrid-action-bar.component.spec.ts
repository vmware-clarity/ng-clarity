/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, DebugElement, EventEmitter, HostBinding } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { ElementResizeService } from '@clr/addons/a11y';
import { ClrDropdownModule, ClrIconModule, ClrTooltipModule } from '@clr/angular';
import { Observable, of, Subject } from 'rxjs';

import { DatagridActionBarComponent } from './datagrid-action-bar.component';
import { AppfxDatagridModule } from '../../datagrid.module';
import { ActionDefinition } from '../../shared/action/action-definition';

const last = (array: any[]) => array[array.length - 1];

@Component({
  selector: 'test-container-component',
  imports: [AppfxDatagridModule, ClrDropdownModule, ClrIconModule, ClrTooltipModule],
  template: `
    <appfx-datagrid-action-bar (invokeAction)="onActionClick($event)" [actions]="actions"> </appfx-datagrid-action-bar>
  `,
  styles: [
    `
      appfx-datagrid-action-bar {
        width: 100%;
        display: block;
      }

      ::ng-deep appfx-datagrid-action-bar button[data-test-id] {
        width: 65px;
      }
    `,
  ],
  standalone: true,
})
class TestContainerComponent {
  readonly normalSize: string = '210px';
  readonly smallSize: string = '200px';

  @HostBinding('style.width') width: string = this.normalSize;

  actions: ActionDefinition[];

  actionClick: EventEmitter<ActionDefinition> = new EventEmitter();

  onActionClick(action: ActionDefinition): void {
    this.actionClick.emit(action);
  }
}

class MockElementResizeService {
  resize$ = new Subject<void>();

  getResizeObservable(): Observable<void> {
    return this.resize$.asObservable();
  }
}

interface ThisTest {
  fixture: ComponentFixture<TestContainerComponent>;
  containerComponent: TestContainerComponent;
  component: DatagridActionBarComponent;
  resizeService: MockElementResizeService;

  actionsWithGroups: ActionDefinition[];
  actionsToFitScreen: ActionDefinition[];
  actionsNotFittingScreen: ActionDefinition[];
  actionsWithVisibility: ActionDefinition[];
}

describe('DatagridActionBarComponent', function () {
  beforeEach(function () {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, ClrIconModule, ClrTooltipModule, ClrDropdownModule, TestContainerComponent],
      providers: [
        {
          provide: ElementResizeService,
          useClass: MockElementResizeService,
        },
        {
          provide: ActivatedRoute,
          useValue: {
            url: of({}),
          },
        },
      ],
    });
  });

  beforeEach(function (this: ThisTest) {
    this.fixture = TestBed.createComponent(TestContainerComponent);
    this.containerComponent = this.fixture.componentInstance;
    this.component = this.fixture.debugElement.query(By.directive(DatagridActionBarComponent)).componentInstance;

    this.resizeService = TestBed.inject(ElementResizeService) as MockElementResizeService;

    this.actionsWithGroups = [
      {
        id: 'com.domain.a1',
        label: 'Action 1',
        enabled: true,
        children: [
          {
            id: 'com.domain.a2.a21',
            label: 'Action 2 - Action 1',
            enabled: true,
          },
          {
            id: 'com.domain.a2.a22',
            label: 'Action 2 - Action 2',
            enabled: true,
          },
        ],
      },
      {
        id: 'com.domain.a2',
        label: 'Action 2',
        enabled: true,
      },
    ];

    this.actionsToFitScreen = [
      {
        id: 'com.domain.a1',
        label: 'Action 1',
        enabled: true,
      },
      {
        id: 'com.domain.a2',
        label: 'Action 2',
        enabled: true,
      },
    ];
    this.actionsNotFittingScreen = this.actionsToFitScreen.concat([
      {
        id: 'com.domain.a3',
        label: 'Action 3',
        enabled: true,
      },
      {
        id: 'com.domain.a4',
        label: 'Action 4',
        enabled: true,
      },
    ]);
    this.actionsWithVisibility = [
      {
        id: 'com.domain.a1',
        label: 'Action 1',
        enabled: true,
        isVisible: true,
      },
      {
        id: 'com.domain.a2',
        label: 'Action 2',
        enabled: true,
        isVisible: false,
      },
    ];

    spyOn(this.containerComponent, 'onActionClick');
    spyOn(this.component, 'deriveBaseRootElementSize').and.returnValue(24);
  });

  afterEach(function (this: ThisTest) {
    this.fixture.destroy();
  });

  describe('WHEN there are grouped actions', function () {
    beforeEach(function (this: ThisTest) {
      this.containerComponent.actions = this.actionsWithGroups;
      this.fixture.detectChanges();
    });

    it('THEN displays all available actions', function (this: ThisTest) {
      this.actionsWithGroups.forEach(action => {
        expect(this.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          this.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(this.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        this.actionsWithGroups.length
      );
    });

    it('THEN a dropdown is displayed', function (this: ThisTest) {
      expect(this.fixture.debugElement.query(By.css('clr-dropdown'))).not.toBeNull();
    });
  });

  describe("WHEN initially all the actions fit the container's width", function () {
    beforeEach(function (this: ThisTest) {
      this.containerComponent.actions = this.actionsToFitScreen;
      this.fixture.detectChanges();
    });

    it('THEN displays all available actions', function (this: ThisTest) {
      this.actionsToFitScreen.forEach(action => {
        expect(this.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          this.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(this.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        this.actionsToFitScreen.length
      );
    });

    it('THEN a dropdown is NOT displayed', function (this: ThisTest) {
      expect(this.fixture.debugElement.query(By.css('clr-dropdown'))).toBeNull();
    });

    describe('AND an action button is clicked', function () {
      beforeEach(function (this: ThisTest) {
        this.fixture.debugElement
          .query(By.css(`button[data-test-id='${this.actionsToFitScreen[0].id}']`))
          .triggerEventHandler('click', {});
      });

      it('THEN invokes the right action', function (this: ThisTest) {
        expect(this.containerComponent.onActionClick).toHaveBeenCalledWith(this.actionsToFitScreen[0]);
      });
    });

    describe('WHEN the first action is disabled', function () {
      beforeEach(function (this: ThisTest) {
        this.containerComponent.actions = this.actionsToFitScreen.map(
          action =>
            <ActionDefinition>{
              id: action.id,
              label: action.label,
              enabled: action.id !== this.actionsToFitScreen[0].id,
            }
        );
        this.fixture.detectChanges();
      });

      it('THEN the first action button is disabled', function (this: ThisTest) {
        expect(
          this.fixture.debugElement.query(By.css(`button[data-test-id='${this.actionsToFitScreen[0].id}']`))
            .nativeElement.attributes['disabled']
        ).toBeTruthy();
      });
    });

    describe("AND the container's width has decreased due to a browser window resize", function () {
      beforeEach(fakeAsync(function (this: ThisTest) {
        this.containerComponent.width = this.containerComponent.smallSize;
        this.fixture.detectChanges();
        this.resizeService.resize$.next();
        tick(10);
        this.fixture.detectChanges();
      }));

      it("THEN displays only the buttons for actions which fit the container's width", function (this: ThisTest) {
        const action: ActionDefinition = this.actionsToFitScreen[0];
        expect(this.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();
        expect(
          this.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);

        expect(this.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(1);
      });

      it('THEN a dropdown is displayed', function (this: ThisTest) {
        expect(this.fixture.debugElement.query(By.css('clr-dropdown'))).toBeTruthy();
      });

      it('THEN displays the rest of the actions within the dropdown', function (this: ThisTest) {
        this.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        this.fixture.detectChanges();

        const action: ActionDefinition = last(this.actionsToFitScreen);
        expect(
          this.fixture.debugElement.query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
        ).toBeTruthy();

        expect(
          this.fixture.debugElement
            .query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);

        expect(this.fixture.debugElement.queryAll(By.css('clr-dropdown-menu button[data-test-id]')).length).toEqual(1);
      });

      describe('AND the container is resized back to its original size', function () {
        beforeEach(fakeAsync(function (this: ThisTest) {
          this.containerComponent.width = this.containerComponent.normalSize;
          this.fixture.detectChanges();
          this.resizeService.resize$.next();
          tick(10);
          this.fixture.detectChanges();
        }));

        it('THEN displays all available actions', function (this: ThisTest) {
          this.actionsToFitScreen.forEach(action => {
            expect(this.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

            expect(
              this.fixture.debugElement
                .query(By.css(`button[data-test-id='${action.id}']`))
                .nativeElement.textContent.trim()
            ).toEqual(action.label);
          });
          expect(this.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
            this.actionsToFitScreen.length
          );
        });

        it('THEN a dropdown is NOT displayed', function (this: ThisTest) {
          expect(this.fixture.debugElement.query(By.css('clr-dropdown'))).toBeNull();
        });
      });
    });
  });

  describe("WHEN initially NOT all actions fit the container's width", function () {
    beforeEach(function (this: ThisTest) {
      this.containerComponent.actions = this.actionsNotFittingScreen;
      this.fixture.detectChanges();
    });

    it("THEN displays all actions which fit the container's width", function (this: ThisTest) {
      this.actionsToFitScreen.forEach(action => {
        expect(this.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          this.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(this.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        this.actionsToFitScreen.length
      );
    });

    it('THEN a dropdown is displayed', function (this: ThisTest) {
      expect(this.fixture.debugElement.query(By.css('clr-dropdown'))).toBeTruthy();
    });

    describe('AND the dropdown is opened', function () {
      beforeEach(function (this: ThisTest) {
        this.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        this.fixture.detectChanges();
      });

      it('THEN displays the rest of the actions within the dropdown', function (this: ThisTest) {
        const actionsToFitScreenLength = this.actionsToFitScreen.length;
        this.actionsNotFittingScreen
          .filter(
            action =>
              this.actionsToFitScreen.reduce((length: number, a: ActionDefinition): number => {
                if (a.id === action.id) {
                  return length - 1;
                }
                return length;
              }, actionsToFitScreenLength) === actionsToFitScreenLength
          )
          .forEach(action => {
            expect(
              this.fixture.debugElement.query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
            ).toBeTruthy();

            expect(
              this.fixture.debugElement
                .query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
                .nativeElement.textContent.trim()
            ).toEqual(action.label);
          });

        expect(this.fixture.debugElement.queryAll(By.css('clr-dropdown-menu button[data-test-id]')).length).toEqual(
          this.actionsNotFittingScreen.length - this.actionsToFitScreen.length
        );
      });

      describe('AND an action button from the dropdown is clicked', function () {
        beforeEach(function (this: ThisTest) {
          this.fixture.debugElement
            .query(By.css(`clr-dropdown-menu button[data-test-id='${last(this.actionsNotFittingScreen)?.id}']`))
            .triggerEventHandler('click', {});
        });

        it('THEN invokes the right action', function (this: ThisTest) {
          expect(this.containerComponent.onActionClick).toHaveBeenCalledWith(last(this.actionsNotFittingScreen));
        });
      });

      describe('AND the browser window is being resized', function () {
        beforeEach(fakeAsync(function (this: ThisTest) {
          this.resizeService.resize$.next();
          tick(10);
          this.fixture.detectChanges();
        }));

        it('THEN the dropdown is closed', function (this: ThisTest) {
          expect(this.fixture.debugElement.query(By.css('clr-dropdown-menu'))).toBeNull();
        });
      });
    });

    describe('AND the last action from the dropdown is disabled', function () {
      beforeEach(function (this: ThisTest) {
        this.containerComponent.actions = this.actionsNotFittingScreen.map(
          action =>
            <ActionDefinition>{
              id: action.id,
              label: action.label,
              enabled: action.id !== last(this.actionsNotFittingScreen)?.id,
            }
        );
        this.fixture.detectChanges();
      });

      it('THEN the last action button from the dropdown is disabled', function (this: ThisTest) {
        this.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        this.fixture.detectChanges();
        expect(
          this.fixture.debugElement.query(
            By.css(`clr-dropdown-menu button[data-test-id='${last(this.actionsNotFittingScreen)?.id}']`)
          ).nativeElement.attributes['disabled']
        ).toBeTruthy();
      });
    });
  });

  it('NOT all actions should be visible', fakeAsync(function (this: ThisTest) {
    const visibleActionSelector = `button[data-test-id='${this.actionsWithVisibility[0].id}']`;
    const hiddenActionSelector = `button[data-test-id='${this.actionsWithVisibility[1].id}']`;
    const dropDownSelector = 'clr-dropdown.dropdown button.dropdown-toggle';
    this.containerComponent.actions = this.actionsWithVisibility;
    this.fixture.detectChanges();

    expect(this.fixture.debugElement.query(By.css(visibleActionSelector))).toBeTruthy();
    expect(this.fixture.debugElement.query(By.css(hiddenActionSelector))).toBeNull();

    this.fixture.debugElement.query(By.css(dropDownSelector)).triggerEventHandler('click', {});
    tick(10);
    this.fixture.detectChanges();

    const hiddenActionEle: DebugElement = this.fixture.debugElement.query(By.css(hiddenActionSelector));
    expect(hiddenActionEle).toBeTruthy();
    expect(hiddenActionEle.nativeElement.textContent.trim()).toEqual(`${this.actionsWithVisibility[1].label}`);
  }));
});
