/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { applyClrFormValues } from './form-value-applier';

@Component({
  template: `
    <form>
      <input type="text" name="hostName" [(ngModel)]="hostName" />
      <select name="cluster" [(ngModel)]="cluster">
        <option value="alpha">Alpha</option>
        <option value="beta">Beta</option>
      </select>
      <input type="checkbox" name="enabled" [(ngModel)]="enabled" />
      <input type="radio" name="tier" value="gold" [(ngModel)]="tier" />
      <input type="radio" name="tier" value="silver" [(ngModel)]="tier" />
      <input type="password" name="secret" [(ngModel)]="secret" />
      <textarea name="notes" [(ngModel)]="notes"></textarea>
    </form>
  `,
  standalone: false,
})
class TestComponent {
  hostName = '';
  cluster = 'alpha';
  enabled = false;
  tier = 'gold';
  secret = '';
  notes = '';
}

describe('applyClrFormValues', () => {
  let fixture: ComponentFixture<TestComponent>;
  let form: HTMLFormElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [FormsModule], declarations: [TestComponent] });
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    form = fixture.nativeElement.querySelector('form');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('writes values through real events, so Angular bindings pick them up', () => {
    const result = applyClrFormValues(form, {
      hostName: 'esx-prod-04',
      cluster: 'beta',
      enabled: true,
      tier: 'silver',
      notes: 'Provisioned by the assistant',
    });
    fixture.detectChanges();

    expect(result.applied).toEqual(['hostName', 'cluster', 'enabled', 'tier', 'notes']);
    expect(result.skipped).toEqual([]);
    expect(fixture.componentInstance.hostName).toBe('esx-prod-04');
    expect(fixture.componentInstance.cluster).toBe('beta');
    expect(fixture.componentInstance.enabled).toBe(true);
    expect(fixture.componentInstance.tier).toBe('silver');
    expect(fixture.componentInstance.notes).toBe('Provisioned by the assistant');
  });

  it('matches select options by their visible label too', () => {
    applyClrFormValues(form, { cluster: 'Beta' });
    fixture.detectChanges();

    expect(fixture.componentInstance.cluster).toBe('beta');
  });

  it('skips unknown controls and values with no matching option', () => {
    const result = applyClrFormValues(form, { unknownField: 'x', cluster: 'gamma', tier: 'bronze' });

    expect(result.applied).toEqual([]);
    expect(result.skipped).toEqual([
      { name: 'unknownField', reason: 'no control with this name' },
      { name: 'cluster', reason: 'no option matches this value' },
      { name: 'tier', reason: 'no radio option matches this value' },
    ]);
  });

  it('never writes password inputs', () => {
    const result = applyClrFormValues(form, { secret: 'hunter2' });
    fixture.detectChanges();

    expect(result.skipped).toEqual([{ name: 'secret', reason: 'password and file inputs are never written' }]);
    expect(fixture.componentInstance.secret).toBe('');
    expect(form.querySelector<HTMLInputElement>('[name=secret]')?.value).toBe('');
  });
});
