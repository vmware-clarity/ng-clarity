/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service.js';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces.js';
import { airplaneIcon, airplaneIconName } from '../shapes/airplane.js';
import { bicycleIcon, bicycleIconName } from '../shapes/bicycle.js';
import { boatIcon, boatIconName } from '../shapes/boat.js';
import { campervanIcon, campervanIconName } from '../shapes/campervan.js';
import { canoeIcon, canoeIconName } from '../shapes/canoe.js';
import { carIcon, carIconName } from '../shapes/car.js';
import { caravanIcon, caravanIconName } from '../shapes/caravan.js';
import { castleIcon, castleIconName } from '../shapes/castle.js';
import { compassIcon, compassIconName } from '../shapes/compass.js';
import { ferryIcon, ferryIconName } from '../shapes/ferry.js';
import { gymIcon, gymIconName } from '../shapes/gym.js';
import { hotelIcon, hotelIconName } from '../shapes/hotel.js';
import { mapMarkerIcon, mapMarkerIconName } from '../shapes/map-marker.js';
import { mapIcon, mapIconName } from '../shapes/map.js';
import { noSmokingIcon, noSmokingIconName } from '../shapes/no-smoking.js';
import { onHolidayIcon, onHolidayIconName } from '../shapes/on-holiday.js';
import { palmTreeIcon, palmTreeIconName } from '../shapes/palm-tree.js';
import { passportIcon, passportIconName } from '../shapes/passport.js';
import { planeTicketIcon, planeTicketIconName } from '../shapes/plane-ticket.js';
import { poolIcon, poolIconName } from '../shapes/pool.js';
import { smokingIcon, smokingIconName } from '../shapes/smoking.js';
import { suitcase2Icon, suitcase2IconName } from '../shapes/suitcase-2.js';
import { suitcaseIcon, suitcaseIconName } from '../shapes/suitcase.js';
import { tentIcon, tentIconName } from '../shapes/tent.js';
import { trailerIcon, trailerIconName } from '../shapes/trailer.js';
import { trainIcon, trainIconName } from '../shapes/train.js';
import { truckIcon, truckIconName } from '../shapes/truck.js';

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
 * import '@cds/core/icon/register.js';
 * import { loadTravelIconSet } from '@cds/core/icon';
 *
 * loadTravelIconSet();
 * ```
 *
 */
export function loadTravelIconSet() {
  ClarityIcons.addIcons(...travelCollectionIcons);
  ClarityIcons.addAliases(...travelCollectionAliases);
}

declare module '@cds/core/internal' {
  interface IconRegistrySources {
    [airplaneIconName]: string;
    [bicycleIconName]: string;
    [boatIconName]: string;
    [canoeIconName]: string;
    [carIconName]: string;
    [caravanIconName]: string;
    [campervanIconName]: string;
    [castleIconName]: string;
    [compassIconName]: string;
    [ferryIconName]: string;
    [gymIconName]: string;
    [hotelIconName]: string;
    [mapIconName]: string;
    [mapMarkerIconName]: string;
    [noSmokingIconName]: string;
    [onHolidayIconName]: string;
    [palmTreeIconName]: string;
    [passportIconName]: string;
    [planeTicketIconName]: string;
    [poolIconName]: string;
    [smokingIconName]: string;
    [suitcaseIconName]: string;
    [suitcase2IconName]: string;
    [tentIconName]: string;
    [trailerIconName]: string;
    [trainIconName]: string;
    [truckIconName]: string;
  }
}
