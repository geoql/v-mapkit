<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      /** When set, shows the shadcn-vue registry add command for this slug. */
      registry?: string;
    }>(),
    { registry: '' },
  );

  const managers = [
    { id: 'npm', label: 'npm', add: 'npm install', dlx: 'npx' },
    { id: 'pnpm', label: 'pnpm', add: 'pnpm add', dlx: 'pnpm dlx' },
    { id: 'yarn', label: 'yarn', add: 'yarn add', dlx: 'npx' },
    { id: 'bun', label: 'bun', add: 'bun add', dlx: 'bunx --bun' },
  ] as const;

  const selected = ref<(typeof managers)[number]['id']>('npm');

  const command = computed(() => {
    const mgr = managers.find((m) => m.id === selected.value) ?? managers[0];
    return props.registry
      ? `${mgr.dlx} shadcn-vue@latest add https://mapkit-cn.geoql.in/r/${props.registry}`
      : `${mgr.add} @geoql/v-mapkit`;
  });

  const { copy, copied } = useClipboard({ source: command });
</script>

<template>
  <div class="rounded-lg border border-border/50 bg-card">
    <div
      class="flex items-center justify-between border-b border-border/50 px-4 py-2"
    >
      <span class="text-xs font-medium text-muted-foreground">Installation</span>
      <div class="flex gap-1">
        <button
          v-for="mgr in managers"
          :key="mgr.id"
          type="button"
          :class="[
            'rounded-md px-2 py-0.5 font-mono text-xs transition-colors',
            selected === mgr.id
              ? 'bg-secondary text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @click="selected = mgr.id"
        >
          <span class="text-[10px] text-muted-foreground/60">&gt;_</span>
          {{ mgr.label }}
        </button>
      </div>
    </div>
    <div class="flex items-center gap-2 px-4 py-3">
      <code class="min-w-0 flex-1 truncate font-mono text-xs text-foreground/80">
        <span class="text-muted-foreground/60">$</span> {{ command }}
      </code>
      <button
        type="button"
        class="grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        :aria-label="copied ? 'Copied' : 'Copy command'"
        @click="copy(command)"
      >
        <Icon
          :name="copied ? 'lucide:check' : 'lucide:copy'"
          class="size-3.5"
          :class="copied ? 'text-success' : ''"
        />
      </button>
    </div>
  </div>
</template>
