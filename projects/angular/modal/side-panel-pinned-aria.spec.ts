/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CdkTrapFocusModule } from '@clr/angular/utils';

import { ClrSidePanelModule } from './side-panel.module';

@Component({
  template: `
    <clr-side-panel [(clrSidePanelOpen)]="open" [clrSidePanelPinnable]="true">
      <div class="side-panel-title">Details</div>
      <div class="side-panel-body">Body</div>
    </clr-side-panel>
  `,
  standalone: false,
})
class TestComponent {
  open = true;
}

describe('ClrSidePanel pinned state, as assistive technology sees it', () => {
  let fixture: ComponentFixture<TestComponent>;

  function pinButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('button.pinnable');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CdkTrapFocusModule, ClrSidePanelModule, NoopAnimationsModule],
      declarations: [TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  beforeEach(async () => {
    // The panel renders its content through an inner clr-modal, which settles a tick later.
    await fixture.whenStable();
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('reports the pin as a toggle that is currently off', () => {
    // Pinned state was conveyed only by swapping the icon shape, which neither a screen
    // reader nor page-context tooling can read.
    expect(pinButton().getAttribute('aria-pressed')).toBe('false');
  });

  it('reports the pin as pressed once the panel is pinned', () => {
    pinButton().click();
    fixture.detectChanges();

    expect(pinButton().getAttribute('aria-pressed')).toBe('true');
  });
});
