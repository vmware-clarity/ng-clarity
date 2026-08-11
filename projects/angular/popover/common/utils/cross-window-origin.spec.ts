/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef } from '@angular/core';

import { resolveCrossWindowOrigin } from './cross-window-origin';

export default function (): void {
  describe('resolveCrossWindowOrigin', function () {
    let cleanupFns: (() => void)[];

    beforeEach(function () {
      cleanupFns = [];
    });

    afterEach(function () {
      cleanupFns.forEach(cleanup => cleanup());
    });

    function createIframe(): HTMLIFrameElement {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      cleanupFns.push(() => iframe.remove());
      return iframe;
    }

    it('returns the same ElementRef origin unchanged when the element is in this window', function () {
      const element = document.createElement('button');
      document.body.appendChild(element);
      cleanupFns.push(() => element.remove());
      const origin = new ElementRef(element);

      expect(resolveCrossWindowOrigin(origin)).toBe(origin);
    });

    it('returns the same Element origin unchanged when the element is in this window', function () {
      const element = document.createElement('button');
      document.body.appendChild(element);
      cleanupFns.push(() => element.remove());

      expect(resolveCrossWindowOrigin(element)).toBe(element);
    });

    it('returns a point-based origin unchanged', function () {
      const point = { x: 10, y: 20 };

      expect(resolveCrossWindowOrigin(point)).toBe(point);
    });

    it('wraps a cross-window element origin in a Point whose x/y/width/height include the iframe offset', function () {
      const iframe = createIframe();
      iframe.style.position = 'absolute';
      iframe.style.left = '30px';
      iframe.style.top = '40px';
      iframe.style.border = 'none';

      const iframeDoc = iframe.contentDocument;
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
      iframeDoc.close();

      const button = iframeDoc.createElement('button');
      button.style.position = 'absolute';
      button.style.left = '5px';
      button.style.top = '6px';
      button.style.width = '50px';
      button.style.height = '20px';
      iframeDoc.body.appendChild(button);

      const resolved = resolveCrossWindowOrigin(new ElementRef(button)) as {
        x: number;
        y: number;
        width: number;
        height: number;
      };

      expect(resolved as unknown).not.toBe(button);

      const iframeRect = iframe.getBoundingClientRect();
      const rawButtonRect = button.getBoundingClientRect();

      expect(resolved.x).toBeCloseTo(iframeRect.left + rawButtonRect.left, 0);
      expect(resolved.y).toBeCloseTo(iframeRect.top + rawButtonRect.top, 0);
      expect(resolved.width).toBeCloseTo(rawButtonRect.width, 0);
      expect(resolved.height).toBeCloseTo(rawButtonRect.height, 0);
    });

    it('accounts for the iframe border and padding, not just its border', function () {
      const iframe = createIframe();
      iframe.style.position = 'absolute';
      iframe.style.left = '30px';
      iframe.style.top = '40px';
      iframe.style.border = '2px solid black';
      iframe.style.padding = '10px 5px';

      const iframeDoc = iframe.contentDocument;
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
      iframeDoc.close();

      const button = iframeDoc.createElement('button');
      button.style.position = 'absolute';
      button.style.left = '0px';
      button.style.top = '0px';
      iframeDoc.body.appendChild(button);

      const resolved = resolveCrossWindowOrigin(new ElementRef(button)) as { x: number; y: number };

      const iframeRect = iframe.getBoundingClientRect();
      const rawButtonRect = button.getBoundingClientRect();

      // border (2px) + padding (5px left / 10px top), not just clientLeft/clientTop (border only)
      expect(resolved.x).toBeCloseTo(iframeRect.left + 2 + 5 + rawButtonRect.left, 0);
      expect(resolved.y).toBeCloseTo(iframeRect.top + 2 + 10 + rawButtonRect.top, 0);
    });

    it('recomputes live so a later reposition reflects the current rect', async function () {
      const iframe = createIframe();
      iframe.style.position = 'absolute';
      iframe.style.left = '30px';
      iframe.style.top = '40px';
      iframe.style.border = 'none';

      const iframeDoc = iframe.contentDocument;
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
      iframeDoc.close();

      const button = iframeDoc.createElement('button');
      button.style.position = 'absolute';
      button.style.left = '5px';
      button.style.top = '6px';
      iframeDoc.body.appendChild(button);

      const resolved = resolveCrossWindowOrigin(new ElementRef(button)) as { x: number; y: number };
      const initialX = resolved.x;

      // The read above is memoized for the current microtask (see resolveCrossWindowOrigin);
      // let it clear before moving the iframe and reading again, matching how CDK's own
      // apply() calls are each their own microtask-separated read.
      await Promise.resolve();

      iframe.style.left = '100px';

      expect(resolved.x).toBeCloseTo(initialX + 70, 0);
    });

    it('sums offsets across nested iframes', function () {
      const outerIframe = createIframe();
      outerIframe.style.position = 'absolute';
      outerIframe.style.left = '15px';
      outerIframe.style.top = '25px';
      outerIframe.style.border = 'none';

      const outerDoc = outerIframe.contentDocument;
      outerDoc.open();
      outerDoc.write(
        '<!DOCTYPE html><html><body style="margin:0"><iframe id="inner" style="position:absolute;left:5px;top:5px;border:none;"></iframe></body></html>'
      );
      outerDoc.close();

      const innerIframe = outerDoc.getElementById('inner') as HTMLIFrameElement;
      const innerDoc = innerIframe.contentDocument;
      innerDoc.open();
      innerDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
      innerDoc.close();

      const button = innerDoc.createElement('button');
      innerDoc.body.appendChild(button);

      const resolved = resolveCrossWindowOrigin(new ElementRef(button)) as { x: number; y: number };

      const outerRect = outerIframe.getBoundingClientRect();
      const innerRect = innerIframe.getBoundingClientRect(); // relative to outer iframe's own viewport
      const rawButtonRect = button.getBoundingClientRect();

      expect(resolved.x).toBeCloseTo(outerRect.left + innerRect.left + rawButtonRect.left, 0);
      expect(resolved.y).toBeCloseTo(outerRect.top + innerRect.top + rawButtonRect.top, 0);
    });

    it('memoizes the rect per microtask so reading x/y/width/height only measures once', async function () {
      const iframe = createIframe();
      iframe.style.border = 'none';

      const iframeDoc = iframe.contentDocument;
      iframeDoc.open();
      iframeDoc.write('<!DOCTYPE html><html><body style="margin:0"></body></html>');
      iframeDoc.close();

      const button = iframeDoc.createElement('button');
      iframeDoc.body.appendChild(button);

      const originalGetBoundingClientRect = button.getBoundingClientRect.bind(button);
      let measureCount = 0;
      button.getBoundingClientRect = () => {
        measureCount++;
        return originalGetBoundingClientRect();
      };

      const resolved = resolveCrossWindowOrigin(new ElementRef(button)) as {
        x: number;
        y: number;
        width: number;
        height: number;
      };

      const firstRead = { x: resolved.x, y: resolved.y, width: resolved.width, height: resolved.height };
      expect(firstRead).toBeTruthy();
      expect(measureCount).toBe(1);

      // A later reposition (a new microtask) must still measure fresh, not reuse the cache forever.
      await Promise.resolve();
      const secondRead = resolved.x;
      expect(secondRead).toBeDefined();
      expect(measureCount).toBe(2);
    });
  });
}
