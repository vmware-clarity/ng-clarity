/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { inject, TestBed } from '@angular/core/testing';

import { CsvHelperService } from './csv-helper.service';

describe('ExportProviderService', () => {
  beforeEach(function (this: any) {
    TestBed.configureTestingModule({
      providers: [CsvHelperService],
    });

    this.serialKeyLicenseItems = [
      {
        name: 'License 1',
        usage: '0 CPUs',
      },
      {
        name: 'License 2',
        usage: '10 CPUs',
      },
      {
        name: 'License 3',
        usage: '20 CPUs',
      },
      {
        name: 'License 4',
        usage: '30 CPUs',
      },
    ];

    this.columnDef = [
      {
        field: 'name',
        displayName: 'Name',
      },
      {
        field: 'usage',
        displayName: 'Usage',
      },
    ];
  });

  it('getData returns the correct csv', inject(
    [CsvHelperService],
    function (this: any, csvHelperService: CsvHelperService) {
      const columnNames: string[] = [
        csvHelperService.toCsvFormat(this.columnDef[0].displayName.toString()),
        csvHelperService.toCsvFormat(this.columnDef[1].displayName.toString()),
      ];
      const rows: string[] = [
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[0].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[0].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[1].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[1].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[2].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[2].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[3].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[3].usage.toString()),
      ];
      const expectedCsvData = columnNames.join(',') + '\n' + rows.join('\n') + '\n';

      const csvData = csvHelperService.getData(this.serialKeyLicenseItems, this.columnDef);
      expect(csvData).toEqual(expectedCsvData);
    }
  ));

  it('getColumnDataFromColumnDef returns the correct column csv', inject(
    [CsvHelperService],
    function (this: any, csvHelperService: CsvHelperService) {
      const columnNames: string[] = [
        csvHelperService.toCsvFormat(this.columnDef[0].displayName.toString()),
        csvHelperService.toCsvFormat(this.columnDef[1].displayName.toString()),
      ];
      const expectedCsvData: string = columnNames.join(',') + '\n';
      const csvData = csvHelperService.getColumnDataFromColumnDef(this.columnDef);
      expect(csvData).toEqual(expectedCsvData);
    }
  ));

  it('getRowDataFromColumnDef returns the correct row csv', inject(
    [CsvHelperService],
    function (this: any, csvHelperService: CsvHelperService) {
      const rows: string[] = [
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[0].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[0].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[1].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[1].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[2].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[2].usage.toString()),
        csvHelperService.toCsvFormat(this.serialKeyLicenseItems[3].name.toString()) +
          ',' +
          csvHelperService.toCsvFormat(this.serialKeyLicenseItems[3].usage.toString()),
      ];
      const expectedCsvData = rows.join('\n') + '\n';

      const csvData = csvHelperService.getRowDataFromColumnDef(this.serialKeyLicenseItems, this.columnDef);
      expect(csvData).toEqual(expectedCsvData);
    }
  ));
});
