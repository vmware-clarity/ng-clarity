/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EmbeddedViewRef, Type } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Interface for all needed properties
 * to render card inside Appfx card container
 */
export interface AppfxCard {
  /**
   *  unique id of the Card
   */
  id: string;

  /**
   * Card component class to render.
   */
  componentClass: Type<any>;

  /**
   *  (@optional)
   *  Title of the Card to display in settings drop-down menu to show/hide
   *  If not pass then show/hide option will not be available for card
   *  (@see) appfx-container-settings
   */
  title: string;

  /**
   * (@optional)
   * Width of the card in multiple of units calculated as below -
   *
   * unitWidth * unitWidthInPixels(258px) + lengthOfGutters * unitGutterSizeInPixels(18px)
   *
   * lengthOfGutters -in between gutters are number of units - 1
   *
   * 1 unit -> 258px
   * 2 unit -> 258*2 + 18 -> 534px
   * 3 unit -> 258*3 + 18*2 -> 810px ....
   * -1 unit -> remove width of the card, can be helpful in 4x zoom
   *
   * If not provided default is 1 unit
   *
   * Note: gets applied on the .card class, keep card structure as per Clarity design
   */
  unitWidth?: number;

  /**
   *  (@optional)
   *  Height of the card in multiple of units
   *  card height is unitHeight * unitHeightInPixels(58px) + in between gutters * unitGutterSizeInPixels(18px)
   *  in between gutters are number of units - 1
   *  1 unit -> 58px
   *  5 unit -> 58*5 + 18*4 -> 362px
   *  7 unit -> 58*7 + 18*6 -> 514px ....
   *  -1 unit -> remove height of the card body, can be helpful in 4x zoom
   *
   *  If not provided default is 5 units
   *
   *  Note: gets applied on the .card-block class, keep card structure as per Clarity design
   *        if .card-footer is added, .card-footer for the appfx-card will get 50px height,
   *           in this case .card-block height will get adjusted accordingly
   *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
   *        if .card-header is added, .card-header for the appfx-card will get 50px height,
   *           in this case .card-block height will get adjusted accordingly
   *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -> 312px
   *        if .card-footer and .card-header is added
   *           in this case .card-block height will get adjusted accordingly
   *           for e.g 5 unit -> 58*5 + 18*4 -> 362px - 50px -50px -> 262px
   */
  unitHeight?: number;

  /**
   * (@optional)
   * If false then user will not able to hide the card from container settings drop down menu
   * which shows list of cards to show/hide
   *  (@see) appfx-container-settings
   */
  canHide?: boolean;

  /**
   * (@optional)
   * sends as input properties to dynamically created componentClass instance
   */
  context?: AppfxCardContext;

  /**
   * (@optional)
   * Card size in 2x zoom (zoom2x)  and in 4x zoom (zoom4x)
   */
  cardZoomSizes?: AppfxCardZoomSizes;
}

/**
 * Card context which is pass as input properties
 * to the AppfxCard componentClass
 */
export interface AppfxCardContext {
  [key: string]: object;
}

/**
 * Internal properties of the card needed to
 * maintain order, display and rendering
 */
export interface AppfxCardInternal extends AppfxCard {
  /**
   *  To toggle the card visibility from the Container Settings dropdown
   */
  hidden: boolean;
  /**
   *  Indicates Order of the card inside card container view
   */
  order: number;
  /**
   *  To keep get order of card from ViewContainerRef
   */
  view: EmbeddedViewRef<void>;
}

/**
 * Store to save CardContainer state information
 * e.g. card attributes order, hidden etc
 */
export interface AppfxContainerPersistenceStore {
  retrieve: () => Observable<AppfxCardSettings[]>;
  save: (cardSettings: AppfxCardSettings[]) => void;
}

/**
 * Card Settings properties
 */
export type AppfxCardSettings = Pick<AppfxCardInternal, 'id' | 'order' | 'hidden'>;

/**
 * Defines card size in 2x zoom (zoom2x)
 * and in 4x zoom (zoom4x).
 */
export interface AppfxCardZoomSizes {
  zoom2x?: {
    unitWidth?: number;
    unitHeight?: number;
  };
  zoom4x?: {
    unitWidth?: number;
    unitHeight?: number;
  };
}
