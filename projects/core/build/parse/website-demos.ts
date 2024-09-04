/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as glob from 'glob';
import { extractFilename, DocDemos, parseStories } from './utils';

const stories: DocDemos[] = [];
// Note: even though this is in the parse directory, it executes the scripts form the build directory, one level up from here.
const fileArray: string[] = glob.sync('../src/**/*.stories.ts');

// Parse the demos from all stories files
fileArray.forEach(file => {
  // each file may have an array of stories with templates
  const docDemos: DocDemos = {
    componentName: extractFilename(file),
    stories: parseStories(file),
  };
  stories.push(docDemos);
});
