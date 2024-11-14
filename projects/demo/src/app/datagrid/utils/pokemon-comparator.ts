/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridComparatorInterface } from '@clr/angular';

import { User } from '../inventory/user';

export class PokemonComparator implements ClrDatagridComparatorInterface<User> {
  compare(a: User, b: User) {
    return a.pokemon.number - b.pokemon.number;
  }
}
