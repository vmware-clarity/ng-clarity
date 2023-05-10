/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

module.exports = {
  default: [
    // Index signature
    'signature',
    'call-signature',

    // Fields
    'public-static-field',
    'protected-static-field',
    'private-static-field',

    'public-instance-field',
    'protected-instance-field',
    'private-instance-field',

    'public-abstract-field',
    'protected-abstract-field',

    'public-field',
    'protected-field',
    'private-field',

    'static-field',
    'instance-field',
    'abstract-field',

    'field',

    // Constructors
    'public-constructor',
    'protected-constructor',
    'private-constructor',

    'constructor',

    // Accessors
    ['public-static-get', 'public-static-set'],
    ['protected-static-get', 'protected-static-set'],
    ['private-static-get', 'private-static-set'],

    ['public-get', 'public-set'],
    ['protected-get', 'protected-set'],
    ['private-get', 'private-set'],
    ['get', 'set'],

    // Methods
    'public-static-method',
    'protected-static-method',
    'private-static-method',

    'public-instance-method',
    'protected-instance-method',
    'private-instance-method',

    'public-abstract-method',
    'protected-abstract-method',

    'public-method',
    'protected-method',
    'private-method',

    'static-method',
    'instance-method',
    'abstract-method',

    'method',
  ],
};
