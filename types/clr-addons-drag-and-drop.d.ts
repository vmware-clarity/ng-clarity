import { CdkDropList } from '@angular/cdk/drag-drop';
import * as i0 from '@angular/core';

/**
 * Service for managing groups of items that can be dragged and dropped with CdkDropList.
 */
declare class DragAndDropGroupService {
    private groups;
    /**
     * Retrieves the items (CdkDropList instances) belonging to a specific group.
     *
     * @param group The name of the group to retrieve items for.
     * @returns An array of CdkDropList instances belonging to the specified group.
     */
    getGroupItems(group: string): readonly CdkDropList[];
    /**
     * Adds a CdkDropList item to the specified group.
     *
     * @param group The name of the group to add the item to.
     * @param item The CdkDropList instance to add to the group.
     */
    addGroupItem(group: string, item: CdkDropList): void;
    /**
     * Removes a CdkDropList item from the specified group.
     *
     * @param group The name of the group to remove the item from.
     * @param item The CdkDropList instance to remove from the group.
     */
    removeGroupItem(group: string, item: CdkDropList): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DragAndDropGroupService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DragAndDropGroupService>;
}

export { DragAndDropGroupService };
