<script setup lang="ts">
  import { SidebarProvider } from '@/components/ui/sidebar';
</script>

<template>
  <SidebarProvider :default-open="false">
    <AppSidebar />
    <ExampleShell>
      <slot></slot>
    </ExampleShell>
  </SidebarProvider>
</template>
