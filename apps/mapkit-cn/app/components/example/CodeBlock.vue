<script setup lang="ts">
  import { useHighlightedCode } from '~/composables/useHighlightedCode';

  const props = withDefaults(
    defineProps<{
      code: string;
      language?: string;
      filename?: string;
    }>(),
    {
      language: 'vue',
      filename: '',
    },
  );

  const { trimmed, highlighted } = useHighlightedCode(
    () => props.code,
    () => props.language,
  );

  const { copy, copied } = useClipboard({ copiedDuring: 1600 });
</script>

<template>
  <figure
    class="group/code flex flex-col overflow-hidden rounded-xl border border-border bg-card lg:h-full lg:min-h-0"
  >
    <figcaption
      class="flex shrink-0 items-center justify-between border-b border-border/70 bg-secondary/40 px-4 py-2"
    >
      <span
        class="flex items-center gap-2 font-mono text-xs text-muted-foreground"
      >
        <Icon name="lucide:code-xml" class="size-3.5" />
        {{ filename || `${language} component` }}
      </span>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy(trimmed)"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="size-3.5"
          :class="copied ? 'text-success' : ''"
        />
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </figcaption>

    <!-- eslint-disable vue/no-v-html -- Shiki returns trusted, prerendered HTML -->
    <div
      v-if="highlighted"
      class="shiki-block overflow-auto p-4 text-[0.8125rem] leading-relaxed lg:min-h-0 lg:flex-1"
      v-html="highlighted"
    ></div>
    <!-- eslint-enable vue/no-v-html -->
    <pre
      v-else
      class="overflow-auto p-4 text-[0.8125rem] leading-relaxed lg:min-h-0 lg:flex-1"
    ><code class="font-mono text-foreground/90">{{ trimmed }}</code></pre>
  </figure>
</template>
