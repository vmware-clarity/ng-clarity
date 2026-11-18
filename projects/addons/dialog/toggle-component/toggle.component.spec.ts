/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { renderFixture } from '@clr/angular/utils/testing';

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
    renderFixture(fixture);
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
    fixture.componentRef.setInput('label', 'Enable feature');
    renderFixture(fixture);

    expect(fixture.nativeElement.querySelector('.toggle-label').textContent.trim()).toEqual('Enable feature');
  });

  it('emits toggleStateChange when the checkbox value changes', () => {
    vi.spyOn(component.toggleStateChange, 'emit').mockImplementation(() => undefined);

    component.onToggleStateChanged(true);

    expect(component.toggleStateChange.emit).toHaveBeenCalledWith(true);
  });

  it('disables the checkbox input when disabled is set', () => {
    fixture.componentRef.setInput('disabled', true);
    renderFixture(fixture);

    const input: HTMLInputElement = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    expect(input.disabled).toBeTruthy();
  });
});

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<appfx-toggle [label]="label()" [(toggleState)]="enabled"></appfx-toggle>',
})
class OnPushHostComponent {
  readonly label = signal('Advanced');
  readonly enabled = signal(false);
}

describe('ToggleComponent in an OnPush host', () => {
  let fixture: ComponentFixture<OnPushHostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ClrCheckboxModule],
      declarations: [ToggleComponent, OnPushHostComponent],
    });
    fixture = TestBed.createComponent(OnPushHostComponent);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    input = fixture.nativeElement.querySelector('input');
  });

  afterEach(() => fixture.destroy());

  it('renders state and label changes made by the host', async () => {
    fixture.componentInstance.enabled.set(true);
    fixture.componentInstance.label.set('Expert');
    await fixture.whenStable();

    expect(input.checked).toBe(true);
    expect(fixture.nativeElement.querySelector('label.toggle-label').textContent.trim()).toBe('Expert');
  });

  it('reports a click to the host', async () => {
    input.click();
    await fixture.whenStable();

    expect(fixture.componentInstance.enabled()).toBe(true);
  });
});
