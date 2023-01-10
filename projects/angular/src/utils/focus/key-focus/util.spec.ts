/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { IEKeys, Keys } from '../../enums/keys.enum';
import { preventArrowKeyScroll } from './util';

describe('preventArrowKeyScroll', () => {
  it('should prevent scroll on element based on key event', () => {
    const mockEvent = {
      key: Keys.ArrowDown,
      code: Keys.ArrowDown,
      preventDefault: () => {
        // Do nothing
      },
    };

    const mockIncorrectKeyCodeEvent = {
      key: Keys.Space,
      code: 'Space',
      preventDefault: () => {
        // Do nothing
      },
    };

    spyOn(mockEvent, 'preventDefault');
    preventArrowKeyScroll(mockEvent as KeyboardEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();

    spyOn(mockIncorrectKeyCodeEvent, 'preventDefault');
    preventArrowKeyScroll(mockIncorrectKeyCodeEvent as KeyboardEvent);
    expect(mockIncorrectKeyCodeEvent.preventDefault).not.toHaveBeenCalled();
  });

  it('should prevent scroll for IE', () => {
    const mockEvent = {
      key: IEKeys.ArrowDown,
      code: undefined,
      preventDefault: () => {
        // Do nothing
      },
    };

    spyOn(mockEvent, 'preventDefault');
    preventArrowKeyScroll(mockEvent as KeyboardEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });
});
