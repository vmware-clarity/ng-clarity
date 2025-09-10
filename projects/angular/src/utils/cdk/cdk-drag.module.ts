/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directionality } from '@angular/cdk/bidi';
import { CDK_DRAG_CONFIG, CDK_DROP_LIST, CdkDrag, DragDrop, DragDropConfig } from '@angular/cdk/drag-drop';
import {
  ChangeDetectorRef,
  Directive,
  DOCUMENT,
  ElementRef,
  Inject,
  NgModule,
  NgZone,
  Optional,
  ViewContainerRef,
} from '@angular/core';

/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
@Directive({
  selector: '[cdkDrag]',
  standalone: false,
})
export class CdkDragModule_CdkDrag extends CdkDrag {
  /**
   * Include the constructor to forward all the dependencies to the base class
   * as a workaround to fix Angular "ɵɵinvalidFactoryDep" error after upgrading storybook
   * https://github.com/storybookjs/storybook/issues/23534
   */
  constructor(
    elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(CDK_DROP_LIST) dropContainer: any,
    @Optional() @Inject(DOCUMENT) document: any,
    ngZone: NgZone,
    viewContainerRef: ViewContainerRef,
    @Optional() @Inject(CDK_DRAG_CONFIG) config: DragDropConfig,
    dir: Directionality,
    dragDrop: DragDrop,
    changeDetectorRef: ChangeDetectorRef
  ) {
    super(elementRef, dropContainer, document, ngZone, viewContainerRef, config, dir, dragDrop, changeDetectorRef);
  }
}

/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
@NgModule({
  declarations: [CdkDragModule_CdkDrag],
  exports: [CdkDragModule_CdkDrag],
})
export class CdkDragModule {}
