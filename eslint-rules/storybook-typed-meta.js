/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const EXPORT_DEFAULT_MESSAGE =
  'Story meta must be a typed constant: `const meta: Meta<TArgs> = {…}; export default meta;`. Never `export default {`.';
const UNTYPED_META_MESSAGE = 'Meta must have a type argument, e.g. `Meta<AccordionArgs>`.';
const UNTYPED_STORY_OBJ_MESSAGE = 'StoryObj must have a type argument, e.g. `type Story = StoryObj<AccordionArgs>;`.';
const UNANNOTATED_STORY_MESSAGE =
  'Story exports must be annotated with the file-local `Story` type, e.g. `export const Default: Story = {};`.';

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require typed story meta (`const meta: Meta<TArgs>`) and typed story exports (`: Story`) in Storybook story files',
    },
  },
  create: context => {
    return {
      'ExportDefaultDeclaration > ObjectExpression': node => {
        context.report({ node: node, message: EXPORT_DEFAULT_MESSAGE });
      },
      TSTypeReference: node => {
        if (node.typeName.type !== 'Identifier' || node.typeArguments) {
          return;
        }

        if (node.typeName.name === 'Meta') {
          context.report({ node: node, message: UNTYPED_META_MESSAGE });
        } else if (node.typeName.name === 'StoryObj') {
          context.report({ node: node, message: UNTYPED_STORY_OBJ_MESSAGE });
        }
      },
      'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator': node => {
        if (node.id.type !== 'Identifier' || node.id.typeAnnotation) {
          return;
        }

        context.report({ node: node.id, message: UNANNOTATED_STORY_MESSAGE });
      },
    };
  },
};
