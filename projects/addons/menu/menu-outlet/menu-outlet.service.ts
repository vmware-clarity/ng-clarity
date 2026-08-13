/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ComponentRef, Injectable } from '@angular/core';

import { Menu } from '../menu.interface';
import { MenuOutlet } from './menu-outlet';

@Injectable({ providedIn: 'root' })
/**
 * Exposes an imperative way to display a menu.
 */
export class MenuOutletService {
  menuOutlet: MenuOutlet;

  /**
   * Shows and attaches the menu component.
   */
  showMenu(menuComponentRef: ComponentRef<Menu>, e: Event, x: number, y: number, trigger?: HTMLElement): void {
    this.menuOutlet.attachMenu(menuComponentRef);
    menuComponentRef.instance.show(e, x, y, trigger);
    menuComponentRef.instance.closed.subscribe(() => this.closeMenu());
  }

  /**
   * Closes and detaches the menu component
   */
  closeMenu(): void {
    this.menuOutlet.detachMenu();
  }
}
