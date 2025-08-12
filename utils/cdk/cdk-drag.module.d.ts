import { Directionality } from '@angular/cdk/bidi';
import { CdkDrag, DragDrop, DragDropConfig } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, ElementRef, NgZone, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
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
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDragModule_CdkDrag, [null, { optional: true; }, { optional: true; }, null, null, { optional: true; }, null, null, null]>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<CdkDragModule_CdkDrag, "[cdkDrag]", never, {}, {}, never, never, false, never>;
}
/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
export declare class CdkDragModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CdkDragModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CdkDragModule, [typeof CdkDragModule_CdkDrag], never, [typeof CdkDragModule_CdkDrag]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CdkDragModule>;
}
