<script setup lang="ts">
  import { isValidMapKitToken } from '~/composables/useMapkitToken';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';

  const { token, hasToken, setToken, clearToken } = useMapkitToken();

  const open = ref(false);
  const draft = ref('');
  const error = ref('');

  watch(open, (isOpen) => {
    if (isOpen) {
      draft.value = token.value;
      error.value = '';
    }
  });

  watch(draft, () => {
    error.value = '';
  });

  function save(): void {
    const next = draft.value.trim();
    if (!isValidMapKitToken(next)) {
      error.value =
        'That doesn\'t look like a MapKit JS token. It should be a JWT with three base64url parts (header.payload.signature).';
      return;
    }

    setToken(next);
    open.value = false;
  }

  function reset(): void {
    clearToken();
    draft.value = '';
  }
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button :variant="hasToken ? 'outline' : 'default'" size="sm">
        <Icon
          :name="hasToken ? 'lucide:key-round' : 'lucide:key'"
          class="size-3.5"
        />
        {{ hasToken ? 'Token set' : 'Set MapKit token' }}
      </Button>
    </PopoverTrigger>

    <PopoverContent
      :side-offset="8"
      align="center"
      class="w-[min(20rem,calc(100vw-2rem))] rounded-xl text-left"
    >
        <div class="mb-3 space-y-1">
          <h3 class="text-sm font-semibold text-foreground">
            Apple MapKit JS token
          </h3>
          <p class="text-xs/relaxed text-muted-foreground">
            Paste a JWT signed with your MapKit JS key. Stored in
            <code class="font-mono">localStorage</code>, never sent anywhere.
          </p>
        </div>

        <Input
          v-model="draft"
          type="password"
          placeholder="eyJhbGciOiJFUzI1NiIs…"
          autocomplete="off"
          class="font-mono text-xs"
          @keydown.enter="save"
        />

        <p
          v-if="error"
          class="mt-2 text-xs text-destructive"
          role="alert"
          aria-live="polite"
        >
          {{ error }}
        </p>

        <div class="mt-3 flex items-center justify-between gap-2">
          <a
            href="https://developer.apple.com/documentation/mapkitjs/creating_a_maps_token"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-primary transition-colors hover:underline"
          >
            How to get one
          </a>
          <div class="flex items-center gap-2">
            <Button v-if="hasToken" variant="ghost" size="sm" @click="reset">
              Clear
            </Button>
            <Button size="sm" :disabled="!draft.trim()" @click="save">
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
  </Popover>
</template>
