/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { loadChartIconSet } from '../collections/chart';
import { loadCommerceIconSet } from '../collections/commerce';
import { loadCoreIconSet } from '../collections/core';
import { loadEssentialIconSet } from '../collections/essential';
import { loadMediaIconSet } from '../collections/media';
import { loadMiniIconSet } from '../collections/mini';
import { loadSocialIconSet } from '../collections/social';
import { loadTechnologyIconSet } from '../collections/technology';
import { loadTextEditIconSet } from '../collections/text-edit';
import { loadTravelIconSet } from '../collections/travel';
import { ClarityIcons } from '../icon.service';
import { airplaneIconName } from '../shapes/airplane';
import { applicationIconName } from '../shapes/application';
import { arrowMiniIconName } from '../shapes/arrow-mini';
import { axisChartIconName } from '../shapes/axis-chart';
import { bankIconName } from '../shapes/bank';
import { betaIconName } from '../shapes/beta';
import { boldIconName } from '../shapes/bold';
import { musicNoteIconName } from '../shapes/music-note';
import { starIconName } from '../shapes/star';
import { vmBugIconName } from '../shapes/vm-bug';

describe('icon collection tests', () => {
  describe('chart icon collection (loadChartIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'analytics';
      expect(ClarityIcons.registry[axisChartIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadChartIconSet();
      expect(ClarityIcons.registry[axisChartIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('commerce icon collection (loadCommerceIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'savings';
      expect(ClarityIcons.registry[bankIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadCommerceIconSet();
      expect(ClarityIcons.registry[bankIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('core icon collection (loadCoreIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'house';
      expect(ClarityIcons.registry[vmBugIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadCoreIconSet();
      expect(ClarityIcons.registry[vmBugIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('Essential icon collection (loadEssentialIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'alert';
      expect(ClarityIcons.registry[betaIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadEssentialIconSet();
      expect(ClarityIcons.registry[betaIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('Media icon collection (loadMediaIconSet)', () => {
    it('should work', () => {
      expect(ClarityIcons.registry[musicNoteIconName]).toBeUndefined();
      loadMediaIconSet();
      expect(ClarityIcons.registry[musicNoteIconName]).toBeDefined();
    });
  });

  describe('Mini icon collection (loadMiniIconSet)', () => {
    it('should work', () => {
      expect(ClarityIcons.registry[arrowMiniIconName]).toBeUndefined();
      loadMiniIconSet();
      expect(ClarityIcons.registry[arrowMiniIconName]).toBeDefined();
    });
  });

  describe('Social icon collection (loadSocialIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'email';
      expect(ClarityIcons.registry[starIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadSocialIconSet();
      expect(ClarityIcons.registry[starIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('Technology icon collection (loadTechnologyIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'server';
      expect(ClarityIcons.registry[applicationIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadTechnologyIconSet();
      expect(ClarityIcons.registry[applicationIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });

  describe('TextEdit icon collection (loadTextEditIconSet)', () => {
    it('should work', () => {
      expect(ClarityIcons.registry[boldIconName]).toBeUndefined();
      loadTextEditIconSet();
      expect(ClarityIcons.registry[boldIconName]).toBeDefined();
    });
  });

  describe('Travel icon collection (loadTravelIconSet)', () => {
    it('should work', () => {
      const knownAlias = 'auto';
      expect(ClarityIcons.registry[airplaneIconName]).toBeUndefined();
      expect(ClarityIcons.registry[knownAlias]).toBeUndefined();
      loadTravelIconSet();
      expect(ClarityIcons.registry[airplaneIconName]).toBeDefined();
      expect(ClarityIcons.registry[knownAlias]).toBeDefined();
    });
  });
});
