<script setup lang="ts">
  defineProps<{
    description: string;
    code?: string;
    registry?: string;
  }>();
</script>

<template>
  <div class="space-y-6">
    <p class="text-sm/relaxed text-muted-foreground">
      {{ description }}
    </p>

    <ExampleCodePanel v-if="code" :code="code" />

    <ExamplePackageManagerTabs :registry="registry" />
  </div>
</template>
