<script setup lang="ts">
  defineProps<{
    title: string;
    description: string;
  }>();
</script>

<template>
  <section class="flex flex-col gap-5 lg:min-h-0 lg:flex-1">
    <header class="shrink-0 space-y-1.5">
      <h2 class="text-2xl font-semibold tracking-tight text-foreground">
        {{ title }}
      </h2>
      <p class="max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
        {{ description }}
      </p>
    </header>

    <!-- Live demo + source snippet side by side on desktop, stacked on mobile -->
    <div class="grid grid-cols-1 gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
      <div class="grid min-w-0 gap-4 lg:min-h-0 lg:grid-rows-[1fr_auto]">
        <slot></slot>
        <div v-if="$slots.controls" class="min-w-0">
          <slot name="controls"></slot>
        </div>
      </div>

      <div v-if="$slots.code" class="min-w-0 lg:min-h-0">
        <slot name="code"></slot>
      </div>
    </div>
  </section>
</template>
