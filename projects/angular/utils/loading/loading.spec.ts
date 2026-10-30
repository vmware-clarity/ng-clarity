/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Injectable, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { renderFixture } from '@clr/angular/utils/testing';

import { ClrLoading, ClrLoadingState } from './loading';
import { LoadingListener } from './loading-listener';

describe('Loading directive', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClrLoading, FullTest],
      providers: [{ provide: LoadingListener, useClass: DummyListener }],
    });
    testContext.fixture = TestBed.createComponent(FullTest);
    renderFixture(testContext.fixture);
    testContext.testComponent = testContext.fixture.componentInstance;
    testContext.clarityDirective = testContext.fixture.componentInstance.loadingDirective;
    testContext.listener = TestBed.inject(LoadingListener);
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('notifies the listener when the [clrLoading] input changes', () => {
    expect(testContext.listener.loading).toBe(false);
    testContext.testComponent.loading = true;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loading).toBe(true);
    testContext.testComponent.loading = false;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loading).toBe(false);
  });

  it('ignores successive inputs with the same value', () => {
    vi.spyOn(testContext.listener, 'loadingStateChange').mockImplementation(() => undefined);
    testContext.testComponent.loading = false;
    renderFixture(testContext.fixture);
    testContext.testComponent.loading = false;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loadingStateChange).toHaveBeenCalledTimes(0);
    testContext.testComponent.loading = true;
    renderFixture(testContext.fixture);
    testContext.testComponent.loading = true;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loadingStateChange).toHaveBeenCalledTimes(1);
  });

  it('handles null or other falsy values as false', () => {
    testContext.testComponent.loading = null;
    renderFixture(testContext.fixture);
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.DEFAULT);
    testContext.testComponent.loading = undefined;
    renderFixture(testContext.fixture);
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.DEFAULT);
    testContext.testComponent.loading = 0;
    renderFixture(testContext.fixture);
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.DEFAULT);
  });

  it('stops loading when destroyed', () => {
    testContext.testComponent.loading = true;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loading).toBe(true);
    testContext.testComponent.displayed = false;
    renderFixture(testContext.fixture);
    expect(testContext.listener.loading).toBe(false);
  });
});

describe('Loading directive without listener', () => {
  let testContext: any;
  beforeEach(() => {
    testContext = {};
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClrLoading, FullTest],
    });
    testContext.fixture = TestBed.createComponent(FullTest);
    renderFixture(testContext.fixture);
    testContext.testComponent = testContext.fixture.componentInstance;
    testContext.clarityDirective = testContext.fixture.componentInstance.loadingDirective;
  });

  afterEach(() => {
    testContext.fixture.destroy();
  });

  it('keeps loading state without exceptions', () => {
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.DEFAULT);
    testContext.testComponent.loading = true;
    renderFixture(testContext.fixture);
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.LOADING);
    testContext.testComponent.loading = false;
    renderFixture(testContext.fixture);
    expect(testContext.clarityDirective.loadingState).toEqual(ClrLoadingState.DEFAULT);
  });
});

@Component({
  template: `@if (displayed) {
    <div [clrLoading]="loading"></div>
  }`,
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
class FullTest {
  @ViewChild(ClrLoading) loadingDirective: ClrLoading;

  displayed = true;
  loading = false;
}

@Injectable()
class DummyListener implements LoadingListener {
  loading = false;

  loadingStateChange(state: ClrLoadingState): void {
    this.loading = state === ClrLoadingState.LOADING;
  }
}
