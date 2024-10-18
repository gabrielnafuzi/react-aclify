import { fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importHelpers from 'eslint-plugin-import-helpers'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import testingLibraryPlugin from 'eslint-plugin-testing-library'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// eslint-disable-next-line no-redeclare
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line no-redeclare
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends(
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      react,
      'react-hooks': fixupPluginRules(reactHooks),
      '@typescript-eslint': typescriptEslint,
      'import-helpers': fixupPluginRules(importHelpers),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'commonjs',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'import/no-anonymous-default-export': 'off',

      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            ['/^react$/'],
            ['module'],
            ['/^@//'],
            ['parent', 'sibling', 'index'],
          ],

          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: [
            'multiline-block-like',
            'multiline-const',
            'multiline-expression',
          ],
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',

          next: [
            'multiline-block-like',
            'multiline-const',
            'multiline-expression',
            'switch',
            'return',
          ],
        },
        {
          blankLine: 'never',
          prev: 'case',
          next: 'multiline-block-like',
        },
        {
          blankLine: 'never',
          prev: 'multiline-block-like',
          next: 'case',
        },
      ],

      'no-console': [
        'error',
        {
          allow: ['error', 'warn'],
        },
      ],

      'prefer-const': 'error',
      'no-return-await': 'error',
      'require-await': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unused-prop-types': 'error',
      'react/self-closing-comp': 'warn',

      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],

      'react/hook-use-state': 'warn',
      'react/jsx-boolean-value': 'warn',
      'react/jsx-fragments': 'warn',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-target-blank': 'warn',
      'react/jsx-no-useless-fragment': 'warn',

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-explicit-any': 'error',

      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
        },
      ],

      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'allow-as-parameter',
        },
      ],

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },
  {
    plugins: {
      'testing-library': fixupPluginRules({
        rules: testingLibraryPlugin.rules,
      }),
    },
    files: ['**/*.spec.tsx', '**/*.test.tsx'],
    rules: {
      ...testingLibraryPlugin.configs['flat/react'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
