/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrSelectModule } from '@clr/angular/forms';
import { ClrIcon } from '@clr/angular/icon';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';
import { Subject } from 'rxjs';

import { FilterFormComponent } from './filter-form.component';
import { UsersFilterComponent } from './users-filter.component';
import { DatagridFiltersStrings } from '../datagrid-filters-strings.service';
import { DatagridFiltersUserService } from '../datagrid-filters-user-service';
import { UserPropertyDefinition } from '../model/datagrid-filters.interfaces';

/** OnPush host that never calls `markForCheck()`: the filter has to refresh itself when the service answers. */
@Component({
  template: `<appfx-users-filter [filterProperty]="property"></appfx-users-filter>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class OnPushUsersFilterHost {
  readonly property = new UserPropertyDefinition('Owner', 'owner');
}

describe('appfx-users-filter in an OnPush host (zoneless)', () => {
  let fixture: ComponentFixture<OnPushUsersFilterHost>;
  let domains: Subject<string[]>;
  let users: Subject<string[]>;

  function element(): HTMLElement {
    return fixture.nativeElement;
  }

  function domainOptions(): string[] {
    return Array.from(element().querySelectorAll<HTMLOptionElement>('select[name=domain] option')).map(option =>
      option.textContent.trim()
    );
  }

  function userLabels(): string[] {
    return Array.from(element().querySelectorAll('.enum-options clr-checkbox-wrapper label')).map(label =>
      label.textContent.trim()
    );
  }

  function loading(): boolean {
    return !!element().querySelector('.loading-overlay');
  }

  beforeEach(async () => {
    vi.useFakeTimers();
    domains = new Subject<string[]>();
    users = new Subject<string[]>();
    TestBed.configureTestingModule({
      imports: [
        ClrCheckboxModule,
        ClrSelectModule,
        ClrInputModule,
        ClrIcon,
        ClrSpinnerModule,
        CommonModule,
        ReactiveFormsModule,
      ],
      declarations: [OnPushUsersFilterHost, UsersFilterComponent, FilterFormComponent],
      providers: [
        DatagridFiltersStrings,
        {
          provide: DatagridFiltersUserService,
          useValue: { getDomains: () => domains, searchUsers: () => users },
        },
      ],
    });
    fixture = TestBed.createComponent(OnPushUsersFilterHost);
    await fixture.whenStable();
  });

  it('shows the domains and users once the service answers', async () => {
    expect(loading()).toBe(true);

    domains.next(['corp.local', 'vsphere.local']);
    await vi.advanceTimersByTimeAsync(200);
    await fixture.whenStable();

    expect(domainOptions()).toEqual(['corp.local', 'vsphere.local']);

    users.next(['alice', 'bob']);
    await fixture.whenStable();

    expect(userLabels()).toEqual(['Select all', 'alice', 'bob']);
    expect(loading()).toBe(false);
  });

  it('shows a search error once the service fails', async () => {
    domains.next(['corp.local']);
    await vi.advanceTimersByTimeAsync(200);

    users.error(new Error('offline'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    await fixture.whenStable();

    expect(element().querySelector('.error')?.textContent.trim()).toBe('Error searching users.');
    expect(loading()).toBe(false);
  });
});
