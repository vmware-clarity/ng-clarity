/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { PropertyViewConfig } from './property-view-config';

@Injectable()
export class PropertyViewConfigProvider {
  private config: PropertyViewConfig | undefined;
  private configSubject = new BehaviorSubject<PropertyViewConfig | undefined>(undefined);

  getConfig(): PropertyViewConfig | undefined {
    return this.config;
  }

  config$(): Observable<PropertyViewConfig | undefined> {
    return this.configSubject.asObservable();
  }

  setConfig(value: PropertyViewConfig | undefined): void {
    this.config = value;
    this.configSubject.next(value);
  }
}
