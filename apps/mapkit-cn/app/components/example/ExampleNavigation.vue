<script setup lang="ts">
  import { Separator } from '@/components/ui/separator';
  import { allExamples, GITHUB_EDIT_BASE } from '~/lib/examples';

  const route = useRoute();

  const currentSlug = computed(() => {
    const segments = route.path.split('/').filter(Boolean);
    return segments[0] === 'examples' && segments[1] ? segments[1] : '';
  });

  const currentIndex = computed(() =>
    allExamples.findIndex((example) => example.slug === currentSlug.value),
  );

  const prev = computed(() =>
    currentIndex.value > 0 ? allExamples[currentIndex.value - 1] : null,
  );

  const next = computed(() => {
    const i = currentIndex.value;
    return i >= 0 && i < allExamples.length - 1 ? allExamples[i + 1] : null;
  });

  const editUrl = computed(
    () => `${GITHUB_EDIT_BASE}/${currentSlug.value || 'basic-map'}.vue`,
  );
  const issueUrl =
    'https://github.com/geoql/v-mapkit/issues/new?labels=examples';
</script>

<template>
  <div>
    <div class="flex items-center justify-center gap-2 text-sm">
      <Separator class="flex-1" />
      <a
        :href="editUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
      >
        <Icon name="lucide:pencil" class="size-3.5" />
        Edit
      </a>
      <a
        :href="issueUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/50 px-3 py-1.5 text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
      >
        <Icon name="lucide:circle-dot" class="size-3.5" />
        Report
      </a>
      <Separator class="flex-1" />
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3">
      <NuxtLink
        v-if="prev"
        :to="`/examples/${prev.slug}`"
        :aria-label="`Previous example: ${prev.title}`"
        class="group flex min-w-0 flex-col gap-3 rounded-lg border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/30"
      >
        <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon name="lucide:arrow-left" class="size-3.5" />
          Previous
        </span>
        <span class="flex min-w-0 items-center gap-2.5">
          <Icon
            :name="prev.icon"
            class="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
          />
          <span class="truncate text-sm font-medium group-hover:text-primary">
            {{ prev.title }}
          </span>
        </span>
      </NuxtLink>
      <div v-else></div>

      <NuxtLink
        v-if="next"
        :to="`/examples/${next.slug}`"
        :aria-label="`Next example: ${next.title}`"
        class="group flex min-w-0 flex-col items-end gap-3 rounded-lg border border-border/50 bg-card/50 p-4 text-right transition-colors hover:border-primary/30"
      >
        <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
          Next
          <Icon name="lucide:arrow-right" class="size-3.5" />
        </span>
        <span class="flex min-w-0 items-center justify-end gap-2.5">
          <span class="truncate text-sm font-medium group-hover:text-primary">
            {{ next.title }}
          </span>
          <Icon
            :name="next.icon"
            class="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
          />
        </span>
      </NuxtLink>
      <div v-else></div>
    </div>
  </div>
</template>
