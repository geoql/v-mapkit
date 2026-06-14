<script setup lang="ts">
  const route = useRoute();
  const siteConfig = useSiteConfig();

  const canonical = computed(
    () => `${siteConfig.url.replace(/\/$/, '')}${route.path}`,
  );

  useHead({
    htmlAttrs: { lang: 'en' },
    link: () => [{ rel: 'canonical', href: canonical.value }],
  });

  useSeoMeta({
    ogUrl: () => canonical.value,
  });
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
