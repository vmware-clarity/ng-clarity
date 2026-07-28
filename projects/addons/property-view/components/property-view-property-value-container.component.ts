/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { PropertyViewPropertyValueComponent } from '../property-view.model';

/**
 * Component used to dynamically render
 * a given component passed as a property of the PropertyViewPropertyComponentValueModel
 */
@Component({
  selector: 'appfx-property-view-property-value-component',
  standalone: false,
  template: '',
})
export class PropertyViewPropertyValueContainerComponent<T> implements OnInit, OnChanges, OnDestroy {
  @Input() componentType?: Type<PropertyViewPropertyValueComponent<T>> | null;

  @Input() componentModel?: T | null;

  #pageComponent?: PropertyViewPropertyValueComponent<T>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.createComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.componentType && !changes.componentType.firstChange) {
      this.createComponent();
    } else if (changes.componentModel && !changes.componentModel.firstChange) {
      if (this.#pageComponent) {
        this.#pageComponent.model = this.componentModel;
        this.cdRef.detectChanges();
      }
    } else {
      // no action
    }
  }

  ngOnDestroy(): void {
    this.clear();
  }

  private createComponent(): void {
    this.clear();
    if (!this.componentType) {
      return;
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.componentType);
    const componentRef = this.viewContainer.createComponent(componentFactory);
    this.#pageComponent = componentRef.instance;
    this.#pageComponent.model = this.componentModel;
    this.cdRef.detectChanges();
  }

  private clear(): void {
    this.viewContainer.clear();
    this.#pageComponent = undefined;
  }
}
