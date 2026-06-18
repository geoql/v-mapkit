<script setup lang="ts">
  import { SidebarTrigger } from '@/components/ui/sidebar';

  defineProps<{
    title: string;
    description: string;
    code?: string;
    registry?: string;
  }>();
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden lg:flex-row">
    <!-- Desktop content rail (mobile/tablet use the MapInfoSheet peek-bar) -->
    <aside
      class="hidden flex-col lg:flex lg:w-1/3 lg:max-w-[33.333%] lg:shrink-0 lg:border-r lg:border-border"
    >
      <div
        class="gradient-fade-both hide-scrollbar min-w-0 flex-1 overflow-y-auto p-8 lg:pt-12"
      >
        <div class="mb-6 flex items-center gap-2">
          <SidebarTrigger
            class="-ml-1.5 text-muted-foreground hover:text-foreground"
          />
          <NuxtLink
            to="/examples"
            class="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="lucide:arrow-left" class="size-3" />
            Examples
          </NuxtLink>
        </div>

        <h1 class="mb-6 text-2xl font-semibold tracking-tight text-foreground">
          {{ title }}
        </h1>

        <ExampleDocs
          :description="description"
          :code="code"
          :registry="registry"
        />
      </div>

      <div class="shrink-0 border-t border-border px-8 py-4">
        <ExampleNavigation />
      </div>
    </aside>

    <!-- Full-bleed live map -->
    <div
      class="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-muted/30 lg:w-2/3 dark:bg-background"
    >
      <div class="relative min-h-0 flex-1 overflow-hidden">
        <slot></slot>

        <!-- Example controls float over the map (Apple-glass panel) -->
        <div
          v-if="$slots.controls"
          class="absolute inset-x-3 top-3 z-10 mx-auto w-[calc(100%-1.5rem)] max-w-md rounded-xl border border-border bg-background/80 p-3 shadow-lg backdrop-blur-chrome supports-backdrop-filter:bg-background/65 lg:inset-x-auto lg:left-4 lg:mx-0 lg:w-auto lg:max-w-sm"
        >
          <slot name="controls"></slot>
        </div>
      </div>

      <ExampleMapInfoSheet
        :title="title"
        :description="description"
        :code="code"
        :registry="registry"
      />
    </div>
  </div>
</template>
