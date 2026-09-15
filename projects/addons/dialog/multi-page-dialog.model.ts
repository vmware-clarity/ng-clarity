/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { TabLayout } from '@clr/addons/var';
import { Observable } from 'rxjs';

/**
 * The modal options with which the multi page dialog should be opened.
 */
export interface DialogOptions {
  /**
   * Specify the dialog height in pixels. The clarity modal sizes set only the
   * width of the modal dialog, so the height needs to be explicitly set, else
   * the dialog height will vary.
   * The height should be specified with px - for example: height: '800px'.
   * The multi page dialog has a default min height 545px.
   */
  height?: string;

  /**
   * Specify the layout of the tab pages - horizontal or vertical tabs.
   * If it is not specified, the default layout is horizontal.
   * It is recommended to use the horizontal tabs if the number of tabs is less than 3,
   * and vertical tabs if they are more.
   */
  tabLayout?: TabLayout;

  /**
   * Title of the modal dialog.
   */
  title?: string;

  /**
   *  Text string to display as subtitle.
   */
  subTitle?: string | Observable<string>;

  /**
   * Specifies which button ('cancel' or 'save') is highlighted, 'cancel' by default.
   */
  defaultButton?: DefaultButton;

  /**
   * Modal size. Values are 'sm', <none>, 'lg'
   */
  size?: ModalSize;

  /**
   * Title of the submit button.
   */
  okButtonLabel?: string;
}

/**
 * Dialog's Modal Size
 */
export type ModalSize = 'full-screen' | 'xl' | 'lg' | 'md' | 'sm' | undefined;

/**
 * Dialog's default button options - submit and close (default)
 */
export type DefaultButton = 'submit' | 'close';
