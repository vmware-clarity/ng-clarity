/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { axisChartIcon } from '../shapes/axis-chart';
import { barChartIcon } from '../shapes/bar-chart';
import { bellCurveIcon } from '../shapes/bell-curve';
import { boxPlotIcon } from '../shapes/box-plot';
import { bubbleChartIcon } from '../shapes/bubble-chart';
import { cloudChartIcon } from '../shapes/cloud-chart';
import { curveChartIcon } from '../shapes/curve-chart';
import { gridChartIcon } from '../shapes/grid-chart';
import { heatMapIcon } from '../shapes/heat-map';
import { lineChartIcon, lineChartIconName } from '../shapes/line-chart';
import { pieChartIcon } from '../shapes/pie-chart';
import { scatterPlotIcon } from '../shapes/scatter-plot';
import { tickChartIcon } from '../shapes/tick-chart';

export const chartCollectionIcons: IconShapeTuple[] = [
  axisChartIcon,
  barChartIcon,
  bellCurveIcon,
  boxPlotIcon,
  bubbleChartIcon,
  cloudChartIcon,
  curveChartIcon,
  gridChartIcon,
  heatMapIcon,
  lineChartIcon,
  pieChartIcon,
  scatterPlotIcon,
  tickChartIcon,
];

export const chartCollectionAliases: IconAlias[] = [[lineChartIconName, ['analytics']]];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadChartIconSet } from '@clr/angular';
 *
 * loadChartIconSet();
 * ```
 *
 */
export function loadChartIconSet() {
  ClarityIcons.addIcons(...chartCollectionIcons);
  ClarityIcons.addAliases(...chartCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [axisChartIconName]: string;
//     [barChartIconName]: string;
//     [bellCurveIconName]: string;
//     [boxPlotIconName]: string;
//     [bubbleChartIconName]: string;
//     [cloudChartIconName]: string;
//     [curveChartIconName]: string;
//     [gridChartIconName]: string;
//     [heatMapIconName]: string;
//     [lineChartIconName]: string;
//     [pieChartIconName]: string;
//     [scatterPlotIconName]: string;
//     [tickChartIconName]: string;
//   }
// }
