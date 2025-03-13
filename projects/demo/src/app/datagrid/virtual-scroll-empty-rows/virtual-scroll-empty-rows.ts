/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ListRange } from '@angular/cdk/collections';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ClrDatagridSortOrder } from '@clr/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { DynamicData, Row } from '../inventory/dynamic-data';
import { Inventory } from '../inventory/inventory';
import { User } from '../inventory/user';
import { PokemonComparator } from '../utils/pokemon-comparator';

@Component({
  selector: 'clr-datagrid-virtual-scroll-empty-rows-demo',
  providers: [DynamicData, Inventory],
  templateUrl: './virtual-scroll-empty-rows.html',
  styleUrls: ['../datagrid.demo.scss'],
})
export class DatagridVirtualScrollEmptyRowsDemo implements OnInit, AfterViewChecked {
  userRange: ListRange;
  totalRows = 10000;
  users: Observable<User[]>;

  selectedUsers: User[] = [];
  sortOrder: ClrDatagridSortOrder = ClrDatagridSortOrder.UNSORTED;
  globalFilter = '';

  pokemonComparator = new PokemonComparator();

  constructor(public inventory: Inventory, private dynamicData: DynamicData, private cdr: ChangeDetectorRef) {
    this.users = new BehaviorSubject<User[]>(Array(this.totalRows));

    this.users.subscribe(users => {
      console.log(users);
    });
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    // this.calculateDatagrid();
  }

  setGlobalFilter(value: string) {
    this.globalFilter = value;

    if (value) {
      this.users = new BehaviorSubject<User[]>(this.inventory.all.filter(user => user.name.includes(value)));
    } else {
      this.users = this.inventory.getAllUsersSubject();
    }
  }

  calculateDatagrid() {
    this.loadUsers();
  }

  loadUsers() {
    this.inventory.size = this.totalRows;
    this.inventory.all = [];
    this.inventory.lazyLoadUsers(this.inventory.size);

    this.users = this.inventory.getAllUsersSubject();
  }

  setExpanded($event: boolean, user: User | Row) {
    user.expanded = $event;
  }

  renderUserRangeChange($event: ListRange) {
    this.userRange = $event;
    console.log($event);
  }

  rowByIndex(index: number, user: User) {
    console.log(user);
    return index;
  }

  getIndexes(rows: any[]) {
    const result = [];

    for (let i = 0; i < rows.length; i++) {
      if (i % 1000 === 0) {
        result.push(i);
      }
    }

    return result;
  }
}
