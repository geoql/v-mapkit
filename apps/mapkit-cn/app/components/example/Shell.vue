<script setup lang="ts">
  import { SidebarInset, useSidebar } from '@/components/ui/sidebar';

  const { state, setOpen } = useSidebar();
  const isExpanded = computed(() => state.value === 'expanded');
</script>

<template>
  <SidebarInset class="h-dvh min-h-0 overflow-hidden">
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

    <slot></slot>
  </SidebarInset>
</template>
