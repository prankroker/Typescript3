import js from '@eslint/js';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin'; // Ensure correct import
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  { ignores: ['dist'] }, // Exclude build directories
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    files: ['**/*.{js,ts}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: ['./tsconfig.json'], // Adjust if you have other tsconfig files
      },
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error', // Enable Prettier rules
    },
  }
);