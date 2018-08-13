/* global describe, test, expect, beforeEach, */

import {
  getLocale,
  getTranslations,
  setLocale,
  setTranslations,
  setLocaleGetter,
  setTranslationsGetter,
  setHandleMissingTranslation,
  t,
  l,
} from '../../src';

describe('API', () => {
  describe('setLocale', () => {
    setLocale('zh');
    const result = getLocale();
    expect(result).toEqual('zh');
  });

  describe('setTranslations', () => {
    setTranslations({
      en: {
        hello: 'Hello, %{name}!',
      },
    });
    const result = getTranslations();
    expect(result).toEqual({
      en: {
        hello: 'Hello, %{name}!',
      },
    });
  });

  describe('setLocaleGetter', () => {
    setLocaleGetter(() => 'zh');
    const result = getLocale();
    expect(result).toEqual('zh');
  });

  describe('setLocaleGetter', () => {
    setTranslationsGetter(() => ({
      en: {
        hello: 'Hello, %{name}!',
      },
    }));
    const result = getTranslations();
    expect(result).toEqual({
      en: {
        hello: 'Hello, %{name}!',
      },
    });
  });

  describe('setHandleMissingTranslation', () => {
    setHandleMissingTranslation(key => `Missing translation: ${key}`);
    const result = t('application.unknown_translation');
    expect(result).toEqual('Missing translation: application.unknown_translation');
  });

  describe('t', () => {
    beforeEach(() => {
      setTranslations({
        en: {
          application: {
            hello: 'Hello, %{name}!',
          },
        },
        nl: {
          application: {
            hello: 'Hallo, %{name}!',
          },
        },
      });
      setLocale('en');
    });

    test('should support fallback locale', () => {
      setLocale('nl-argh');
      const result1 = t('application.hello', { name: 'Aad' });
      expect(result1).toEqual('Hallo, Aad!');
    });

    test('should handle dynamic placeholder', () => {
      const result1 = t('application.hello', { name: 'Aad' });
      expect(result1).toEqual('Hello, Aad!');

      const result2 = t('application.hello', { name: 'Piet' });
      expect(result2).toEqual('Hello, Piet!');
    });

    test('should handle nested dynamic placeholder', () => {
      const result1 = t('application', { name: 'Aad' });
      expect(result1).toEqual({ hello: 'Hello, Aad!' });

      const result2 = t('application', { name: 'Piet' });
      expect(result2).toEqual({ hello: 'Hello, Piet!' });
    });
  });

  describe('l', () => {
    beforeEach(() => {
      setTranslations({
        en: {
          dates: {
            lts: 'LTS',
            short: 'MM-dd-YYYY',
            long: 'MMMM do, YYYY',
          },
        },
        nl: {
          dates: {
            long: 'd MMMM YYYY',
          },
        },
      });
      setLocale('en');
    });

    test('should support fallback locale', () => {
      setLocale('nl-argh');
      const result = l(1517774664107, { dateFormat: 'dates.long' });
      expect(result).toEqual('4 februari 2018');
    });

    test('should support parseFormat', () => {
      const result = l('2014-30-12', { parseFormat: 'YYYY-dd-MM', dateFormat: 'dates.short' });
      expect(result).toEqual('12-30-2014');
    });

    test('should support LTS format', () => {
      const result = l(1517774664107, { dateFormat: 'dates.lts' });
      expect(result).toEqual('9:04:24 p.m.');
    });
  });
});
