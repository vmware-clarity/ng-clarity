/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkDrag } from '@angular/cdk/drag-drop';
import { Directive, NgModule } from '@angular/core';

/**
 * This is just a copy of CdkDrag so it can be used independent of the rest of the CdkDragDropModule.
 */
@Directive({
  selector: '[cdkDrag]',
})
export class CdkDragModule_CdkDrag extends CdkDrag {}

/**
 * This module allows us to avoid importing all of CdkDragDropModule which results in a smaller application bundle.
 */
@NgModule({
  declarations: [CdkDragModule_CdkDrag],
  exports: [CdkDragModule_CdkDrag],
})
export class CdkDragModule {}
