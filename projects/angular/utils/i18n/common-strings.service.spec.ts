/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ClrCardModule } from '@clr/angular/card';

import { commonStringsDefault } from './common-strings.default';
import { ClrCommonStringsService } from './common-strings.service';

@Component({
  template: `
    <clr-card clrCardCollapsible>
      <clr-card-header>Title</clr-card-header>
    </clr-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ClrCardModule],
})
class OnPushCardHost {}

describe('ClrCommonStringsService', () => {
  let service: ClrCommonStringsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [OnPushCardHost] });
    service = TestBed.inject(ClrCommonStringsService);
  });

  afterEach(() => {
    service.localize(commonStringsDefault);
  });

  it('starts with the default strings', () => {
    expect(service.keys).toEqual(commonStringsDefault);
  });

  it('merges overrides into the current strings', () => {
    service.localize({ open: 'Ouvrir' });
    service.localize({ close: 'Fermer' });

    expect(service.keys.open).toBe('Ouvrir');
    expect(service.keys.close).toBe('Fermer');
    expect(service.keys.next).toBe(commonStringsDefault.next);
  });

  it('notifies readers when localized', () => {
    const open = computed(() => service.keys.open);
    expect(open()).toBe(commonStringsDefault.open);

    service.localize({ open: 'Ouvrir' });

    expect(open()).toBe('Ouvrir');
  });

  it('parses tokens', () => {
    expect(service.parse('{CURRENT} of {TOTAL}', { CURRENT: '1', TOTAL: '3' })).toBe('1 of 3');
  });

  it('updates OnPush library views when localized after the first render', async () => {
    const fixture = TestBed.createComponent(OnPushCardHost);
    await fixture.whenStable();
    const toggle: HTMLButtonElement = fixture.nativeElement.querySelector('.card-header-toggle');
    expect(toggle.getAttribute('aria-label')).toBe(commonStringsDefault.collapseCardAriaLabel);

    service.localize({ collapseCardAriaLabel: 'Réduire la carte' });
    await fixture.whenStable();

    expect(toggle.getAttribute('aria-label')).toBe('Réduire la carte');
    fixture.destroy();
  });
});
