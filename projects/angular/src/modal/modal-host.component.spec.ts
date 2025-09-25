/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrModalHostComponent } from './modal-host.component';

describe('ModalHost for SidePanel', () => {
  let fixture: ComponentFixture<TestComponent>;
  let modalHostElement: HTMLElement;

  beforeEach(function () {
    TestBed.configureTestingModule({
      declarations: [ClrModalHostComponent, TestComponent],
    });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    modalHostElement = fixture.componentInstance.hostElement.nativeElement.querySelector('&>.clr-modal-host');
  });

  it('adds clr-modal-host class to the host element', function () {
    expect(modalHostElement).toBeTruthy();
  });

  it('adds child div with clr-modal-host-scrollable class to the host', function () {
    expect(modalHostElement.querySelector('&>div.clr-modal-host-scrollable')).toBeTruthy();
  });
});

@Component({
  template: '<div clrModalHost #hostElement></div>',
  standalone: false,
})
class TestComponent {
  constructor(public hostElement: ElementRef<HTMLElement>) {}
}
