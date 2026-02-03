/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockDatagridColumnToggleComponent } from '@clr/addons/testing';
import { ClrDatagridModule } from '@clr/angular';
import { of } from 'rxjs';

import { DatagridComponent } from '../../datagrid.component';
import { AppfxDatagridModule } from '../../datagrid.module';
import { DatagridStrings } from '../../i18n/datagrid-strings.service';
import { ExportProviderService } from '../export/export-provider.service';
import { appfxDatagridUserPreferencesToken } from './appfx-datagrid-user-preferences.token';
import { DatagridContentNoWrapDirective } from './datagrid-content-no-wrap.directive';
import { DatagridUserPreferencesService } from './datagrid-user-preferences.interfaces';

import Spy = jasmine.Spy;
import createSpyObj = jasmine.createSpyObj;

describe('DatagridContentNoWrapDirective', () => {
  let userPreferencesService: DatagridUserPreferencesService;
  let fixture: ComponentFixture<DatagridHostComponent>;
  let appfxDatagridHostComponent: DatagridHostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClrDatagridModule, FormsModule, NoopAnimationsModule, DragDropModule, OverlayModule],
      declarations: [MockDatagridColumnToggleComponent],
      providers: [
        {
          provide: appfxDatagridUserPreferencesToken,
          useValue: createSpyObj(['getWrapGridCellTextPreference$']),
        },
        {
          provide: DatagridStrings,
          useClass: DatagridStrings,
        },
      ],
    }).overrideProvider(ExportProviderService, {
      useValue: {
        exportUIOnlyData: jasmine.createSpy('exportUIOnlyData'),
      },
    });

    userPreferencesService = TestBed.inject(appfxDatagridUserPreferencesToken);
  });

  it('calls getWrapGridCellTextPreference$ method of datagrid user preferences service', () => {
    (userPreferencesService.getWrapGridCellTextPreference$ as Spy).and.returnValue(of(true));
    fixture = TestBed.createComponent(DatagridHostComponent);
    appfxDatagridHostComponent = fixture.componentInstance;
    fixture.detectChanges(false);
    expect(userPreferencesService.getWrapGridCellTextPreference$).toHaveBeenCalled();
    fixture.detectChanges(false);
    expect(appfxDatagridHostComponent.appfxDatagridComponent.wrapText).toEqual(true);
  });

  it('sets return value from datagrid user preferences service to wrapText datagrid field', () => {
    (userPreferencesService.getWrapGridCellTextPreference$ as Spy).and.returnValue(of(false));
    fixture = TestBed.createComponent(DatagridHostComponent);
    appfxDatagridHostComponent = fixture.componentInstance;
    fixture.detectChanges(false);
    expect(userPreferencesService.getWrapGridCellTextPreference$).toHaveBeenCalled();
    fixture.detectChanges(false);
    expect(appfxDatagridHostComponent.appfxDatagridComponent.wrapText).toEqual(false);
  });

  afterEach(function (this: any) {
    fixture.destroy();
  });
});

@Component({
  selector: 'appfx-datagrid-host-component',
  imports: [AppfxDatagridModule, DragDropModule, FormsModule, OverlayModule],
  template: `<appfx-datagrid></appfx-datagrid>`,
  standalone: true,
})
class DatagridHostComponent {
  @ViewChild(DatagridComponent, { static: true }) appfxDatagridComponent: DatagridComponent<unknown>;

  @ViewChild(DatagridContentNoWrapDirective, { static: true }) directive: DatagridContentNoWrapDirective;
}
