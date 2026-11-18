/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { OverlayContainer } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZoomLevel, ZoomLevelService } from '@clr/addons/a11y';
import { ZoomLevelServiceMock } from '@clr/addons/testing';

import { AppfxMenuModule } from './appfx-menu.module';
import { MenuComponent } from './menu.component';

@Component({
  imports: [AppfxMenuModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ZoomLevelService, useClass: ZoomLevelServiceMock }],
  template: `
    <appfx-menu>
      <appfx-menu-header [text]="header()"></appfx-menu-header>
      <appfx-menu-action [text]="action()" [enabled]="enabled()" shortcut="Ctrl+C"></appfx-menu-action>
      <appfx-menu-separator></appfx-menu-separator>
      <appfx-menu [text]="more()">
        <appfx-menu-action [text]="nested()"></appfx-menu-action>
      </appfx-menu>
    </appfx-menu>
  `,
})
class OnPushHost {
  readonly header = signal('Edit');
  readonly action = signal('Copy');
  readonly enabled = signal(true);
  readonly more = signal('More');
  readonly nested = signal('Nested');

  @ViewChild(MenuComponent) menu: MenuComponent;
}

describe('MenuComponent in an OnPush host', () => {
  let fixture: ComponentFixture<OnPushHost>;
  let host: OnPushHost;
  let zoomLevelService: ZoomLevelServiceMock;

  beforeEach(async () => {
    fixture = TestBed.createComponent(OnPushHost);
    host = fixture.componentInstance;
    zoomLevelService = fixture.debugElement.injector.get(ZoomLevelService) as unknown as ZoomLevelServiceMock;
    fixture.autoDetectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.inject(OverlayContainer).ngOnDestroy();
  });

  async function open() {
    // Apps open the menu from their own handlers, for example through MenuOutletService.
    host.menu.show(new Event('contextmenu'), 10, 20);
    await fixture.whenStable();
  }

  function texts(selector: string): string[] {
    return Array.from(document.querySelectorAll(selector)).map(element => element.textContent?.trim() ?? '');
  }

  it('renders its items when it is opened from outside one of its events', async () => {
    await open();

    expect(texts('.dropdown-header .title-text')).toEqual(['Edit']);
    expect(texts('.menu-item-action .menu-item-text')).toEqual(['Copy', 'Nested']);
    expect(texts('.menu-item-shortcut')).toEqual(['Ctrl+C', '']);
    expect(document.querySelectorAll('.dropdown-divider').length).toBe(1);
    expect(texts('button[clrDropdownTrigger]').filter(Boolean)).toEqual(['More']);
  });

  it('renders item inputs that change while it is open', async () => {
    await open();

    host.header.set('Clipboard');
    host.action.set('Paste');
    host.enabled.set(false);
    await fixture.whenStable();

    expect(texts('.dropdown-header .title-text')).toEqual(['Clipboard']);
    expect(texts('.menu-item-action .menu-item-text')).toEqual(['Paste', 'Nested']);
    expect(document.querySelector('button.menu-item-action[data-test-id="Paste"]')?.classList).toContain('disabled');
  });

  it('renders input changes of a nested menu and its items', async () => {
    await open();

    host.more.set('Other');
    host.nested.set('Deeper');
    await fixture.whenStable();

    expect(texts('button[clrDropdownTrigger]').filter(Boolean)).toEqual(['Other']);
    expect(texts('.menu-item-action .menu-item-text')).toEqual(['Copy', 'Deeper']);
  });

  it('renders the zoom level and closes when the zoom level changes', async () => {
    const closed = vi.fn();
    host.menu.closed.subscribe(closed);
    zoomLevelService.resizeSubject.next(ZoomLevel.none);
    await vi.waitFor(() => expect(host.menu.currentZoomLevel).toBe(ZoomLevel.none));
    await open();

    zoomLevelService.resizeSubject.next(ZoomLevel.x4);
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('clr-dropdown.app-menu').classList).toContain('zoom4x');
    expect(closed).toHaveBeenCalledTimes(1);
  });

  it('stops listening to zoom changes when it is destroyed', () => {
    const menu = host.menu;
    const closed = vi.spyOn(menu.closed, 'emit');
    zoomLevelService.resizeSubject.next(ZoomLevel.none);
    fixture.destroy();

    zoomLevelService.resizeSubject.next(ZoomLevel.x2);

    expect(closed).not.toHaveBeenCalled();
  });
});
