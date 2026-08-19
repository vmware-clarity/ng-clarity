/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';

import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let fixture: ComponentFixture<ToggleComponent>;
  let component: ToggleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ClrCheckboxModule],
      declarations: [ToggleComponent],
    });
    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });

  it('autogenerates a unique toggleId when one is not provided', () => {
    const otherFixture = TestBed.createComponent(ToggleComponent);
    const otherComponent = otherFixture.componentInstance;

    expect(component.toggleId).toBeTruthy();
    expect(otherComponent.toggleId).toBeTruthy();
    expect(component.toggleId).not.toEqual(otherComponent.toggleId);
  });

  it('renders the provided label', () => {
    component.label = 'Enable feature';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.toggle-label').textContent.trim()).toEqual('Enable feature');
  });

  it('emits toggleStateChange when the checkbox value changes', () => {
    spyOn(component.toggleStateChange, 'emit');

    component.onToggleStateChanged(true);

    expect(component.toggleStateChange.emit).toHaveBeenCalledWith(true);
  });

  it('disables the checkbox input when disabled is set', () => {
    component.disabled = true;
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    expect(input.disabled).toBeTruthy();
  });
});
