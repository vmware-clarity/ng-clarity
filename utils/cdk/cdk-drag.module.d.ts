import { Directionality } from '@angular/cdk/bidi';
import { CdkDrag, DragDrop, DragDropConfig } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
export declare class CdkDragModule_CdkDrag extends CdkDrag {
    /**
     * Include the constructor to forward all the dependencies to the base class
     * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
     * https://github.com/storybookjs/storybook/issues/23534
     */
    constructor(elementRef: ElementRef<HTMLElement>, dropContainer: any, document: any, ngZone: NgZone, viewContainerRef: ViewContainerRef, config: DragDropConfig, dir: Directionality, dragDrop: DragDrop, changeDetectorRef: ChangeDetectorRef);
}
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
export declare class CdkDragModule {
}
