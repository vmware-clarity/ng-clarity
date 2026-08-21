/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { MenuOutlet } from './menu-outlet';
import { MenuOutletService } from './menu-outlet.service';

@Component({
  selector: 'menu-outlet',
  standalone: false,
  template: ` <ng-container #vc></ng-container>`,
})
/**
 * Determines the location of a menu shown through instance of MenuOutletService.
 */
export class MenuOutletComponent implements MenuOutlet, OnInit {
  @ViewChild('vc', { read: ViewContainerRef }) vc: ViewContainerRef;

  constructor(private menuOutletService: MenuOutletService) {}

  ngOnInit(): void {
    this.menuOutletService.menuOutlet = this;
  }

  /**
   * Adds the menu component to the component's container.
   */
  attachMenu(menuComponentRef: ComponentRef<any>): void {
    this.vc.clear();
    this.vc.insert(menuComponentRef.hostView);
    menuComponentRef.changeDetectorRef.detectChanges();
  }

  /**
   * Removes to menu component from the component's container.
   */
  detachMenu(): void {
    this.vc.clear();
  }
}
