/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDropList } from '@angular/cdk/drag-drop';
import { TestBed } from '@angular/core/testing';

import { DragAndDropGroupService } from './drag-and-drop-group.service';

describe('Service: DragAndDropGroupService', () => {
  let groupService: DragAndDropGroupService;

  const item1 = { id: 1 } as unknown as CdkDropList;
  const item2 = { id: 2 } as unknown as CdkDropList;

  beforeEach(() => {
    const testbed = TestBed.configureTestingModule({
      providers: [DragAndDropGroupService],
    });

    groupService = testbed.inject(DragAndDropGroupService);
  });

  it('no items added', () => {
    const items = groupService.getGroupItems('test-group-empty');

    expect(items).toEqual([]);
  });

  it('items in a group', () => {
    const group = 'test-group-item';
    groupService.addGroupItem(group, item1);
    groupService.addGroupItem(group, item2);
    const items = groupService.getGroupItems(group);

    expect(items).toEqual([item1, item2]);
  });

  it('items in different groups', () => {
    const group1 = 'test-group-1';
    const group2 = 'test-group-2';

    groupService.addGroupItem(group1, item1);
    groupService.addGroupItem(group2, item2);
    const items1 = groupService.getGroupItems(group1);
    const items2 = groupService.getGroupItems(group2);

    expect(items1).toEqual([item1]);
    expect(items2).toEqual([item2]);
  });

  it('avoids duplicates', () => {
    const testGroup = 'test-group';
    groupService.addGroupItem(testGroup, item1);
    groupService.addGroupItem(testGroup, item1);
    const items = groupService.getGroupItems(testGroup);

    expect(items).toEqual([item1]);
  });

  it('allows adding the same item to multiple groups', () => {
    groupService.addGroupItem('test-group-11', item1);
    groupService.addGroupItem('test-group-22', item1);
    const items1 = groupService.getGroupItems('test-group-11');
    const items2 = groupService.getGroupItems('test-group-22');

    expect(items1).toEqual([item1]);
    expect(items2).toEqual([item1]);
  });

  it('can remove items', () => {
    const testGroup = 'test-group';
    expect(groupService.getGroupItems(testGroup)).toEqual([]);

    groupService.addGroupItem(testGroup, item1);
    expect(groupService.getGroupItems(testGroup)).toEqual([item1]);

    groupService.removeGroupItem(testGroup, item1);
    expect(groupService.getGroupItems(testGroup)).toEqual([]);

    groupService.removeGroupItem(testGroup, item2);
    expect(groupService.getGroupItems(testGroup)).toEqual([]);
  });
});
