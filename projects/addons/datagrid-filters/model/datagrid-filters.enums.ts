/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export enum ComparisonOperator {
  Contains,
  DoesNotContain,
  Equals,
  DoesNotEqual,
  StartsWith,
  EndsWith,
  IsEmpty,
  LessThan,
  LessThanOrEqualTo,
  GreaterThan,
  GreaterThanOrEqualTo,
  Before,
  BeforeOrEqualTo,
  After,
  AfterOrEqualTo,
  CustomRange,
  LastDay,
  LastWeek,
  LastMonth,
  LastYear,
  TimeSpan,
}

export enum LogicalOperator {
  And,
  Or,
}

export enum FilterMode {
  Quick,
  Advanced,
  AdvancedOnly,
}

export enum PropertyType {
  String,
  Enum,
  Numeric,
  DateTime,
}

export enum Unit {
  Byte,
  KB,
  MB,
  GB,
  TB,
  HZ,
  KHZ,
  MHZ,
  GHZ,
  BytePS,
  KBytePS,
  MBytePS,
  GBytePS,
  BitPS,
  KBitPS,
  MBitPS,
  GBitPS,
}

export enum TimeSpan {
  Minutes,
  Hours,
  Days,
  Weeks,
  Months,
  Years,
}
