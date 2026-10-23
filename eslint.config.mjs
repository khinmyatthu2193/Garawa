import nextPlugin from '@next/eslint-plugin-next';
import reactHooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';

export default [
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true }, sourceType: 'module' } },
    plugins: { '@next/next': nextPlugin, 'react-hooks': reactHooks },
    rules: { ...nextPlugin.configs.recommended.rules, ...reactHooks.configs.recommended.rules, 'react-hooks/set-state-in-effect': 'off' },
  },
];
