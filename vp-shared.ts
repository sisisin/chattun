/** vite-plus の共有設定（front/server 共通） */
export const sharedFmt = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  trailingComma: 'all' as const,
  bracketSpacing: true,
  arrowParens: 'avoid' as const,
  sortPackageJson: false,
};

export const sharedLintRules = {
  'typescript/no-explicit-any': 'off',
  'typescript/no-non-null-assertion': 'off',
  'typescript/explicit-function-return-type': 'off',
  'typescript/no-namespace': 'error',
} as const;
