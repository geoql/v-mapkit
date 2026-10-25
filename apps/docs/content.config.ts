import { defineCollection, defineContentConfig } from '@nuxt/content';

// One page collection over every Markdown file in content/ (the same
// collection @nuxt/content falls back to without a config, made explicit).
export default defineContentConfig({
  collections: {
    content: defineCollection({ type: 'page', source: '**/*.md' }),
  },
});
