/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { airplaneIcon, airplaneIconName } from '../shapes/airplane';
import { bicycleIcon } from '../shapes/bicycle';
import { boatIcon } from '../shapes/boat';
import { campervanIcon } from '../shapes/campervan';
import { canoeIcon } from '../shapes/canoe';
import { carIcon } from '../shapes/car';
import { caravanIcon, caravanIconName } from '../shapes/caravan';
import { castleIcon } from '../shapes/castle';
import { compassIcon } from '../shapes/compass';
import { ferryIcon } from '../shapes/ferry';
import { gymIcon } from '../shapes/gym';
import { hotelIcon } from '../shapes/hotel';
import { mapIcon } from '../shapes/map';
import { mapMarkerIcon } from '../shapes/map-marker';
import { noSmokingIcon } from '../shapes/no-smoking';
import { onHolidayIcon } from '../shapes/on-holiday';
import { palmTreeIcon } from '../shapes/palm-tree';
import { passportIcon } from '../shapes/passport';
import { planeTicketIcon } from '../shapes/plane-ticket';
import { poolIcon } from '../shapes/pool';
import { smokingIcon } from '../shapes/smoking';
import { suitcaseIcon } from '../shapes/suitcase';
import { suitcase2Icon } from '../shapes/suitcase-2';
import { tentIcon } from '../shapes/tent';
import { trailerIcon } from '../shapes/trailer';
import { trainIcon } from '../shapes/train';
import { truckIcon } from '../shapes/truck';

export const travelCollectionIcons: IconShapeTuple[] = [
  airplaneIcon,
  bicycleIcon,
  boatIcon,
  carIcon,
  campervanIcon,
  canoeIcon,
  caravanIcon,
  castleIcon,
  compassIcon,
  ferryIcon,
  gymIcon,
  hotelIcon,
  mapIcon,
  mapMarkerIcon,
  noSmokingIcon,
  onHolidayIcon,
  palmTreeIcon,
  passportIcon,
  planeTicketIcon,
  poolIcon,
  smokingIcon,
  suitcaseIcon,
  suitcase2Icon,
  tentIcon,
  trailerIcon,
  trainIcon,
  truckIcon,
];

export const travelCollectionAliases: IconAlias[] = [
  [airplaneIconName, ['plane']],
  [caravanIconName, ['auto']],
];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTravelIconSet } from '@clr/angular';
 *
 * loadTravelIconSet();
 * ```
 *
 */
export function loadTravelIconSet() {
  ClarityIcons.addIcons(...travelCollectionIcons);
  ClarityIcons.addAliases(...travelCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [airplaneIconName]: string;
//     [bicycleIconName]: string;
//     [boatIconName]: string;
//     [canoeIconName]: string;
//     [carIconName]: string;
//     [caravanIconName]: string;
//     [campervanIconName]: string;
//     [castleIconName]: string;
//     [compassIconName]: string;
//     [ferryIconName]: string;
//     [gymIconName]: string;
//     [hotelIconName]: string;
//     [mapIconName]: string;
//     [mapMarkerIconName]: string;
//     [noSmokingIconName]: string;
//     [onHolidayIconName]: string;
//     [palmTreeIconName]: string;
//     [passportIconName]: string;
//     [planeTicketIconName]: string;
//     [poolIconName]: string;
//     [smokingIconName]: string;
//     [suitcaseIconName]: string;
//     [suitcase2IconName]: string;
//     [tentIconName]: string;
//     [trailerIconName]: string;
//     [trainIconName]: string;
//     [truckIconName]: string;
//   }
// }
