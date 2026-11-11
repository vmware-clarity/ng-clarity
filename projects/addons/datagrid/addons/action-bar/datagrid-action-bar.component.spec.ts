/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, DebugElement, EventEmitter, HostBinding } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ElementResizeService } from '@clr/addons/a11y';
import { ClrIcon } from '@clr/angular/icon';
import { ClrDropdownModule, ClrTooltipModule } from '@clr/angular/popover';
import { renderFixture } from '@clr/angular/utils/testing';
import { Observable, of, Subject } from 'rxjs';

import { DatagridActionBarComponent } from './datagrid-action-bar.component';
import { useTestTimers } from '../../../../test-timers';
import { AppfxDatagridModule } from '../../datagrid.module';
import { ActionDefinition } from '../../shared/action/action-definition';

const last = (array: any[]) => array[array.length - 1];

@Component({
  selector: 'test-container-component',
  imports: [AppfxDatagridModule, ClrDropdownModule, ClrIcon, ClrTooltipModule],
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
  changeDetection: ChangeDetectionStrategy.Eager,
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

describe('DatagridActionBarComponent', () => {
  let testContext: ThisTest;
  beforeEach(() => {
    testContext = {} as ThisTest;
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrIcon, ClrTooltipModule, ClrDropdownModule, TestContainerComponent],
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

  beforeEach(() => {
    testContext.fixture = TestBed.createComponent(TestContainerComponent);
    testContext.containerComponent = testContext.fixture.componentInstance;
    testContext.component = testContext.fixture.debugElement.query(
      By.directive(DatagridActionBarComponent)
    ).componentInstance;

    testContext.resizeService = TestBed.inject(ElementResizeService) as MockElementResizeService;

    testContext.actionsWithGroups = [
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

    testContext.actionsToFitScreen = [
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
    testContext.actionsNotFittingScreen = testContext.actionsToFitScreen.concat([
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
    testContext.actionsWithVisibility = [
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

    vi.spyOn(testContext.containerComponent, 'onActionClick').mockImplementation(() => undefined);
    vi.spyOn(testContext.component, 'deriveBaseRootElementSize').mockReturnValue(24);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  describe('WHEN there are grouped actions', () => {
    beforeEach(() => {
      testContext.containerComponent.actions = testContext.actionsWithGroups;
      renderFixture(testContext.fixture);
    });

    it('THEN displays all available actions', () => {
      testContext.actionsWithGroups.forEach(action => {
        expect(testContext.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          testContext.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(testContext.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        testContext.actionsWithGroups.length
      );
    });

    it('THEN a dropdown is displayed', () => {
      expect(testContext.fixture.debugElement.query(By.css('clr-dropdown'))).not.toBeNull();
    });
  });

  describe("WHEN initially all the actions fit the container's width", () => {
    beforeEach(() => {
      testContext.containerComponent.actions = testContext.actionsToFitScreen;
      renderFixture(testContext.fixture);
    });

    it('THEN displays all available actions', () => {
      testContext.actionsToFitScreen.forEach(action => {
        expect(testContext.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          testContext.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(testContext.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        testContext.actionsToFitScreen.length
      );
    });

    it('THEN a dropdown is NOT displayed', () => {
      expect(testContext.fixture.debugElement.query(By.css('clr-dropdown'))).toBeNull();
    });

    describe('AND an action button is clicked', () => {
      beforeEach(() => {
        testContext.fixture.debugElement
          .query(By.css(`button[data-test-id='${testContext.actionsToFitScreen[0].id}']`))
          .triggerEventHandler('click', {});
      });

      it('THEN invokes the right action', () => {
        expect(testContext.containerComponent.onActionClick).toHaveBeenCalledWith(testContext.actionsToFitScreen[0]);
      });
    });

    describe('WHEN the first action is disabled', () => {
      beforeEach(() => {
        testContext.containerComponent.actions = testContext.actionsToFitScreen.map(
          action =>
            <ActionDefinition>{
              id: action.id,
              label: action.label,
              enabled: action.id !== testContext.actionsToFitScreen[0].id,
            }
        );
        renderFixture(testContext.fixture);
      });

      it('THEN the first action button is disabled', () => {
        expect(
          testContext.fixture.debugElement.query(
            By.css(`button[data-test-id='${testContext.actionsToFitScreen[0].id}']`)
          ).nativeElement.attributes['disabled']
        ).toBeTruthy();
      });
    });

    describe("AND the container's width has decreased due to a browser window resize", () => {
      beforeEach(async () => {
        useTestTimers();
        testContext.containerComponent.width = testContext.containerComponent.smallSize;
        renderFixture(testContext.fixture);
        testContext.resizeService.resize$.next();
        await vi.advanceTimersByTimeAsync(10);
        renderFixture(testContext.fixture);
      });

      it("THEN displays only the buttons for actions which fit the container's width", () => {
        const action: ActionDefinition = testContext.actionsToFitScreen[0];
        expect(testContext.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();
        expect(
          testContext.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);

        expect(testContext.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(1);
      });

      it('THEN a dropdown is displayed', () => {
        expect(testContext.fixture.debugElement.query(By.css('clr-dropdown'))).toBeTruthy();
      });

      it('THEN displays the rest of the actions within the dropdown', () => {
        testContext.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        renderFixture(testContext.fixture);

        const action: ActionDefinition = last(testContext.actionsToFitScreen);
        expect(
          testContext.fixture.debugElement.query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
        ).toBeTruthy();

        expect(
          testContext.fixture.debugElement
            .query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);

        expect(
          testContext.fixture.debugElement.queryAll(By.css('clr-dropdown-menu button[data-test-id]')).length
        ).toEqual(1);
      });

      describe('AND the container is resized back to its original size', () => {
        beforeEach(async () => {
          useTestTimers();
          testContext.containerComponent.width = testContext.containerComponent.normalSize;
          renderFixture(testContext.fixture);
          testContext.resizeService.resize$.next();
          await vi.advanceTimersByTimeAsync(10);
          renderFixture(testContext.fixture);
        });

        it('THEN displays all available actions', () => {
          testContext.actionsToFitScreen.forEach(action => {
            expect(testContext.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

            expect(
              testContext.fixture.debugElement
                .query(By.css(`button[data-test-id='${action.id}']`))
                .nativeElement.textContent.trim()
            ).toEqual(action.label);
          });
          expect(testContext.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
            testContext.actionsToFitScreen.length
          );
        });

        it('THEN a dropdown is NOT displayed', () => {
          expect(testContext.fixture.debugElement.query(By.css('clr-dropdown'))).toBeNull();
        });
      });
    });
  });

  describe("WHEN initially NOT all actions fit the container's width", () => {
    beforeEach(() => {
      testContext.containerComponent.actions = testContext.actionsNotFittingScreen;
      renderFixture(testContext.fixture);
    });

    it("THEN displays all actions which fit the container's width", () => {
      testContext.actionsToFitScreen.forEach(action => {
        expect(testContext.fixture.debugElement.query(By.css(`button[data-test-id='${action.id}']`))).toBeTruthy();

        expect(
          testContext.fixture.debugElement
            .query(By.css(`button[data-test-id='${action.id}']`))
            .nativeElement.textContent.trim()
        ).toEqual(action.label);
      });
      expect(testContext.fixture.debugElement.queryAll(By.css('button[data-test-id]')).length).toEqual(
        testContext.actionsToFitScreen.length
      );
    });

    it('THEN a dropdown is displayed', () => {
      expect(testContext.fixture.debugElement.query(By.css('clr-dropdown'))).toBeTruthy();
    });

    describe('AND the dropdown is opened', () => {
      beforeEach(() => {
        testContext.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        renderFixture(testContext.fixture);
      });

      it('THEN displays the rest of the actions within the dropdown', () => {
        const actionsToFitScreenLength = testContext.actionsToFitScreen.length;
        testContext.actionsNotFittingScreen
          .filter(
            action =>
              testContext.actionsToFitScreen.reduce((length: number, a: ActionDefinition): number => {
                if (a.id === action.id) {
                  return length - 1;
                }
                return length;
              }, actionsToFitScreenLength) === actionsToFitScreenLength
          )
          .forEach(action => {
            expect(
              testContext.fixture.debugElement.query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
            ).toBeTruthy();

            expect(
              testContext.fixture.debugElement
                .query(By.css(`clr-dropdown-menu button[data-test-id='${action.id}']`))
                .nativeElement.textContent.trim()
            ).toEqual(action.label);
          });

        expect(
          testContext.fixture.debugElement.queryAll(By.css('clr-dropdown-menu button[data-test-id]')).length
        ).toEqual(testContext.actionsNotFittingScreen.length - testContext.actionsToFitScreen.length);
      });

      describe('AND an action button from the dropdown is clicked', () => {
        beforeEach(() => {
          testContext.fixture.debugElement
            .query(By.css(`clr-dropdown-menu button[data-test-id='${last(testContext.actionsNotFittingScreen)?.id}']`))
            .triggerEventHandler('click', {});
        });

        it('THEN invokes the right action', () => {
          expect(testContext.containerComponent.onActionClick).toHaveBeenCalledWith(
            last(testContext.actionsNotFittingScreen)
          );
        });
      });

      describe('AND the browser window is being resized', () => {
        beforeEach(async () => {
          useTestTimers();
          testContext.resizeService.resize$.next();
          await vi.advanceTimersByTimeAsync(10);
          renderFixture(testContext.fixture);
        });

        it('THEN the dropdown is closed', () => {
          expect(testContext.fixture.debugElement.query(By.css('clr-dropdown-menu'))).toBeNull();
        });
      });
    });

    describe('AND the last action from the dropdown is disabled', () => {
      beforeEach(() => {
        testContext.containerComponent.actions = testContext.actionsNotFittingScreen.map(
          action =>
            <ActionDefinition>{
              id: action.id,
              label: action.label,
              enabled: action.id !== last(testContext.actionsNotFittingScreen)?.id,
            }
        );
        renderFixture(testContext.fixture);
      });

      it('THEN the last action button from the dropdown is disabled', () => {
        testContext.fixture.debugElement.query(By.css('clr-dropdown > button')).triggerEventHandler('click', {});
        renderFixture(testContext.fixture);
        expect(
          testContext.fixture.debugElement.query(
            By.css(`clr-dropdown-menu button[data-test-id='${last(testContext.actionsNotFittingScreen)?.id}']`)
          ).nativeElement.attributes['disabled']
        ).toBeTruthy();
      });
    });
  });

  it('NOT all actions should be visible', async () => {
    useTestTimers();
    const visibleActionSelector = `button[data-test-id='${testContext.actionsWithVisibility[0].id}']`;
    const hiddenActionSelector = `button[data-test-id='${testContext.actionsWithVisibility[1].id}']`;
    const dropDownSelector = 'clr-dropdown.dropdown button.dropdown-toggle';
    testContext.containerComponent.actions = testContext.actionsWithVisibility;
    renderFixture(testContext.fixture);

    expect(testContext.fixture.debugElement.query(By.css(visibleActionSelector))).toBeTruthy();
    expect(testContext.fixture.debugElement.query(By.css(hiddenActionSelector))).toBeNull();

    testContext.fixture.debugElement.query(By.css(dropDownSelector)).triggerEventHandler('click', {});
    await vi.advanceTimersByTimeAsync(10);
    renderFixture(testContext.fixture);

    const hiddenActionEle: DebugElement = testContext.fixture.debugElement.query(By.css(hiddenActionSelector));
    expect(hiddenActionEle).toBeTruthy();
    expect(hiddenActionEle.nativeElement.textContent.trim()).toEqual(`${testContext.actionsWithVisibility[1].label}`);
  });
});
