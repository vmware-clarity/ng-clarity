/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { Categorical } from '@clr/highcharts-configs';
import * as Highcharts from 'highcharts';

type DataItem = {
  data: number[];
  type: 'column';
  name: string;
};

function generateArray(n: number): DataItem[] {
  const generateRandomData = (length: number): number[] =>
    Array.from({ length }, () => Math.floor(Math.random() * 500) + 1);

  return Array.from({ length: n }, (_, index) => ({
    data: generateRandomData(12),
    type: 'column',
    name: `Test ${index + 1}`,
  }));
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
})
export class ChartsComponent {
  Highcharts: typeof Highcharts = Highcharts;
  categoricalOptions: Highcharts.Options = Highcharts.merge(Categorical.recommendedConfig, {
    title: {
      text: 'Test Title',
    },
    xAxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    series: generateArray(3),
  });

  ngOnInit() {
    console.log(this.categoricalOptions);
  }
}
