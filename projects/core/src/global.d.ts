/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

declare module '*.scss' {
  const content: import('lit').CSSResultGroup;
  export = content;
}

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*.svg' {
  const value: any;
  export default value;
}

declare module '*.png' {
  const value: any;
  export default value;
}
