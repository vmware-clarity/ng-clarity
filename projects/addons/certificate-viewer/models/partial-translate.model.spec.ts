/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AppfxTranslateService, DateTimeService } from '@clr/addons/translate';

import { Line, TranslatableValue, Value } from './partial-translate.model';

describe('partial-translate.model', () => {
  const mockTranslateService = {
    translate: (key: string, args?: Record<string, unknown>) => {
      return `Translated: ${key} ${JSON.stringify(args)}`;
    },
  } as AppfxTranslateService;

  const mockDateTimeService = {
    format: (date: Date) => {
      return `Formatted Date: ${date}`;
    },
  } as DateTimeService;

  describe('TranslatableValue', () => {
    it('should translate a TranslatableValue with args', () => {
      const translatable = new TranslatableValue('key', { arg1: 'value1', arg2: 'value2' });
      const translated = translatable.translate(mockTranslateService);
      expect(translated).toBe('Translated: key {"arg1":"value1","arg2":"value2"}');
    });

    it('should translate a TranslatableValue without args', () => {
      const translatable = new TranslatableValue('key');
      const translated = translatable.translate(mockTranslateService);
      expect(translated).toBe('Translated: key undefined');
    });
  });

  describe('Value', () => {
    it('should translate a Value with a string value', () => {
      const value = new Value('Hello, World!');
      const translated = value.translate(mockTranslateService, mockDateTimeService);
      expect(translated).toBe('Hello, World!');
    });

    it('should translate a Value with a Date value', () => {
      const date = new Date('2023-11-08T12:00:00Z');
      const value = new Value(date);
      const translated = value.translate(mockTranslateService, mockDateTimeService);
      expect(translated).toBe(`Formatted Date: ${date}`);
    });

    it('should translate a Value with a TranslatableValue', () => {
      const translatable = new TranslatableValue('key', { arg: 'value' });
      const value = new Value(translatable);
      const translated = value.translate(mockTranslateService, mockDateTimeService);
      expect(translated).toBe('Translated: key {"arg":"value"}');
    });
  });

  describe('Line', () => {
    it('should translate a Line with multiple Values', () => {
      const key = new Value('Key');
      const separator = new Value(':');
      const value = new Value('Value');
      const line = new Line([key, separator, value]);
      const translated = line.translate(mockTranslateService, mockDateTimeService);
      expect(translated).toBe('Key:Value');
    });
  });
});
