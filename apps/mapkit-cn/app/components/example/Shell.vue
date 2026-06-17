<script setup lang="ts">
  import { Button } from '@/components/ui/button';
  import {
    SidebarInset,
    SidebarTrigger,
    useSidebar,
  } from '@/components/ui/sidebar';
  import { findExample, GITHUB_EXAMPLES_BASE } from '~/lib/examples';

  const route = useRoute();
  const { state, setOpen } = useSidebar();

  const isExpanded = computed(() => state.value === 'expanded');

  const currentSlug = computed(() => {
    const segments = route.path.split('/').filter(Boolean);
    return segments[0] === 'examples' && segments[1] ? segments[1] : '';
  });

  const currentTitle = computed(
    () => findExample(currentSlug.value)?.title ?? 'Examples',
  );

  const sourceUrl = computed(() => {
    const example = findExample(currentSlug.value);
    return example
      ? `${GITHUB_EXAMPLES_BASE}/${example.slug}.vue`
      : GITHUB_EXAMPLES_BASE;
  });
</script>

<template>
  <SidebarInset>
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2.5 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
    >
      Skip to content
    </a>

    <Transition name="fade">
      <div
        v-if="isExpanded"
        class="fixed inset-0 z-40 bg-foreground/15"
        aria-hidden="true"
        @click="setOpen(false)"
      ></div>
    </Transition>

    <header
      class="sticky top-0 z-30 flex h-12 items-center justify-between gap-3 border-b border-border/60 bg-background/72 px-4 backdrop-blur-chrome backdrop-saturate-150 supports-backdrop-filter:bg-background/60"
    >
      <div class="flex items-center gap-2 text-sm">
        <SidebarTrigger class="text-muted-foreground hover:text-foreground" />
        <span class="font-medium tracking-tight">{{ currentTitle }}</span>
      </div>

      <Button
        as="a"
        :href="sourceUrl"
        target="_blank"
        rel="noopener noreferrer"
        variant="outline"
        size="sm"
      >
        <Icon name="simple-icons:github" class="size-3.5" />
        View source
      </Button>
    </header>

    <div
      class="flex flex-1 flex-col px-4 py-6 lg:min-h-0 lg:overflow-hidden lg:p-8"
    >
      <slot></slot>
    </div>
  </SidebarInset>
</template>
