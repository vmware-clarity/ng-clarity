/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { renderIcon } from './icon.renderer.js';
import { ClarityIcons } from './icon.service.js';
import { IconAlias, IconShapeTuple } from './interfaces/icon.interfaces.js';
import { GlobalStateService } from './services/global.service.js';
import { testIcons } from './utils/test-icons.js';

describe('ClarityIcons service: ', () => {
  // Before each test, reset the icon registry in the global state
  beforeEach(() => {
    GlobalStateService.setValue('iconRegistry', {});
  });

  describe('addIcons: ', () => {
    it('should add icons to the registry using legacy call signature', () => {
      ClarityIcons.addIcons(['test01', 'testing']);
      expect(ClarityIcons.getIconShape('test01')).toEqual('testing');
    });

    it('should be able to add multiple icons to the registry using legacy call signature', () => {
      ClarityIcons.addIcons(['test02', 'testing'], ['test03', 'ohai']);
      expect(ClarityIcons.getIconShape('test02')).toEqual('testing');
      expect(ClarityIcons.getIconShape('test03')).toEqual('ohai');
    });

    it('should add icons to the registry using icon shapes', () => {
      const [, testShape] = testIcons.justOutline;
      const expected = renderIcon(testShape);
      ClarityIcons.addIcons(['test04', testShape]);
      expect(ClarityIcons.getIconShape('test04')).toEqual(expected);
    });

    it('should add icons to the registry using strings', () => {
      ClarityIcons.addIcons(['test05', 'testing']);
      expect(ClarityIcons.getIconShape('test05')).toEqual('testing');
    });

    it('should not overwrite icons that have already been added to the registry (legacy api)', () => {
      const [, testShape] = testIcons.justOutline;
      ClarityIcons.addIcons(['test06', 'testing']);
      expect(ClarityIcons.getIconShape('test06')).toEqual('testing');
      ClarityIcons.addIcons(['test06', testShape]);
      expect(ClarityIcons.getIconShape('test06')).toEqual('testing');
    });
  });

  describe('addIcon: ', () => {
    it('should add icons to the registry using icon shape tuples', () => {
      const [, testShape] = testIcons.badgedIcon;
      const expected = renderIcon(testShape);
      ClarityIcons.addIcons(['test07', testShape]);
      expect(ClarityIcons.getIconShape('test07')).toEqual(expected);
    });

    it('should add icons to the registry using string tuples', () => {
      ClarityIcons.addIcons(['test08', 'testing']);
      expect(ClarityIcons.getIconShape('test08')).toEqual('testing');
    });

    it('should not overwrite icons that have already been added to the registry (legacy api)', () => {
      ClarityIcons.addIcons(['test09', 'ohai']);
      expect(ClarityIcons.getIconShape('test09')).toEqual('ohai');
      ClarityIcons.addIcons(['test09', 'kthxbye']);
      expect(ClarityIcons.getIconShape('test09')).toEqual('ohai');
    });
  });

  describe('getIconShape: ', () => {
    it('should return the icon shape without copying the whole registry', () => {
      const [, testShape] = testIcons.justOutline;
      ClarityIcons.addIcons(['test10', testShape]);

      const registrySpy = spyOnProperty(ClarityIcons, 'registry', 'get').and.callThrough();

      expect(ClarityIcons.getIconShape('test10')).toEqual(renderIcon(testShape));
      expect(registrySpy).not.toHaveBeenCalled();
    });

    it('should fall back to the unknown icon shape when the name is "unknown" and not registered', () => {
      expect(ClarityIcons.getIconShape('unknown')).toEqual(ClarityIcons.registry['unknown']);
    });

    it('should return undefined for an unregistered icon name', () => {
      expect(ClarityIcons.getIconShape('does-not-exist')).toBeUndefined();
    });
  });

  describe('getIconNameFromShape: ', () => {
    it('should return the icon name string from an icon shape tuple', () => {
      const testIcon: IconShapeTuple = ['test09', 'ohai'];
      ClarityIcons.addIcons(testIcon);
      expect(ClarityIcons.getIconNameFromShape(testIcon)).toEqual('test09');
    });
  });

  describe('addAliases: ', () => {
    it('should be able to set an array of aliases', () => {
      const iconName = 'unknown';
      const aliases: IconAlias[] = [
        [iconName, ['whut']],
        [iconName, ['huh']],
        [iconName, ['ItsAMystery']],
      ];

      const theUnknownIcon = ClarityIcons.getIconShape(iconName);
      ClarityIcons.addAliases(...aliases);
      expect(ClarityIcons.getIconShape('whut')).toEqual(theUnknownIcon);
      expect(ClarityIcons.getIconShape('huh')).toEqual(theUnknownIcon);
      expect(ClarityIcons.getIconShape('ItsAMystery')).toEqual(theUnknownIcon);
    });
  });
});
