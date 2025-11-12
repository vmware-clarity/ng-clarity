/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CDSState, GlobalStateService } from './global.service';

function getMockState(): CDSState {
  return {
    iconRegistry: {},
  };
}

function resetGlobalState() {
  // Directly set the private state on the window object
  if (window.CDS) {
    (window.CDS._state as any) = getMockState();
  }
}

describe('Global State Service', () => {
  beforeEach(() => {
    // Ensure the global object is set up before each test
    GlobalStateService.setupCDSGlobal();
    resetGlobalState();
  });

  afterEach(() => {
    resetGlobalState();
  });

  it('.state should return all global state', () => {
    expect(Object.keys(GlobalStateService.state.iconRegistry).length).toBe(0);
    // Use setValue to trigger the proxy
    GlobalStateService.setValue('iconRegistry', { test: 'ohai' });
    expect(GlobalStateService.state.iconRegistry['test']).toBe('ohai');
  });

  it('getValue should return value of state key', () => {
    GlobalStateService.setValue('iconRegistry', { yolo: 'howdy' });
    expect((GlobalStateService.getValue('iconRegistry') as any)['yolo']).toEqual('howdy');
    expect(GlobalStateService.state.iconRegistry['yolo']).toEqual('howdy');
  });

  it('setValue should assign value to key', () => {
    GlobalStateService.setValue('iconRegistry', { test: 'ohai' });
    expect(GlobalStateService.state.iconRegistry).toEqual({ test: 'ohai' });

    // Test proxy behavior by adding to the object
    const currentState = GlobalStateService.state.iconRegistry;
    GlobalStateService.setValue('iconRegistry', { ...currentState, another: 'howdy' });
    expect(GlobalStateService.state.iconRegistry).toEqual({ test: 'ohai', another: 'howdy' });
  });

  it('.log() should log state to the console', () => {
    const spy = spyOn(console, 'log');
    GlobalStateService.log();
    expect(spy).toHaveBeenCalled();
  });
});
