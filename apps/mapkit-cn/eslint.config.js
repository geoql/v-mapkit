// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat';
import betterTailwindcss from 'eslint-plugin-better-tailwindcss';
import oxlint from 'eslint-plugin-oxlint';

export default createConfigForNuxt({
  features: {
    stylistic: false,
    tooling: true,
    typescript: true,
  },
})
  .override('nuxt/vue/rules', {
    files: ['app/pages/**/*.vue', 'app/layouts/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  })
  .append({
    plugins: {
      'better-tailwindcss': betterTailwindcss,
    },
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'error',
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-duplicate-classes': 'error',
      'better-tailwindcss/no-unnecessary-whitespace': 'error',
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'app/assets/css/main.css',
        rootFontSize: 16,
      },
    },
  })
  .append({
    // shadcn-vue primitives are vendored verbatim; don't rewrite their classes
    // so re-vendoring from upstream stays a clean diff.
    files: ['app/components/ui/**/*.vue'],
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'off',
    },
  })
  .append(...oxlint.configs['flat/recommended'])
  .append({
    rules: {
      // oxfmt owns self-closing; keeping this on starts a formatter-vs-linter war.
      'vue/html-self-closing': 'off',
      // The `/i` flag + mixed char classes make a `\w` rewrite non-equivalent.
      'regexp/prefer-w': 'off',
    },
  });
