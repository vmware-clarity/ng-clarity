/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Location } from '@angular/common';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { delay } from '@clr/angular/testing';

import { ClrLayoutModule } from '../layout.module';

@Component({
  template: `<clr-breadcrumbs [items]="menuItems"></clr-breadcrumbs>`,
  standalone: false,
})
class TestComponent {
  menuItems = [
    { label: 'Home', routerLink: '/home' },
    { label: 'Parent Page', routerLink: '/parent' },
    { label: 'Current Page', routerLink: '/child' },
    { label: 'Grandchild Page', routerLink: '/grandchild' },
    { label: 'Last Page', routerLink: '/last' },
  ];
}

describe('ClrBreadcrumbs', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let breadcrumbs: DebugElement;
  let breadcrumbList: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ClrLayoutModule,
        RouterTestingModule.withRoutes([
          { path: 'home', component: TestComponent },
          { path: 'child', component: TestComponent },
        ]),
      ],
      declarations: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    breadcrumbs = fixture.debugElement.query(By.css('clr-breadcrumbs'));
    breadcrumbList = breadcrumbs.query(By.css('.clr-breadcrumb-menu'));
  });

  it('should have each breadcrumb as a clickable item which navigates to its corresponding page', async () => {
    const item = breadcrumbList.queryAll(By.css('.clr-breadcrumb-item'))[1].query(By.css('a'));
    item.nativeElement.click();
    fixture.detectChanges();
    await delay(1);
    const location: Location = TestBed.inject(Location);
    expect(location.path()).toEqual('/child');
  });

  it('should have a seperator between breadcrumbs', () => {
    const link = breadcrumbList.nativeElement.querySelector('.clr-breadcrumb-item');
    const delimiter = window.getComputedStyle(link, ':after').getPropertyValue('content');
    expect(delimiter).toEqual('"/"');
  });

  it('should have the current page as the last item in a breadcrumb', () => {
    const currentItem = breadcrumbList.children[breadcrumbList.children.length - 1];
    expect(currentItem.children[0].nativeElement.textContent).toEqual('Last Page');
  });

  it('should show collapsed state with ellipsis as the first breadcrumb if more than 3 nested pages', () => {
    const firstItem = breadcrumbList.children[0];
    expect(firstItem.query(By.css('.clr-breadcrumb-expand')).children[0].nativeElement.getAttribute('shape')).toEqual(
      'ellipsis-horizontal'
    );
  });

  it('should not show collapsed state with ellipsis if less than 3 nested pages', () => {
    component.menuItems = [
      { label: 'Home', routerLink: '/home' },
      { label: 'Parent Page', routerLink: '/parent' },
      { label: 'Current Page', routerLink: '/child' },
    ];
    fixture.detectChanges();
    const firstItem = breadcrumbList.children[0];
    expect(firstItem.children[0].nativeElement.textContent.trim()).toEqual('Home');
  });

  it('should show last 3 breadcrumbs if more than 3 nested pages', () => {
    const firstItem = breadcrumbList.children[1];
    const secondItem = breadcrumbList.children[2];
    const thirdItem = breadcrumbList.children[3];
    expect(firstItem.children[0].nativeElement.textContent.trim()).toEqual('Current Page');
    expect(secondItem.children[0].nativeElement.textContent.trim()).toEqual('Grandchild Page');
    expect(thirdItem.children[0].nativeElement.textContent.trim()).toEqual('Last Page');
  });

  it('should show all breadcrumbs if breadcrumbs are expanded', () => {
    const expandLink = breadcrumbList.query(By.css('.clr-breadcrumb-expand'));
    expandLink.nativeElement.click();
    fixture.detectChanges();
    expect(breadcrumbList.children.length).toEqual(5);
  });
});
