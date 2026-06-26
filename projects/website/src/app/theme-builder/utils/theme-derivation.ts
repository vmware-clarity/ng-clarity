/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { shiftL } from './color';
import { DerivableField, DerivedSet, ThemeColors } from './types';

export function effectiveValue(f: DerivableField): string {
  return f.useManual ? f.override : f.auto;
}

function computeAutos(base: ThemeColors, isDark: boolean): Record<string, string> {
  const tk = (
    key: 'primary' | 'success' | 'warning' | 'danger',
    tint: number,
    shade: number,
    hover: number,
    active: number
  ) => ({
    [`${key}Tint`]: shiftL(base[key], isDark ? -tint : tint),
    [`${key}Shade`]: shiftL(base[key], isDark ? shade : -shade),
    [`${key}Hover`]: shiftL(base[key], isDark ? hover : -hover),
    [`${key}Active`]: shiftL(base[key], isDark ? active : -active),
  });
  return {
    ...tk('primary', 40, 7, 10, 17),
    ...tk('success', 40, 7, 10, 17),
    ...tk('warning', 35, 9, 10, 17),
    ...tk('danger', 40, 7, 10, 17),
  };
}

export function buildDerivedSet(base: ThemeColors, existing: DerivedSet | null, isDark: boolean): DerivedSet {
  const autos = computeAutos(base, isDark);
  const make = (key: string): DerivableField => {
    const auto = autos[key] ?? '#000000';
    const prev = existing?.[key as keyof DerivedSet];
    return {
      auto,
      override: prev?.useManual ? prev.override : auto,
      useManual: prev?.useManual ?? false,
    };
  };
  return {
    primaryTint: make('primaryTint'),
    primaryShade: make('primaryShade'),
    primaryHover: make('primaryHover'),
    primaryActive: make('primaryActive'),
    successTint: make('successTint'),
    successShade: make('successShade'),
    successHover: make('successHover'),
    successActive: make('successActive'),
    warningTint: make('warningTint'),
    warningShade: make('warningShade'),
    warningHover: make('warningHover'),
    warningActive: make('warningActive'),
    dangerTint: make('dangerTint'),
    dangerShade: make('dangerShade'),
    dangerHover: make('dangerHover'),
    dangerActive: make('dangerActive'),
  };
}
