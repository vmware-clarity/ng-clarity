import * as i0 from '@angular/core';
import { Injectable } from '@angular/core';

/**
 * Service for managing groups of items that can be dragged and dropped with CdkDropList.
 */
class DragAndDropGroupService {
    constructor() {
        this.groups = new Map();
    }
    /**
     * Retrieves the items (CdkDropList instances) belonging to a specific group.
     *
     * @param group The name of the group to retrieve items for.
     * @returns An array of CdkDropList instances belonging to the specified group.
     */
    getGroupItems(group) {
        const items = this.groups.get(group);
        if (items) {
            return items;
        }
        const emptyItems = [];
        this.groups.set(group, emptyItems);
        return emptyItems;
    }
    /**
     * Adds a CdkDropList item to the specified group.
     *
     * @param group The name of the group to add the item to.
     * @param item The CdkDropList instance to add to the group.
     */
    addGroupItem(group, item) {
        const items = this.groups.get(group) ?? [];
        if (!items.includes(item)) {
            items.push(item);
            this.groups.set(group, items);
        }
    }
    /**
     * Removes a CdkDropList item from the specified group.
     *
     * @param group The name of the group to remove the item from.
     * @param item The CdkDropList instance to remove from the group.
     */
    removeGroupItem(group, item) {
        const items = this.groups.get(group);
        if (!items) {
            return;
        }
        const index = items.indexOf(item);
        if (index < 0) {
            return;
        }
        items.splice(index, 1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragAndDropGroupService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragAndDropGroupService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.3", ngImport: i0, type: DragAndDropGroupService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Generated bundle index. Do not edit.
 */

export { DragAndDropGroupService };
//# sourceMappingURL=clr-addons-drag-and-drop.mjs.map
