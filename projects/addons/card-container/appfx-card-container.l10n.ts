/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Disable the duplicate string check because this is a translations file.

import { AppfxTranslations } from '@clr/addons/translate';

export const translations: AppfxTranslations = {
  en: {
    /**
     * Settings toggle button label for screen readers.
     */
    settingsCog: 'Settings',
    /**
     * Drag handle button label for screen readers.
     */
    cardDragHandle: 'Card drag handle',
    /**
     * Drag handle button describe for screen readers.
     */
    cardDragHandleDescription: 'Press Enter and use left or right key to move the card to a new position.',
  },
  fr: {
    settingsCog: 'Paramètres',

    cardDragHandle: 'Poignée de glissement de carte',

    cardDragHandleDescription:
      'Appuyez sur Entrée et utilisez la flèche vers la gauche ou la droite pour déplacer la carte vers une nouvelle position.',
  },
  es: {
    settingsCog: 'Configuración',

    cardDragHandle: 'Control de arrastre de tarjeta ',

    cardDragHandleDescription:
      'Pulse la tecla Intro y use la tecla de flecha izquierda o derecha para mover la tarjeta a una nueva posición.',
  },
  ja: {
    settingsCog: '設定',

    cardDragHandle: 'カード ドラッグ ハンドル',

    cardDragHandleDescription: 'Enter キーを押し、←または→キーを押してカードを新しい位置に移動します。',
  },
};
