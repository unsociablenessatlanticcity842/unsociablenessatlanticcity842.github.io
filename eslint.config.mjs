import typescriptEslintPlugin from 'typescript-eslint'
import nextPlugin from '@next/eslint-plugin-next'

export default [
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '.git/**',
      '.vercel/**',
      'coverage/**',
      '**/*.config.js',
      '**/*.config.ts',
      'scripts/**',
    ],
  },
  ...typescriptEslintPlugin.config(
    typescriptEslintPlugin.configs.recommended,
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
]
