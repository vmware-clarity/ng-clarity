/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { delay } from '@clr/angular/testing';
import { ClrCommonStringsService, ClrLoadingModule, ClrLoadingState } from '@clr/angular/utils';

import { ClrButtonGroupModule } from './button-group/button-group.module';
import { ClrLoadingButtonModule } from './button-loading/loading-button.module';

// Every host is OnPush and every change comes from a signal or a native event, never from a forced change detection.

@Component({
  template: `
    <clr-button-group>
      <clr-button>{{ firstLabel() }}</clr-button>
      <clr-button [clrInMenu]="secondInMenu()" [disabled]="disabled()" [class]="classes()">Second</clr-button>
      @if (extra()) {
        <clr-button>Late inline</clr-button>
        <clr-button [clrInMenu]="true">Late menu</clr-button>
      }
      <clr-button [clrLoading]="loading()" (click)="clicks.update(count => count + 1)">Third</clr-button>
      @if (fourth()) {
        <clr-button [clrInMenu]="true" [clrLoading]="loading()">Fourth</clr-button>
      }
    </clr-button-group>
    <output>{{ clicks() }}</output>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class ButtonGroupHost {
  readonly firstLabel = signal('First');
  readonly secondInMenu = signal(false);
  readonly disabled = signal(false);
  readonly classes = signal('btn-primary');
  readonly extra = signal(false);
  readonly fourth = signal(true);
  readonly loading = signal(false);
  readonly clicks = signal(0);
}

@Component({
  template: `
    <clr-button-group>
      <clr-button routerLink="/one" routerLinkActive="btn-primary">One</clr-button>
      <clr-button routerLink="/two" routerLinkActive="btn-primary" [clrInMenu]="true">Two</clr-button>
    </clr-button-group>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class RouterButtonGroupHost {}

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class EmptyRoute {}

@Component({
  template: `<button [(clrLoading)]="state" [disabled]="disabled()">Save</button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
class LoadingButtonHost {
  readonly state = signal(ClrLoadingState.DEFAULT);
  readonly disabled = signal(false);
}

describe('Button group (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<ButtonGroupHost>;
  let host: ButtonGroupHost;

  const inlineLabels = () =>
    Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('clr-button-group > button')).map(button =>
      button.textContent.trim()
    );
  const overflow = (): HTMLElement => fixture.nativeElement.querySelector('.btn-group-overflow');
  const menuLabels = () =>
    Array.from<HTMLElement>(document.querySelectorAll('.clr-button-group-menu > button')).map(button =>
      button.textContent.trim()
    );
  // Menu buttons are in the overlay container, outside the group.
  const button = (label: string) =>
    Array.from<HTMLButtonElement>(
      document.querySelectorAll('clr-button-group > button, .clr-button-group-menu > button')
    ).find(element => element.textContent.trim() === label);
  async function openMenu() {
    overflow().querySelector<HTMLElement>('.dropdown-toggle').click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrButtonGroupModule, ClrLoadingModule],
      declarations: [ButtonGroupHost],
    });
    fixture = TestBed.createComponent(ButtonGroupHost);
    host = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => fixture.destroy());

  it('moves a button into the menu and back when its clrInMenu input changes', async () => {
    host.fourth.set(false);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Second', 'Third']);
    expect(overflow()).toBeNull();

    host.secondInMenu.set(true);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Third']);
    await openMenu();
    expect(menuLabels()).toEqual(['Second']);

    host.secondInMenu.set(false);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Second', 'Third']);
    expect(overflow()).toBeNull();
  });

  it('keeps the order of the projected buttons in both lists', async () => {
    host.secondInMenu.set(true);
    host.extra.set(true);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Late inline', 'Third']);
    await openMenu();
    expect(menuLabels()).toEqual(['Second', 'Late menu', 'Fourth']);
  });

  it('places buttons projected later and drops removed ones', async () => {
    host.extra.set(true);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Second', 'Late inline', 'Third']);
    await openMenu();
    expect(menuLabels()).toEqual(['Late menu', 'Fourth']);

    host.extra.set(false);
    host.fourth.set(false);
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Second', 'Third']);
    expect(overflow()).toBeNull();
    expect(document.querySelector('.clr-button-group-menu')).toBeNull();
  });

  it('updates the inputs and the projected content of a button', async () => {
    expect(button('Second').disabled).toBe(false);
    expect(button('Second').classList).toContain('btn-primary');

    host.disabled.set(true);
    host.classes.set('btn-outline');
    host.firstLabel.set('Renamed');
    await fixture.whenStable();
    expect(button('Second').disabled).toBe(true);
    expect(button('Second').classList).toContain('btn-outline');
    expect(button('Second').classList).not.toContain('btn-primary');
    expect(inlineLabels()[0]).toBe('Renamed');
  });

  it('updates the inputs of a button while it moves into the menu', async () => {
    host.secondInMenu.set(true);
    host.disabled.set(true);
    await fixture.whenStable();
    await openMenu();
    expect(button('Second').disabled).toBe(true);
    expect(button('Second').getAttribute('role')).toBe('menuitem');
  });

  it('shows the loading spinner of inline and menu buttons', async () => {
    await openMenu();
    expect(button('Third').querySelector('.spinner')).toBeNull();
    expect(button('Fourth').querySelector('.spinner')).toBeNull();

    host.loading.set(true);
    await fixture.whenStable();
    expect(button('Third').querySelector('.spinner')).not.toBeNull();
    expect(button('Fourth').querySelector('.spinner')).not.toBeNull();

    host.loading.set(false);
    await fixture.whenStable();
    expect(button('Third').querySelector('.spinner')).toBeNull();
    expect(button('Fourth').querySelector('.spinner')).toBeNull();
  });

  it('renders a change made after an asynchronous task', async () => {
    setTimeout(() => host.secondInMenu.set(true));
    await delay();
    await fixture.whenStable();
    expect(inlineLabels()).toEqual(['First', 'Third']);
  });

  it('emits the click of a button to an OnPush host', async () => {
    button('Third').click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('output').textContent).toBe('1');
  });

  it('shows the common strings localized after the first render', async () => {
    const icon = () => overflow().querySelector('cds-icon');
    expect(icon().getAttribute('title')).toBe('More');

    TestBed.inject(ClrCommonStringsService).localize({ more: 'Plus' });
    await fixture.whenStable();
    expect(icon().getAttribute('title')).toBe('Plus');
  });

  it('closes the menu and removes its buttons when the group is destroyed', async () => {
    await openMenu();
    expect(menuLabels()).toEqual(['Fourth']);

    fixture.destroy();
    expect(document.querySelector('.clr-button-group-menu')).toBeNull();
  });
});

describe('Button group with routerLinkActive (zoneless, OnPush host)', () => {
  it('sets the active classes on the inline and menu buttons after a navigation', async () => {
    TestBed.configureTestingModule({
      imports: [ClrButtonGroupModule, RouterLink, RouterLinkActive],
      declarations: [RouterButtonGroupHost],
      providers: [
        provideRouter([
          { path: 'one', component: EmptyRoute },
          { path: 'two', component: EmptyRoute },
        ]),
      ],
    });
    const fixture = TestBed.createComponent(RouterButtonGroupHost);
    fixture.autoDetectChanges();
    await fixture.whenStable();
    const inline: HTMLButtonElement = fixture.nativeElement.querySelector('clr-button-group > button');
    expect(inline.classList).not.toContain('btn-primary');

    await TestBed.inject(Router).navigateByUrl('/one');
    await fixture.whenStable();
    expect(inline.classList).toContain('btn-primary');

    await TestBed.inject(Router).navigateByUrl('/two');
    fixture.nativeElement.querySelector('.dropdown-toggle').click();
    await fixture.whenStable();
    expect(inline.classList).not.toContain('btn-primary');
    expect(document.querySelector('.clr-button-group-menu > button').classList).toContain('btn-primary');
    fixture.destroy();
  });
});

describe('Loading button (zoneless, OnPush host)', () => {
  let fixture: ComponentFixture<LoadingButtonHost>;
  let host: LoadingButtonHost;
  let element: HTMLButtonElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ClrLoadingButtonModule, ClrLoadingModule],
      declarations: [LoadingButtonHost],
    });
    fixture = TestBed.createComponent(LoadingButtonHost);
    host = fixture.componentInstance;
    fixture.autoDetectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement.querySelector('button');
  });

  afterEach(() => fixture.destroy());

  it('shows the spinner while loading and the content again after an error', async () => {
    host.state.set(ClrLoadingState.LOADING);
    await fixture.whenStable();
    expect(element.querySelector('.spinner')).not.toBeNull();
    expect(element.querySelector('.clr-loading-btn-content')).toBeNull();
    expect(element.disabled).toBe(true);

    host.state.set(ClrLoadingState.ERROR);
    await fixture.whenStable();
    expect(element.querySelector('.spinner')).toBeNull();
    expect(element.querySelector('.clr-loading-btn-content')).not.toBeNull();
    expect(element.disabled).toBe(false);
  });

  // Without animations, the success state ends right after the check mark is rendered.
  it('reports the default state back to the host after the success state', async () => {
    host.state.set(ClrLoadingState.SUCCESS);
    await fixture.whenStable();
    await delay();
    await fixture.whenStable();
    expect(host.state()).toBe(ClrLoadingState.DEFAULT);
    expect(element.querySelector('.spinner-check')).toBeNull();
    expect(element.querySelector('.clr-loading-btn-content')).not.toBeNull();
  });

  it('keeps the disabled input of the host after loading', async () => {
    host.disabled.set(true);
    host.state.set(ClrLoadingState.LOADING);
    await fixture.whenStable();
    host.state.set(ClrLoadingState.DEFAULT);
    await fixture.whenStable();
    expect(element.disabled).toBe(true);

    host.disabled.set(false);
    await fixture.whenStable();
    expect(element.disabled).toBe(false);
  });

  it('shows a state set after an asynchronous task', async () => {
    setTimeout(() => host.state.set(ClrLoadingState.LOADING));
    await delay();
    await fixture.whenStable();
    expect(element.querySelector('.spinner')).not.toBeNull();
  });
});
