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
const UNTYPED_META_DECLARATION_MESSAGE =
  'The default-exported story meta must be a constant declared in this file and typed `Meta<TArgs>`: `const meta: Meta<TArgs> = {…};` or `const meta = {…} satisfies Meta<TArgs>;`.';
const WRONG_STORY_TYPE_MESSAGE =
  'Story exports must be typed with the file-local `Story` type (or `StoryObj<TArgs>`), e.g. `export const Default: Story = {};`.';

// Type-only wrappers around an exported object literal: `{…} satisfies X`, `{…} as X`, `<X>{…}`.
const TYPE_WRAPPERS = new Set(['TSSatisfiesExpression', 'TSAsExpression', 'TSTypeAssertion']);

/** Whether `type` is a plain reference to one of `names` (`Meta`, `Story`, …). Its type argument is checked elsewhere. */
function isTypeReferenceTo(type, names) {
  return (
    type !== undefined &&
    type !== null &&
    type.type === 'TSTypeReference' &&
    type.typeName.type === 'Identifier' &&
    names.includes(type.typeName.name)
  );
}

/** `const meta: Meta<…> = …` or `const meta = … satisfies Meta<…>`. */
function isTypedMetaDeclarator(declarator) {
  if (declarator.id.typeAnnotation && isTypeReferenceTo(declarator.id.typeAnnotation.typeAnnotation, ['Meta'])) {
    return true;
  }

  const init = declarator.init;

  return (
    init !== undefined &&
    init !== null &&
    init.type === 'TSSatisfiesExpression' &&
    isTypeReferenceTo(init.typeAnnotation, ['Meta'])
  );
}

/** The variable `identifier` refers to, looked up by name from the innermost enclosing scope outwards. */
function findVariable(sourceCode, identifier) {
  for (let scope = sourceCode.getScope(identifier); scope; scope = scope.upper) {
    const variable = scope.set.get(identifier.name);

    if (variable !== undefined) {
      return variable;
    }
  }

  return undefined;
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Require typed story meta (`const meta: Meta<TArgs>` or `const meta = {…} satisfies Meta<TArgs>`) and typed story exports (`: Story`) in Storybook story files',
    },
  },
  create: context => {
    const sourceCode = context.sourceCode || context.getSourceCode();

    return {
      ExportDefaultDeclaration: node => {
        let declaration = node.declaration;

        while (TYPE_WRAPPERS.has(declaration.type)) {
          declaration = declaration.expression;
        }

        if (declaration.type === 'ObjectExpression') {
          context.report({ node: declaration, message: EXPORT_DEFAULT_MESSAGE });

          return;
        }

        if (declaration.type !== 'Identifier') {
          return;
        }

        // `export default meta;`: `meta` must be declared in this file, with the `Meta` type. A
        // missing type argument on that `Meta` is reported by the TSTypeReference check below.
        const variable = findVariable(sourceCode, declaration);
        const definition = variable === undefined ? undefined : variable.defs[variable.defs.length - 1];

        if (
          definition !== undefined &&
          definition.type === 'Variable' &&
          definition.node.type === 'VariableDeclarator' &&
          isTypedMetaDeclarator(definition.node)
        ) {
          return;
        }

        context.report({ node: declaration, message: UNTYPED_META_DECLARATION_MESSAGE });
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
        if (node.id.type !== 'Identifier') {
          return;
        }

        if (!node.id.typeAnnotation) {
          context.report({ node: node.id, message: UNANNOTATED_STORY_MESSAGE });

          return;
        }

        // `Story` or `StoryObj`; a `StoryObj` missing its type argument is reported by the
        // TSTypeReference check above, so it is not reported twice here.
        if (!isTypeReferenceTo(node.id.typeAnnotation.typeAnnotation, ['Story', 'StoryObj'])) {
          context.report({ node: node.id.typeAnnotation, message: WRONG_STORY_TYPE_MESSAGE });
        }
      },
    };
  },
};
