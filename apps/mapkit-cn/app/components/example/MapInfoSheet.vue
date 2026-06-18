<script setup lang="ts">
  /**
   * MapInfoSheet — mobile + tablet docs peek-bar for example pages.
   * Apple/Google Maps pattern: a slim bar pinned under the full-bleed map
   * (hidden on lg+, where the side rail does this job). Tap → bottom Sheet
   * with the description, code, install command, and prev/next nav.
   */
  import { SidebarTrigger } from '@/components/ui/sidebar';
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';

  defineProps<{
    title: string;
    description: string;
    code?: string;
    registry?: string;
  }>();
</script>

<template>
  <div
    class="z-20 flex h-12 shrink-0 items-stretch border-t border-border bg-background lg:hidden"
    :style="{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }"
  >
    <SidebarTrigger
      class="m-1.5 flex size-9 shrink-0 items-center justify-center rounded-md hover:bg-accent"
      aria-label="Open navigation"
    />
    <Sheet>
      <SheetTrigger
        class="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 text-left transition-colors hover:bg-accent"
        aria-label="Open example details"
      >
        <span
          class="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          Details
        </span>
        <span class="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span class="truncate text-sm font-medium text-foreground">
            {{ title }}
          </span>
          <Icon
            name="lucide:chevron-up"
            class="size-4 shrink-0 text-muted-foreground"
          />
        </span>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        class="max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-border bg-background p-0 lg:hidden"
      >
        <SheetHeader class="border-b border-border px-4 py-3 text-left">
          <SheetTitle class="text-xl font-semibold tracking-tight">
            {{ title }}
          </SheetTitle>
          <SheetDescription class="sr-only">
            Example details and source code
          </SheetDescription>
        </SheetHeader>
        <div class="space-y-6 px-4 pb-8 pt-4">
          <NuxtLink
            to="/examples"
            class="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="lucide:arrow-left" class="size-3" />
            Back to Examples
          </NuxtLink>
          <ExampleDocs
            :description="description"
            :code="code"
            :registry="registry"
          />
          <div class="border-t border-border pt-4">
            <ExampleNavigation />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  </div>
</template>
