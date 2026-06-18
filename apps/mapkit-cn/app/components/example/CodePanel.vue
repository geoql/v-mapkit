<script setup lang="ts">
  import { useHighlightedCode } from '~/composables/useHighlightedCode';

  const props = withDefaults(
    defineProps<{
      code: string;
      language?: string;
    }>(),
    { language: 'vue' },
  );

  const expanded = ref(false);

  const { trimmed, highlighted } = useHighlightedCode(
    () => props.code,
    () => props.language,
  );

  const { copy, copied } = useClipboard({ copiedDuring: 1600 });
</script>

<template>
  <div>
    <button
      type="button"
      class="flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      :aria-expanded="expanded"
      aria-controls="example-code-panel"
      @click="expanded = !expanded"
    >
      <Icon name="lucide:code" class="size-3.5" />
      <span>{{ expanded ? 'Hide code' : 'View code' }}</span>
      <Icon
        name="lucide:chevron-down"
        class="size-3 transition-transform duration-200"
        :class="expanded ? 'rotate-180' : ''"
      />
    </button>

    <div
      v-show="expanded"
      id="example-code-panel"
      role="region"
      aria-label="Source code"
      class="relative mt-3 overflow-hidden rounded-lg border border-border/50 bg-card"
    >
      <button
        type="button"
        class="absolute right-2 top-2 z-10 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :aria-label="copied ? 'Copied' : 'Copy code'"
        @click="copy(trimmed)"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="size-3.5"
          :class="copied ? 'text-success' : ''"
        />
      </button>

      <!-- eslint-disable vue/no-v-html -- Shiki returns trusted, prerendered HTML -->
      <div
        v-if="highlighted"
        class="shiki-block max-h-[60vh] min-w-0 overflow-auto p-4 text-[0.8125rem] leading-relaxed"
        v-html="highlighted"
      ></div>
      <!-- eslint-enable vue/no-v-html -->
      <pre
        v-else
        class="max-h-[60vh] min-w-0 overflow-auto p-4 text-[0.8125rem] leading-relaxed"
      ><code class="font-mono text-foreground/90">{{ trimmed }}</code></pre>
    </div>
  </div>
</template>
