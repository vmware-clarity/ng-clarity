/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { MenuItemType } from './menu-item.token';
import { NestedMenu } from './nested-menu';

describe('NestedMenu', () => {
  it('should create a NestedMenu instance', () => {
    const nestedMenu = new NestedMenu();
    expect(nestedMenu).toBeInstanceOf(NestedMenu);
    expect(nestedMenu.type).toEqual(MenuItemType.menu);
  });

  it('should set text and iconClass properties', () => {
    const nestedMenu = new NestedMenu();
    nestedMenu.text = 'Nested Menu';
    nestedMenu.iconClass = 'menu-icon';

    expect(nestedMenu.text).toEqual('Nested Menu');
    expect(nestedMenu.iconClass).toEqual('menu-icon');
  });

  it('should have menuItems property as Iterable<MenuItem>', () => {
    const menuItem1 = new NestedMenu();
    const menuItem2 = new NestedMenu();

    const nestedMenu = new NestedMenu();
    nestedMenu.menuItems = [menuItem1, menuItem2];

    expect(nestedMenu.menuItems).toEqual([menuItem1, menuItem2]);
  });
});
