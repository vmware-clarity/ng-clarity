/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { bankIcon } from '../shapes/bank';
import { bitcoinIcon } from '../shapes/bitcoin';
import { calculatorIcon } from '../shapes/calculator';
import { coinBagIcon } from '../shapes/coin-bag';
import { creditCardIcon } from '../shapes/credit-card';
import { dollarIcon } from '../shapes/dollar';
import { dollarBillIcon } from '../shapes/dollar-bill';
import { eCheckIcon } from '../shapes/e-check';
import { employeeIcon } from '../shapes/employee';
import { employeeGroupIcon } from '../shapes/employee-group';
import { euroIcon } from '../shapes/euro';
import { factoryIcon } from '../shapes/factory';
import { pesoIcon } from '../shapes/peso';
import { piggyBankIcon, piggyBankIconName } from '../shapes/piggy-bank';
import { poundIcon } from '../shapes/pound';
import { rubleIcon } from '../shapes/ruble';
import { rupeeIcon } from '../shapes/rupee';
import { shoppingBagIcon } from '../shapes/shopping-bag';
import { shoppingCartIcon } from '../shapes/shopping-cart';
import { storeIcon } from '../shapes/store';
import { walletIcon } from '../shapes/wallet';
import { wonIcon } from '../shapes/won';
import { yenIcon } from '../shapes/yen';

export const commerceCollectionIcons: IconShapeTuple[] = [
  bankIcon,
  bitcoinIcon,
  calculatorIcon,
  creditCardIcon,
  coinBagIcon,
  dollarIcon,
  dollarBillIcon,
  eCheckIcon,
  employeeGroupIcon,
  employeeIcon,
  euroIcon,
  factoryIcon,
  pesoIcon,
  piggyBankIcon,
  poundIcon,
  rubleIcon,
  rupeeIcon,
  shoppingBagIcon,
  shoppingCartIcon,
  storeIcon,
  walletIcon,
  wonIcon,
  yenIcon,
];

export const commerceCollectionAliases: IconAlias[] = [[piggyBankIconName, ['savings']]];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadCommerceIconSet } from '@clr/angular';
 *
 * loadCommerceIconSet();
 * ```
 *
 */
export function loadCommerceIconSet() {
  ClarityIcons.addIcons(...commerceCollectionIcons);
  ClarityIcons.addAliases(...commerceCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [bankIconName]: string;
//     [bitcoinIconName]: string;
//     [calculatorIconName]: string;
//     [coinBagIconName]: string;
//     [creditCardIconName]: string;
//     [dollarIconName]: string;
//     [dollarBillIconName]: string;
//     [eCheckIconName]: string;
//     [employeeIconName]: string;
//     [employeeGroupIconName]: string;
//     [euroIconName]: string;
//     [factoryIconName]: string;
//     [pesoIconName]: string;
//     [piggyBankIconName]: string;
//     [poundIconName]: string;
//     [rubleIconName]: string;
//     [rupeeIconName]: string;
//     [shoppingBagIconName]: string;
//     [shoppingCartIconName]: string;
//     [storeIconName]: string;
//     [walletIconName]: string;
//     [wonIconName]: string;
//     [yenIconName]: string;
//   }
// }
