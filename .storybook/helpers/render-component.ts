/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'storybook-render-component',
  template: ` <ng-container #components></ng-container> `,
  standalone: true,
})
export class RenderComponentStorybook {
  @Input() components: Array<{ type: Type<unknown>; options: any }> = [];

  @ViewChild('components', { read: ViewContainerRef }) _components: ViewContainerRef;

  ngAfterViewInit() {
    this.components.forEach(component => {
      const componentRef = this._components.createComponent(component.type);
      Object.assign(componentRef.instance, component.options);
      componentRef.changeDetectorRef.detectChanges();
    });
  }
}
