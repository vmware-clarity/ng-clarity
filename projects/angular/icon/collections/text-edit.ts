/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClarityIcons } from '../icon.service';
import { IconAlias, IconShapeTuple } from '../interfaces/icon.interfaces';
import { alignBottomIcon } from '../shapes/align-bottom';
import { alignCenterIcon } from '../shapes/align-center';
import { alignLeftIcon } from '../shapes/align-left';
import { alignLeftTextIcon } from '../shapes/align-left-text';
import { alignMiddleIcon } from '../shapes/align-middle';
import { alignRightIcon } from '../shapes/align-right';
import { alignRightTextIcon } from '../shapes/align-right-text';
import { alignTopIcon } from '../shapes/align-top';
import { blockQuoteIcon } from '../shapes/block-quote';
import { boldIcon } from '../shapes/bold';
import { bulletListIcon } from '../shapes/bullet-list';
import { centerTextIcon } from '../shapes/center-text';
import { checkboxListIcon } from '../shapes/checkbox-list';
import { fontSizeIcon } from '../shapes/font-size';
import { highlighterIcon } from '../shapes/highlighter';
import { indentIcon } from '../shapes/indent';
import { italicIcon } from '../shapes/italic';
import { justifyTextIcon } from '../shapes/justify-text';
import { languageIcon } from '../shapes/language';
import { numberListIcon } from '../shapes/number-list';
import { outdentIcon } from '../shapes/outdent';
import { paintRollerIcon } from '../shapes/paint-roller';
import { strikethroughIcon } from '../shapes/strikethrough';
import { subscriptIcon } from '../shapes/subscript';
import { superscriptIcon } from '../shapes/superscript';
import { textIcon } from '../shapes/text';
import { textColorIcon } from '../shapes/text-color';
import { underlineIcon } from '../shapes/underline';

export const textEditCollectionIcons: IconShapeTuple[] = [
  alignBottomIcon,
  alignCenterIcon,
  alignLeftIcon,
  alignLeftTextIcon,
  alignMiddleIcon,
  alignRightIcon,
  alignRightTextIcon,
  alignTopIcon,
  blockQuoteIcon,
  boldIcon,
  bulletListIcon,
  centerTextIcon,
  checkboxListIcon,
  fontSizeIcon,
  highlighterIcon,
  indentIcon,
  italicIcon,
  justifyTextIcon,
  languageIcon,
  numberListIcon,
  outdentIcon,
  paintRollerIcon,
  strikethroughIcon,
  subscriptIcon,
  superscriptIcon,
  textIcon,
  textColorIcon,
  underlineIcon,
];

export const textEditCollectionAliases: IconAlias[] = [];

/**
 * Function that can be called to load the core icon set.
 *
 * ```typescript
 * import { loadTextEditIconSet } from '@clr/angular';
 *
 * loadTextEditIconSet();
 * ```
 *
 */
export function loadTextEditIconSet() {
  ClarityIcons.addIcons(...textEditCollectionIcons);
  ClarityIcons.addAliases(...textEditCollectionAliases);
}

// declare module '@clr/angular' {
//   interface IconRegistrySources {
//     [alignBottomIconName]: string;
//     [alignCenterIconName]: string;
//     [alignLeftIconName]: string;
//     [alignLeftTextIconName]: string;
//     [alignMiddleIconName]: string;
//     [alignRightIconName]: string;
//     [alignRightTextIconName]: string;
//     [alignTopIconName]: string;
//     [blockQuoteIconName]: string;
//     [boldIconName]: string;
//     [bulletListIconName]: string;
//     [centerTextIconName]: string;
//     [checkboxListIconName]: string;
//     [fontSizeIconName]: string;
//     [highlighterIconName]: string;
//     [indentIconName]: string;
//     [italicIconName]: string;
//     [justifyTextIconName]: string;
//     [languageIconName]: string;
//     [numberListIconName]: string;
//     [outdentIconName]: string;
//     [paintRollerIconName]: string;
//     [strikethroughIconName]: string;
//     [subscriptIconName]: string;
//     [superscriptIconName]: string;
//     [textIconName]: string;
//     [textColorIconName]: string;
//     [underlineIconName]: string;
//   }
// }
