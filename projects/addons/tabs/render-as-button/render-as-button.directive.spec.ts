/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClrTabsModule } from '@clr/angular/layout/tabs';

import { RenderAsButtonDirective } from './render-as-button.directive';

@Component({
  standalone: false,
  template: `
    <clr-tabs>
      <clr-tab>
        <button clrTabLink [renderAsButton]="renderAsButton">Tab 1</button>
        <clr-tab-content>content</clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
})
class TestHostComponent {
  renderAsButton = true;
}

describe('RenderAsButtonDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrTabsModule],
      declarations: [TestHostComponent, RenderAsButtonDirective],
    });

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  function tabLinkElement(): HTMLElement {
    return fixture.debugElement.query(By.css('[clrTabLink]')).nativeElement;
  }

  it('strips the nav-link classes when renderAsButton is true', () => {
    expect(tabLinkElement().classList).not.toContain('nav-link');
    expect(tabLinkElement().classList).not.toContain('btn-link');
  });

  it('restores the nav-link classes when renderAsButton is set to false', () => {
    host.renderAsButton = false;
    fixture.detectChanges();

    expect(tabLinkElement().classList).toContain('nav-link');
    expect(tabLinkElement().classList).toContain('btn-link');
  });

  it('re-applies the classes again once renderAsButton flips back to true', () => {
    host.renderAsButton = false;
    fixture.detectChanges();
    host.renderAsButton = true;
    fixture.detectChanges();

    expect(tabLinkElement().classList).not.toContain('nav-link');
    expect(tabLinkElement().classList).not.toContain('btn-link');
  });
});
