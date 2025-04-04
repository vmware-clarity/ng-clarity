/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * These helpers are local to Datagrid at the moment, but I wrote them generic enough to move them globally
 * when we have the time. This will be very helpful in future refactors due to Angular upgrades, or simply
 * just to avoid leaks since destroying fixtures is automatic with this.
 */
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, InjectionToken, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from '../../clr-angular.module';
import { IfExpandService } from '../../utils/conditional/if-expanded.service';
import { DomAdapter } from '../../utils/dom-adapter/dom-adapter';
import { DatagridWillyWonka } from './chocolate/datagrid-willy-wonka';
import { DatagridIfExpandService } from './datagrid-if-expanded.service';
import { ColumnsService } from './providers/columns.service';
import { DetailService } from './providers/detail.service';
import { MockDisplayModeService } from './providers/display-mode.mock';
import { DisplayModeService } from './providers/display-mode.service';
import { FiltersProvider } from './providers/filters';
import { ExpandableRowsCount } from './providers/global-expandable-rows';
import { Items } from './providers/items';
import { Page } from './providers/page';
import { RowActionService } from './providers/row-action-service';
import { Selection } from './providers/selection';
import { Sort } from './providers/sort';
import { StateDebouncer } from './providers/state-debouncer.provider';
import { StateProvider } from './providers/state.provider';
import { TableSizeService } from './providers/table-size.service';
import { DatagridRenderOrganizer } from './render/render-organizer';
import { KeyNavigationGridController } from './utils/key-navigation-grid.controller';

// Reusable list of providers used in a number of tests
export const DATAGRID_SPEC_PROVIDERS = [
  { provide: DisplayModeService, useClass: MockDisplayModeService },
  Selection,
  Sort,
  FiltersProvider,
  DatagridWillyWonka,
  DomAdapter,
  IfExpandService,
  DatagridIfExpandService,
  Page,
  ColumnsService,
  Items,
  DatagridRenderOrganizer,
  RowActionService,
  ExpandableRowsCount,
  StateDebouncer,
  StateProvider,
  TableSizeService,
  DetailService,
  KeyNavigationGridController,
];

export class TestContext<D, C> {
  fixture: ComponentFixture<C>;
  testComponent: C;
  testElement: any;
  clarityDirective: D;
  clarityElement: any;

  private clarityDebugElement: DebugElement;

  constructor(clarityDirectiveType: Type<D>, componentType: Type<C>) {
    this.fixture = TestBed.createComponent(componentType);
    this.fixture.detectChanges();
    this.testComponent = this.fixture.componentInstance;
    this.testElement = this.fixture.nativeElement;
    this.clarityDebugElement = this.fixture.debugElement.query(By.directive(clarityDirectiveType));
    if (!this.clarityDebugElement) {
      const componentName = (componentType as any).name;
      const clarityDirectiveName = (clarityDirectiveType as any).name;
      throw new Error(`Test component ${componentName} doesn't contain a ${clarityDirectiveName}`);
    }
    this.clarityDirective = this.clarityDebugElement.injector.get(clarityDirectiveType);
    this.clarityElement = this.clarityDebugElement.nativeElement;
  }

  // The Function type here is just to tell Typescript to be nice with abstract classes. Weird.
  // eslint-disable-next-line @typescript-eslint/ban-types
  getClarityProvider<T>(token: Type<T> | InjectionToken<T> | Function): T {
    return this.clarityDebugElement.injector.get(token);
  }

  /**
   * Delegate method to avoid verbosity
   */
  detectChanges() {
    this.fixture.detectChanges();
  }
}

export function addHelpers(): void {
  beforeEach(function () {
    /*
     * Ideally we would just make "this" a TestContext, but typing "this" in typescript
     * is a bit too new for all IDEs to correctly process it.
     */
    this.create = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = []
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createOnly = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = []
    ) => {
      TestBed.configureTestingModule({
        declarations: [clarityDirective, testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createWithOverrideComponent = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = [],
      serviceOverrides: any[]
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      }).overrideComponent(clarityDirective, {
        set: {
          providers: serviceOverrides,
        },
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };

    this.createWithOverrideDirective = <D, C>(
      clarityDirective: Type<D>,
      testComponent: Type<C>,
      providers: any[] = [],
      extraDirectives: Type<any>[] = [],
      serviceOverrides: any[]
    ) => {
      TestBed.configureTestingModule({
        imports: [ClarityModule, NoopAnimationsModule],
        declarations: [testComponent, ...extraDirectives],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: providers,
      }).overrideDirective(clarityDirective, {
        set: {
          providers: serviceOverrides,
        },
      });
      return (this._context = new TestContext<D, C>(clarityDirective, testComponent));
    };
  });

  afterEach(function () {
    if (this._context) {
      this._context.fixture.destroy();
    }
  });
}
