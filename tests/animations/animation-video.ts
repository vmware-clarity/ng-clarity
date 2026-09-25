/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/** Frame rate of the recording videos: one video frame per display frame. */
export const VIDEO_FPS = 60;

export interface TimedFrame {
  /** Milliseconds since the trigger. */
  t: number;
  /** JPEG image. */
  data: Buffer;
}

/**
 * Encodes the frames painted by the browser (sent only when the page repaints, at irregular times) into a video with a
 * constant frame rate: each video frame shows the last frame painted at its time. The video starts at `start` and ends
 * at `end` (milliseconds since the trigger), so the frame showing the page at a time `t` is at `(t - start) / 1000`
 * seconds in the video.
 *
 * Uses the ffmpeg build Playwright installs for its own videos (`npx playwright install ffmpeg`), or `CLARITY_FFMPEG`.
 */
export function encodeVideo(frames: TimedFrame[], start: number, end: number, file: string) {
  const sorted = [...frames].sort((a, b) => a.t - b.t);
  const slots = Math.max(1, Math.round(((end - start) * VIDEO_FPS) / 1000));
  const images: Buffer[] = [];
  let current = 0;
  for (let slot = 0; slot < slots; slot++) {
    const time = start + (slot * 1000) / VIDEO_FPS;
    while (current + 1 < sorted.length && sorted[current + 1].t <= time) {
      current++;
    }
    images.push(sorted[current].data);
  }

  // Playwright's ffmpeg build cannot read from a pipe: the images go through a temporary file.
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clr-animation-'));
  const imagesFile = path.join(tempDir, 'frames.mjpeg');
  try {
    fs.writeFileSync(imagesFile, Buffer.concat(images));
    const result = spawnSync(findFfmpeg(), [
      ...['-hide_banner', '-loglevel', 'error', '-y'],
      ...['-f', 'image2pipe', '-framerate', String(VIDEO_FPS), '-c:v', 'mjpeg', '-i', imagesFile],
      // VP8 (the codec of Playwright's ffmpeg build), high quality, a key frame every 15 frames for fast seeking.
      ...['-c:v', 'libvpx', '-b:v', '0', '-crf', '8', '-qmin', '0', '-qmax', '30', '-g', '15', '-auto-alt-ref', '0'],
      ...['-deadline', 'good', '-cpu-used', '4', file],
    ]);
    if (result.status !== 0) {
      throw new Error(`ffmpeg failed to encode ${file}: ${result.stderr?.toString() || result.error?.message}`);
    }
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

function findFfmpeg(): string {
  if (process.env['CLARITY_FFMPEG']) {
    return process.env['CLARITY_FFMPEG'];
  }
  const executable = { linux: 'ffmpeg-linux', darwin: 'ffmpeg-mac', win32: 'ffmpeg-win64.exe' }[process.platform];
  for (const root of playwrightBrowserPaths()) {
    const candidates = fs.existsSync(root) ? fs.readdirSync(root).filter(name => name.startsWith('ffmpeg-')) : [];
    for (const dir of candidates.sort().reverse()) {
      const candidate = path.join(root, dir, executable);
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }
  throw new Error(
    'ffmpeg was not found: run `npx playwright install ffmpeg`, or set CLARITY_FFMPEG to an ffmpeg executable'
  );
}

/** Where Playwright installs its browsers and ffmpeg (https://playwright.dev/docs/browsers#managing-browser-binaries). */
function playwrightBrowserPaths(): string[] {
  const configured = process.env['PLAYWRIGHT_BROWSERS_PATH'];
  if (configured === '0') {
    return [path.join(path.dirname(require.resolve('playwright-core/package.json')), '.local-browsers')];
  }
  if (configured) {
    return [configured];
  }
  const home = os.homedir();
  return [
    path.join(process.env['XDG_CACHE_HOME'] || path.join(home, '.cache'), 'ms-playwright'),
    path.join(home, 'Library', 'Caches', 'ms-playwright'),
    path.join(process.env['LOCALAPPDATA'] || path.join(home, 'AppData', 'Local'), 'ms-playwright'),
  ];
}
