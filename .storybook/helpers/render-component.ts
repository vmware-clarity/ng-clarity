/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, Input, Type, ViewChild, ViewContainerRef } from '@angular/core';

export type StorybookRenderComponent = Array<{ type: Type<unknown>; options: any }>;

@Component({
  selector: 'storybook-render-component',
  standalone: true,
  template: `<ng-container #container></ng-container>`,
})
export class RenderComponentStorybook implements AfterViewInit {
  @Input() components: Array<{ type: Type<unknown>; options?: any }> = [];

  @ViewChild('container', { read: ViewContainerRef, static: true }) private _container!: ViewContainerRef;

  ngAfterViewInit(): void {
    this.components.forEach(component => {
      const componentRef = this._container.createComponent<any>(component.type);

      if (component.options) {
        Object.assign(componentRef.instance, component.options);
      }
      componentRef.changeDetectorRef.detectChanges();

      const hostEl = componentRef.location.nativeElement as HTMLElement;
      const parent = hostEl.parentNode;

      Array.from(hostEl.childNodes).forEach(child => parent.insertBefore(child, hostEl));
      parent.removeChild(hostEl);
    });
  }
}
