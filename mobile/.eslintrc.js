const config = {
  extends: [
    '@react-native',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  overrides: [
    {
      files: [
        'babel.config.js',
        'metro.config.js',
        'react-native.config.js',
        '**/__tests__/**/*.ts?(x)',
        'scripts/**/*.?(c)js',
        '**/?(*.)+(spec|test).ts?(x)',
        '.lintstagedrc.js',
      ],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
      extends: ['plugin:testing-library/react'],
    },
    {
      files: ['src/**/*.js?(x)', 'app/**/*.js?(x)'],
      excludedFiles: [
        'src/depman.js',
        'babel.config.js',
        'app/index.js',
        'metro.config.js',
        'react-native.config.js',
      ],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'Program',
            message:
              'JavaScript files (.js, .jsx) are not allowed. Use TypeScript (.ts, .tsx) instead.',
          },
        ],
      },
    },
    {
      files: ['src/**/*', 'app/src/**/*'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variable',
            format: ['camelCase'],
            filter: {
              regex: '^use[A-Z]',
              match: true,
            },
          },
          {
            selector: 'variable',
            format: ['PascalCase', 'camelCase', 'UPPER_CASE'],
          },
          {
            selector: 'typeLike',
            format: ['PascalCase'],
          },
        ],
        'prefer-arrow/prefer-arrow-functions': [
          'error',
          {
            disallowPrototype: true,
            singleReturnOnly: false,
            classPropertiesAllowed: false,
          },
        ],
        'import/no-default-export': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        'react/jsx-pascal-case': ['error', { allowNamespace: true }],
        'import/order': [
          'error',
          {
            'newlines-between': 'always',
            groups: ['external', 'internal', 'parent', 'sibling', 'index'],
            alphabetize: { order: 'asc', caseInsensitive: true },
            pathGroups: [
              {
                pattern: '@assets/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@data-access/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@entry-providers/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@features/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@libs/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@modules/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@navigation/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@operations/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@query/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@types/**',
                group: 'internal',
                position: 'after',
              },
              {
                pattern: '@zest/**',
                group: 'internal',
                position: 'after',
              },
            ],
            pathGroupsExcludedImportTypes: ['builtin'],
          },
        ],
        'id-length': [
          'error',
          { min: 3, properties: 'never', exceptions: ['_', 'id', 'z'] },
        ],
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              '@libs/*/*',

              // Allow exact imports (no deeper nesting)
              '!@libs/*',

              '!@libs/native-modules',
              '!@libs/native-modules/*',

              '!@data-access/native',
              '!@data-access/native/*',

              '!@data-access/query',
              '!@data-access/query/*',

              '!@data-access/graphql',
              '!@data-access/graphql/*',

              // Disallow deeper imports
              '@libs/native-modules/*/*',
              '@data-access/native/*/*',
              '@data-access/query/*/*',
              '@data-access/graphql/*/*',
            ],
            paths: [
              // ❌ Prevent importing gql from @apollo/client
              {
                name: '@apollo/client',
                importNames: ['gql'],
                message: 'Please import gql from @data-access/graphql instead.',
              },
            ],
          },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'prefer-arrow',
    'import',
    'react',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    warnOnUnsupportedTypeScriptVersion: true,
  },
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    jest: true,
    es6: true,
  },
  rules: {
    'react-native/no-inline-styles': 'error',
    'react/react-in-jsx-scope': 'off',
    'prettier/prettier': ['error'],
    curly: 'error',
    'no-var': 'error',
    'no-loop-func': 'error',
    'eslint-comments/no-unused-disable': 'warn',
    'eslint-comments/no-restricted-disable': [
      'warn',
      'eslint-comments/no-restricted-disable',
      '@typescript-eslint/no-explicit-any',
    ],
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': false,
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-check': false,
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-empty-object-type': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'off',
  },
  ignorePatterns: ['!.*'],
};

module.exports = config;
