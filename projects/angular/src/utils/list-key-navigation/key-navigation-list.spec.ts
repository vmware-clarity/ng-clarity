/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrKeyNavigationList } from './key-navigation-list';
import { ClrKeyNavigationListModule } from './key-navigation-list.module';

@Component({
  template: `
    <section clrKeyNavigationList>
      <div><button>0</button></div>
      <div><button>1</button></div>
      <div><button>2</button></div>
      <div><button>3</button></div>
      <div><button>4</button></div>
      <div><button>5</button></div>
    </section>
  `,
})
class ListTest {
  @ViewChild(ClrKeyNavigationList) keyNav: ClrKeyNavigationList;
}

describe('ClrKeyNaviationList', function () {
  describe('key-navigation-list', () => {
    let fixture: ComponentFixture<ListTest>;
    let componentHTML: HTMLElement;
    let keyListItems: NodeListOf<HTMLElement>;

    beforeEach(async () => {
      TestBed.configureTestingModule({
        imports: [ClrKeyNavigationListModule],
        declarations: [ListTest],
      });
      fixture = TestBed.createComponent(ListTest);
      await fixture.whenStable();
      componentHTML = fixture.nativeElement.querySelector('section');
      keyListItems = componentHTML.querySelectorAll('button');
      fixture.detectChanges();
    });

    afterEach(() => {
      fixture.destroy();
    });

    it('should initialize first item if focus management is enabled', async () => {
      expect(keyListItems[0].tabIndex).toBe(0);
      expect(keyListItems[1].tabIndex).toBe(-1);
    });

    it('should set activate a item on click', async () => {
      keyListItems[2].click();

      fixture.detectChanges();

      expect(keyListItems[0].tabIndex).toBe(-1);
      expect(keyListItems[1].tabIndex).toBe(-1);
      expect(keyListItems[2].tabIndex).toBe(0);
    });

    it('should support horizontal arrow key navigation', async () => {
      fixture.componentInstance.keyNav.configuration = { layout: 'horizontal' };
      fixture.detectChanges();

      keyListItems[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }));
      keyListItems[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight', bubbles: true }));

      fixture.detectChanges();

      expect(keyListItems[0].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[1].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[2].getAttribute('tabindex')).toBe('0');

      keyListItems[2].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true }));
      keyListItems[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft', bubbles: true }));

      fixture.detectChanges();

      expect(keyListItems[0].getAttribute('tabindex')).toBe('0');
      expect(keyListItems[1].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[2].getAttribute('tabindex')).toBe('-1');
    });

    it('should support vertical arrow key navigation', async () => {
      await fixture.whenStable();

      fixture.componentInstance.keyNav.configuration = { layout: 'vertical' };
      fixture.detectChanges();

      keyListItems[0].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));
      keyListItems[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown', bubbles: true }));

      fixture.detectChanges();

      expect(keyListItems[0].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[1].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[2].getAttribute('tabindex')).toBe('0');

      keyListItems[2].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));
      keyListItems[1].dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp', bubbles: true }));

      fixture.detectChanges();

      expect(keyListItems[0].getAttribute('tabindex')).toBe('0');
      expect(keyListItems[1].getAttribute('tabindex')).toBe('-1');
      expect(keyListItems[2].getAttribute('tabindex')).toBe('-1');
    });
  });
});
