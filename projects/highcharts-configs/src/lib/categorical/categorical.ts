/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// import * as tokens from '@cds/core/tokens/tokens';
import * as HighCharts from 'highcharts';

import tokens from '../tokens'; // Replace with original import once https://github.com/vmware-clarity/core/pull/341 is merged and released

export abstract class Categorical {
  static get colors(): Record<string, string> {
    const colorTokens = Object.entries(tokens).filter(([key]) => key.startsWith('aliasVizGeneral'));

    const colorMap = colorTokens.reduce((acc, [key, value]) => {
      acc[key] = value as string;
      return acc;
    }, {} as Record<string, string>);

    return colorMap;
  }

  static get colorValues() {
    return Object.entries(Categorical.colors).map(([_key, value]) => value as string);
  }

  static get recommendedConfig(): HighCharts.Options {
    const defaultStyle = {
      fontFamily: 'Metropolis',
      color: tokens.aliasTypographyColor450,
    };
    return {
      colors: Categorical.colorValues,
      chart: {
        backgroundColor: tokens.aliasObjectContainerBackground,
        plotBorderColor: tokens.aliasVizBorder,
        plotBorderWidth: 2,
        style: defaultStyle,
      },

      title: {
        style: defaultStyle,
      },
      xAxis: {
        lineColor: 'tokens.aliasVizBorder',
        labels: {
          style: defaultStyle,
        },
        title: {
          style: defaultStyle,
        },
      },
      yAxis: {
        labels: {
          style: defaultStyle,
        },
        title: {
          style: defaultStyle,
        },
      },
      legend: {
        title: {
          style: defaultStyle,
        },
        itemStyle: defaultStyle,
        itemHoverStyle: {
          color: tokens.aliasTypographyColor200,
        },
      },
      plotOptions: {
        series: {
          borderColor: tokens.aliasVizBorder,
        },
      },
    };
  }
}
